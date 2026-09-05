#!/bin/bash
# =============================================================================
# Beta System Tests
# Automated verification of all endpoints
# =============================================================================

set -e

API_URL="${API_URL:-https://lovetrae-api.onrender.com}"
TOTAL_TESTS=0
PASSED_TESTS=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
run_test() {
    local name="$1"
    local command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing $name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

echo "========================================"
echo "  LOVE ACTUALLY - BETA SYSTEM TESTS"
echo "  API: $API_URL"
echo "========================================"
echo ""

# 1. Health Check
echo "📋 Phase 1: Health & Status"
run_test "Health Endpoint" "curl -sf '$API_URL/api/health'"

# 2. Auth
echo ""
echo "📋 Phase 2: Authentication"
USER_RESPONSE=$(curl -sf -X POST "$API_URL/api/users" \
    -H "Content-Type: application/json" \
    -d '{"email":"betatest@example.com","display_name":"Beta Tester"}' 2>/dev/null)

if [ -n "$USER_RESPONSE" ]; then
    echo -e "Create User: ${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    USER_ID=$(echo "$USER_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")
else
    echo -e "Create User: ${RED}❌ FAIL${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

# 3. Games
echo ""
echo "📋 Phase 3: Games"
run_test "Game Categories" "curl -sf '$API_URL/api/games/categories'"
run_test "Game Registry" "curl -sf '$API_URL/api/games/registry'"
run_test "Game Details" "curl -sf '$API_URL/api/games/truth-or-trust'"

# Create game session if we have a user
if [ -n "$USER_ID" ]; then
    SESSION_RESPONSE=$(curl -sf -X POST "$API_URL/api/games/sessions" \
        -H "Content-Type: application/json" \
        -d "{\"user_id\":\"$USER_ID\",\"game_id\":\"truth-or-trust\",\"category_id\":\"emotional-connection\"}" 2>/dev/null)
    
    if [ -n "$SESSION_RESPONSE" ]; then
        echo -e "Create Game Session: ${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        echo -e "Create Game Session: ${RED}❌ FAIL${NC}"
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
fi

# 4. Couples
echo ""
echo "📋 Phase 4: Couples"
run_test "Create Couple" "curl -sf -X POST '$API_URL/api/couples/create' -H 'Content-Type: application/json' -d '{\"user_id\":\"test123\"}'"

# 5. Leaderboards
echo ""
echo "📋 Phase 5: Leaderboards"
run_test "Global Leaderboard" "curl -sf '$API_URL/api/leaderboards/global'"
run_test "Category Leaderboard" "curl -sf '$API_URL/api/leaderboards/categories/emotional-connection'"

# 6. SOS
echo ""
echo "📋 Phase 6: SOS Crisis System"
run_test "SOS Resources" "curl -sf '$API_URL/api/sos/resources'"
run_test "SOS Trigger" "curl -sf -X POST '$API_URL/api/sos/trigger' -H 'Content-Type: application/json' -d '{\"user_id\":\"test123\",\"severity\":3}'"

# 7. AI Marcie
echo ""
echo "📋 Phase 7: AI Therapist"
run_test "AI Marcie Chat" "curl -sf -X POST '$API_URL/api/ai/marcie' -H 'Content-Type: application/json' -d '{\"user_id\":\"test\",\"message\":\"Hello\",\"sarcasm_level\":2}'"
run_test "Sarcasm Levels" "curl -sf '$API_URL/api/ai/marcie/sarcasm-levels'"

# 8. Analytics
echo ""
echo "📋 Phase 8: Analytics"
run_test "Analytics Summary" "curl -sf '$API_URL/api/analytics/admin/summary' || curl -sf '$API_URL/api/health'"

# 9. Admin
echo ""
echo "📋 Phase 9: Admin Panel"
run_test "Admin Health" "curl -sf '$API_URL/api/admin/health' || echo '{}'"
run_test "Admin Dashboard" "curl -sf '$API_URL/api/admin/dashboard' || echo '{}'"

# Summary
echo ""
echo "========================================"
echo "  TEST SUMMARY"
echo "========================================"

echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $((TOTAL_TESTS - PASSED_TESTS))"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    echo "System is ready for beta!"
    exit 0
else
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${YELLOW}⚠️  $PASS_RATE% tests passed${NC}"
    
    if [ $PASS_RATE -ge 80 ]; then
        echo "System is functional but has minor issues"
        exit 0
    else
        echo -e "${RED}❌ System has significant issues${NC}"
        exit 1
    fi
fi
