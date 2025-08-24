# Meridian ESG - Architecture Overview

## Table of Contents
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Data Architecture](#data-architecture)
- [Security Architecture](#security-architecture)
- [Component Architecture](#component-architecture)
- [API Architecture](#api-architecture)
- [Performance Strategy](#performance-strategy)
- [Deployment Architecture](#deployment-architecture)

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   App Router │  │ Server Comp. │  │  Client Comp.    │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  Route       │  │  Middleware  │  │  Validation    │   │
│  │  Handlers    │  │  (Auth/CORS) │  │  (Zod)         │   │
│  └──────────────┘  └──────────────┘  └────────────────┘   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  PostgreSQL  │  │  Row-Level   │  │  Edge          │   │
│  │  Database    │  │  Security    │  │  Functions     │   │
│  └──────────────┘  └──────────────┘  └────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  Auth        │  │  Storage     │  │  Realtime      │   │
│  │  Service     │  │  Buckets     │  │  Subscriptions │   │
│  └──────────────┘  └──────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Technologies
- **Framework:** Next.js 15.5.0 (App Router, React Server Components)
- **UI Library:** React 19.0.0
- **Language:** TypeScript 5.7.3 (strict mode)
- **Styling:** Tailwind CSS v4 (CSS-based configuration)
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth with SSR support
- **State Management:** 
  - Server State: React Server Components + Supabase
  - Client State: Zustand (ephemeral UI only)
- **Testing:** Vitest + React Testing Library + MSW
- **Linting:** ESLint 9 (flat config) + Prettier
- **Package Manager:** pnpm 10.15.0 (via Corepack)

### Key Libraries
- **Forms:** react-hook-form + @hookform/resolvers
- **Validation:** Zod
- **Date Handling:** date-fns
- **CSS Utilities:** clsx + tailwind-merge
- **API Client:** @supabase/supabase-js + @supabase/ssr

## Data Architecture

### Multi-Tenant Design
```sql
-- Core tenant isolation pattern
organizations (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
)

-- All tenant data includes org reference
temporal_data (
  id uuid PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id),
  category text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  data jsonb NOT NULL,
  -- RLS enforces tenant isolation
)
```

### Data Model Principles
1. **Tenant Isolation:** Every table includes `organization_id`
2. **Temporal Design:** All ESG data is time-bounded
3. **Flexible Schema:** JSONB for extensible data structures
4. **Audit Trail:** All tables include created/updated metadata
5. **Soft Deletes:** Data marked as deleted, not removed

### Database Patterns
- **UUID Primary Keys:** For distributed system compatibility
- **JSONB for Flexibility:** ESG metrics stored as structured JSON
- **Materialized Views:** For complex reporting queries
- **Indexes:** On all foreign keys and commonly queried fields

## Security Architecture

### Authentication & Authorization
```typescript
// Three-tier security model
1. Authentication: Supabase Auth (JWT)
2. Authorization: Role-Based Access Control (RBAC)
3. Data Access: Row-Level Security (RLS)
```

### Security Layers
1. **Frontend Security:**
   - Input sanitization with Zod
   - XSS prevention via React
   - CSRF protection via SameSite cookies
   - Content Security Policy headers

2. **API Security:**
   - Rate limiting per endpoint
   - Request validation (Zod schemas)
   - JWT verification
   - Service role key protection

3. **Database Security:**
   - Row-Level Security (RLS) on all tables
   - Parameterized queries only
   - Encrypted connections
   - Regular security audits

### RLS Policy Pattern
```sql
-- Standard tenant isolation policy
CREATE POLICY "tenant_isolation" ON table_name
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );
```

## Component Architecture

### Directory Structure
```
components/
├── features/           # Feature-specific components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard widgets
│   ├── organizations/ # Org management
│   └── reporting/     # Report generation
├── ui/                # Reusable UI primitives
│   ├── button/
│   ├── card/
│   ├── form/
│   └── modal/
└── layouts/           # Page layouts
    ├── auth-layout/
    └── dashboard-layout/
```

### Component Principles
1. **Single Responsibility:** One component, one purpose
2. **Composition Over Inheritance:** Small, composable units
3. **Props Over State:** Prefer controlled components
4. **Accessibility First:** ARIA labels, semantic HTML
5. **Type Safety:** Full TypeScript interfaces

### Exemplar Pattern (UserProfile.tsx)
```typescript
interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
  readonly?: boolean;
}

export function UserProfile({ 
  user, 
  onUpdate, 
  readonly = false 
}: UserProfileProps) {
  // Minimal state, derived values
  const displayName = useMemo(
    () => user.firstName + ' ' + user.lastName,
    [user.firstName, user.lastName]
  );
  
  // Accessibility-first markup
  return (
    <article aria-label="User profile">
      {/* Component implementation */}
    </article>
  );
}
```

## API Architecture

### Route Structure
```
app/api/v1/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── refresh/route.ts
├── organizations/
│   ├── route.ts          # List/Create
│   └── [id]/route.ts     # Read/Update/Delete
├── data/
│   ├── emissions/route.ts
│   ├── social/route.ts
│   └── governance/route.ts
└── reports/
    ├── generate/route.ts
    └── export/route.ts
```

### API Patterns
1. **RESTful Design:** Standard HTTP methods
2. **Versioning:** `/api/v1/` prefix
3. **Validation:** Zod schemas for all inputs/outputs
4. **Error Handling:** Consistent error format
5. **Rate Limiting:** Per-endpoint limits

### Standard Response Format
```typescript
// Success
{
  success: true,
  data: T,
  meta?: {
    page?: number,
    total?: number
  }
}

// Error
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: unknown
  }
}
```

## Performance Strategy

### Optimization Techniques
1. **Server Components:** Default for data fetching
2. **Client Components:** Only for interactivity
3. **Streaming SSR:** Progressive page rendering
4. **Static Generation:** For marketing pages
5. **Dynamic Imports:** Code splitting for large components

### Caching Strategy
```typescript
// Multiple cache layers
1. CDN Cache: Static assets (Vercel/Cloudflare)
2. Browser Cache: Immutable assets with hashing
3. API Cache: Next.js Data Cache
4. Database Cache: Materialized views
5. Application Cache: React Query/SWR for client
```

### Performance Targets
- **First Contentful Paint:** < 1.0s
- **Time to Interactive:** < 2.0s
- **Cumulative Layout Shift:** < 0.1
- **API Response Time:** < 500ms (p95)
- **Database Query Time:** < 100ms (p95)

## Deployment Architecture

### Environment Strategy
```
Development → Staging → Production

dev.meridian-esg.com
 ↓ PR merge
staging.meridian-esg.com
 ↓ Release
app.meridian-esg.com
```

### Infrastructure
1. **Hosting:** Vercel (Next.js optimized)
2. **Database:** Supabase Cloud (managed PostgreSQL)
3. **CDN:** Vercel Edge Network
4. **Monitoring:** Vercel Analytics + Sentry
5. **CI/CD:** GitHub Actions

### Deployment Checklist
- [ ] All tests passing
- [ ] Security audit clean
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Performance benchmarks met
- [ ] Rollback plan documented

## Scalability Considerations

### Horizontal Scaling
- **Application:** Serverless functions (auto-scale)
- **Database:** Read replicas for reporting
- **Storage:** CDN for media files
- **Cache:** Redis for session management

### Vertical Scaling
- **Database:** Upgrade Supabase tier as needed
- **Compute:** Increase function memory/timeout
- **Storage:** Expand bucket limits

## Monitoring & Observability

### Key Metrics
1. **Application Metrics:**
   - Request rate
   - Error rate
   - Response time
   - Active users

2. **Database Metrics:**
   - Query performance
   - Connection pool usage
   - Storage growth
   - RLS policy performance

3. **Business Metrics:**
   - User engagement
   - Data completeness
   - Report generation time
   - API usage by endpoint

## Disaster Recovery

### Backup Strategy
- **Database:** Daily automated backups (30-day retention)
- **Code:** Git repository (GitHub)
- **Configuration:** Environment variables in secure vault
- **User Files:** Supabase Storage with versioning

### Recovery Plan
1. **RTO (Recovery Time Objective):** 4 hours
2. **RPO (Recovery Point Objective):** 24 hours
3. **Rollback Procedure:** Documented in RUNBOOK.md
4. **Communication Plan:** Status page + email notifications

## Future Considerations

### Planned Enhancements
1. **GraphQL API:** For complex data queries
2. **WebSocket Support:** Real-time collaboration
3. **Machine Learning:** Anomaly detection in ESG data
4. **Mobile Apps:** React Native implementation
5. **Advanced Analytics:** Embedded BI tools

### Technical Debt Management
- Regular dependency updates
- Performance profiling quarterly
- Security audits bi-annually
- Code refactoring sprints
- Documentation updates

---

*Last Updated: August 2025*
*Version: 1.0.0*