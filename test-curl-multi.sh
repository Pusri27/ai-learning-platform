source .env.local

echo "Testing gemini-1.5-flash-001 (v1beta)..."
curl -s -o /dev/null -w "%{http_code}" -H 'Content-Type: application/json' \
-d '{"contents":[{"parts":[{"text":"Hi"}]}]}' \
"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=$GEMINI_API_KEY"
echo ""

echo "Testing gemini-pro (v1beta)..."
curl -s -o /dev/null -w "%{http_code}" -H 'Content-Type: application/json' \
-d '{"contents":[{"parts":[{"text":"Hi"}]}]}' \
"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_API_KEY"
echo ""

echo "Testing gemini-1.5-flash (v1)..."
curl -s -o /dev/null -w "%{http_code}" -H 'Content-Type: application/json' \
-d '{"contents":[{"parts":[{"text":"Hi"}]}]}' \
"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=$GEMINI_API_KEY"
echo ""

echo "Testing gemini-pro (v1)..."
curl -s -o /dev/null -w "%{http_code}" -H 'Content-Type: application/json' \
-d '{"contents":[{"parts":[{"text":"Hi"}]}]}' \
"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=$GEMINI_API_KEY"
echo ""
