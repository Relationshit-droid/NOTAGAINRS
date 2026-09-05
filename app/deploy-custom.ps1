# Windows PowerShell Deployment Script
# Replaces deployDomain.sh for Windows environments

# 1. Deploy and capture the URL
Write-Host "Starting Vercel deployment..."
$deploymentUrl = vercel deploy

# Check if the command succeeded
if ($LASTEXITCODE -eq 0) {
    # Trim whitespace just in case
    $deploymentUrl = $deploymentUrl.Trim()
    
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host "URL: $deploymentUrl"
    
    # 2. Alias to custom domain (Optional)
    # UNCOMMENT the lines below and replace 'my-custom-domain.com' with your actual domain
    
    # $customDomain = "my-custom-domain.com"
    # Write-Host "Aliasing to $customDomain..."
    # vercel alias $deploymentUrl $customDomain
    
} else {
    Write-Host "Deployment failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
