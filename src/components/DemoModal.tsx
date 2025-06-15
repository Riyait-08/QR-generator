
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Settings, Download, ArrowRight } from 'lucide-react';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const demoSteps = [
    {
      step: 1,
      title: "Upload Your Data File",
      description: "Start by uploading an Excel (.xlsx), CSV, or JSON file containing your data. For example, a product inventory or customer list.",
      icon: Upload,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&auto=format",
      details: [
        "Supports Excel (.xlsx), CSV, and JSON formats",
        "Automatically detects columns and data types",
        "Preview your data before proceeding"
      ]
    },
    {
      step: 2,
      title: "Preview & Select Data",
      description: "Review your uploaded data in a clean table format and select which columns you want to include in your QR codes.",
      icon: FileText,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop&auto=format",
      details: [
        "Interactive data table preview",
        "Select specific columns for QR codes",
        "See real-time data formatting"
      ]
    },
    {
      step: 3,
      title: "Configure QR Settings",
      description: "Customize your QR codes by choosing which data columns to include and adjusting the size to fit your needs.",
      icon: Settings,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&auto=format",
      details: [
        "Choose which columns to encode",
        "Adjust QR code size",
        "Preview generated codes"
      ]
    },
    {
      step: 4,
      title: "Generate & Export",
      description: "Generate QR codes for all your data rows and export them as a professional PDF document ready for printing or sharing.",
      icon: Download,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&auto=format",
      details: [
        "Batch generate hundreds of QR codes",
        "Export to professional PDF format",
        "Include data labels with each code"
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">How QR Nexus Creator Works</DialogTitle>
          <DialogDescription>
            Follow these simple steps to transform your data into professional QR codes
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 mt-6">
          {demoSteps.map((step, index) => (
            <div key={step.step} className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Step {step.step}: {step.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="lg:w-1/2">
                <img
                  src={step.image}
                  alt={`Step ${step.step} demonstration`}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Sample Use Cases</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-blue-700">Inventory Management</strong>
              <p className="text-blue-600">Create QR codes for product SKUs, names, and descriptions</p>
            </div>
            <div>
              <strong className="text-blue-700">Event Tickets</strong>
              <p className="text-blue-600">Generate unique QR codes for attendee information</p>
            </div>
            <div>
              <strong className="text-blue-700">Contact Cards</strong>
              <p className="text-blue-600">Convert contact lists into scannable QR codes</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button onClick={() => onOpenChange(false)} className="mr-3">
            Close Demo
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/generator'}>
            Try It Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
