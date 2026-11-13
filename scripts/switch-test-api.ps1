param([ValidateSet('Normal','Denied')][string]$Mode = 'Normal')
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
$pidPath = Join-Path $projectRoot 'runtime\store-api.pid'
$taskProcessId = [int](Get-Content -LiteralPath $pidPath)
$taskInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $taskProcessId"
if ($taskInfo.ExecutablePath -ne 'C:\Program Files\nodejs\node.exe' -or
    ($taskInfo.CommandLine -notlike '*--env-file=.env*src/server.js*' -and $taskInfo.CommandLine -notlike '*scripts/serve-denied.js*')) {
    throw 'The recorded PID does not belong to the task API. No process was stopped.'
}
& taskkill.exe /PID $taskProcessId
if ($LASTEXITCODE -ne 0) { throw 'Could not stop the task API.' }
$argumentList = if ($Mode -eq 'Denied') { @('scripts/serve-denied.js') } else { @('--env-file=.env','src/server.js') }
$logName = if ($Mode -eq 'Denied') { 'server-denied' } else { 'server-restored' }
$taskProcess = Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' -ArgumentList $argumentList -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $projectRoot "runtime\$logName.out.log") -RedirectStandardError (Join-Path $projectRoot "runtime\$logName.err.log")
$taskProcess.Id | Set-Content -LiteralPath $pidPath
Write-Output "Task API mode: $Mode; PID: $($taskProcess.Id)"
Wait-Process -Id $taskProcess.Id
