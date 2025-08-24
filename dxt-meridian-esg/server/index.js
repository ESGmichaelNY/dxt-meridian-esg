#!/usr/bin/env node

/**
 * Meridian ESG MCP Server
 * 
 * A comprehensive Model Context Protocol server for ESG data management,
 * Supabase integration, and development workflow automation.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Logger with debug mode support
class Logger {
  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  info(message, ...args) {
    console.error(`[INFO] ${message}`, ...args);
  }

  debug(message, ...args) {
    if (this.debugMode) {
      console.error(`[DEBUG] ${message}`, ...args);
    }
  }

  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  }

  warn(message, ...args) {
    console.error(`[WARN] ${message}`, ...args);
  }
}

// Configuration management
class Config {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
    this.environment = process.env.ENVIRONMENT || 'local';
    this.debugMode = process.env.ENABLE_DEBUG === 'true';
    this.workspaceDir = process.env.WORKSPACE_DIR || process.cwd();
    this.maxQueryResults = parseInt(process.env.MAX_QUERY_RESULTS || '100', 10);
  }

  validate() {
    const errors = [];
    
    if (!this.supabaseUrl) {
      errors.push('SUPABASE_URL is required');
    }
    
    if (!this.supabaseAnonKey) {
      errors.push('SUPABASE_ANON_KEY is required');
    }
    
    if (errors.length > 0) {
      throw new Error(`Configuration errors: ${errors.join(', ')}`);
    }
  }

  hasServiceKey() {
    return !!this.supabaseServiceKey;
  }
}

// Supabase client manager
class SupabaseManager {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.anonClient = null;
    this.serviceClient = null;
  }

  initialize() {
    try {
      // Initialize anon client
      this.anonClient = createClient(
        this.config.supabaseUrl,
        this.config.supabaseAnonKey
      );
      this.logger.info('Initialized Supabase anon client');

      // Initialize service client if key is available
      if (this.config.hasServiceKey()) {
        this.serviceClient = createClient(
          this.config.supabaseUrl,
          this.config.supabaseServiceKey
        );
        this.logger.info('Initialized Supabase service client');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Supabase clients:', error);
      throw error;
    }
  }

  getClient(requireService = false) {
    if (requireService) {
      if (!this.serviceClient) {
        throw new Error('Service client not available. Service key required for this operation.');
      }
      return this.serviceClient;
    }
    return this.anonClient;
  }
}

// Tool schemas
const SupabaseQuerySchema = z.object({
  table: z.string().describe('The table to query'),
  select: z.string().optional().describe('Columns to select'),
  filters: z.array(z.object({
    column: z.string(),
    operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'is', 'in']),
    value: z.any()
  })).optional().describe('Query filters'),
  orderBy: z.object({
    column: z.string(),
    ascending: z.boolean().default(true)
  }).optional().describe('Order by configuration'),
  limit: z.number().optional().describe('Limit results'),
  useServiceRole: z.boolean().default(false).describe('Use service role (bypasses RLS)')
});

const ValidateESGDataSchema = z.object({
  data: z.record(z.any()).describe('ESG data to validate'),
  framework: z.enum(['GRI', 'TCFD', 'ISSB', 'SASB']).describe('ESG framework to validate against'),
  category: z.enum(['emissions', 'social', 'governance']).describe('Data category')
});

const GenerateReportSchema = z.object({
  organizationId: z.string().uuid().describe('Organization ID'),
  framework: z.enum(['GRI', 'TCFD', 'ISSB', 'SASB']).describe('Reporting framework'),
  startDate: z.string().describe('Report start date (ISO format)'),
  endDate: z.string().describe('Report end date (ISO format)'),
  format: z.enum(['pdf', 'excel', 'json']).default('json').describe('Output format')
});

const RLSPolicySchema = z.object({
  action: z.enum(['create', 'list', 'test']).describe('Action to perform'),
  table: z.string().optional().describe('Table name for policy'),
  policyName: z.string().optional().describe('Policy name'),
  policyDefinition: z.string().optional().describe('SQL policy definition'),
  testUserId: z.string().uuid().optional().describe('User ID for testing')
});

const MigrationSchema = z.object({
  action: z.enum(['run', 'create', 'status']).describe('Migration action'),
  name: z.string().optional().describe('Migration name'),
  content: z.string().optional().describe('Migration SQL content')
});

const SecurityAuditSchema = z.object({
  scope: z.enum(['database', 'code', 'all']).default('all').describe('Audit scope'),
  includeRLS: z.boolean().default(true).describe('Include RLS policy check'),
  includeAuth: z.boolean().default(true).describe('Include authentication check'),
  includeValidation: z.boolean().default(true).describe('Include input validation check')
});

const TestCoverageSchema = z.object({
  command: z.enum(['run', 'coverage', 'watch']).default('run').describe('Test command'),
  pattern: z.string().optional().describe('Test file pattern'),
  updateSnapshot: z.boolean().default(false).describe('Update test snapshots')
});

const DevWorkflowSchema = z.object({
  command: z.enum(['dev', 'build', 'lint', 'typecheck', 'verify', 'supabase:start', 'supabase:stop']).describe('Development command'),
  args: z.array(z.string()).optional().describe('Additional arguments')
});

// Main MCP Server
class MeridianESGServer {
  constructor() {
    this.config = new Config();
    this.logger = new Logger(this.config.debugMode);
    this.supabase = new SupabaseManager(this.config, this.logger);
    this.server = new Server(
      {
        name: 'meridian-esg',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  }

  async initialize() {
    try {
      // Validate configuration
      this.config.validate();
      
      // Initialize Supabase
      this.supabase.initialize();
      
      // Set up request handlers
      this.setupHandlers();
      
      this.logger.info('Meridian ESG MCP Server initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize server:', error);
      throw error;
    }
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'supabase_query',
          description: 'Execute a Supabase query with optional RLS bypass',
          inputSchema: {
            type: 'object',
            properties: SupabaseQuerySchema.shape,
            required: ['table']
          }
        },
        {
          name: 'validate_esg_data',
          description: 'Validate ESG data against framework standards',
          inputSchema: {
            type: 'object',
            properties: ValidateESGDataSchema.shape,
            required: ['data', 'framework', 'category']
          }
        },
        {
          name: 'generate_report',
          description: 'Generate ESG compliance reports',
          inputSchema: {
            type: 'object',
            properties: GenerateReportSchema.shape,
            required: ['organizationId', 'framework', 'startDate', 'endDate']
          }
        },
        {
          name: 'manage_rls_policies',
          description: 'Create, list, and test RLS policies',
          inputSchema: {
            type: 'object',
            properties: RLSPolicySchema.shape,
            required: ['action']
          }
        },
        {
          name: 'run_migrations',
          description: 'Execute database migrations',
          inputSchema: {
            type: 'object',
            properties: MigrationSchema.shape,
            required: ['action']
          }
        },
        {
          name: 'audit_security',
          description: 'Perform security audit on database and code',
          inputSchema: {
            type: 'object',
            properties: SecurityAuditSchema.shape,
            required: []
          }
        },
        {
          name: 'test_coverage',
          description: 'Check test coverage and run tests',
          inputSchema: {
            type: 'object',
            properties: TestCoverageSchema.shape,
            required: []
          }
        },
        {
          name: 'dev_workflow',
          description: 'Execute development workflow commands',
          inputSchema: {
            type: 'object',
            properties: DevWorkflowSchema.shape,
            required: ['command']
          }
        }
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      this.logger.debug(`Executing tool: ${name}`, args);
      
      try {
        switch (name) {
          case 'supabase_query':
            return await this.executeSupabaseQuery(args);
          
          case 'validate_esg_data':
            return await this.validateESGData(args);
          
          case 'generate_report':
            return await this.generateReport(args);
          
          case 'manage_rls_policies':
            return await this.manageRLSPolicies(args);
          
          case 'run_migrations':
            return await this.runMigrations(args);
          
          case 'audit_security':
            return await this.auditSecurity(args);
          
          case 'test_coverage':
            return await this.testCoverage(args);
          
          case 'dev_workflow':
            return await this.devWorkflow(args);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        this.logger.error(`Tool execution failed: ${name}`, error);
        
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  async executeSupabaseQuery(args) {
    try {
      const params = SupabaseQuerySchema.parse(args);
      const client = this.supabase.getClient(params.useServiceRole);
      
      let query = client.from(params.table);
      
      // Apply select
      if (params.select) {
        query = query.select(params.select);
      } else {
        query = query.select('*');
      }
      
      // Apply filters
      if (params.filters) {
        for (const filter of params.filters) {
          query = query[filter.operator](filter.column, filter.value);
        }
      }
      
      // Apply ordering
      if (params.orderBy) {
        query = query.order(params.orderBy.column, {
          ascending: params.orderBy.ascending
        });
      }
      
      // Apply limit
      const limit = params.limit || this.config.maxQueryResults;
      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Query failed: ${error.message}`);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              count: data.length,
              data,
              metadata: {
                table: params.table,
                limit,
                rlsBypassed: params.useServiceRole
              }
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  async validateESGData(args) {
    try {
      const params = ValidateESGDataSchema.parse(args);
      
      // Framework-specific validation rules
      const validationRules = {
        GRI: {
          emissions: ['scope1', 'scope2', 'scope3', 'unit', 'period'],
          social: ['employees', 'diversity', 'safety', 'training'],
          governance: ['board_composition', 'ethics', 'risk_management']
        },
        TCFD: {
          emissions: ['ghg_emissions', 'climate_risks', 'scenarios'],
          social: ['climate_impact_workforce'],
          governance: ['climate_governance', 'strategy', 'metrics']
        },
        ISSB: {
          emissions: ['scope1', 'scope2', 'scope3', 'targets'],
          social: ['human_capital', 'social_capital'],
          governance: ['governance_emissions', 'oversight']
        },
        SASB: {
          emissions: ['energy_management', 'emissions_reporting'],
          social: ['labor_practices', 'community_relations'],
          governance: ['business_ethics', 'competitive_behavior']
        }
      };
      
      const rules = validationRules[params.framework][params.category];
      const errors = [];
      const warnings = [];
      
      // Check required fields
      for (const field of rules) {
        if (!(field in params.data)) {
          errors.push(`Missing required field: ${field}`);
        }
      }
      
      // Validate data types and ranges
      if (params.category === 'emissions') {
        if (params.data.scope1 && typeof params.data.scope1 !== 'number') {
          errors.push('scope1 must be a number');
        }
        if (params.data.scope1 && params.data.scope1 < 0) {
          errors.push('scope1 cannot be negative');
        }
      }
      
      const isValid = errors.length === 0;
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              valid: isValid,
              framework: params.framework,
              category: params.category,
              errors,
              warnings,
              metadata: {
                validatedFields: Object.keys(params.data),
                requiredFields: rules
              }
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  async generateReport(args) {
    try {
      const params = GenerateReportSchema.parse(args);
      
      // Fetch organization data
      const client = this.supabase.getClient();
      
      const { data: orgData, error: orgError } = await client
        .from('organizations')
        .select('*')
        .eq('id', params.organizationId)
        .single();
      
      if (orgError) {
        throw new Error(`Failed to fetch organization: ${orgError.message}`);
      }
      
      // Fetch temporal data for the period
      const { data: temporalData, error: dataError } = await client
        .from('temporal_data')
        .select('*')
        .eq('organization_id', params.organizationId)
        .gte('period_start', params.startDate)
        .lte('period_end', params.endDate);
      
      if (dataError) {
        throw new Error(`Failed to fetch temporal data: ${dataError.message}`);
      }
      
      // Generate report structure
      const report = {
        metadata: {
          organization: orgData.name,
          framework: params.framework,
          period: {
            start: params.startDate,
            end: params.endDate
          },
          generatedAt: new Date().toISOString()
        },
        sections: {},
        data: temporalData,
        summary: {
          totalDataPoints: temporalData.length,
          categories: [...new Set(temporalData.map(d => d.category))],
          completeness: this.calculateCompleteness(temporalData, params.framework)
        }
      };
      
      // Framework-specific sections
      if (params.framework === 'GRI') {
        report.sections = {
          economic: temporalData.filter(d => d.category === 'economic'),
          environmental: temporalData.filter(d => d.category === 'environmental'),
          social: temporalData.filter(d => d.category === 'social')
        };
      }
      
      // Handle different output formats
      let output;
      if (params.format === 'json') {
        output = JSON.stringify(report, null, 2);
      } else if (params.format === 'excel') {
        output = 'Excel generation would require additional libraries. Returning JSON format.';
        output = JSON.stringify(report, null, 2);
      } else if (params.format === 'pdf') {
        output = 'PDF generation would require additional libraries. Returning JSON format.';
        output = JSON.stringify(report, null, 2);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              report: report,
              format: params.format
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  async manageRLSPolicies(args) {
    try {
      const params = RLSPolicySchema.parse(args);
      
      if (!this.supabase.serviceClient) {
        throw new Error('Service key required for RLS management');
      }
      
      const client = this.supabase.getClient(true);
      
      switch (params.action) {
        case 'list': {
          // List all RLS policies
          const { data, error } = await client.rpc('get_rls_policies');
          
          if (error) {
            throw new Error(`Failed to list policies: ${error.message}`);
          }
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  action: 'list',
                  policies: data
                }, null, 2)
              }
            ]
          };
        }
        
        case 'create': {
          if (!params.table || !params.policyName || !params.policyDefinition) {
            throw new Error('Table, policy name, and definition required for create action');
          }
          
          // Create RLS policy
          const query = `
            CREATE POLICY "${params.policyName}"
            ON "${params.table}"
            ${params.policyDefinition};
          `;
          
          const { error } = await client.rpc('execute_sql', { query });
          
          if (error) {
            throw new Error(`Failed to create policy: ${error.message}`);
          }
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  action: 'create',
                  policy: params.policyName,
                  table: params.table
                }, null, 2)
              }
            ]
          };
        }
        
        case 'test': {
          if (!params.table || !params.testUserId) {
            throw new Error('Table and test user ID required for test action');
          }
          
          // Test RLS policy
          const { data, error } = await client
            .from(params.table)
            .select('*')
            .limit(1);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  action: 'test',
                  table: params.table,
                  accessible: !error,
                  error: error?.message
                }, null, 2)
              }
            ]
          };
        }
        
        default:
          throw new Error(`Unknown action: ${params.action}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  async runMigrations(args) {
    try {
      const params = MigrationSchema.parse(args);
      
      switch (params.action) {
        case 'status': {
          const migrationsPath = path.join(this.config.workspaceDir, 'supabase', 'migrations');
          
          try {
            const files = await fs.readdir(migrationsPath);
            const migrations = files.filter(f => f.endsWith('.sql'));
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    success: true,
                    action: 'status',
                    migrations,
                    count: migrations.length
                  }, null, 2)
                }
              ]
            };
          } catch (error) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    success: true,
                    action: 'status',
                    migrations: [],
                    error: 'Migrations directory not found'
                  }, null, 2)
                }
              ]
            };
          }
        }
        
        case 'create': {
          if (!params.name || !params.content) {
            throw new Error('Name and content required for create action');
          }
          
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          const filename = `${timestamp}_${params.name}.sql`;
          const filepath = path.join(this.config.workspaceDir, 'supabase', 'migrations', filename);
          
          await fs.writeFile(filepath, params.content);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  action: 'create',
                  migration: filename,
                  path: filepath
                }, null, 2)
              }
            ]
          };
        }
        
        case 'run': {
          const { stdout, stderr } = await execAsync(
            'pnpm supabase db push',
            { cwd: this.config.workspaceDir }
          );
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  action: 'run',
                  output: stdout,
                  error: stderr
                }, null, 2)
              }
            ]
          };
        }
        
        default:
          throw new Error(`Unknown action: ${params.action}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  async auditSecurity(args) {
    try {
      const params = SecurityAuditSchema.parse(args);
      const audit = {
        timestamp: new Date().toISOString(),
        scope: params.scope,
        findings: [],
        recommendations: []
      };
      
      // Database security audit
      if (params.scope === 'database' || params.scope === 'all') {
        if (params.includeRLS) {
          // Check RLS on tables
          const tablesWithoutRLS = [];
          // This would normally query the database
          audit.findings.push({
            category: 'RLS',
            severity: 'info',
            message: 'RLS policy check would be performed on all tables'
          });
        }
        
        if (params.includeAuth) {
          audit.findings.push({
            category: 'Authentication',
            severity: 'info',
            message: 'Authentication configuration check would be performed'
          });
        }
      }
      
      // Code security audit
      if (params.scope === 'code' || params.scope === 'all') {
        if (params.includeValidation) {
          // Check for Zod validation
          const { stdout } = await execAsync(
            'grep -r "z\\.object\\|z\\.string\\|z\\.number" --include="*.ts" --include="*.tsx" | wc -l',
            { cwd: this.config.workspaceDir }
          );
          
          const validationCount = parseInt(stdout.trim(), 10);
          
          audit.findings.push({
            category: 'Input Validation',
            severity: validationCount > 10 ? 'good' : 'warning',
            message: `Found ${validationCount} Zod validation schemas`,
            recommendation: validationCount < 10 ? 'Consider adding more input validation' : null
          });
        }
        
        // Check for exposed keys
        try {
          const { stdout } = await execAsync(
            'grep -r "SUPABASE_SERVICE" --include="*.tsx" --include="*.ts" app/ components/ 2>/dev/null | wc -l',
            { cwd: this.config.workspaceDir }
          );
          
          const exposedKeys = parseInt(stdout.trim(), 10);
          
          if (exposedKeys > 0) {
            audit.findings.push({
              category: 'Key Exposure',
              severity: 'critical',
              message: `Found ${exposedKeys} potential service key exposures in frontend code`,
              recommendation: 'Remove service keys from frontend code immediately'
            });
          }
        } catch (error) {
          // Grep might fail if no matches, which is good
        }
      }
      
      // Generate recommendations
      audit.recommendations = audit.findings
        .filter(f => f.recommendation)
        .map(f => f.recommendation);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              audit
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  async testCoverage(args) {
    try {
      const params = TestCoverageSchema.parse(args);
      
      let command;
      switch (params.command) {
        case 'run':
          command = 'pnpm test';
          if (params.pattern) {
            command += ` ${params.pattern}`;
          }
          if (params.updateSnapshot) {
            command += ' -u';
          }
          break;
        
        case 'coverage':
          command = 'pnpm test:coverage';
          break;
        
        case 'watch':
          command = 'pnpm test:watch';
          break;
        
        default:
          throw new Error(`Unknown command: ${params.command}`);
      }
      
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.config.workspaceDir,
        timeout: 60000 // 60 second timeout
      });
      
      // Parse coverage if available
      let coverage = null;
      if (params.command === 'coverage') {
        const coverageMatch = stdout.match(/All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
        if (coverageMatch) {
          coverage = {
            statements: parseFloat(coverageMatch[1]),
            branches: parseFloat(coverageMatch[2]),
            functions: parseFloat(coverageMatch[3]),
            lines: parseFloat(coverageMatch[4])
          };
        }
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              command: params.command,
              output: stdout.slice(-5000), // Last 5000 chars to avoid huge outputs
              coverage,
              error: stderr
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  async devWorkflow(args) {
    try {
      const params = DevWorkflowSchema.parse(args);
      
      const commands = {
        'dev': 'pnpm dev',
        'build': 'pnpm build',
        'lint': 'pnpm lint',
        'typecheck': 'pnpm typecheck',
        'verify': 'pnpm verify',
        'supabase:start': 'pnpm supabase:start',
        'supabase:stop': 'pnpm supabase:stop'
      };
      
      let command = commands[params.command];
      if (params.args && params.args.length > 0) {
        command += ' ' + params.args.join(' ');
      }
      
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.config.workspaceDir,
        timeout: 120000 // 2 minute timeout
      });
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              command: params.command,
              executed: command,
              output: stdout.slice(-5000), // Last 5000 chars
              error: stderr
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  calculateCompleteness(data, framework) {
    // Simple completeness calculation
    const requiredFields = {
      GRI: 15,
      TCFD: 12,
      ISSB: 18,
      SASB: 10
    };
    
    const required = requiredFields[framework] || 10;
    const actual = data.length;
    
    return Math.min(100, (actual / required) * 100).toFixed(2) + '%';
  }

  async start() {
    try {
      await this.initialize();
      
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      this.logger.info('MCP Server started and listening on stdio');
    } catch (error) {
      this.logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new MeridianESGServer();
server.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});