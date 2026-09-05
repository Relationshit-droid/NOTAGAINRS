#!/usr/bin/env python3
"""
Create beta tester accounts
Usage: python scripts/create_beta_testers.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone
import uuid

def create_beta_testers():
    try:
        # Firebase setup
        try:
            from firebase_admin import credentials, firestore, initialize_app, auth
            import firebase_admin
            
            if not firebase_admin._apps:
                cred_path = os.environ.get('FIREBASE_CREDENTIALS_PATH')
                if cred_path and os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
                else:
                    cred = credentials.ApplicationDefault()
                initialize_app(cred)
            
            db = firestore.client()
            
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            return False
        
        # Beta testers
        beta_testers = [
            {
                'email': 'mel_cleary92@gmail.com',
                'display_name': 'Mel Cleary',
            },
            {
                'email': 'sijames.inuk@gmail.com',
                'display_name': 'Si James',
            }
        ]
        
        invite_codes = []
        
        print("\n" + "="*60)
        print("CREATING BETA TESTER ACCOUNTS")
        print("="*60)
        
        for tester in beta_testers:
            user_id = str(uuid.uuid4())
            invite_code = str(uuid.uuid4())[:6].upper()
            temp_password = f"Beta2024!{invite_code}"
            
            # Create Firebase Auth user
            try:
                auth_user = auth.create_user(
                    uid=user_id,
                    email=tester['email'],
                    password=temp_password,
                    display_name=tester['display_name'],
                    email_verified=False,
                )
                print(f"✅ Firebase Auth: {tester['email']}")
            except auth.EmailAlreadyExistsError:
                print(f"ℹ️  User exists: {tester['email']}")
                # Get existing user
                user_record = auth.get_user_by_email(tester['email'])
                user_id = user_record.uid
                temp_password = "[Use password reset]"
            
            # Create user document
            user_data = {
                'id': user_id,
                'email': tester['email'],
                'display_name': tester['display_name'],
                'roles': ['beta_tester'],
                'plan': 'beta',
                'is_active': True,
                'email_verified': False,
                'invite_code': invite_code,
                'created_at': datetime.now(timezone.utc).isoformat(),
                'updated_at': datetime.now(timezone.utc).isoformat(),
                'last_active': datetime.now(timezone.utc).isoformat(),
                'sarcasm_level': 2,
                'trust_level': 0.5,
                'vulnerability_level': 0.5,
                'points': 0,
                'beta_features_enabled': True,
                'analytics_enabled': True,
                'couple_id': None,
                'partner_id': None,
            }
            
            db.collection('users').document(user_id).set(user_data, merge=True)
            
            invite_codes.append({
                'name': tester['display_name'],
                'email': tester['email'],
                'code': invite_code,
                'user_id': user_id,
                'temp_password': temp_password,
            })
            
            print(f"✅ Firestore: {tester['email']}")
        
        # Print summary
        print("\n" + "="*60)
        print("BETA TESTER ACCOUNTS CREATED")
        print("="*60)
        
        for invite in invite_codes:
            print(f"\n👤 {invite['name']}")
            print(f"   Email: {invite['email']}")
            print(f"   Invite Code: {invite['code']}")
            print(f"   User ID: {invite['user_id']}")
        
        print("\n" + "="*60)
        print("BETA TESTER INSTRUCTIONS (Copy & Send)")
        print("="*60)
        print("""
Subject: 🎮 Love Actually Beta Access

Hi!

You're invited to the Love Actually beta!

🔗 Access: https://loveactuallythegame.fun

📧 Login with your email: [EMAIL]
🔑 Temporary password: [TEMP_PASSWORD]

Please change your password after first login.

To link with your partner:
1. Create your profile
2. Share your invite code: [INVITE_CODE]
3. Partner enters code to link

Feedback: Reply to this email

Enjoy!
- Love Actually Team
""")
        
        for invite in invite_codes:
            print(f"\n--- {invite['name']} ---")
            print(f"Email: {invite['email']}")
            print(f"Temp Password: {invite['temp_password']}")
            print(f"Invite Code: {invite['code']}")
        
        print("\n" + "="*60)
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = create_beta_testers()
    sys.exit(0 if success else 1)
