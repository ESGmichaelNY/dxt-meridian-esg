# Claude Command Agents

## Overview
This directory contains command agents that help Claude Code perform complex development workflows for the Meridian ESG platform.

## Available Commands

### 🔧 Setup & Configuration
- **setup-clerk** - Configure Clerk authentication, webhooks, and database sync
  - Sets up environment variables
  - Configures webhooks for user/org sync
  - Creates database schema with text IDs
  - Integrates with Next.js middleware

### 🧪 Testing & Quality
- **run-tests** - Execute comprehensive test suites and generate coverage reports
  - Type checking with TypeScript
  - Linting with ESLint 9
  - Unit tests with Vitest
  - Integration tests for API routes
  - Coverage reporting

- **review-code** - Review code for quality, security, and best practices
  - Architectural consistency
  - Security vulnerabilities
  - Performance issues
  - Code style adherence

### 📊 Database Operations
- **migrate-database** - Create and run database migrations using Drizzle ORM
  - Schema updates for PostgreSQL 17
  - Migration generation and execution
  - Rollback procedures
  - Data migration patterns

### 🚀 Deployment & Features
- **deploy-preview** - Deploy preview environments on Vercel
  - Pre-deployment checks
  - Database setup for preview
  - Environment configuration
  - Testing and monitoring

- **parallel-development** - Develop multiple features in parallel using Git worktrees
  - Two modes: manual setup or automated with agents
  - Isolated development environments
  - Coordinate multiple feature implementations

- **merge-features** - Integrate parallel feature branches safely
  - Conflict resolution
  - Migration coordination
  - Testing before merge
  - Production deployment

### 📝 Documentation & Issues
- **document_feature** - Generate comprehensive documentation for features
  - Technical documentation
  - User guides
  - API documentation
  - Architecture diagrams

- **fix-issue** - Fix GitHub issues with systematic approach
  - Issue analysis
  - Solution implementation
  - Testing and verification
  - Documentation updates

## Tech Stack Compliance
All commands enforce the following technology requirements:

### Authentication
- ✅ **Clerk** for ALL authentication (`@clerk/nextjs`)
- ❌ **Never** use Supabase Auth

### Database
- ✅ **Drizzle ORM** for ALL database operations
- ✅ **PostgreSQL 17** via Supabase hosting
- ❌ **Never** use Supabase client for queries

### Key Patterns
- Text IDs for Clerk compatibility (not UUIDs)
- Tailwind CSS v4 for styling
- TypeScript with strict mode
- pnpm for package management

## Usage Examples

### Basic Command
```
/claude run-tests
```

### Command with Arguments
```
/claude migrate-database add-esg-metrics-table
```

### Parallel Development
```
/claude parallel-development --with-agents user-profiles reporting dashboard
```

## Command Structure
Each command file follows this structure:
1. **Overview** - Brief description of what the command does
2. **Prerequisites** - Requirements before running
3. **Workflow Steps** - Detailed phases of execution
4. **Code Examples** - Sample implementations
5. **Troubleshooting** - Common issues and solutions
6. **Quick Commands** - Most frequently used variations

## Creating New Commands
When adding new command agents:
1. Use kebab-case naming (e.g., `new-command.md`)
2. Include tech stack reminders (Clerk, Drizzle, PostgreSQL 17)
3. Provide comprehensive workflow steps
4. Add code examples aligned with project patterns
5. Include troubleshooting section
6. Document quick commands for common use cases

## Important Notes
- Commands may spawn subagents for complex tasks
- All database operations use Drizzle ORM, never Supabase client
- Authentication is exclusively handled by Clerk
- Use text IDs throughout for Clerk compatibility
- Always verify against the tech stack requirements in CLAUDE.md