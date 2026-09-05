$results = @()
$screensDir = 'app/src/screens'

$files = Get-ChildItem -Path $screensDir -Recurse -Filter '*.tsx' | Where-Object { $_.FullName -notlike '*theme*' }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $relPath = $file.FullName.Replace($PWD.Path + '\', '').Replace('\', '/')
        
        # Count violations
        $hexCount = ([regex]::Matches($content, '#[0-9a-fA-F]{3,8}')).Count
        $rgbaCount = ([regex]::Matches($content, 'rgba\s*\(')).Count
        $fontSizeCount = ([regex]::Matches($content, 'fontSize:\s*[0-9]')).Count
        $paddingMarginCount = ([regex]::Matches($content, '(padding|margin):\s*[0-9]')).Count
        $borderRadiusCount = ([regex]::Matches($content, 'borderRadius:\s*[0-9]')).Count
        $shadowCount = ([regex]::Matches($content, '(shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation\s*:)')).Count
        $inlineStyleCount = ([regex]::Matches($content, 'style=\{\{')).Count
        $safeAreaCount = ([regex]::Matches($content, 'SafeAreaView')).Count
        $textCount = ([regex]::Matches($content, '<Text[^a-zA-Z]')).Count
        $touchableCount = ([regex]::Matches($content, 'TouchableOpacity')).Count
        
        $result = [PSCustomObject]@{
            File = $relPath
            Hex = $hexCount
            Rgba = $rgbaCount
            FontSize = $fontSizeCount
            PaddingMargin = $paddingMarginCount
            BorderRadius = $borderRadiusCount
            Shadow = $shadowCount
            InlineStyle = $inlineStyleCount
            SafeAreaView = $safeAreaCount
            Text = $textCount
            TouchableOpacity = $touchableCount
        }
        $results += $result
    }
}

$results | ConvertTo-Json -Depth 10 | Out-File -FilePath 'screen_analysis.json' -Encoding UTF8
Write-Host "Analysis complete. Found $($results.Count) files."
