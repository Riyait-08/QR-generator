import React, { useState } from 'react';
import { ArrowRight, Upload, Settings, Download, QrCode, FileText, Zap, Shield, Globe, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import DemoModal from '@/components/DemoModal';

const Landing = () => {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: Upload,
      title: "Multiple File Formats",
      description: "Support for Excel (.xlsx), CSV, and JSON files. Upload your data in any format."
    },
    {
      icon: Settings,
      title: "Customizable QR Codes",
      description: "Choose which columns to include and customize QR code size to fit your needs."
    },
    {
      icon: Download,
      title: "PDF Export",
      description: "Export all generated QR codes to a professional PDF document with one click."
    },
    {
      icon: Zap,
      title: "Fast Generation",
      description: "Generate hundreds of QR codes in seconds with our optimized processing engine."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is processed locally in your browser. No data is sent to external servers."
    },
    {
      icon: Globe,
      title: "Universal Access",
      description: "Works on any device with a web browser. No installation required."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <QrCode className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">QR Nexus Creator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </Link>
            <Link to="/generator">
              <Button>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <QrCode className="h-20 w-20 text-blue-600 mx-auto mb-6" />
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Transform Your Data Into QR Codes
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload your Excel, CSV, or JSON files and generate professional QR codes in seconds. 
              Perfect for inventory management, event tickets, product catalogs, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generator">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Creating QR Codes
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => setShowDemo(true)}
              >
                <FileText className="h-5 w-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Everything You Need to Generate QR Codes
            </h3>
            <p className="text-lg text-gray-600">
              Powerful features designed to make QR code generation simple and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              How It Works
            </h3>
            <p className="text-lg text-gray-600">
              Generate QR codes from your data in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Upload, title: "Upload File", description: "Upload your Excel, CSV, or JSON file" },
              { icon: FileText, title: "Preview Data", description: "Review your data in an organized table view" },
              { icon: Settings, title: "Configure QR", description: "Select columns and customize QR code settings" },
              { icon: Download, title: "Export PDF", description: "Download your QR codes as a professional PDF" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust QR Nexus Creator for their QR code generation needs.
          </p>
          <Link to="/generator">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Create Your First QR Code
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">QR Nexus Creator</span>
          </div>
          <p className="text-gray-400">
            Transform your data into QR codes with ease. Built with modern web technologies.
          </p>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoModal open={showDemo} onOpenChange={setShowDemo} />
    </div>
  );
};

export default Landing;
