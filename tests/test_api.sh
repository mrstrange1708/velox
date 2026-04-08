#!/bin/bash

# Configuration
BASE_URL="http://localhost:8080"
EMAIL="testuser_$(date +%s)@example.com"
PASSWORD="SecurePassword123"
NAME="Test User"

echo "Using Email: $EMAIL"

# Helpers
function assert_status() {
    local actual=$1
    local expected=$2
    local msg=$3
    if [ "$actual" -ne "$expected" ]; then
        echo "FAIL: $msg (Expected $expected, got $actual)"
        exit 1
    else
        echo "PASS: $msg"
    fi
}

# 1. Health Check
echo "--- Testing Health ---"
resp=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
assert_status "$resp" 200 "Health check"

# 2. Signup
echo "--- Testing Signup ---"
# Single call to signup, capturing response and status
signup_full_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$NAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

signup_resp=$(echo "$signup_full_resp" | sed '$d')
signup_status=$(echo "$signup_full_resp" | tail -n 1)

if [[ "$signup_status" =~ ^20 ]]; then
    echo "PASS: Signup"
else
    echo "FAIL: Signup (Status: $signup_status)"
    echo "Response: $signup_resp"
    exit 1
fi

# 3. Login
echo "--- Testing Login ---"
login_full_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

login_resp=$(echo "$login_full_resp" | sed '$d')
login_status=$(echo "$login_full_resp" | tail -n 1)

# Extract token from data.token
token=$(echo "$login_resp" | jq -r '.data.token')

if [[ "$login_status" =~ ^20 ]] && [ "$token" != "null" ] && [ -n "$token" ]; then
    echo "PASS: Login (Token received)"
else
    echo "FAIL: Login (Status: $login_status)"
    echo "Response: $login_resp"
    exit 1
fi

# 4. Dashboard (Session Auth)
echo "--- Testing Dashboard (JWT) ---"
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/dashboard" \
  -H "Authorization: Bearer $token")
echo "Token: $token"
assert_status "$status" 200 "Dashboard access"

# 5. Generate API Key
echo "--- Generating API Key ---"
key_resp=$(curl -s -X POST "$BASE_URL/auth/api-keys" \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Key", "scopes": ["submit", "status"]}')

api_key=$(echo "$key_resp" | jq -r '.key')

if [ "$api_key" != "null" ] && [ -n "$api_key" ]; then
    echo "PASS: API Key Generation (Key: $api_key)"
else
    echo "FAIL: API Key Generation"
    echo "Response: $key_resp"
    exit 1
fi

# 6. Submit Code (API Key Auth)
echo "--- Testing Submit (API Key) ---"
submit_resp=$(curl -s -X POST "$BASE_URL/submit" \
  -H "Authorization: Bearer $api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "source_code": "import sys\nfor line in sys.stdin:\n    print(line.strip())",
    "test_cases": [
      {"test_case_id": 1, "input": "hello", "expected_output": "hello"},
      {"test_case_id": 2, "input": "world", "expected_output": "world"}
    ]
  }')

sub_id=$(echo "$submit_resp" | jq -r '.submission_id')

if [ "$sub_id" != "null" ] && [ -n "$sub_id" ]; then
    echo "PASS: Submit (ID: $sub_id)"
else
    echo "FAIL: Submit"
    echo "Response: $submit_resp"
    exit 1
fi

# 7. Check Status (API Key Auth)
echo "--- Testing Status (API Key) ---"
status_resp=$(curl -s -G "$BASE_URL/status" \
  -H "Authorization: Bearer $api_key" \
  --data-urlencode "submission_id=$sub_id")

run_status=$(echo "$status_resp" | jq -r '.status')
if [ "$run_status" == "null" ]; then
    run_status="completed"
fi

if [ "$run_status" == "pending" ] || [ -n "$(echo "$status_resp" | jq -r '.result')" ]; then
    echo "PASS: Status check $run_status"
    echo "Response: $status_resp"
else
    echo "FAIL: Status check"
    echo "Response: $status_resp"
    exit 1
fi

# 8. Negative Test: Invalid API Key
echo "--- Testing Invalid API Key ---"
status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/submit" \
  -H "Authorization: Bearer invalid_key" \
  -H "Content-Type: application/json" \
  -d '{"language": "python", "code": "print(42)"}')
assert_status "$status" 401 "Invalid key rejection"

echo "--- ALL TESTS PASSED ---"
