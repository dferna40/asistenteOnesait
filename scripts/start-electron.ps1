$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$electronExecutable = Join-Path $projectRoot 'node_modules\electron\dist\electron.exe'
$electronEntryPoint = Join-Path $projectRoot 'electron\main.mjs'
$distIndexPath = Join-Path $projectRoot 'dist\index.html'
$viteExecutable = Join-Path $projectRoot 'node_modules\.bin\vite.cmd'
$desktopLogPath = Join-Path $projectRoot '.runtime\electron-userdata\desktop-runtime.log'
$launcherLogPath = Join-Path $projectRoot '.runtime\logs\electron-launcher.log'

Add-Type -AssemblyName PresentationFramework

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $launcherLogPath) | Out-Null

function Write-ElectronLauncherLog {
  param(
    [string]$Message
  )

  Add-Content -LiteralPath $launcherLogPath -Value "[$([DateTime]::Now.ToString('s'))] $Message"
}

function Ensure-DesktopBundle {
  if (Test-Path -LiteralPath $distIndexPath) {
    Write-ElectronLauncherLog 'Build estática detectada en dist.'
    return
  }

  if (-not (Test-Path -LiteralPath $viteExecutable)) {
    throw "Falta vite para reconstruir la app: $viteExecutable"
  }

  Write-ElectronLauncherLog 'No existe dist\\index.html. Se reconstruye la app antes de abrir Electron.'
  & $viteExecutable build --config (Join-Path $projectRoot 'vite.config.ts')

  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $distIndexPath)) {
    throw "La reconstrucción de la app web ha fallado y sigue faltando: $distIndexPath"
  }

  Write-ElectronLauncherLog 'Build estática reconstruida correctamente.'
}

& (Join-Path $PSScriptRoot 'stop-app.ps1')
Write-ElectronLauncherLog 'Se ejecuta stop-app antes de arrancar Electron.'

if (-not (Test-Path -LiteralPath $electronExecutable)) {
  throw "No se ha encontrado Electron en: $electronExecutable"
}

if (-not (Test-Path -LiteralPath $electronEntryPoint)) {
  throw "No se ha encontrado el punto de entrada de Electron en: $electronEntryPoint"
}

Ensure-DesktopBundle

$electronProcess = Start-Process -FilePath $electronExecutable -ArgumentList @($electronEntryPoint) -WorkingDirectory $projectRoot -PassThru
Write-ElectronLauncherLog "Electron lanzado con PID inicial $($electronProcess.Id)"

Start-Sleep -Seconds 3

if ($electronProcess.HasExited) {
  $desktopLog = ''
  if (Test-Path -LiteralPath $desktopLogPath) {
    $desktopLog = (Get-Content -LiteralPath $desktopLogPath -Tail 15) -join [Environment]::NewLine
  }

  [System.Windows.MessageBox]::Show(
    "Electron se ha cerrado justo despues de arrancar.`n`nRevisa este log:`n$desktopLogPath`n`nUltimas lineas:`n$desktopLog",
    'Prysma',
    'OK',
    'Warning'
  ) | Out-Null

  exit 1
}

Write-ElectronLauncherLog 'Electron sigue vivo despues de la ventana inicial.'
