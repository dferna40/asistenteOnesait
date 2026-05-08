import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, nativeImage, shell } from 'electron';
import { startServer } from '../server.js';

const currentFilePath = fileURLToPath(import.meta.url);
const electronRoot = path.dirname(currentFilePath);
const projectRoot = path.resolve(electronRoot, '..');
const desktopUserDataPath = path.join(projectRoot, '.runtime', 'electron-userdata');
const desktopPort = Number(process.env.ELECTRON_APP_PORT || 3002);
const devServerUrl = process.env.ELECTRON_START_URL || '';
const defaultPrysmaIconDataUrl = (() => {
  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="prysma-electron-gradient" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stop-color="#38bdf8" />
          <stop offset="0.52" stop-color="#06b6d4" />
          <stop offset="1" stop-color="#0f766e" />
        </linearGradient>
      </defs>
      <path d="M32 6 52 18v28L32 58 12 46V18L32 6Z" fill="url(#prysma-electron-gradient)" stroke="rgba(255,255,255,0.82)" stroke-width="1.5"/>
      <path d="M32 6v52M12 18l20 12 20-12M12 46l20-16 20 16" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M25 20.5h10.5c4.1 0 7 2.4 7 6.3 0 4.4-3 6.9-7.8 6.9H30v9.3h-5V20.5Zm5 4.3v4.8h5c1.8 0 2.9-.9 2.9-2.4 0-1.5-1.1-2.4-2.9-2.4h-5Z" fill="white"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`;
})();

let mainWindow = null;
let serverHandle = null;

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('no-sandbox');

fs.mkdirSync(desktopUserDataPath, { recursive: true });
app.setPath('userData', desktopUserDataPath);

const logDesktopEvent = (message, details) => {
  try {
    const appDataPath = app?.isReady?.() ? app.getPath('userData') : process.cwd();
    const logPath = path.join(appDataPath, 'desktop-runtime.log');
    const serializedDetails = details ? ` ${JSON.stringify(details)}` : '';
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}${serializedDetails}\n`);
  } catch {
    // Si el log falla, no bloqueamos el arranque de la app.
  }
};

const createMainWindow = async () => {
  logDesktopEvent('Creando ventana principal.');
  const prysmaWindowIcon = nativeImage.createFromDataURL(defaultPrysmaIconDataUrl);
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    backgroundColor: '#0f172a',
    center: true,
    height: 960,
    icon: prysmaWindowIcon,
    minHeight: 760,
    minWidth: 1200,
    show: true,
    width: 1480,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    logDesktopEvent('Ventana lista para mostrarse.');
    mainWindow?.show();
    mainWindow?.focus();
    mainWindow?.moveTop();
    mainWindow?.setAlwaysOnTop(true);
    setTimeout(() => {
      mainWindow?.setAlwaysOnTop(false);
    }, 1500);
  });

  mainWindow.on('closed', () => {
    logDesktopEvent('Ventana cerrada.');
    mainWindow = null;
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedUrl) => {
    logDesktopEvent('Fallo al cargar la URL de la ventana.', {
      errorCode,
      errorDescription,
      validatedUrl,
    });
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    logDesktopEvent('El proceso de render ha terminado.', details);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  const targetUrl = devServerUrl || `http://127.0.0.1:${desktopPort}`;
  logDesktopEvent('Cargando URL principal.', { targetUrl });
  await mainWindow.loadURL(targetUrl);
};

const ensureDesktopServer = async () => {
  if (devServerUrl) {
    logDesktopEvent('Modo desarrollo detectado. No se inicia servidor embebido.', {
      devServerUrl,
    });
    return null;
  }

  logDesktopEvent('Iniciando servidor embebido.', { desktopPort });
  return startServer({
    appDataDir: app.getPath('userData'),
    port: desktopPort,
    serveStatic: true,
    sourceRoot: projectRoot,
    staticDistDir: path.join(projectRoot, 'dist'),
  });
};

const shutdownDesktopServer = async () => {
  if (!serverHandle?.server) {
    logDesktopEvent('No hay servidor embebido que cerrar.');
    return;
  }

  await new Promise((resolve) => {
    serverHandle.server.close(() => resolve(undefined));
  });
  logDesktopEvent('Servidor embebido detenido.');
  serverHandle = null;
};

const singleInstanceLock = app.requestSingleInstanceLock();

if (!singleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) {
      if (app.isReady()) {
        void createMainWindow();
      }
      return;
    }

    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.focus();
  });

  app.whenReady().then(async () => {
    logDesktopEvent('Electron listo. Iniciando bootstrap.');
    serverHandle = await ensureDesktopServer();
    logDesktopEvent('Servidor embebido inicializado.', {
      port: serverHandle?.port ?? desktopPort,
    });
    await createMainWindow();

    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        await createMainWindow();
      }
    });
  }).catch((error) => {
    logDesktopEvent('Fallo durante el bootstrap de Electron.', {
      message: error?.message,
      stack: error?.stack,
    });
    console.error('No se pudo iniciar la app de escritorio.', error);
    app.quit();
  });

  app.on('before-quit', () => {
    logDesktopEvent('Evento before-quit recibido.');
    void shutdownDesktopServer();
  });

  app.on('window-all-closed', () => {
    logDesktopEvent('Evento window-all-closed recibido.');
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('quit', (_event, exitCode) => {
    logDesktopEvent('Electron finalizado.', { exitCode });
  });

  process.on('uncaughtException', (error) => {
    logDesktopEvent('Excepcion no controlada en el proceso principal.', {
      message: error?.message,
      stack: error?.stack,
    });
  });

  process.on('unhandledRejection', (reason) => {
    logDesktopEvent('Promesa no controlada en el proceso principal.', {
      reason: typeof reason === 'string' ? reason : JSON.stringify(reason),
    });
  });
}
