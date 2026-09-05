#!/usr/bin/env python3
"""
ScreenLayout Enforcement Script
Refactors game screens to use ScreenLayout consistently.
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Tuple, Dict

# Configuration
GAMES_DIR = Path("app/src/screens/games")
BACKUP_SUFFIX = ".backup"

# Patterns to match
SAFEAREA_IMPORT_PATTERN = re.compile(r"import\s+\{\s*SafeAreaView\s*\}\s+from\s+['"]react-native-safe-area-context['"];?")
SCREENLAYOUT_IMPORT_PATTERN = re.compile(r"import\s+.*ScreenLayout.*from.*")

# JSX patterns
SAFEAREA_OPEN_PATTERN = re.compile(r"<SafeAreaView[^>]*>")
SAFEAREA_CLOSE_PATTERN = re.compile(r"</SafeAreaView>")
SCREENLAYOUT_OPEN_PATTERN = re.compile(r"<ScreenLayout[^>]*>")


def categorize_file(filepath: Path) -> str:
    """Categorize a file based on its usage of SafeAreaView and ScreenLayout."""
    content = filepath.read_text(encoding='utf-8')
    
    has_screenlayout_import = bool(SCREENLAYOUT_IMPORT_PATTERN.search(content))
    has_safearea_import = bool(SAFEAREA_IMPORT_PATTERN.search(content))
    has_screenlayout_jsx = bool(SCREENLAYOUT_OPEN_PATTERN.search(content))
    has_safearea_jsx = bool(SAFEAREA_OPEN_PATTERN.search(content))
    
    if has_screenlayout_jsx and has_safearea_jsx:
        return "NESTED"
    elif has_safearea_jsx and not has_screenlayout_jsx:
        return "SAFEAREA_ONLY"
    elif has_screenlayout_jsx and not has_safearea_jsx:
        return "SCREENLAYOUT_ONLY"
    else:
        return "OTHER"


def process_nested_file(filepath: Path) -> Tuple[bool, str]:
    """
    Process files with nested ScreenLayout + SafeAreaView.
    Consolidate to single ScreenLayout with showHeader={false} scrollable={true}.
    """
    content = filepath.read_text(encoding='utf-8')
    original_content = content
    
    # Find the ScreenLayout opening tag and its props
    screenlayout_match = SCREENLAYOUT_OPEN_PATTERN.search(content)
    if not screenlayout_match:
        return False, "No ScreenLayout tag found"
    
    screenlayout_tag = screenlayout_match.group(0)
    
    # Check if ScreenLayout already has the correct props
    if 'showHeader={false}' in screenlayout_tag and 'scrollable={true}' in screenlayout_tag:
        # Just remove the SafeAreaView wrapper
        pass
    else:
        # Update ScreenLayout props
        new_tag = '<ScreenLayout showHeader={false} scrollable={true}'
        
        # Preserve other props like showMarcie, marcieQuote, etc.
        if 'showMarcie=' in screenlayout_tag:
            showmarcie_match = re.search(r'showMarcie=\{[^}]+\}', screenlayout_tag)
            if showmarcie_match:
                new_tag += f' {showmarcie_match.group(0)}'
        
        if 'marcieQuote=' in screenlayout_tag:
            marciequote_match = re.search(r'marcieQuote=\{[^}]+\}', screenlayout_tag)
            if marciequote_match:
                new_tag += f' {marciequote_match.group(0)}'
        
        if 'marcieAnimation=' in screenlayout_tag:
            marcieanim_match = re.search(r'marcieAnimation=\{[^}]+\}', screenlayout_tag)
            if marcieanim_match:
                new_tag += f' {marcieanim_match.group(0)}'
        
        if 'marciePosition=' in screenlayout_tag:
            marciepos_match = re.search(r'marciePosition=\{[^}]+\}', screenlayout_tag)
            if marciepos_match:
                new_tag += f' {marciepos_match.group(0)}'
        
        new_tag += '>'
        content = content.replace(screenlayout_tag, new_tag, 1)
    
    # Remove SafeAreaView import
    content = SAFEAREA_IMPORT_PATTERN.sub('', content)
    
    # Remove SafeAreaView opening tag (with any props)
    content = SAFEAREA_OPEN_PATTERN.sub('', content, count=1)
    
    # Remove SafeAreaView closing tag
    content = SAFEAREA_CLOSE_PATTERN.sub('', content, count=1)
    
    # Clean up any double newlines from removed imports
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    if content != original_content:
        filepath.write_text(content, encoding='utf-8')
        return True, "Successfully consolidated ScreenLayout and removed SafeAreaView"
    
    return False, "No changes needed"


def process_safearea_only_file(filepath: Path) -> Tuple[bool, str]:
    """
    Process files with only SafeAreaView (no ScreenLayout).
    Replace SafeAreaView with ScreenLayout.
    """
    content = filepath.read_text(encoding='utf-8')
    original_content = content
    
    # Add ScreenLayout import if not present
    if not SCREENLAYOUT_IMPORT_PATTERN.search(content):
        # Find the last import statement
        import_matches = list(re.finditer(r'^import\s+.*from\s+["\'].*["\'];?$', content, re.MULTILINE))
        if import_matches:
            last_import = import_matches[-1]
            insert_pos = last_import.end()
            content = content[:insert_pos] + "\nimport { ScreenLayout } from '../../components/ui';" + content[insert_pos:]
    
    # Replace SafeAreaView opening tag with ScreenLayout
    safearea_open = SAFEAREA_OPEN_PATTERN.search(content)
    if safearea_open:
        safearea_tag = safearea_open.group(0)
        # Extract edges prop if present
        edges_match = re.search(r'edges=\{[^}]+\}', safearea_tag)
        new_tag = '<ScreenLayout showHeader={false} scrollable={true}>'
        content = content.replace(safearea_tag, new_tag, 1)
    
    # Replace closing SafeAreaView tag
    content = SAFEAREA_CLOSE_PATTERN.sub('</ScreenLayout>', content, count=1)
    
    # Remove SafeAreaView import
    content = SAFEAREA_IMPORT_PATTERN.sub('', content)
    
    # Clean up double newlines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    if content != original_content:
        filepath.write_text(content, encoding='utf-8')
        return True, "Successfully replaced SafeAreaView with ScreenLayout"
    
    return False, "No changes needed"


def process_other_file(filepath: Path) -> Tuple[bool, str]:
    """
    Process files categorized as OTHER (no SafeAreaView, no ScreenLayout in JSX).
    These might use GameContainer or other wrappers.
    """
    content = filepath.read_text(encoding='utf-8')
    
    # Check if it has SafeAreaView import but doesn't use it in JSX
    has_safearea_import = bool(SAFEAREA_IMPORT_PATTERN.search(content))
    
    if has_safearea_import:
        # Remove unused import
        content = SAFEAREA_IMPORT_PATTERN.sub('', content)
        content = re.sub(r'\n{3,}', '\n\n', content)
        filepath.write_text(content, encoding='utf-8')
        return True, "Removed unused SafeAreaView import"
    
    return False, "No changes needed (uses GameContainer or other wrapper)"


def main():
    """Main entry point."""
    games_dir = Path(GAMES_DIR)
    
    if not games_dir.exists():
        print(f"Error: Directory {games_dir} does not exist")
        sys.exit(1)
    
    # Statistics
    stats = {
        "NESTED": {"count": 0, "modified": 0, "files": []},
        "SAFEAREA_ONLY": {"count": 0, "modified": 0, "files": []},
        "SCREENLAYOUT_ONLY": {"count": 0, "modified": 0, "files": []},
        "OTHER": {"count": 0, "modified": 0, "files": []},
    }
    
    errors = []
    
    # Process all .tsx files
    for filepath in sorted(games_dir.glob("*.tsx")):
        try:
            category = categorize_file(filepath)
            stats[category]["count"] += 1
            
            if category == "NESTED":
                modified, message = process_nested_file(filepath)
                if modified:
                    stats[category]["modified"] += 1
                    stats[category]["files"].append(f"{filepath.name} - {message}")
                else:
                    stats[category]["files"].append(f"{filepath.name} - {message}")
                    
            elif category == "SAFEAREA_ONLY":
                modified, message = process_safearea_only_file(filepath)
                if modified:
                    stats[category]["modified"] += 1
                    stats[category]["files"].append(f"{filepath.name} - {message}")
                else:
                    stats[category]["files"].append(f"{filepath.name} - {message}")
                    
            elif category == "OTHER":
                modified, message = process_other_file(filepath)
                if modified:
                    stats[category]["modified"] += 1
                    stats[category]["files"].append(f"{filepath.name} - {message}")
                else:
                    stats[category]["files"].append(f"{filepath.name} - {message}")
            else:
                # SCREENLAYOUT_ONLY - skip
                stats[category]["files"].append(f"{filepath.name} - Already compliant")
                
        except Exception as e:
            errors.append(f"{filepath.name}: {str(e)}")
    
    # Print report
    print("=" * 80)
    print("SCREENLAYOUT ENFORCEMENT REFACTOR REPORT")
    print("=" * 80)
    print()
    
    for category, data in stats.items():
        print(f"\n{category} ({data['count']} files, {data['modified']} modified):")
        print("-" * 40)
        for file_info in data["files"]:
            print(f"  - {file_info}")
    
    if errors:
        print("\n\nERRORS:")
        print("-" * 40)
        for error in errors:
            print(f"  - {error}")
    
    print()
    print("=" * 80)
    print(f"Total files processed: {sum(d['count'] for d in stats.values())}")
    print(f"Total files modified: {sum(d['modified'] for d in stats.values())}")
    print("=" * 80)


if __name__ == "__main__":
    main()
