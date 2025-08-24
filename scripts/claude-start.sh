#!/bin/bash

# claude-start.sh
# Quick start script for Claude Code development

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}     Meridian ESG - Claude Code Quick Start     ${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Function to run command with status
run_with_status() {
    local cmd=$1
    local desc=$2
    echo -e "${YELLOW}$desc...${NC}"
    if eval "$cmd"; then
        echo -e "${GREEN}✓ $desc completed${NC}"
    else
        echo -e "${RED}✗ $desc failed${NC}"
        return 1
    fi
    echo ""
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Not in project root directory${NC}"
    exit 1
fi

# 1. Install dependencies if needed
if [ ! -d "node_modules" ]; then
    run_with_status "pnpm install --frozen-lockfile" "Installing dependencies"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
    echo ""
fi

# 2. Check environment setup
echo -e "${YELLOW}Checking environment...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠ .env.local not found, copying from example...${NC}"
    cp .env.local.example .env.local
    echo -e "${YELLOW}⚠ Please update .env.local with your Supabase credentials${NC}"
else
    echo -e "${GREEN}✓ Environment configured${NC}"
fi
echo ""

# 3. Start Supabase if not running
echo -e "${YELLOW}Checking Supabase status...${NC}"
if ! supabase status 2>/dev/null | grep -q "RUNNING"; then
    echo -e "${YELLOW}Starting Supabase...${NC}"
    supabase start
    echo -e "${GREEN}✓ Supabase started${NC}"
else
    echo -e "${GREEN}✓ Supabase already running${NC}"
fi
echo ""

# 4. Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}Current branch: ${NC}$CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "main" ]; then
    echo -e "${YELLOW}⚠ You're on main branch. Create a feature branch:${NC}"
    echo -e "  ${YELLOW}./scripts/new-feature.sh <feature-name>${NC}"
fi
echo ""

# 5. Run initial checks
echo -e "${YELLOW}Running initial verification...${NC}"
pnpm type-check && echo -e "${GREEN}✓ TypeScript check passed${NC}" || echo -e "${YELLOW}⚠ TypeScript errors found${NC}"
echo ""

# 6. Display useful commands
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}✅ Ready for development!${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  ${YELLOW}pnpm dev${NC}           - Start development server"
echo -e "  ${YELLOW}pnpm test:watch${NC}    - Run tests in watch mode"
echo -e "  ${YELLOW}pnpm verify${NC}        - Run all checks before commit"
echo -e "  ${YELLOW}pnpm build${NC}         - Build for production"
echo -e "  ${YELLOW}pnpm db:types${NC}      - Generate Supabase types"
echo ""
echo -e "${BLUE}Create a new feature:${NC}"
echo -e "  ${YELLOW}./scripts/new-feature.sh <feature-name>${NC}"
echo ""
echo -e "${BLUE}Check setup:${NC}"
echo -e "  ${YELLOW}./scripts/check-setup.sh${NC}"
echo -e "${BLUE}================================================${NC}"