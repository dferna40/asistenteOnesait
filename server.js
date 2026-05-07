// Si este puente de persistencia se migra a Java, es obligatorio implementar
// try-catch-resources para el manejo de los flujos de entrada/salida de
// archivos (Streams) y asi evitar bloqueos de recursos en el sistema operativo
// [cite: 2026-02-12].

import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const app = express();
const port = 3001;
const imagesDirectory = path.resolve('public', 'images');
const backupsDirectory = path.resolve('backups');
const manualFilePath = path.resolve('src', 'data', 'manual.json');
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]);

fs.mkdirSync(imagesDirectory, { recursive: true });
fs.mkdirSync(backupsDirectory, { recursive: true });

const formatTimestamp = () =>
  new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    year: 'numeric',
  }).format(new Date());

const logServerEvent = (scope, message, details) => {
  const prefix = `[${formatTimestamp()}] [${scope}]`;

  if (details) {
    console.log(`${prefix} ${message}`, details);
    return;
  }

  console.log(`${prefix} ${message}`);
};

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, imagesDirectory);
  },
  filename: (_request, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    callback(null, `${uniqueName}${extension}`);
  },
});

const upload = multer({ storage });

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origen no permitido por CORS.'));
    },
  }),
);
app.use(express.json());
app.use('/images', express.static(imagesDirectory));
app.use((request, response, next) => {
  const startedAt = Date.now();

  logServerEvent('HTTP', `${request.method} ${request.originalUrl}`, {
    ip: request.ip,
  });

  response.on('finish', () => {
    logServerEvent(
      'HTTP',
      `${request.method} ${request.originalUrl} -> ${response.statusCode} en ${Date.now() - startedAt} ms`,
    );
  });

  next();
});

app.get('/health', (_request, response) => {
  logServerEvent('HEALTH', 'Health check respondido con OK.');
  response.json({ ok: true });
});

app.post('/save-manual', async (request, response) => {
  const manualEntries = request.body;

  if (!Array.isArray(manualEntries)) {
    logServerEvent('SAVE', 'Peticion rechazada: body no valido para guardado.');
    response.status(400).json({
      error: 'El cuerpo de la peticion debe ser un array de entradas.',
    });
    return;
  }

  try {
    logServerEvent('SAVE', 'Inicio de persistencia de manual.', {
      totalEntradas: manualEntries.length,
    });

    const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(
      backupsDirectory,
      `manual_${backupTimestamp}.json`,
    );

    try {
      await fs.promises.copyFile(manualFilePath, backupFilePath);
      logServerEvent('SAVE', 'Backup previo generado.', { backupFilePath });
    } catch (error) {
      const fileMissing =
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT';

      if (!fileMissing) {
        throw error;
      }

      logServerEvent(
        'SAVE',
        'No existia manual previo; se omite la copia de seguridad inicial.',
      );
    }

    // Si esta logica de escritura en disco se traslada a Java, es obligatorio
    // el uso de try-catch-resources para el manejo de FileWriter,
    // BufferedWriter y otros flujos de salida, garantizando el cierre seguro de
    // descriptores en JBoss.
    await fs.promises.writeFile(
      manualFilePath,
      JSON.stringify(manualEntries, null, 2),
      'utf-8',
    );

    logServerEvent('SAVE', 'Manual actualizado en disco correctamente.', {
      manualFilePath,
      totalEntradas: manualEntries.length,
    });
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error(
      `[${formatTimestamp()}] [SAVE] No se pudo guardar manual.json en disco.`,
      error,
    );
    response.status(500).json({
      error: 'No se pudo guardar manual.json en disco.',
    });
  }
});

app.post('/upload', upload.single('image'), (request, response) => {
  logServerEvent('UPLOAD', 'Recibida peticion de subida de imagen.');

  if (!request.file) {
    logServerEvent('UPLOAD', 'La subida ha llegado sin archivo adjunto.');
    response.status(400).json({ error: 'No se ha recibido ningun archivo.' });
    return;
  }

  logServerEvent('UPLOAD', 'Imagen almacenada correctamente.', {
    filename: request.file.filename,
    originalName: request.file.originalname,
    size: request.file.size,
  });

  response.status(201).json({
    filename: request.file.filename,
    path: `/images/${request.file.filename}`,
  });
});

app.listen(port, () => {
  logServerEvent('BOOT', 'Servidor de imagenes y persistencia iniciado.', {
    allowedOrigins: Array.from(allowedOrigins),
    backupsDirectory,
    imagesDirectory,
    manualFilePath,
    port,
  });
});
