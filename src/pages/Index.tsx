import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Upload, FileText, Settings, Download, QrCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import QRGenerator from '@/components/QRGenerator';
import QRHistory from '@/components/QRHistory';
import UserProfile from '@/components/UserProfile';

interface DataRow {
  [key: string]: any;
}

interface QRRecord {
  id: string;
  qrString: string;
  timestamp: Date;
  qrDataUrl: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedData, setUploadedData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [qrSize, setQrSize] = useState(200);
  const [generatedQRs, setGeneratedQRs] = useState<QRRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileUpload = useCallback((data: DataRow[], cols: string[], name: string) => {
    setUploadedData(data);
    setColumns(cols);
    setFileName(name);
    setSelectedColumns(cols.slice(0, 3)); // Select first 3 columns by default
    setCurrentStep(2);
    toast({
      title: "File uploaded successfully!",
      description: `Loaded ${data.length} rows with ${cols.length} columns.`,
    });
  }, [toast]);

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const generateQRCodes = async () => {
    if (selectedColumns.length === 0) {
      toast({
        title: "No columns selected",
        description: "Please select at least one column to generate QR codes.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const newQRs: QRRecord[] = [];

    try {
      for (let i = 0; i < uploadedData.length; i++) {
        const row = uploadedData[i];
        const qrString = selectedColumns
          .map(col => `${col}: ${row[col] || ''}`)
          .join(' | ');
        
        const qrDataUrl = await QRCode.toDataURL(qrString, {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        const qrRecord: QRRecord = {
          id: `qr-${Date.now()}-${i}`,
          qrString,
          timestamp: new Date(),
          qrDataUrl
        };

        newQRs.push(qrRecord);
      }

      // Save all QR codes to localStorage for history
      const existingHistory = JSON.parse(localStorage.getItem('qr-history') || '[]');
      const updatedHistory = [...existingHistory, ...newQRs];
      localStorage.setItem('qr-history', JSON.stringify(updatedHistory));
      
      // Dispatch custom event to notify QRHistory component
      window.dispatchEvent(new CustomEvent('qr-history-updated'));
      
      console.log('QR codes saved to localStorage:', updatedHistory);

      setGeneratedQRs(newQRs);
      setCurrentStep(4);
      toast({
        title: "QR codes generated!",
        description: `Successfully generated ${newQRs.length} QR codes.`,
      });
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast({
        title: "Generation failed",
        description: "An error occurred while generating QR codes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    if (generatedQRs.length === 0) return;

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const qrSizeInPDF = 60;
      const cols = 2;
      const rows = Math.ceil(generatedQRs.length / cols);
      
      pdf.setFontSize(16);
      pdf.text('Generated QR Codes', margin, margin);
      pdf.setFontSize(10);
      pdf.text(`Generated from: ${fileName}`, margin, margin + 10);
      pdf.text(`Date: ${new Date().toLocaleString()}`, margin, margin + 15);

      let currentY = margin + 30;
      
      for (let i = 0; i < generatedQRs.length; i++) {
        const qr = generatedQRs[i];
        const col = i % cols;
        const x = margin + col * (qrSizeInPDF + 30);
        
        if (col === 0 && i > 0) {
          currentY += qrSizeInPDF + 20;
        }
        
        if (currentY + qrSizeInPDF > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        
        // Add QR code
        pdf.addImage(qr.qrDataUrl, 'PNG', x, currentY, qrSizeInPDF, qrSizeInPDF);
        
        // Add text below QR code
        pdf.setFontSize(8);
        const textLines = pdf.splitTextToSize(qr.qrString, qrSizeInPDF);
        pdf.text(textLines, x, currentY + qrSizeInPDF + 5);
      }
      
      pdf.save(`qr-codes-${Date.now()}.pdf`);
      
      toast({
        title: "PDF exported!",
        description: "QR codes have been exported to PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred while exporting to PDF.",
        variant: "destructive",
      });
    }
  };

  const steps = [
    { number: 1, title: "Upload File", icon: Upload, completed: currentStep > 1 },
    { number: 2, title: "Preview Data", icon: FileText, completed: currentStep > 2 },
    { number: 3, title: "Configure QR", icon: Settings, completed: currentStep > 3 },
    { number: 4, title: "Generate & Export", icon: Download, completed: currentStep > 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center flex-1">
              <QrCode className="h-10 w-10 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">QR Nexus Creator</h1>
            </div>
            <div className="flex items-center">
              <UserProfile />
            </div>
          </div>
          <p className="text-lg text-gray-600">Transform your data into QR codes with ease</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === step.number 
                    ? 'bg-blue-600 text-white' 
                    : step.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-px w-8 ${step.completed ? 'bg-green-300' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <FileUpload onFileUpload={handleFileUpload} />
            )}

            {currentStep === 2 && (
              <DataPreview 
                data={uploadedData} 
                fileName={fileName}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Configure QR Generation
                  </CardTitle>
                  <CardDescription>
                    Select columns to include in QR codes and customize settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Select Columns to Include
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {columns.map((column) => (
                        <div key={column} className="flex items-center space-x-2">
                          <Checkbox
                            id={column}
                            checked={selectedColumns.includes(column)}
                            onCheckedChange={() => handleColumnToggle(column)}
                          />
                          <Label htmlFor={column} className="text-sm truncate">
                            {column}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="qr-size" className="text-sm font-medium text-gray-700">
                      QR Code Size (pixels)
                    </Label>
                    <Input
                      id="qr-size"
                      type="number"
                      min="100"
                      max="500"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="mt-1 w-32"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={generateQRCodes}
                      disabled={isGenerating || selectedColumns.length === 0}
                    >
                      {isGenerating ? "Generating..." : "Generate QR Codes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <QRGenerator 
                qrs={generatedQRs}
                onExportPDF={exportToPDF}
                onBack={() => setCurrentStep(3)}
                onNewFile={() => {
                  setCurrentStep(1);
                  setUploadedData([]);
                  setGeneratedQRs([]);
                }}
              />
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            {uploadedData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Rows:</span>
                    <span className="font-medium">{uploadedData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Columns:</span>
                    <span className="font-medium">{columns.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Selected:</span>
                    <span className="font-medium">{selectedColumns.length}</span>
                  </div>
                  {generatedQRs.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">QR Codes:</span>
                      <span className="font-medium">{generatedQRs.length}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* QR History */}
            <QRHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
