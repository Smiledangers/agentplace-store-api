$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$deliveryRoot = Join-Path $projectRoot 'delivery'
New-Item -ItemType Directory -Force -Path $deliveryRoot | Out-Null
$archivePath = Join-Path $deliveryRoot 'store-agent-demo.zip'
# Explicit allowlist: excludes .env, runtime, credentials and Git metadata.
$sourceNames = @('src','data','test','scripts','docs','evidence','README.md','package.json','openapi.json','Dockerfile','.dockerignore','.gitignore','.env.example')
$sourcePaths = $sourceNames | ForEach-Object { Join-Path $projectRoot $_ }
Compress-Archive -LiteralPath $sourcePaths -DestinationPath $archivePath -Force
$hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath (Join-Path $deliveryRoot 'store-agent-demo.zip.sha256') -Value "$hash  store-agent-demo.zip" -Encoding utf8
Write-Output $archivePath
Write-Output "SHA256: $hash"
