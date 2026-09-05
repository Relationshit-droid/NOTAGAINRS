import sys
sys.path.insert(0, '.')
from server import app
paths = [r.path for r in app.routes if hasattr(r, 'path')]
for p in paths:
    if 'games' in p.lower():
        print(p)