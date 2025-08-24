#!/bin/bash

# check-setup.sh
# Verify that the development environment is properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}     Meridian ESG - Development Setup Check     ${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Track if any checks fail
FAILED=0

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment variable
check_env_var() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}✗${NC} $1 is not set"
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 is set"
        return 0
    fi
}

# Check Node.js version
echo -e "${YELLOW}Checking Node.js...${NC}"
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
    
    # Check if version is 18 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${RED}  ⚠ Node.js 18 or higher recommended${NC}"
        FAILED=1
    fi
else
    echo -e "${RED}✗${NC} Node.js not found"
    FAILED=1
fi
echo ""

# Check pnpm and Corepack
echo -e "${YELLOW}Checking pnpm and Corepack...${NC}"
if command_exists corepack; then
    echo -e "${GREEN}✓${NC} Corepack is available"
    
    # Check if pnpm is managed by Corepack
    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm -v)
        echo -e "${GREEN}✓${NC} pnpm installed: v$PNPM_VERSION"
        
        # Check if it matches packageManager in package.json
        EXPECTED_VERSION="10.15.0"
        if [ "$PNPM_VERSION" != "$EXPECTED_VERSION" ]; then
            echo -e "${YELLOW}  ⚠ Expected pnpm v$EXPECTED_VERSION, got v$PNPM_VERSION${NC}"
            echo -e "${YELLOW}  Run: corepack prepare pnpm@$EXPECTED_VERSION --activate${NC}"
        fi
    else
        echo -e "${RED}✗${NC} pnpm not found"
        echo -e "${YELLOW}  Run: corepack enable && corepack prepare pnpm@10.15.0 --activate${NC}"
        FAILED=1
    fi
else
    echo -e "${RED}✗${NC} Corepack not found (comes with Node.js 16.13+)"
    FAILED=1
fi
echo ""

# Check Supabase CLI
echo -e "${YELLOW}Checking Supabase CLI...${NC}"
if command_exists supabase; then
    SUPABASE_VERSION=$(supabase --version)
    echo -e "${GREEN}✓${NC} Supabase CLI installed: $SUPABASE_VERSION"
else
    echo -e "${RED}✗${NC} Supabase CLI not found"
    echo -e "${YELLOW}  Install with: brew install supabase/tap/supabase${NC}"
    FAILED=1
fi
echo ""

# Check Docker (required for Supabase local dev)
echo -e "${YELLOW}Checking Docker...${NC}"
if command_exists docker; then
    echo -e "${GREEN}✓${NC} Docker is installed"
    
    # Check if Docker is running
    if docker info >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Docker is running"
    else
        echo -e "${YELLOW}⚠${NC} Docker is installed but not running"
        echo -e "${YELLOW}  Start Docker Desktop or run: docker start${NC}"
    fi
else
    echo -e "${RED}✗${NC} Docker not found (required for Supabase local development)"
    echo -e "${YELLOW}  Install Docker Desktop from: https://www.docker.com/products/docker-desktop${NC}"
    FAILED=1
fi
echo ""

# Check environment variables
echo -e "${YELLOW}Checking environment variables...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local file exists"
    
    # Check for required environment variables without sourcing
    # This avoids issues with spaces in values
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [[ -z "$key" ]] && continue
        
        # Check for our required variables
        case "$key" in
            NEXT_PUBLIC_SUPABASE_URL)
                echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_URL is set"
                ;;
            NEXT_PUBLIC_SUPABASE_ANON_KEY)
                echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
                ;;
            SUPABASE_SERVICE_ROLE_KEY)
                echo -e "${GREEN}✓${NC} SUPABASE_SERVICE_ROLE_KEY is set"
                ;;
            SUPABASE_PROJECT_ID)
                echo -e "${GREEN}✓${NC} SUPABASE_PROJECT_ID is set"
                ;;
        esac
    done < .env.local
    
    # Check if all required vars were found
    if ! grep -q "^NEXT_PUBLIC_SUPABASE_URL=" .env.local; then
        echo -e "${RED}✗${NC} NEXT_PUBLIC_SUPABASE_URL is not set"
        FAILED=1
    fi
    if ! grep -q "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local; then
        echo -e "${RED}✗${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
        FAILED=1
    fi
    if ! grep -q "^SUPABASE_SERVICE_ROLE_KEY=" .env.local; then
        echo -e "${RED}✗${NC} SUPABASE_SERVICE_ROLE_KEY is not set"
        FAILED=1
    fi
    if ! grep -q "^SUPABASE_PROJECT_ID=" .env.local; then
        echo -e "${RED}✗${NC} SUPABASE_PROJECT_ID is not set"
        FAILED=1
    fi
else
    echo -e "${RED}✗${NC} .env.local file not found"
    echo -e "${YELLOW}  Copy .env.local.example to .env.local and fill in values${NC}"
    FAILED=1
fi
echo ""

# Check if dependencies are installed
echo -e "${YELLOW}Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
    
    # Check if lockfile is in sync
    if pnpm ls >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Dependencies are in sync"
    else
        echo -e "${YELLOW}⚠${NC} Dependencies may be out of sync"
        echo -e "${YELLOW}  Run: pnpm install --frozen-lockfile${NC}"
    fi
else
    echo -e "${RED}✗${NC} Dependencies not installed"
    echo -e "${YELLOW}  Run: pnpm install --frozen-lockfile${NC}"
    FAILED=1
fi
echo ""

# Check TypeScript
echo -e "${YELLOW}Checking TypeScript...${NC}"
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✓${NC} TypeScript configured"
    
    # Run type check
    if pnpm type-check >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Type checking passes"
    else
        echo -e "${RED}✗${NC} Type checking failed"
        echo -e "${YELLOW}  Run: pnpm type-check to see errors${NC}"
        FAILED=1
    fi
else
    echo -e "${RED}✗${NC} tsconfig.json not found"
    FAILED=1
fi
echo ""

# Check Git hooks
echo -e "${YELLOW}Checking Git hooks...${NC}"
if [ -d ".husky" ]; then
    echo -e "${GREEN}✓${NC} Husky configured"
    
    if [ -f ".husky/pre-commit" ]; then
        echo -e "${GREEN}✓${NC} Pre-commit hook configured"
    else
        echo -e "${YELLOW}⚠${NC} Pre-commit hook not found"
    fi
else
    echo -e "${YELLOW}⚠${NC} Husky not configured"
    echo -e "${YELLOW}  Run: pnpm prepare${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}================================================${NC}"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your environment is ready.${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Start Supabase: ${YELLOW}pnpm supabase:start${NC}"
    echo -e "  2. Start dev server: ${YELLOW}pnpm dev${NC}"
    echo -e "  3. Run tests: ${YELLOW}pnpm test:watch${NC}"
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
echo -e "${BLUE}================================================${NC}"