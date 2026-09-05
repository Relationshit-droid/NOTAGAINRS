
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os

# Path to your service account key
SERVICE_ACCOUNT_KEY = 'admin/firebase-adminsdk-fbsvc-8d149cbd31.json'

# User details
EMAIL = 'melissa.cleary@loveactuallythegame.fun'
PASSWORD = 'AllForLeyna699!'
DISPLAY_NAME = 'CEO / Puppet Master'

def create_admin_user():
    """Creates a new admin user in Firebase and a corresponding Firestore document."""
    try:
        # Initialize the app with a service account, granting admin privileges
        cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
        # Check if the app is already initialized
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)

        # Create the new user
        user = auth.create_user(
            email=EMAIL,
            password=PASSWORD,
            display_name=DISPLAY_NAME,
            email_verified=True
        )

        print(f"Successfully created new user: {{uid: '{user.uid}'}}")

        # Set custom user claims for admin role
        auth.set_custom_user_claims(user.uid, {'role': 'admin', 'isAdmin': True})
        print(f"Set custom claims for {user.uid}")

        # Create a document for the user in Firestore
        db = firestore.client()
        user_doc_ref = db.collection('users').document(user.uid)
        user_doc_ref.set({
            'email': EMAIL,
            'role': 'admin',
            'isAdmin': True,
            'displayName': DISPLAY_NAME
        })
        print(f"Created Firestore document for {user.uid}")

        return user.uid

    except Exception as e:
        print(f"An error occurred: {e}")
        # If user already exists, try to set claims and Firestore doc
        if "EMAIL_EXISTS" in str(e):
            print("User already exists. Attempting to update claims and Firestore document...")
            try:
                user = auth.get_user_by_email(EMAIL)
                auth.set_custom_user_claims(user.uid, {'role': 'admin', 'isAdmin': True})
                print(f"Set custom claims for existing user {user.uid}")

                db = firestore.client()
                user_doc_ref = db.collection('users').document(user.uid)
                user_doc_ref.set({
                    'email': EMAIL,
                    'role': 'admin',
                    'isAdmin': True,
                    'displayName': DISPLAY_NAME
                }, merge=True)
                print(f"Updated Firestore document for {user.uid}")
                return user.uid
            except Exception as update_e:
                print(f"Error updating existing user: {update_e}")
                return None

if __name__ == '__main__':
    create_admin_user()
