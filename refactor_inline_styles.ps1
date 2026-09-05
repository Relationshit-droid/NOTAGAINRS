# Inline Style Refactoring Script for React Native
# This script identifies and helps refactor inline styles in game screens

$gamesDir = "app/src/screens/games"
$files = Get-ChildItem -Path $gamesDir -Filter "*.tsx" -File

$results = @()
$totalInlineStyles = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Count inline styles (style={{...}})
    $inlineStylePattern = 'style=\{\{[^}]+\}\}'
    $inlineStyles = [regex]::Matches($content, $inlineStylePattern)
    $count = $inlineStyles.Count
    
    if ($count -gt 0) {
        $totalInlineStyles += $count
        $results += [PSCustomObject]@{
            FileName = $file.Name
            InlineStyles = $count
            Path = $file.FullName
        }
        Write-Host "$($file.Name): $count inline styles found"
    }
}

Write-Host "`nTotal files with inline styles: $($results.Count)"
Write-Host "Total inline styles to refactor: $totalInlineStyles"

# Export results
$results | Export-Csv -Path "inline_styles_report.csv" -NoTypeInformation
Write-Host "`nReport saved to inline_styles_report.csv"
