# Meridian ESG Desktop Extension

A comprehensive Desktop Extension (DXT) for the Meridian ESG platform, providing MCP server capabilities for ESG data management, Supabase integration, and development workflow automation.

## Features

- **Supabase Integration**: Execute queries, manage RLS policies, and run migrations
- **ESG Data Management**: Validate data against frameworks (GRI, TCFD, ISSB, SASB)
- **Report Generation**: Generate compliance reports in multiple formats
- **Security Auditing**: Comprehensive security checks for database and code
- **Development Workflow**: Integrated development commands and test coverage
- **Local Development**: Optimized for local development with Supabase

## Installation

### Prerequisites

- Node.js >= 18.0.0
- Claude Desktop >= 0.10.0
- Supabase CLI installed
- Docker (for local Supabase)

### Quick Start

1. **Build the extension package:**
   ```bash
   # Install dependencies
   cd dxt-meridian-esg/server
   npm install
   
   # Go back to extension root
   cd ..
   
   # Package the extension (requires dxt CLI)
   dxt pack .
   ```

2. **Install in Claude Desktop:**
   - Open Claude Desktop
   - Go to Extensions
   - Click "Install from file"
   - Select the generated `.dxt` file

3. **Configure the extension:**
   - Set your Supabase URL and keys in the extension settings
   - Configure workspace directory to your project root
   - Enable debug mode for detailed logging (optional)

## Configuration

The extension requires the following configuration:

| Setting | Required | Description |
|---------|----------|-------------|
| `supabase_url` | Yes | Your Supabase project URL |
| `supabase_anon_key` | Yes | Supabase anonymous key (client-safe) |
| `supabase_service_key` | No | Service role key (for admin operations) |
| `environment` | No | Environment (local/staging/production) |
| `enable_debug` | No | Enable detailed logging |
| `workspace_dir` | No | Project root directory |
| `max_query_results` | No | Maximum query results (1-1000) |

## Available Tools

### 1. supabase_query
Execute Supabase queries with optional RLS bypass.

```json
{
  "table": "organizations",
  "select": "id, name, created_at",
  "filters": [
    {
      "column": "created_at",
      "operator": "gte",
      "value": "2024-01-01"
    }
  ],
  "orderBy": {
    "column": "created_at",
    "ascending": false
  },
  "limit": 10,
  "useServiceRole": false
}
```

### 2. validate_esg_data
Validate ESG data against framework standards.

```json
{
  "data": {
    "scope1": 1000,
    "scope2": 500,
    "scope3": 2000,
    "unit": "tCO2e",
    "period": "2024-Q1"
  },
  "framework": "GRI",
  "category": "emissions"
}
```

### 3. generate_report
Generate ESG compliance reports.

```json
{
  "organizationId": "550e8400-e29b-41d4-a716-446655440000",
  "framework": "TCFD",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "format": "json"
}
```

### 4. manage_rls_policies
Create, list, and test Row-Level Security policies.

```json
{
  "action": "list"
}
```

```json
{
  "action": "create",
  "table": "organizations",
  "policyName": "org_select_policy",
  "policyDefinition": "FOR SELECT TO authenticated USING (id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid()))"
}
```

### 5. run_migrations
Execute database migrations.

```json
{
  "action": "status"
}
```

```json
{
  "action": "create",
  "name": "add_audit_table",
  "content": "CREATE TABLE audit_logs (...);"
}
```

### 6. audit_security
Perform comprehensive security audits.

```json
{
  "scope": "all",
  "includeRLS": true,
  "includeAuth": true,
  "includeValidation": true
}
```

### 7. test_coverage
Run tests and check coverage.

```json
{
  "command": "coverage"
}
```

### 8. dev_workflow
Execute development workflow commands.

```json
{
  "command": "verify"
}
```

## Development

### Local Testing

1. **Set up environment variables:**
   ```bash
   export SUPABASE_URL="your-url"
   export SUPABASE_ANON_KEY="your-anon-key"
   export SUPABASE_SERVICE_KEY="your-service-key"
   export ENABLE_DEBUG=true
   export WORKSPACE_DIR="/path/to/meridian-esg"
   ```

2. **Run the MCP server locally:**
   ```bash
   cd dxt-meridian-esg/server
   npm start
   ```

3. **Test with MCP client:**
   You can use any MCP client to test the server locally via stdio.

### Building for Production

1. **Install production dependencies only:**
   ```bash
   cd server
   npm ci --production
   ```

2. **Bundle node_modules:**
   The entire `node_modules` directory should be included in the extension package.

3. **Create the package:**
   ```bash
   cd ..
   zip -r meridian-esg.dxt . -x "*.git*" -x "*node_modules/.cache*"
   ```

## Security Considerations

- **Service Keys**: Never expose service role keys in frontend code
- **RLS Policies**: Always enable RLS on user-facing tables
- **Input Validation**: All inputs are validated using Zod schemas
- **Error Handling**: Comprehensive error handling with safe error messages
- **Audit Logging**: All sensitive operations are logged

## Troubleshooting

### Common Issues

1. **"Service client not available" error**
   - Ensure `supabase_service_key` is configured for admin operations

2. **"Configuration errors" on startup**
   - Check that required environment variables are set
   - Verify Supabase URL and keys are correct

3. **Migration failures**
   - Ensure Docker is running for local Supabase
   - Check that `supabase` CLI is installed

4. **Test command timeouts**
   - Increase timeout in development settings
   - Check that all dependencies are installed

### Debug Mode

Enable debug mode for detailed logging:
- Set `ENABLE_DEBUG=true` in environment
- Or enable in extension settings

## Architecture

```
dxt-meridian-esg/
├── manifest.json          # DXT manifest configuration
├── server/
│   ├── index.js          # Main MCP server implementation
│   ├── package.json      # Node.js dependencies
│   └── node_modules/     # Bundled dependencies
├── README.md             # This file
└── icon.png             # Extension icon (optional)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

- **Documentation**: https://docs.meridian-esg.com/dxt
- **Issues**: https://github.com/meridian-esg/dxt-extension/issues
- **Email**: dev@meridian-esg.com

## Changelog

### v1.0.0 (Initial Release)
- Supabase integration with RLS support
- ESG data validation for major frameworks
- Report generation (JSON format)
- Security auditing capabilities
- Development workflow automation
- Comprehensive error handling and logging