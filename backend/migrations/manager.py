"""
Migration Manager
Versioned database schema migrations for Firestore
"""

import os
import json
import importlib
from datetime import datetime, timezone
from typing import List, Dict, Optional, Callable
from pathlib import Path

# Firestore imports
try:
    from firebase_admin import firestore
    from firebase_admin.firestore import Client as FirestoreClient
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False


class Migration:
    """Single migration definition"""
    
    def __init__(self, version: str, name: str, 
                 up: Callable, down: Optional[Callable] = None):
        self.version = version
        self.name = name
        self.up = up
        self.down = down
        self.applied_at: Optional[datetime] = None


class MigrationManager:
    """Manage database migrations"""
    
    MIGRATIONS_COLLECTION = '_migrations'
    
    def __init__(self, db: Optional[FirestoreClient] = None):
        self.db = db
        self.migrations: Dict[str, Migration] = {}
        self._load_builtin_migrations()
    
    def _load_builtin_migrations(self):
        """Load built-in migrations"""
        # Migration 001: Initial schema
        self.register(
            version='001',
            name='create_initial_collections',
            up=self._migrate_001_up,
            down=self._migrate_001_down
        )
        
        # Migration 002: Add indexes
        self.register(
            version='002',
            name='create_indexes',
            up=self._migrate_002_up,
        )
        
        # Migration 003: Add audit fields
        self.register(
            version='003',
            name='add_audit_fields',
            up=self._migrate_003_up,
        )
    
    def register(self, version: str, name: str, 
                 up: Callable, down: Optional[Callable] = None):
        """Register a migration"""
        self.migrations[version] = Migration(version, name, up, down)
    
    def get_applied_migrations(self) -> List[str]:
        """Get list of already applied migration versions"""
        if not self.db:
            return []
        
        try:
            docs = self.db.collection(self.MIGRATIONS_COLLECTION).stream()
            return [doc.id for doc in docs]
        except Exception as e:
            print(f"Error reading migrations: {e}")
            return []
    
    def get_pending_migrations(self) -> List[Migration]:
        """Get migrations that need to be applied"""
        applied = set(self.get_applied_migrations())
        pending = []
        
        for version in sorted(self.migrations.keys()):
            if version not in applied:
                pending.append(self.migrations[version])
        
        return pending
    
    def migrate(self, target_version: Optional[str] = None) -> Dict:
        """Run pending migrations"""
        if not self.db:
            return {
                'success': False,
                'error': 'Database not connected',
                'applied': []
            }
        
        pending = self.get_pending_migrations()
        
        if target_version:
            pending = [m for m in pending if m.version <= target_version]
        
        applied = []
        errors = []
        
        for migration in pending:
            try:
                print(f"Applying migration {migration.version}: {migration.name}")
                
                # Run migration
                migration.up(self.db)
                
                # Record migration
                self.db.collection(self.MIGRATIONS_COLLECTION).document(migration.version).set({
                    'version': migration.version,
                    'name': migration.name,
                    'applied_at': datetime.now(timezone.utc).isoformat(),
                })
                
                migration.applied_at = datetime.now(timezone.utc)
                applied.append(migration.version)
                
            except Exception as e:
                error_msg = f"Migration {migration.version} failed: {str(e)}"
                print(error_msg)
                errors.append(error_msg)
                break
        
        return {
            'success': len(errors) == 0,
            'applied': applied,
            'errors': errors,
            'total_pending': len(pending)
        }
    
    def rollback(self, version: str) -> Dict:
        """Rollback to a specific version"""
        if not self.db:
            return {'success': False, 'error': 'Database not connected'}
        
        applied = self.get_applied_migrations()
        to_rollback = [v for v in applied if v > version]
        
        rolled_back = []
        errors = []
        
        for v in sorted(to_rollback, reverse=True):
            migration = self.migrations.get(v)
            
            if not migration or not migration.down:
                errors.append(f"Cannot rollback {v}: no down migration")
                continue
            
            try:
                print(f"Rolling back migration {migration.version}")
                
                migration.down(self.db)
                
                # Remove migration record
                self.db.collection(self.MIGRATIONS_COLLECTION).document(v).delete()
                
                rolled_back.append(v)
                
            except Exception as e:
                errors.append(f"Rollback {v} failed: {str(e)}")
        
        return {
            'success': len(errors) == 0,
            'rolled_back': rolled_back,
            'errors': errors
        }
    
    def status(self) -> Dict:
        """Get migration status"""
        applied = self.get_applied_migrations()
        pending = self.get_pending_migrations()
        
        return {
            'current_version': max(applied) if applied else None,
            'applied_count': len(applied),
            'pending_count': len(pending),
            'applied_versions': sorted(applied),
            'pending_versions': [m.version for m in pending],
            'is_up_to_date': len(pending) == 0
        }
    
    # =============================================================================
    # Built-in Migrations
    # =============================================================================
    
    def _migrate_001_up(self, db: FirestoreClient):
        """Create initial collections"""
        collections = [
            'users',
            'couples',
            'game_sessions',
            'answers',
            'leaderboards',
            'sos_events',
            'analytics_events',
            'ai_conversations',
        ]
        
        for collection_name in collections:
            # Create collection by adding a placeholder document
            doc_ref = db.collection(collection_name).document('_schema')
            doc_ref.set({
                'version': '001',
                'created_at': datetime.now(timezone.utc).isoformat(),
                'description': f'{collection_name} collection'
            })
            print(f"  Created collection: {collection_name}")
    
    def _migrate_001_down(self, db: FirestoreClient):
        """Remove initial collections"""
        collections = [
            'users', 'couples', 'game_sessions', 'answers',
            'leaderboards', 'sos_events', 'analytics_events', 'ai_conversations'
        ]
        
        for collection_name in collections:
            # Delete all documents in collection
            docs = db.collection(collection_name).stream()
            for doc in docs:
                doc.reference.delete()
            print(f"  Dropped collection: {collection_name}")
    
    def _migrate_002_up(self, db: FirestoreClient):
        """Create indexes (documented, actual creation via Firebase Console or CLI)"""
        indexes = {
            'users': [
                {'fields': ['email'], 'type': 'asc'},
                {'fields': ['couple_id'], 'type': 'asc'},
                {'fields': ['invite_code'], 'type': 'asc'},
            ],
            'couples': [
                {'fields': ['user1_id'], 'type': 'asc'},
                {'fields': ['user2_id'], 'type': 'asc'},
                {'fields': ['invite_code'], 'type': 'asc'},
            ],
            'game_sessions': [
                {'fields': ['user_id', 'started_at'], 'type': 'desc'},
                {'fields': ['couple_id', 'completed'], 'type': 'asc'},
            ],
            'analytics_events': [
                {'fields': ['event_type', 'timestamp'], 'type': 'desc'},
                {'fields': ['user_id', 'timestamp'], 'type': 'desc'},
            ],
        }
        
        # Store index definitions in a metadata document
        db.collection('_schema').document('indexes').set({
            'indexes': indexes,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'note': 'Apply these indexes via Firebase Console or CLI'
        })
        
        print("  Index definitions stored in _schema/indexes")
        print("  Apply manually via Firebase Console or run:")
        print("  firebase deploy --only firestore:indexes")
    
    def _migrate_003_up(self, db: FirestoreClient):
        """Add audit fields to existing collections"""
        collections = ['users', 'couples', 'game_sessions']
        
        for collection_name in collections:
            # Add _audit subcollection for each document
            docs = db.collection(collection_name).limit(100).stream()
            
            for doc in docs:
                # Skip schema documents
                if doc.id.startswith('_'):
                    continue
                
                # Add audit log entry for document creation
                audit_ref = doc.reference.collection('_audit').document()
                audit_ref.set({
                    'action': 'migrated',
                    'timestamp': datetime.now(timezone.utc).isoformat(),
                    'migration': '003'
                })
        
        print("  Added audit fields to collections")


