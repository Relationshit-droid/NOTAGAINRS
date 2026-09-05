#!/usr/bin/env python3

import ast
import sys
import os

def test_server_syntax():
    server_path = "C:\\Users\\tabsv\\Desktop\\relationshitnorthmini\\relationshit\\backend\\server.py"
    
    try:
        with open(server_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        ast.parse(content)
        
        print("✅ server.py - SYNTAX OK")
        print(f"   Lines: {len(content.splitlines())}")
        print(f"   Size: {len(content)} bytes")
        
        print("\n=== FIRST 30 LINES ===")
        lines = content.splitlines()
        for i in range(min(30, len(lines))):
            print(f"{i+1:3}: {lines[i]}")
        
        return True
        
    except SyntaxError as e:
        print(f"❌ server.py - SYNTAX ERROR")
        print(f"   Line: {e.lineno}, Column: {e.offset}")
        print(f"   Error: {e.text}")
        print(f"   Context: {e.context}")
        return False
        
    except Exception as e:
        print(f"❌ server.py - ERROR: {e}")
        return False

if __name__ == "__main__":
    print("=== Testing Backend Server.py Syntax ===")
    print()
    
    if test_server_syntax():
        print("\n✅ server.py syntax is correct!")
        sys.exit(0)
    else:
        print("\n❌ server.py has syntax errors!")
        sys.exit(1)