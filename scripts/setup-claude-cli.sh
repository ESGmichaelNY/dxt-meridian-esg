#!/bin/bash

# Claude CLI Setup Script
# This creates a simple claude command for API access

echo "🔧 Setting up Claude CLI..."

# Check if API key is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY not found in environment"
    echo ""
    echo "Please add to your ~/.zshrc or ~/.bash_profile:"
    echo "export ANTHROPIC_API_KEY='your-api-key-here'"
    echo ""
    echo "Get your API key from: https://console.anthropic.com/account/keys"
    exit 1
fi

# Create the claude command
cat > ~/.local/bin/claude << 'EOF'
#!/bin/bash

# Simple Claude CLI wrapper
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ Please set ANTHROPIC_API_KEY environment variable"
    exit 1
fi

# Check if prompt provided
if [ $# -eq 0 ]; then
    echo "Usage: claude 'Your prompt here'"
    echo "Example: claude 'Explain quantum computing'"
    exit 1
fi

# Call Claude API
curl -s https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 4096,
    "messages": [{"role": "user", "content": "'"$*"'"}]
  }' | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'content' in data:
        print(data['content'][0]['text'])
    else:
        print('Error:', data.get('error', {}).get('message', 'Unknown error'))
except:
    print('Error parsing response')
"
EOF

# Make it executable
chmod +x ~/.local/bin/claude

echo "✅ Claude CLI installed successfully!"
echo ""
echo "Usage: claude 'Your question here'"
echo "Example: claude 'What are the next tasks for my project?'"
