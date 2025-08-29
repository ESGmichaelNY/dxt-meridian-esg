# Parallel Development with Git Worktrees

Develop multiple features in parallel using Git worktrees: $ARGUMENTS

## Overview

This command sets up isolated development environments for parallel feature development using Git worktrees and optionally spawns subagents to implement features simultaneously.

## Execution Modes

### Mode 1: Setup Only (default)
Create worktrees for manual development:
```
parallel-development feature1 feature2 feature3
```

### Mode 2: Setup + Automated Development
Create worktrees and spawn subagents to implement features:
```
parallel-development --with-agents feature1 feature2 feature3
```

## Workflow Steps

### PHASE 1: SETUP WORKTREES
For each feature mentioned:
1. Create a worktree at `../dev_meridian-[feature-name]` with branch `feature/[feature-name]`
2. Set up the development environment in each worktree:
   - Copy `.env.local` if it exists
   - Install dependencies with `pnpm install`
   - Generate Drizzle types if needed
3. List all worktrees created

### PHASE 2: SPAWN SUBAGENTS (if --with-agents flag)
For each feature, run a subagent in parallel with these instructions:
- Working directory: `dev_meridian-[feature-name]` worktree
- Isolated development environment
- Implement the [feature-name] feature with:
  - Full functionality following project patterns
  - Proper Clerk authentication integration
  - Drizzle ORM for all database operations
  - Testing and error handling
  - Type safety with TypeScript
- DO NOT run the application (no `pnpm dev` in background)
- Create summary in `[feature-name].work.txt` including:
  - What was implemented
  - Files created/modified
  - Dependencies added
  - Database schema changes
  - Testing approach
  - Integration notes

### PHASE 3: COORDINATION (if --with-agents flag)
- Monitor all subagents working in parallel
- Ensure each completes their implementation
- Verify work summary files are created

### PHASE 4: FINAL SUMMARY
After setup/implementation:
1. List all worktrees and their status
2. If agents were used, read all `.work.txt` files
3. Provide comprehensive summary:
   - Features ready for development/completed
   - Database migrations needed
   - Dependencies to add
   - Integration considerations
4. Next steps for merging

## Tech Stack Reminders

Each worktree must follow:
- **Auth**: Clerk (NOT Supabase Auth)
- **Database**: Drizzle ORM (NOT Supabase client)
- **IDs**: Text format for Clerk compatibility
- **Styling**: Tailwind CSS v4

## Example Usage

### Simple Setup
```bash
# Create worktrees for manual development
parallel-development user-profiles reporting dashboard
```

### Automated Development
```bash
# Create worktrees and implement features with agents
parallel-development --with-agents user-profiles reporting dashboard
```

## Post-Development Integration

After features are developed, use the `merge-features` command to integrate them safely.