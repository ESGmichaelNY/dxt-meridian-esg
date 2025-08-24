# Meridian ESG Platform

A comprehensive ESG/Sustainability data management platform built with Next.js 15, React 19, and Supabase.

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.0 (App Router, Server Components)
- **UI:** React 19.0.0 (with new hooks: useActionState, useFormStatus, useOptimistic)
- **Styling:** Tailwind CSS v4 (CSS-based configuration)
- **Database:** Supabase (PostgreSQL with Row-Level Security)
- **Language:** TypeScript 5.7.3 (strict mode)
- **Testing:** Vitest + React Testing Library
- **Package Manager:** pnpm 10.15.0 (via Corepack)
- **Code Quality:** ESLint 9 (flat config) + Prettier

## 📋 Prerequisites

- Node.js 20+ (for Corepack support)
- Docker (for local Supabase)
- pnpm (installed via Corepack)

## 🛠️ Setup

### 1. Enable Corepack and Install Dependencies

```bash
# Enable Corepack (ships with Node.js 16.13+)
corepack enable
corepack prepare pnpm@10.15.0 --activate

# Install dependencies
pnpm install --frozen-lockfile

# Approve native builds (for Sharp, etc.)
pnpm approve-builds
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
```

### 3. Supabase Setup

```bash
# Start local Supabase
pnpm supabase:start

# The console will display your local credentials:
# - API URL: http://localhost:54321
# - Anon Key: [your-anon-key]
# - Service Role Key: [your-service-role-key] (⚠️ NEVER expose to client!)

# Run database migrations
pnpm db:migrate

# Generate TypeScript types
pnpm db:types
```

### 4. Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

## 🏗️ Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Protected pages
├── components/
│   ├── features/          # Feature-specific components
│   └── ui/                # Reusable UI components
├── hooks/
│   ├── queries/           # Data fetching hooks
│   └── mutations/         # Data mutation hooks
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── utils/             # Utility functions
│   └── api/               # API helpers
├── services/              # Business logic
│   ├── *.server.ts        # Server-only (secrets)
│   └── *.public.ts        # Client-safe
├── stores/                # Zustand stores
├── supabase/              # Database files
│   ├── migrations/        # SQL migrations
│   └── functions/         # Edge Functions
└── types/                 # TypeScript types
    └── database/          # Generated DB types
```

## 🔑 Key Commands

### Development

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm verify           # Run all checks (type, lint, test)
```

### Testing

```bash
pnpm test             # Run tests
pnpm test:watch       # Watch mode
pnpm test:ui          # Vitest UI
pnpm test:coverage    # Coverage report
```

### Database

```bash
pnpm db:types         # Generate TypeScript types
pnpm db:migrate       # Push migrations
pnpm db:reset         # Reset database
pnpm supabase:start   # Start local Supabase
pnpm supabase:stop    # Stop local Supabase
```

### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix lint issues
pnpm type-check       # TypeScript check
```

## 🏆 Golden Exemplars

Follow these example files for best practices:

- **Components:** `components/features/organizations/UserProfile.tsx`
- **Validation:** `lib/utils/validation.ts`
- **Hooks:** `hooks/queries/use-user-data.ts`

## 🔐 Security Guidelines

### Critical Rules

1. **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend
2. **ALWAYS** enable RLS on user-facing tables
3. **ALWAYS** validate inputs with Zod
4. **NEVER** commit `.env.local`
5. **ALWAYS** use parameterized queries

### RLS Policy Testing

```sql
-- Test your policies in Supabase SQL Editor
-- Example: Test if users can only see their own data
SET SESSION AUTHORIZATION 'authenticated';
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM profiles;
```

## 🌿 Git Workflow

### Feature Development

```bash
# 1. Create feature branch
git checkout -b ai-feature-<descriptive-name>

# 2. Make changes and test
pnpm test:watch

# 3. Verify everything
pnpm verify

# 4. Commit with clear message
git add .
git commit -m "Task X.X: Description of changes"

# 5. Push and create PR
git push origin ai-feature-<descriptive-name>
```

### Branch Naming Convention

- Features: `ai-feature-<name>`
- Bugfixes: `fix-<issue-number>-<description>`
- Hotfixes: `hotfix-<description>`

## 📊 Performance Targets

- Page Load: < 2 seconds
- API Response: < 500ms
- Database Query: < 100ms
- Lighthouse Score: > 90
- Test Coverage: > 80%

## 🧪 Testing Strategy

### Unit Tests
- All utility functions
- Components with logic
- Custom hooks

### Integration Tests
- API routes
- Database operations
- Authentication flows

### E2E Tests (Coming Soon)
- Critical user journeys
- Payment flows
- Report generation

## 📚 Documentation

- [Engineering Best Practices](./ENGINEERING_BEST_PRACTICES.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)

## 🤖 Claude Code Quick Reference

### Quick Start
```bash
# Run this to quickly set up your environment
./scripts/claude-start.sh
```

### Check Setup
```bash
# Verify your environment is configured correctly
./scripts/check-setup.sh
```

### Create New Feature
```bash
# Create a properly named feature branch
./scripts/new-feature.sh <feature-name>
```

### Before Every Task
1. **Create feature branch:** `git checkout -b ai-feature-<name>`
2. **Write tests first:** Create test files before implementation
3. **Follow exemplars:** Reference the golden example files
4. **Verify before commit:** Run `pnpm verify`

### Critical Patterns to Follow

**Components** (see `components/features/organizations/UserProfile.tsx`):
- Props with TypeScript interfaces
- Accessibility-first markup
- Minimal state, memoization outside render
- Clean separation of concerns

**Validation** (see `lib/utils/validation.ts`):
- Zod schemas for all inputs
- Reusable validation helpers
- Consistent error handling

**Hooks** (see `hooks/queries/use-user-data.ts`):
- Remote state: `idle | loading | success | error`
- Zod validation at boundaries
- AbortController for cleanup
- Stable references with useCallback/useMemo

### Security Checklist
- [ ] Service role key NEVER in frontend
- [ ] RLS enabled on ALL user tables
- [ ] Inputs validated with Zod
- [ ] No hardcoded secrets
- [ ] SQL injection prevention
- [ ] XSS prevention

## 🤝 Contributing

1. Read [ENGINEERING_BEST_PRACTICES.md](./ENGINEERING_BEST_PRACTICES.md)
2. Follow the golden exemplars
3. Write tests first (TDD)
4. Create feature branch
5. Submit PR using template

## 🆘 Troubleshooting

### Common Issues

**Issue:** `pnpm: command not found`
```bash
corepack enable
corepack prepare pnpm@10.15.0 --activate
```

**Issue:** Sharp installation fails
```bash
pnpm approve-builds
pnpm install --frozen-lockfile
```

**Issue:** Supabase types outdated
```bash
export SUPABASE_PROJECT_ID=your-project-id
pnpm db:types
```

**Issue:** RLS policies blocking queries
- Check policies in Supabase Dashboard
- Test with SQL Editor using auth context
- Verify JWT claims match policy conditions

## 📄 License

Private and Confidential - Meridian ESG © 2025

## 🙏 Acknowledgments

Built with best practices from:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
