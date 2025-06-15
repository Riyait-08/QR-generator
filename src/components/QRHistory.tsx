
import React, { useState, useEffect } from 'react';
import { History, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface QRRecord {
  id: string;
  qrString: string;
  timestamp: Date;
  qrDataUrl: string;
}

const QRHistory: React.FC = () => {
  const [history, setHistory] = useState<QRRecord[]>([]);

  const loadHistory = () => {
    console.log('Loading QR history from localStorage');
    const stored = localStorage.getItem('qr-history');
    console.log('Raw stored data:', stored);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        console.log('Parsed history:', parsed);
        setHistory(parsed.slice(-10)); // Keep last 10 items
      } catch (error) {
        console.error('Error parsing QR history:', error);
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'qr-history') {
        console.log('Storage change detected for qr-history');
        loadHistory();
      }
    };
    
    // Listen for custom events from the same page
    const handleCustomStorageEvent = () => {
      console.log('Custom storage event detected');
      loadHistory();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('qr-history-updated', handleCustomStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('qr-history-updated', handleCustomStorageEvent);
    };
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('qr-history');
    setHistory([]);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('qr-history-updated'));
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <History className="h-4 w-4 mr-2" />
            QR History
          </CardTitle>
          <CardDescription>
            Your recently generated QR codes will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No QR codes generated yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            QR History
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </CardTitle>
        <CardDescription>
          Last {history.length} generated QR codes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {history.slice().reverse().map((qr) => (
              <div
                key={qr.id}
                className="flex items-center justify-between p-2 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500">
                    {qr.timestamp.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700 truncate">
                    {qr.qrString.substring(0, 30)}...
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>QR Code Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-center">
                        <img
                          src={qr.qrDataUrl}
                          alt="QR Code"
                          className="mx-auto border border-gray-200 rounded"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Content:</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          {qr.qrString}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Generated: {qr.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QRHistory;
