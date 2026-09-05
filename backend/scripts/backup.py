"""
Database Backup Script
Automated Firestore exports and Redis persistence
"""

import os
import json
import gzip
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Optional

# Firestore
try:
    from firebase_admin import firestore
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False


class BackupManager:
    """Manage database backups"""
    
    def __init__(self, backup_dir: str = './backups'):
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(exist_ok=True)
        self.timestamp = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
    
    def create_local_backup(self, collections: List[str] = None) -> Dict:
        """Create local JSON backup of Firestore collections"""
        if not FIREBASE_AVAILABLE:
            return {'success': False, 'error': 'Firebase not available'}
        
        db = firestore.client()
        collections = collections or [
            'users', 'couples', 'game_sessions', 'sos_events',
            'analytics_events', 'ai_conversations'
        ]
        
        backup_path = self.backup_dir / f'backup_{self.timestamp}'
        backup_path.mkdir(exist_ok=True)
        
        stats = {
            'collections_backed_up': 0,
            'total_documents': 0,
            'backup_path': str(backup_path)
        }
        
        try:
            for collection_name in collections:
                print(f"[Backup] Exporting {collection_name}...")
                
                collection_ref = db.collection(collection_name)
                docs = collection_ref.stream()
                
                data = []
                for doc in docs:
                    doc_data = doc.to_dict()
                    doc_data['_id'] = doc.id
                    data.append(doc_data)
                
                # Save as JSON
                file_path = backup_path / f'{collection_name}.json'
                with open(file_path, 'w') as f:
                    json.dump(data, f, indent=2, default=str)
                
                # Compress
                with open(file_path, 'rb') as f_in:
                    with gzip.open(f'{file_path}.gz', 'wb') as f_out:
                        shutil.copyfileobj(f_in, f_out)
                
                # Remove uncompressed file
                file_path.unlink()
                
                stats['collections_backed_up'] += 1
                stats['total_documents'] += len(data)
                print(f"[Backup] {collection_name}: {len(data)} documents")
            
            # Create backup manifest
            manifest = {
                'timestamp': self.timestamp,
                'created_at': datetime.now(timezone.utc).isoformat(),
                'collections': collections,
                'stats': stats
            }
            
            with open(backup_path / 'manifest.json', 'w') as f:
                json.dump(manifest, f, indent=2)
            
            return {'success': True, **stats}
        
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def backup_redis(self) -> Dict:
        """Trigger Redis persistence"""
        try:
            import redis
            r = redis.from_url(os.environ.get('REDIS_URL', 'redis://localhost:6379/0'))
            r.bgsave()
            return {'success': True, 'message': 'Redis BGSAVE triggered'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def cleanup_old_backups(self, keep_days: int = 7) -> Dict:
        """Remove backups older than specified days"""
        cutoff = datetime.now(timezone.utc).timestamp() - (keep_days * 24 * 60 * 60)
        removed = []
        
        for item in self.backup_dir.iterdir():
            if item.is_dir():
                try:
                    item_stat = item.stat()
                    if item_stat.st_mtime < cutoff:
                        shutil.rmtree(item)
                        removed.append(item.name)
                except:
                    pass
        
        return {'success': True, 'removed': removed, 'count': len(removed)}
    
    def list_backups(self) -> List[Dict]:
        """List all available backups"""
        backups = []
        
        for item in self.backup_dir.iterdir():
            if item.is_dir():
                manifest_path = item / 'manifest.json'
                if manifest_path.exists():
                    with open(manifest_path) as f:
                        manifest = json.load(f)
                    backups.append(manifest)
        
        return sorted(backups, key=lambda x: x['timestamp'], reverse=True)


def main():
    """CLI for backup operations"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Database Backup Manager')
    parser.add_argument('command', choices=['local', 'redis', 'cleanup', 'list'])
    parser.add_argument('--keep-days', type=int, default=7)
    
    args = parser.parse_args()
    
    manager = BackupManager()
    
    if args.command == 'local':
        result = manager.create_local_backup()
    elif args.command == 'redis':
        result = manager.backup_redis()
    elif args.command == 'cleanup':
        result = manager.cleanup_old_backups(args.keep_days)
    elif args.command == 'list':
        backups = manager.list_backups()
        print(json.dumps(backups, indent=2))
        return
    
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
