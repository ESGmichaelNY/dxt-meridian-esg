#!/bin/bash

# new-feature.sh
# Create a new feature branch following naming conventions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if feature name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Feature name required${NC}"
    echo ""
    echo "Usage: $0 <feature-name>"
    echo ""
    echo "Examples:"
    echo "  $0 user-authentication"
    echo "  $0 data-validation"
    echo "  $0 report-generation"
    exit 1
fi

FEATURE_NAME=$1
BRANCH_NAME="ai-feature-$FEATURE_NAME"

echo -e "${BLUE}Creating new feature: $FEATURE_NAME${NC}"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠ You have uncommitted changes${NC}"
    echo -e "${YELLOW}Please commit or stash them before creating a new feature branch${NC}"
    echo ""
    echo "Options:"
    echo "  1. Commit changes: git add . && git commit -m 'WIP: description'"
    echo "  2. Stash changes: git stash"
    exit 1
fi

# Ensure we're on main and up to date
echo -e "${YELLOW}Switching to main branch...${NC}"
git checkout main

echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull origin main

# Create and checkout new branch
echo -e "${YELLOW}Creating branch: $BRANCH_NAME${NC}"
git checkout -b "$BRANCH_NAME"

echo ""
echo -e "${GREEN}✅ Feature branch created successfully!${NC}"
echo ""
echo -e "${BLUE}You are now on branch: $BRANCH_NAME${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Write tests first (TDD): ${YELLOW}pnpm test:watch${NC}"
echo "  2. Implement your feature"
echo "  3. Verify all checks pass: ${YELLOW}pnpm verify${NC}"
echo "  4. Commit your changes: ${YELLOW}git add . && git commit -m 'Task X.X: Description'${NC}"
echo "  5. Push to remote: ${YELLOW}git push -u origin $BRANCH_NAME${NC}"
echo ""
echo -e "${BLUE}Remember to follow the exemplar patterns:${NC}"
echo "  - Components: ${YELLOW}components/features/organizations/UserProfile.tsx${NC}"
echo "  - Utilities: ${YELLOW}lib/utils/validation.ts${NC}"
echo "  - Hooks: ${YELLOW}hooks/queries/use-user-data.ts${NC}"