# =============================================================================
# CLI Interface
# =============================================================================

def main():
    """CLI for migration management"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Database Migration Manager')
    parser.add_argument('command', choices=['migrate', 'rollback', 'status', 'create'])
    parser.add_argument('--version', help='Target version for rollback')
    parser.add_argument('--name', help='Name for new migration')
    
    args = parser.parse_args()
    
    # Initialize Firestore
    db = None
    if FIREBASE_AVAILABLE:
        try:
            db = firestore.client()
        except:
            print("Warning: Firebase not initialized")
    
    manager = MigrationManager(db)
    
    if args.command == 'migrate':
        result = manager.migrate(args.version)
        print(json.dumps(result, indent=2))
    
    elif args.command == 'rollback':
        if not args.version:
            print("Error: --version required for rollback")
            return
        result = manager.rollback(args.version)
        print(json.dumps(result, indent=2))
    
    elif args.command == 'status':
        result = manager.status()
        print(json.dumps(result, indent=2))
    
    elif args.command == 'create':
        if not args.name:
            print("Error: --name required for create")
            return
        
        # Generate new migration file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        version = f"{timestamp}_{args.name}"
        
        print(f"Create migration: {version}")
        print("Add to migrations/manager.py or create a new file")


if __name__ == '__main__':
    main()
