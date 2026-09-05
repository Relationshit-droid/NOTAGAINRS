#!/usr/bin/env python3
"""
Backend API Testing for Love, Actually... The Game
Tests all critical endpoints and functionality
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class LoveActuallyAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.user_id = None
        self.couple_id = None

    def log_test(self, name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        if not success and response_data:
            print(f"    Response: {response_data}")

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int = 200, 
                 data: Dict = None, headers: Dict = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            response_data = None
            
            try:
                response_data = response.json()
            except:
                response_data = response.text

            details = f"Status: {response.status_code}"
            if not success:
                details += f" (expected {expected_status})"

            self.log_test(name, success, details, response_data)
            return success, response_data

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        
        if success and isinstance(response, dict):
            if response.get("status") == "healthy":
                self.log_test("Health Status Validation", True, "Status is healthy")
            else:
                self.log_test("Health Status Validation", False, f"Status: {response.get('status')}")
        
        return success

    def test_game_categories(self):
        """Test game categories endpoint"""
        success, response = self.run_test(
            "Get Game Categories",
            "GET",
            "api/games/categories",
            200
        )
        
        if success and isinstance(response, dict):
            categories = response.get("categories", [])
            
            # Check if we have 7 categories
            if len(categories) == 7:
                self.log_test("Categories Count", True, f"Found {len(categories)} categories")
            else:
                self.log_test("Categories Count", False, f"Expected 7, got {len(categories)}")
            
            # Check if Love Arcade exists and is featured
            love_arcade = None
            for cat in categories:
                if cat.get("id") == "love-arcade":
                    love_arcade = cat
                    break
            
            if love_arcade:
                self.log_test("Love Arcade Category Found", True, "Love Arcade category exists")
                
                # Check if it has the right properties
                expected_props = ["name", "description", "icon", "color", "games"]
                missing_props = [prop for prop in expected_props if prop not in love_arcade]
                
                if not missing_props:
                    self.log_test("Love Arcade Properties", True, "All required properties present")
                else:
                    self.log_test("Love Arcade Properties", False, f"Missing: {missing_props}")
            else:
                self.log_test("Love Arcade Category Found", False, "Love Arcade category not found")
        
        return success

    def test_love_arcade_games(self):
        """Test Love Arcade games endpoint"""
        success, response = self.run_test(
            "Get Love Arcade Games",
            "GET",
            "api/love-arcade/games",
            200
        )
        
        if success and isinstance(response, dict):
            games = response.get("games", [])
            
            # Check if we have 6 arcade games
            if len(games) == 6:
                self.log_test("Arcade Games Count", True, f"Found {len(games)} arcade games")
            else:
                self.log_test("Arcade Games Count", False, f"Expected 6, got {len(games)}")
            
            # Check game structure
            if games:
                first_game = games[0]
                expected_props = ["id", "name", "phase", "format", "description", "max_score"]
                missing_props = [prop for prop in expected_props if prop not in first_game]
                
                if not missing_props:
                    self.log_test("Arcade Game Structure", True, "Game objects have required properties")
                else:
                    self.log_test("Arcade Game Structure", False, f"Missing: {missing_props}")
        
        return success

    def test_user_creation(self):
        """Test user creation"""
        user_data = {
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "display_name": "Test User"
        }
        
        success, response = self.run_test(
            "Create User",
            "POST",
            "api/users",
            200,
            user_data
        )
        
        if success and isinstance(response, dict):
            self.user_id = response.get("id")
            if self.user_id:
                self.log_test("User ID Generated", True, f"User ID: {self.user_id}")
            else:
                self.log_test("User ID Generated", False, "No user ID in response")
        
        return success

    def test_marcie_chat(self):
        """Test Dr. Marcie chat endpoint"""
        if not self.user_id:
            self.log_test("Marcie Chat", False, "No user ID available for testing")
            return False
        
        marcie_data = {
            "user_id": self.user_id,
            "context": "Testing Dr. Marcie",
            "message": "Hello Dr. Marcie, can you help us?",
            "sarcasm_level": 2,
            "game_context": "SOS Fight Solver"
        }
        
        success, response = self.run_test(
            "Dr. Marcie Chat",
            "POST",
            "api/marcie/chat",
            200,
            marcie_data
        )
        
        if success and isinstance(response, dict):
            if "response" in response and "sarcasm_level" in response:
                self.log_test("Marcie Response Structure", True, "Response has required fields")
            else:
                self.log_test("Marcie Response Structure", False, "Missing required fields")
        
        return success

    def test_sos_session(self):
        """Test SOS session creation"""
        if not self.user_id:
            self.log_test("SOS Session", False, "No user ID available for testing")
            return False
        
        sos_data = {
            "initiator_id": self.user_id,
            "couple_id": "test-couple-id"
        }
        
        success, response = self.run_test(
            "Create SOS Session",
            "POST",
            "api/sos/sessions",
            200,
            sos_data
        )
        
        if success and isinstance(response, dict):
            session_id = response.get("id")
            if session_id:
                self.log_test("SOS Session ID Generated", True, f"Session ID: {session_id}")
            else:
                self.log_test("SOS Session ID Generated", False, "No session ID in response")
        
        return success

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Love, Actually... The Game Backend Tests")
        print("=" * 60)
        
        # Core API tests
        self.test_health_check()
        self.test_game_categories()
        self.test_love_arcade_games()
        
        # User and functionality tests
        self.test_user_creation()
        self.test_marcie_chat()
        self.test_sos_session()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

    def get_test_report(self):
        """Get detailed test report"""
        return {
            "summary": f"{self.tests_passed}/{self.tests_run} tests passed",
            "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0,
            "tests": self.test_results,
            "timestamp": datetime.now().isoformat()
        }

def main():
    tester = LoveActuallyAPITester()
    success = tester.run_all_tests()
    
    # Save detailed report
    report = tester.get_test_report()
    with open("/app/test_reports/backend_test_results.json", "w") as f:
        json.dump(report, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())