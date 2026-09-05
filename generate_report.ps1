$json = Get-Content -Path 'screen_analysis.json' -Raw | ConvertFrom-Json

# Initialize category collections
$hexOnly = @()
$rgbaOnly = @()
$fontSizeOnly = @()
$paddingMarginOnly = @()
$borderRadiusOnly = @()
$shadowOnly = @()
$inlineStyleOnly = @()
$mixedViolations = @()
$noViolations = @()
$missingScreenLayout = @()
$usingText = @()
$usingTouchableOpacity = @()

foreach ($file in $json) {
    $violations = @{
        'hex' = $file.Hex
        'rgba' = $file.Rgba
        'fontSize' = $file.FontSize
        'paddingMargin' = $file.PaddingMargin
        'borderRadius' = $file.BorderRadius
        'shadow' = $file.Shadow
        'inlineStyle' = $file.InlineStyle
    }
    
    $totalViolations = $file.Hex + $file.Rgba + $file.FontSize + $file.PaddingMargin + $file.BorderRadius + $file.Shadow + $file.InlineStyle
    
    # Find dominant violation type
    $maxCount = 0
    $dominantTypes = @()
    foreach ($key in $violations.Keys) {
        if ($violations[$key] -gt $maxCount) {
            $maxCount = $violations[$key]
            $dominantTypes = @($key)
        } elseif ($violations[$key] -eq $maxCount -and $maxCount -gt 0) {
            $dominantTypes += $key
        }
    }
    
    # Categorize files with violations
    if ($totalViolations -eq 0) {
        $noViolations += $file
    } elseif ($dominantTypes.Count -gt 1) {
        $mixedViolations += @{ File = $file; Types = $dominantTypes; Counts = $violations }
    } else {
        switch ($dominantTypes[0]) {
            'hex' { $hexOnly += @{ File = $file; Count = $file.Hex } }
            'rgba' { $rgbaOnly += @{ File = $file; Count = $file.Rgba } }
            'fontSize' { $fontSizeOnly += @{ File = $file; Count = $file.FontSize } }
            'paddingMargin' { $paddingMarginOnly += @{ File = $file; Count = $file.PaddingMargin } }
            'borderRadius' { $borderRadiusOnly += @{ File = $file; Count = $file.BorderRadius } }
            'shadow' { $shadowOnly += @{ File = $file; Count = $file.Shadow } }
            'inlineStyle' { $inlineStyleOnly += @{ File = $file; Count = $file.InlineStyle } }
        }
    }
    
    # Check for SafeAreaView usage (missing ScreenLayout)
    if ($file.SafeAreaView -gt 0) {
        $missingScreenLayout += @{ File = $file; Count = $file.SafeAreaView }
    }
    
    # Check for Text usage
    if ($file.Text -gt 0) {
        $usingText += @{ File = $file; Count = $file.Text }
    }
    
    # Check for TouchableOpacity usage
    if ($file.TouchableOpacity -gt 0) {
        $usingTouchableOpacity += @{ File = $file; Count = $file.TouchableOpacity }
    }
}

# Generate report
$report = @"
# Screen Violations Analysis Report

Total files analyzed: $($json.Count)

## Summary by Category

| Category | Count |
|----------|-------|
| Raw hex only | $($hexOnly.Count) |
| Raw rgba only | $($rgbaOnly.Count) |
| Raw fontSize only | $($fontSizeOnly.Count) |
| Raw padding/margin only | $($paddingMarginOnly.Count) |
| Raw borderRadius only | $($borderRadiusOnly.Count) |
| Raw shadow only | $($shadowOnly.Count) |
| Mixed style objects | $($inlineStyleOnly.Count) |
| Mixed violations | $($mixedViolations.Count) |
| No violations | $($noViolations.Count) |
| Missing ScreenLayout (SafeAreaView) | $($missingScreenLayout.Count) |
| Using Text instead of Typography | $($usingText.Count) |
| Using TouchableOpacity instead of SquishyButton | $($usingTouchableOpacity.Count) |

---

## 1. Raw hex only

"@

foreach ($item in ($hexOnly | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) hex values)`n"
}

$report += @"

## 2. Raw rgba only

"@

foreach ($item in ($rgbaOnly | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) rgba values)`n"
}

$report += @"

## 3. Raw fontSize only

"@

foreach ($item in ($fontSizeOnly | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) fontSize values)`n"
}

$report += @"

## 4. Raw padding/margin only

"@

foreach ($item in ($paddingMarginOnly | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) padding/margin values)`n"
}

$report += @"

## 5. Raw borderRadius only

"@

foreach ($item in ($borderRadiusOnly | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) borderRadius values)`n"
}

$report += @"

## 6. Raw shadow only

"@

foreach ($item in ($shadowOnly | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) shadow values)`n"
}

$report += @"

## 7. Mixed style objects (inline styles dominant)

"@

foreach ($item in ($inlineStyleOnly | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) inline style objects)`n"
}

$report += @"

## 8. Mixed violations (multiple equal dominant types)

"@

foreach ($item in ($mixedViolations | Sort-Object { $_.File.Hex + $_.File.Rgba + $_.File.FontSize + $_.File.PaddingMargin + $_.File.BorderRadius + $_.File.Shadow + $_.File.InlineStyle } -Descending)) {
    $f = $item.File
    $details = @()
    if ($f.Hex -gt 0) { $details += "hex: $($f.Hex)" }
    if ($f.Rgba -gt 0) { $details += "rgba: $($f.Rgba)" }
    if ($f.FontSize -gt 0) { $details += "fontSize: $($f.FontSize)" }
    if ($f.PaddingMargin -gt 0) { $details += "paddingMargin: $($f.PaddingMargin)" }
    if ($f.BorderRadius -gt 0) { $details += "borderRadius: $($f.BorderRadius)" }
    if ($f.Shadow -gt 0) { $details += "shadow: $($f.Shadow)" }
    if ($f.InlineStyle -gt 0) { $details += "inlineStyle: $($f.InlineStyle)" }
    $report += "- $($f.File) ($($details -join ', '))`n"
}

$report += @"

## 9. No violations (clean files)

"@

foreach ($item in $noViolations) {
    $report += "- $($item.File)`n"
}

$report += @"

## 10. Missing ScreenLayout (uses SafeAreaView)

"@

foreach ($item in ($missingScreenLayout | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) SafeAreaView usages)`n"
}

$report += @"

## 11. Using Text instead of Typography

"@

foreach ($item in ($usingText | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) Text components)`n"
}

$report += @"

## 12. Using TouchableOpacity instead of SquishyButton

"@

foreach ($item in ($usingTouchableOpacity | Sort-Object -Property Count -Descending)) {
    $report += "- $($item.File.File) ($($item.Count) TouchableOpacity usages)`n"
}

$report | Out-File -FilePath 'SCREEN_VIOLATIONS_REPORT.md' -Encoding UTF8
Write-Host "Report generated: SCREEN_VIOLATIONS_REPORT.md"
