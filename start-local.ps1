param(
  [switch]$SkipBrowser
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend'
$logsPath = Join-Path $root 'logs'
$statePath = Join-Path $logsPath 'local-state.json'
$runStamp = Get-Date -Format 'yyyyMMdd-HHmmss'

function Ensure-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $Name"
  }
}

function Test-DockerDaemon {
  try {
    & docker info *> $null
    return $LASTEXITCODE -eq 0
  } catch {
    return $false
  }
}

function Start-HiddenProcess {
  param(
    [string]$Name,
    [string]$FilePath,
    [string[]]$ArgumentList,
    [string]$WorkingDirectory,
    [string]$StdOut,
    [string]$StdErr
  )

  $process = Start-Process `
    -FilePath $FilePath `
    -ArgumentList $ArgumentList `
    -WorkingDirectory $WorkingDirectory `
    -WindowStyle Hidden `
    -PassThru `
    -RedirectStandardOutput $StdOut `
    -RedirectStandardError $StdErr

  Write-Host "$Name started with PID $($process.Id)"
  return $process
}

function Wait-ForHttpOk {
  param(
    [string]$Url,
    [int]$TimeoutSeconds = 90
  )

  $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
  while ($stopwatch.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
        return
      }
    } catch {
      Start-Sleep -Seconds 2
    }
  }

  throw "Timed out waiting for $Url"
}

function Wait-ForMongoHealthy {
  param([int]$TimeoutSeconds = 120)

  $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
  while ($stopwatch.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    try {
      $containerId = docker compose ps -q mongodb 2>$null
      if ($containerId) {
        $status = docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' $containerId 2>$null
        if ($status -eq 'healthy') {
          return
        }
      }
    } catch {
    }
    Start-Sleep -Seconds 2
  }

  throw 'Timed out waiting for MongoDB to become healthy'
}

function Import-EnvFile {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return
  }

  foreach ($line in Get-Content $Path) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith('#')) {
      continue
    }

    $parts = $trimmed.Split('=', 2)
    if ($parts.Count -ne 2) {
      continue
    }

    $name = $parts[0].Trim()
    $value = $parts[1].Trim()
    [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
  }
}

Ensure-Command npm
Ensure-Command cmd

New-Item -ItemType Directory -Force -Path $logsPath | Out-Null
Import-EnvFile -Path (Join-Path $backendPath '.env')

if (-not (Test-Path (Join-Path $root 'node_modules'))) {
  Write-Host 'Installing workspace dependencies...'
  Push-Location $root
  npm install --workspaces
  Pop-Location
}

$useDockerMongo = Test-DockerDaemon

if ($useDockerMongo) {
  Write-Host 'Starting MongoDB with Docker...'
  docker compose up -d mongodb
  Wait-ForMongoHealthy
} else {
$useDockerMongo = $false
Write-Host 'Using local MongoDB service...'
  $mongoService = Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue
  if (-not $mongoService) {
    throw 'MongoDB service is not installed. Install MongoDB locally and start the MongoDB service.'
  }

  if ($mongoService.Status -ne 'Running') {
    Start-Service -Name 'MongoDB'
  }

  $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
  while ($stopwatch.Elapsed.TotalSeconds -lt 120) {
    try {
      if (Test-NetConnection -ComputerName '127.0.0.1' -Port 27017 -InformationLevel Quiet) {
        break
      }
    } catch {
    }
    Start-Sleep -Seconds 2
  }

if (-not (Test-NetConnection -ComputerName '127.0.0.1' -Port 27017 -InformationLevel Quiet)) {
  throw 'Timed out waiting for the local MongoDB service to accept connections on port 27017.'
}
}

$env:NODE_ENV = 'development'
$env:PORT = '5000'
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/insurance_management'
$env:JWT_ACCESS_SECRET = 'dev-access-secret-change-me'
$env:JWT_REFRESH_SECRET = 'dev-refresh-secret-change-me'
$env:JWT_ACCESS_EXPIRES_IN = '15m'
$env:JWT_REFRESH_EXPIRES_IN = '7d'
$env:CLIENT_ORIGIN = 'http://localhost:3000'
$env:UPLOAD_DIR = 'uploads'
$env:LOG_LEVEL = 'info'

if (-not $env:AZURE_STORAGE_CONNECTION_STRING -or -not $env:AZURE_STORAGE_CONTAINER_NAME) {
  Write-Warning 'Azure storage env vars are missing from backend/.env. Document uploads will fail until they are added.'
} else {
  Write-Host "Azure storage container: $($env:AZURE_STORAGE_CONTAINER_NAME)"
}

Write-Host 'Seeding sample admin and insurance plans...'
Push-Location $root
$seedOutput = & npm run seed --workspace backend 2>&1
$seedExitCode = $LASTEXITCODE
Pop-Location

if ($seedExitCode -ne 0) {
  throw "Seed script failed:`n$seedOutput"
}

Write-Host 'Seed completed successfully.'

$backendOut = Join-Path $logsPath "backend-$runStamp.out.log"
$backendErr = Join-Path $logsPath "backend-$runStamp.err.log"
New-Item -ItemType File -Force -Path $backendOut, $backendErr | Out-Null

Write-Host 'Starting backend...'
$backendProcess = Start-HiddenProcess `
  -Name 'Backend' `
  -FilePath 'cmd.exe' `
  -ArgumentList @('/c', 'npm run dev --workspace backend') `
  -WorkingDirectory $root `
  -StdOut $backendOut `
  -StdErr $backendErr

Wait-ForHttpOk -Url 'http://localhost:5000/health' -TimeoutSeconds 120

$env:VITE_API_URL = 'http://localhost:5000/api/v1'

$frontendOut = Join-Path $logsPath 'frontend.out.log'
$frontendErr = Join-Path $logsPath "frontend-$runStamp.err.log"
$frontendOut = Join-Path $logsPath "frontend-$runStamp.out.log"
New-Item -ItemType File -Force -Path $frontendOut, $frontendErr | Out-Null

Write-Host 'Starting frontend...'
$frontendProcess = Start-HiddenProcess `
  -Name 'Frontend' `
  -FilePath 'cmd.exe' `
  -ArgumentList @('/c', 'npm run dev --workspace frontend -- --host 0.0.0.0') `
  -WorkingDirectory $root `
  -StdOut $frontendOut `
  -StdErr $frontendErr

$state = @{
  backendPid = $backendProcess.Id
  frontendPid = $frontendProcess.Id
  backendOut = $backendOut
  backendErr = $backendErr
  frontendOut = $frontendOut
  frontendErr = $frontendErr
  startedAt = (Get-Date).ToString('o')
} | ConvertTo-Json -Depth 3

Set-Content -Path $statePath -Value $state -Encoding utf8

if (-not $SkipBrowser) {
  Start-Sleep -Seconds 3
  Start-Process 'http://localhost:3000'
}

Write-Host ''
Write-Host 'Local environment is running.'
Write-Host 'Frontend: http://localhost:3000'
Write-Host 'Backend:   http://localhost:5000'
Write-Host "Logs:      $logsPath"
Write-Host 'MongoDB:   local Windows service on localhost:27017'
Write-Host 'Admin:     admin@insurance.com / Admin@12345'
Write-Host "State:     $statePath"
Write-Host ''
Write-Host 'To stop the services, use Task Manager or end the npm/node processes listed in the log output.'
