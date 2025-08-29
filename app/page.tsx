import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Globe className="h-7 w-7 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">Meridian ESG</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                Documentation
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/sign-in" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link 
                href="/sign-up"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                What&apos;s new: Just shipped v2.0 →
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                ESG Data
                <br />
                Management for
                <br />
                Modern
                <br />
                Organizations
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your sustainability reporting with our comprehensive ESG platform. 
                Track, analyze, and report on environmental, social, and governance metrics 
                with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/sign-up"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Start free trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/demo"
                  className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Request demo →
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl">
                <div className="aspect-[4/3] bg-white rounded-lg shadow-sm p-6">
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-sm">App screenshot</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for ESG compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for modern organizations that take sustainability seriously
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Tracking
              </h3>
              <p className="text-gray-600">
                Monitor all ESG metrics in one place with automated data collection and real-time dashboards.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Framework Compliance
              </h3>
              <p className="text-gray-600">
                Stay compliant with GRI, TCFD, SASB, and other major reporting frameworks automatically.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Global Standards
              </h3>
              <p className="text-gray-600">
                Report with confidence using internationally recognized standards and methodologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to transform your ESG reporting?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join leading organizations already using Meridian ESG to streamline their sustainability journey.
          </p>
          <Link 
            href="/sign-up"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Get started for free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">Meridian ESG</span>
              </div>
              <p className="text-gray-600 text-sm">
                Making sustainability reporting simple and effective.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-gray-900">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-gray-900">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
                <li><Link href="/security" className="hover:text-gray-900">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-gray-900">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © 2025 Meridian ESG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}