# Meridian ESG

ESG/Sustainability Data Management Platform built with Next.js 15, React 19, Supabase, and TypeScript.

## Tech Stack

- **Framework:** Next.js 15.5.0 with App Router
- **UI:** React 19.0.0 with Server Components
- **Database:** Supabase (PostgreSQL with RLS)
- **Styling:** Tailwind CSS 4.0.0
- **Language:** TypeScript 5.7.3
- **Linting:** ESLint 9.33.0 (flat config)
- **Package Manager:** pnpm 10.15.0 (via Corepack)

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for Supabase local development)
- pnpm (managed via Corepack)

### Setup

1. **Enable Corepack and pnpm:**
   ```bash
   corepack enable
   corepack prepare pnpm@10.15.0 --activate
   ```

2. **Install dependencies:**
   ```bash
   pnpm install --frozen-lockfile
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start Supabase locally:**
   ```bash
   pnpm supabase:start
   ```

5. **Run the development server:**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Workflow

### Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm verify` - Run all checks (typecheck, lint, test)

### Git Workflow

1. Create a feature branch:
   ```bash
   git checkout -b ai-feature-<descriptive-name>
   ```

2. Make changes and test:
   ```bash
   pnpm verify
   ```

3. Commit with clear messages:
   ```bash
   git commit -m "Task X.X: Description"
   ```

## Project Structure

```
meridian-esg/
├── app/                    # Next.js app directory
│   ├── api/v1/            # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── organizations/     # Organization management
├── components/
│   ├── features/          # Feature-specific components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/
│   ├── api/endpoints/    # API endpoint schemas
│   ├── supabase/         # Supabase clients
│   ├── utils/            # Utility functions
│   └── validation/       # Zod schemas
├── hooks/
│   ├── queries/          # Data fetching hooks
│   └── mutations/        # Data mutation hooks
├── services/             # Business logic
├── stores/               # Zustand stores
├── types/                # TypeScript types
├── supabase/
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
└── tests/                # Test files
```

## Best Practices

Refer to [docs/ENGINEERING_BEST_PRACTICES.md](docs/ENGINEERING_BEST_PRACTICES.md) for:
- Code review standards
- Exemplar files
- Security requirements
- Testing requirements
- Performance guidelines

## Security

- Row-Level Security (RLS) enabled on all user tables
- Service role keys never exposed to frontend
- All inputs validated with Zod
- Password requirements: 12+ chars, mixed case, numbers, symbols
- Email verification required

## License

Proprietary - All rights reserved