#!/bin/bash

# generate-types.sh
# Generate TypeScript types from Supabase database schema

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Generating Supabase types...${NC}"

# Check if SUPABASE_PROJECT_ID is set
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo -e "${RED}❌ Error: SUPABASE_PROJECT_ID environment variable is not set${NC}"
  echo "Please set it in your .env.local file or export it:"
  echo "  export SUPABASE_PROJECT_ID=your-project-id"
  exit 1
fi

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}❌ Error: Supabase CLI is not installed${NC}"
  echo "Install it with: brew install supabase/tap/supabase"
  exit 1
fi

# Generate types
echo -e "${YELLOW}📝 Fetching schema from project: $SUPABASE_PROJECT_ID${NC}"

if pnpm supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" > types/database/generated.ts; then
  echo -e "${GREEN}✅ Types generated successfully!${NC}"
  echo "   Location: types/database/generated.ts"
  
  # Run TypeScript check on generated types
  echo -e "${YELLOW}🔍 Validating generated types...${NC}"
  if pnpm tsc --noEmit types/database/generated.ts; then
    echo -e "${GREEN}✅ Type validation passed!${NC}"
  else
    echo -e "${YELLOW}⚠️  Warning: Type validation failed. Check the generated file.${NC}"
  fi
else
  echo -e "${RED}❌ Failed to generate types${NC}"
  echo "Make sure:"
  echo "  1. You're logged in: supabase login"
  echo "  2. The project ID is correct"
  echo "  3. You have access to the project"
  exit 1
fi
