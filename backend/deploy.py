#!/usr/bin/env python3
"""
Deployment Helper Script
Validates configuration before deployment
"""

import os
import sys
from typing import List, Tuple

REQUIRED_ENV_VARS = [
    'FIREBASE_PROJECT_ID',
    'JWT_SECRET',
]

OPTIONAL_ENV_VARS = [
    'REDIS_URL',
    'GEMINI_API_KEY',
    'POSTHOG_API_KEY',
    'SENTRY_DSN',
]

def check_env_vars() -> Tuple[List[str], List[str]]:
    """Check environment variables"""
    missing = []
    present = []
    
    for var in REQUIRED_ENV_VARS:
        if not os.environ.get(var):
            missing.append(var)
        else:
            present.append(var)
    
    for var in OPTIONAL_ENV_VARS:
        if os.environ.get(var):
            present.append(var)
    
    return missing, present

def check_firebase_credentials() -> bool:
    """Check Firebase credentials"""
    # Check for service account file
    if os.environ.get('FIREBASE_CREDENTIALS_PATH'):
        path = os.environ.get('FIREBASE_CREDENTIALS_PATH')
        if os.path.exists(path):
            return True
    
    # Check for base64 encoded credentials
    if os.environ.get('FIREBASE_SERVICE_ACCOUNT_BASE64'):
        return True
    
    # Check for individual credentials
    if (os.environ.get('FIREBASE_PROJECT_ID') and 
        os.environ.get('FIREBASE_CLIENT_EMAIL') and
        os.environ.get('FIREBASE_PRIVATE_KEY')):
        return True
    
    return False

def validate_deployment() -> bool:
    """Run all validation checks"""
    print("=" * 60)
    print("Love Actually - Deployment Validation")
    print("=" * 60)
    
    # Check environment variables
    print("\n📋 Checking Environment Variables...")
    missing, present = check_env_vars()
    
    if missing:
        print(f"  ❌ Missing required: {', '.join(missing)}")
    else:
        print("  ✅ All required variables present")
    
    for var in present:
        print(f"  ✅ {var}")
    
    # Check Firebase
    print("\n🔥 Checking Firebase Credentials...")
    if check_firebase_credentials():
        print("  ✅ Firebase credentials configured")
    else:
        print("  ❌ Firebase credentials not found")
        missing.append("Firebase credentials")
    
    # Check Redis
    print("\n💾 Checking Redis...")
    if os.environ.get('REDIS_URL'):
        print("  ✅ Redis URL configured")
    else:
        print("  ⚠️  Redis URL not set (will use in-memory fallback)")
    
    # Summary
    print("\n" + "=" * 60)
    if missing:
        print(f"❌ Validation Failed: {len(missing)} issues found")
        print("\nPlease fix the above issues before deploying.")
        return False
    else:
        print("✅ Validation Passed! Ready for deployment.")
        return True

if __name__ == "__main__":
    success = validate_deployment()
    sys.exit(0 if success else 1)
