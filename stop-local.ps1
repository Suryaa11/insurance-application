param(
  [switch]$StopMongoService
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logsPath = Join-Path $root 'logs'
$statePath = Join-Path $logsPath 'local-state.json'

function Stop-ProcessIfRunning {
  param([int]$ProcessId)

  try {
    $process = Get-Process -Id $ProcessId -ErrorAction Stop
    Stop-Process -Id $process.Id -Force
    Write-Host "Stopped process $ProcessId"
  } catch {
    Write-Host "Process $ProcessId not running"
  }
}

if (Test-Path $statePath) {
  $state = Get-Content $statePath -Raw | ConvertFrom-Json
  if ($state.backendPid) {
    Stop-ProcessIfRunning -ProcessId [int]$state.backendPid
  }
  if ($state.frontendPid) {
    Stop-ProcessIfRunning -ProcessId [int]$state.frontendPid
  }
} else {
  Write-Host 'No saved local state found. Falling back to port-based cleanup.'
  foreach ($port in @(3000, 5000)) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($connection in $connections) {
      Stop-ProcessIfRunning -ProcessId $connection.OwningProcess
    }
  }
}

if ($StopMongoService) {
  $mongoService = Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue
  if ($mongoService -and $mongoService.Status -eq 'Running') {
    Stop-Service -Name 'MongoDB' -Force
    Write-Host 'MongoDB service stopped'
  }
}

Write-Host 'Local processes stopped.'
