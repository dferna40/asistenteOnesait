$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDir = Join-Path $projectRoot '.runtime'
$logsDir = Join-Path $runtimeDir 'logs'
$serverPidPath = Join-Path $runtimeDir 'server.pid'
$serverLogPath = Join-Path $logsDir 'server.stdout.log'
$serverErrorLogPath = Join-Path $logsDir 'server.stderr.log'
$launcherLogPath = Join-Path $logsDir 'launcher.log'
$serverBootstrapPath = Join-Path $runtimeDir 'start-server.cmd'
$distIndexPath = Join-Path $projectRoot 'dist\index.html'
$appUrl = 'http://127.0.0.1:3001'
$serverUrl = 'http://127.0.0.1:3001/health'
$nodeExecutable = (Get-Command node -ErrorAction Stop).Source

New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null
New-Item -ItemType Directory -Force -Path $logsDir | Out-Null
Add-Type -AssemblyName PresentationFramework

function Write-LauncherLog {
  param(
    [string]$Message
  )

  Add-Content -LiteralPath $launcherLogPath -Value "[$([DateTime]::Now.ToString('s'))] $Message"
}

if (-not (Test-Path -LiteralPath $distIndexPath)) {
  [System.Windows.MessageBox]::Show(
    "No existe la version compilada de la aplicacion.`n`nFalta este archivo:`n$distIndexPath",
    'Prysma',
    'OK',
    'Warning'
  ) | Out-Null
  exit 1
}

function Test-PortReady {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url
  )

  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2
    return $response.StatusCode -ge 200
  } catch {
    return $false
  }
}

function Test-UrlReachable {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url
  )

  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__) {
      $statusCode = $_.Exception.Response.StatusCode.value__
      return $statusCode -ge 200 -and $statusCode -lt 500
    }

    return $false
  }
}

function Test-ProcessAlive {
  param(
    [string]$PidFile
  )

  if (-not (Test-Path -LiteralPath $PidFile)) {
    return $false
  }

  try {
    $pidValue = Get-Content -LiteralPath $PidFile -ErrorAction Stop | Select-Object -First 1
    if (-not $pidValue) {
      return $false
    }

    $null = Get-Process -Id ([int]$pidValue) -ErrorAction Stop
    return $true
  } catch {
    return $false
  }
}

function Open-AppInDefaultBrowser {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url
  )

  try {
    Start-Process -FilePath 'explorer.exe' -ArgumentList $Url | Out-Null
    Write-LauncherLog "URL abierta con explorer.exe: $Url"
    return $true
  } catch {
    try {
      Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'start', '', $Url -WindowStyle Hidden | Out-Null
      Write-LauncherLog "URL abierta con cmd/start: $Url"
      return $true
    } catch {
      try {
        Start-Process $Url | Out-Null
        Write-LauncherLog "URL abierta con Start-Process directo: $Url"
        return $true
      } catch {
        Write-LauncherLog "No se pudo abrir automaticamente la URL: $Url"
        return $false
      }
    }
  }
}

function Get-ListeningProcessIdForPort {
  param(
    [int]$Port
  )

  $listeningConnections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($listeningConnections) {
    return ($listeningConnections | Select-Object -First 1).OwningProcess
  }

  $netstatMatch = netstat -ano | Select-String "LISTENING\s+\d+$" | Where-Object {
    $_.Line -match ":$Port\s"
  } | Select-Object -First 1

  if (-not $netstatMatch) {
    return $null
  }

  $columns = ($netstatMatch.Line -replace '\s+', ' ').Trim().Split(' ')
  if ($columns.Length -lt 5) {
    return $null
  }

  $processId = $columns[-1]
  if ($processId -match '^\d+$') {
    return [int]$processId
  }

  return $null
}

function Start-HiddenProcess {
  param(
    [Parameter(Mandatory = $true)]
    [string]$PidFile,
    [Parameter(Mandatory = $true)]
    [string]$StandardOutputLogPath,
    [Parameter(Mandatory = $true)]
    [string]$StandardErrorLogPath
  )

  if (Test-ProcessAlive -PidFile $PidFile) {
    return
  }

  foreach ($logPath in @($StandardOutputLogPath, $StandardErrorLogPath)) {
    if (Test-Path -LiteralPath $logPath) {
      Remove-Item -LiteralPath $logPath -Force -ErrorAction SilentlyContinue
    }
  }

  $bootstrapContent = @"
@echo off
set "APP_PORT=3001"
set "APP_SERVE_STATIC=true"
cd /d "$projectRoot"
"$nodeExecutable" server.js 1>>"$StandardOutputLogPath" 2>>"$StandardErrorLogPath"
"@

  try {
    Set-Content -LiteralPath $serverBootstrapPath -Value $bootstrapContent -Encoding ASCII
    $process = Start-Process `
      -FilePath 'cmd.exe' `
      -ArgumentList '/c', 'start', '""', '/min', $serverBootstrapPath `
      -WorkingDirectory $projectRoot `
      -WindowStyle Hidden `
      -PassThru
  } catch {
    Write-LauncherLog "No se pudo lanzar el wrapper del servidor: $($_.Exception.Message)"
    throw
  }

  Write-LauncherLog "Wrapper de arranque lanzado con PID inicial $($process.Id)"

  for ($attempt = 0; $attempt -lt 15; $attempt++) {
    if ($process.HasExited) {
      Write-LauncherLog "El wrapper del servidor termino con ExitCode $($process.ExitCode). Se sigue comprobando el puerto."
    }

    $listeningProcessId = Get-ListeningProcessIdForPort -Port 3001
    if ($listeningProcessId) {
      Set-Content -LiteralPath $PidFile -Value $listeningProcessId -Encoding ASCII
      Write-LauncherLog "Servidor escuchando en 3001 con PID $listeningProcessId"
      return
    }

    Start-Sleep -Milliseconds 300
  }

  Set-Content -LiteralPath $PidFile -Value $process.Id -Encoding ASCII
  Write-LauncherLog "No se detecto el puerto a tiempo; se guarda PID de proceso $($process.Id)"
}

if (-not (Test-PortReady -Url $serverUrl)) {
  Write-LauncherLog 'El servidor no estaba listo. Se inicia una nueva instancia.'
  Start-HiddenProcess `
    -PidFile $serverPidPath `
    -StandardOutputLogPath $serverLogPath `
    -StandardErrorLogPath $serverErrorLogPath
}

$maxAttempts = 45
for ($attempt = 0; $attempt -lt $maxAttempts; $attempt++) {
  if ((Test-PortReady -Url $serverUrl) -and (Test-UrlReachable -Url $appUrl)) {
    if (Open-AppInDefaultBrowser -Url $appUrl) {
      Write-LauncherLog 'Arranque web completado correctamente.'
      exit 0
    }

    [System.Windows.MessageBox]::Show(
      "La aplicacion ha arrancado, pero no se ha podido abrir el navegador automaticamente.`n`nAbre manualmente esta URL:`n$appUrl",
      'Prysma',
      'OK',
      'Warning'
    ) | Out-Null
    Write-LauncherLog 'Arranque web con apertura automatica fallida.'
    exit 1
  }

  Start-Sleep -Milliseconds 750
}

[System.Windows.MessageBox]::Show(
  "La aplicacion no ha arrancado a tiempo.`n`nRevisa estos logs:`n$serverLogPath`n$serverErrorLogPath",
  'Prysma',
  'OK',
  'Warning'
) | Out-Null

Write-LauncherLog 'La aplicacion no arranco a tiempo.'

exit 1
