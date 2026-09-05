#!/usr/bin/env python3
"""
Create admin user for beta deployment
Usage: python scripts/create_admin.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone

def create_admin():
    try:
        # Try to import firebase
        try:
            from firebase_admin import credentials, firestore, initialize_app, auth
            import firebase_admin
            
            # Initialize if not already
            if not firebase_admin._apps:
                # Try to get credentials from environment
                cred_path = os.environ.get('FIREBASE_CREDENTIALS_PATH')
                if cred_path and os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
                else:
                    cred = credentials.ApplicationDefault()
                initialize_app(cred)
            
            db = firestore.client()
            
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            print("Make sure Firebase credentials are configured")
            return False
        
        # Admin user data
        admin_id = 'admin_001'
        admin_email = 'admin@loveactuallythegame.fun'
        admin_password = 'LoveActually2024!Admin'  # Change after first login
        
        # Create Firebase Auth user
        try:
            auth_user = auth.create_user(
                uid=admin_id,
                email=admin_email,
                password=admin_password,
                display_name='Administrator',
                email_verified=True,
            )
            print(f"✅ Firebase Auth user created: {admin_email}")
        except auth.EmailAlreadyExistsError:
            print(f"ℹ️  Firebase Auth user already exists: {admin_email}")
            # Update password
            auth.update_user(
                admin_id,
                password=admin_password
            )
            print("✅ Password updated")
        
        # Create user document in Firestore
        admin_data = {
            'id': admin_id,
            'email': admin_email,
            'display_name': 'Administrator',
            'roles': ['admin', 'moderator'],
            'plan': 'enterprise',
            'is_active': True,
            'email_verified': True,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat(),
            'last_active': datetime.now(timezone.utc).isoformat(),
            'sarcasm_level': 2,
            'trust_level': 1.0,
            'vulnerability_level': 1.0,
            'points': 0,
            'couple_id': None,
            'partner_id': None,
        }
        
        db.collection('users').document(admin_id).set(admin_data, merge=True)
        
        print("\n" + "="*60)
        print("ADMIN USER CREATED SUCCESSFULLY")
        print("="*60)
        print(f"Email: {admin_email}")
        print(f"Password: {admin_password}")
        print(f"User ID: {admin_id}")
        print(f"Roles: admin, moderator")
        print("="*60)
        print("\n⚠️  IMPORTANT: Change password after first login!")
        print("Login at: https://loveactuallythegame.fun/admin")
        print("="*60)
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = create_admin()
    sys.exit(0 if success else 1)
