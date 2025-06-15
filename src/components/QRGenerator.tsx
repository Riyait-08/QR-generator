
import React from 'react';
import { Download, ArrowLeft, Plus, QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QRRecord {
  id: string;
  qrString: string;
  timestamp: Date;
  qrDataUrl: string;
}

interface QRGeneratorProps {
  qrs: QRRecord[];
  onExportPDF: () => void;
  onBack: () => void;
  onNewFile: () => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({
  qrs,
  onExportPDF,
  onBack,
  onNewFile
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          Generated QR Codes
        </CardTitle>
        <CardDescription>
          Successfully generated {qrs.length} QR codes. Preview and export below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qrs.map((qr, index) => (
              <div
                key={qr.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="text-center mb-2">
                  <div className="text-xs text-gray-500 mb-2">QR #{index + 1}</div>
                  <img
                    src={qr.qrDataUrl}
                    alt={`QR Code ${index + 1}`}
                    className="mx-auto border border-gray-100 rounded"
                    style={{ maxWidth: '120px', height: 'auto' }}
                  />
                </div>
                <div className="text-xs text-gray-600 break-words">
                  <div className="font-medium text-gray-700 mb-1">Content:</div>
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    {qr.qrString.length > 50 
                      ? `${qr.qrString.substring(0, 50)}...` 
                      : qr.qrString
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          <Button onClick={onExportPDF} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
          <Button variant="outline" onClick={onNewFile}>
            <Plus className="h-4 w-4 mr-2" />
            New File
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Export Information</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>• PDF will contain all {qrs.length} QR codes</div>
            <div>• Each QR code will include its content text</div>
            <div>• QR codes are arranged in a 2-column grid layout</div>
            <div>• Generated on {new Date().toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
