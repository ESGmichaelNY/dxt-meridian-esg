import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
// @ts-expect-error - no types available
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import nextPlugin from '@next/eslint-plugin-next'

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/generated.ts',
      '**/supabase/functions/**',
      'scripts/**/*.js',
      'scripts/**/*.mjs',
      'scripts/**/*.sh',
      'drizzle/**/*.sql',
      'dxt-meridian-esg/**',
      'next-env.d.ts'
    ]
  },
  
  // Base config for all files
  js.configs.recommended,
  
  // TypeScript config
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  
  // Configure TypeScript parser
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  
  // React and Next.js config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin
    },
    settings: {
      react: {
        version: '19.0.0'
      }
    },
    rules: {
      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      
      // TypeScript strict rules (practical configuration)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true
      }],
      // Allow non-null assertions for environment variables and other guaranteed values
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Configure nullish coalescing to be more practical
      '@typescript-eslint/prefer-nullish-coalescing': ['error', {
        ignoreTernaryTests: true,
        ignoreConditionalTests: true,
        ignoreMixedLogicalExpressions: true
      }],
      // Allow unsafe operations in specific contexts
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports'
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-floating-promises': ['error', {
        ignoreVoid: true,
        ignoreIIFE: true
      }],
      '@typescript-eslint/no-misused-promises': ['error', {
        checksVoidReturn: {
          attributes: false
        }
      }],
      
      // General code quality rules
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      
      // Enforce exemplar patterns
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@/lib/supabase/service'],
            message: 'Service client can only be imported in server-side code'
          }
        ]
      }],
      
      // React Hooks exhaustive deps
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    }
  },
  
  // Server-side only files
  {
    files: ['**/*.server.ts', '**/api/**/*.ts', 'middleware.ts', '**/webhooks/**/*.ts'],
    rules: {
      // Allow console in server-side code for logging
      'no-console': 'off',
      // More lenient for server-side code
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off'
    }
  },
  
  // Environment and config files
  {
    files: ['**/*.config.ts', '**/*.config.js', '**/*.config.mjs', '**/env.ts'],
    rules: {
      // Allow non-null assertions for config files
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Allow || for environment variables
      '@typescript-eslint/prefer-nullish-coalescing': 'off'
    }
  },
  
  // Database and schema files
  {
    files: ['**/schema.ts', '**/db/**/*.ts', '**/drizzle/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  
  // Test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/test/**', '**/__tests__/**', '**/tests/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-console': 'off'
    }
  },
  
  // Generated files and types
  {
    files: ['**/generated.ts', '**/types/**/*.ts', 'next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
)