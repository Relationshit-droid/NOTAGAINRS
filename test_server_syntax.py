# !/usr/bin/env python3
"""
Test script to verify the backend server.py is syntactically correct
"""

import ast
import sys

def test_syntax(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse the Python file
        ast.parse(content)
        
        print(f"✅ {file_path} - SYNTAX OK")
        print(f"   File size: {len(content)} bytes")
        print(f"   Lines: {len(content.splitlines())}")
        return True
        
    except SyntaxError as e:
        print(f"❌ {file_path} - SYNTAX ERROR")
        print(f"   Error: {e}")
        print(f"   Line: {e.lineno}, Column: {e.offset}")
        return False
    except Exception as e:
        print(f"❌ {file_path} - ERROR: {e}")
        return False

if __name__ == "__main__":
    server_path = "C:\\Users\\tabsv\\Desktop\\relationshitnorthmini\\relationshit\\backend\\server.py"
    
    print("=== Testing Backend Server.py Syntax ===")
    print()
    
    if test_syntax(server_path):
        print("\n✅ Server.py syntax is correct!")
        sys.exit(0)
    else:
        print("\n❌ Server.py has syntax errors!")
        sys.exit(1)