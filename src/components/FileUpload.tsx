
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Upload, FileX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface DataRow {
  [key: string]: any;
}

interface FileUploadProps {
  onFileUpload: (data: DataRow[], columns: string[], fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const { toast } = useToast();

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let parsedData: DataRow[] = [];
        let columns: string[] = [];

        if (file.name.endsWith('.json')) {
          const jsonData = JSON.parse(data as string);
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            parsedData = jsonData;
            columns = Object.keys(jsonData[0]);
          }
        } else if (file.name.endsWith('.csv')) {
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
          if (parsedData.length > 0) {
            columns = Object.keys(parsedData[0]);
          }
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
          if (parsedData.length > 0) {
            columns = Object.keys(parsedData[0]);
          }
        }

        if (parsedData.length === 0) {
          throw new Error('No data found in file');
        }

        onFileUpload(parsedData, columns, file.name);
      } catch (error) {
        toast({
          title: "Error processing file",
          description: "Please ensure your file is a valid Excel, CSV, or JSON file with data.",
          variant: "destructive",
        });
      }
    };

    if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, [onFileUpload, toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Your Data File
        </CardTitle>
        <CardDescription>
          Upload an Excel (.xlsx, .xls), CSV, or JSON file to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            {isDragActive ? (
              <>
                <Upload className="h-12 w-12 text-blue-500" />
                <p className="text-lg font-medium text-blue-600">Drop your file here!</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Drag & drop your file here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to browse
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  Supports: .xlsx, .xls, .csv, .json
                </div>
              </>
            )}
          </div>
        </div>

        {fileRejections.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <FileX className="h-4 w-4 text-red-500 mr-2" />
              <p className="text-sm text-red-600">
                File type not supported. Please upload Excel, CSV, or JSON files only.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
