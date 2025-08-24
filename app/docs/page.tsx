import { ArrowRight, BookOpen, Code2, FileText, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        API Documentation
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Use the Meridian ESG API to access ESG data, manage organizations, generate reports, 
        and seamlessly integrate sustainability tracking into your workflows.
      </p>

      <div className="flex gap-4 mb-12 not-prose">
        <Link 
          href="/docs/quickstart"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quickstart
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link 
          href="/docs/api"
          className="inline-flex items-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Explore API
        </Link>
      </div>

      <section id="getting-started" className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Getting started
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          To get started, create a new application in your{' '}
          <Link href="/dashboard/settings" className="text-blue-600 hover:underline">
            developer settings
          </Link>
          , then read about how to make requests for the resources you need to access using our 
          HTTP APIs or dedicated client SDKs. When your integration is ready to go live, publish 
          it to our{' '}
          <Link href="/integrations" className="text-blue-600 hover:underline">
            integrations directory
          </Link>
          {' '}to reach the Meridian ESG community.
        </p>

        <Link href="/docs/api" className="text-blue-600 hover:underline inline-flex items-center">
          Get your API key
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </section>

      <section id="guides" className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Guides
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 not-prose">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Authentication</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Learn how to authenticate your API requests.
            </p>
            <Link href="/docs/authentication" className="text-blue-600 hover:underline text-sm inline-flex items-center">
              Read more
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Data Management</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Understand how to work with ESG data endpoints.
            </p>
            <Link href="/docs/data-management" className="text-blue-600 hover:underline text-sm inline-flex items-center">
              Read more
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Webhooks</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Read about the different types of webhook events.
            </p>
            <Link href="/docs/api/webhooks" className="text-blue-600 hover:underline text-sm inline-flex items-center">
              Read more
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      <section id="resources" className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Resources
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 not-prose">
          <Link href="/docs/api" className="block group">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-start">
                <Code2 className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                    API Reference
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Complete reference documentation for all API endpoints, including request/response examples.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/docs/guides/best-practices" className="block group">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-start">
                <BookOpen className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                    Best Practices
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Learn the recommended patterns and practices for building robust ESG integrations.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section id="examples" className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Examples
        </h2>
        
        <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto not-prose">
          <pre className="text-sm text-gray-300">
            <code>{`// Authenticate and get organization data
const response = await fetch('https://api.meridian-esg.com/v1/organizations', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const organizations = await response.json();
console.log(organizations);`}</code>
          </pre>
        </div>
      </section>
    </div>
  )
}