# Discord Style Chat - Create Installation ZIP

Write-Host "Creating Discord Style Chat installation package..." -ForegroundColor Cyan

$sourcePath = $PSScriptRoot
$zipPath = Join-Path $sourcePath "discord-style-chat.zip"

# Remove old zip if exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Removed old zip file" -ForegroundColor Yellow
}

# Files and folders to include
$itemsToInclude = @(
    "about.json",
    "settings.yml",
    "LICENSE",
    "README.md",
    "QUICKSTART.md",
    "TROUBLESHOOTING.md",
    "common",
    "desktop",
    "mobile"
)

# Create temporary directory
$tempDir = Join-Path $env:TEMP "discord-style-chat-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy items to temp directory
foreach ($item in $itemsToInclude) {
    $itemPath = Join-Path $sourcePath $item
    if (Test-Path $itemPath) {
        Copy-Item $itemPath -Destination $tempDir -Recurse -Force
        Write-Host "✓ Added: $item" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing: $item" -ForegroundColor Red
    }
}

# Create zip
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

# Cleanup
Remove-Item $tempDir -Recurse -Force

# Show result
if (Test-Path $zipPath) {
    $zipSize = (Get-Item $zipPath).Length / 1KB
    Write-Host "`n✓ Successfully created: discord-style-chat.zip" -ForegroundColor Green
    Write-Host "  Size: $([math]::Round($zipSize, 2)) KB" -ForegroundColor Cyan
    Write-Host "  Location: $zipPath" -ForegroundColor Cyan
    Write-Host "`nYou can now upload this ZIP file to Discourse!" -ForegroundColor Yellow
} else {
    Write-Host "`n✗ Failed to create ZIP file" -ForegroundColor Red
}
