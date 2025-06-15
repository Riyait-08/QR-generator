
import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataRow {
  [key: string]: any;
}

interface DataPreviewProps {
  data: DataRow[];
  fileName: string;
  onNext: () => void;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, fileName, onNext }) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const previewRows = data.slice(0, 10); // Show first 10 rows

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Data Preview
        </CardTitle>
        <CardDescription>
          Preview of your data from {fileName}. Showing {previewRows.length} of {data.length} rows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="border border-gray-200 px-4 py-2 text-sm text-gray-600 max-w-48 truncate"
                      >
                        {row[column]?.toString() || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>

        {data.length > 10 && (
          <p className="text-sm text-gray-500 mt-4">
            ... and {data.length - 10} more rows
          </p>
        )}

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{data.length}</span> rows with{' '}
            <span className="font-medium">{columns.length}</span> columns detected
          </div>
          <Button onClick={onNext} className="flex items-center">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreview;
