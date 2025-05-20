import React, { useState } from 'react';
import { Upload, X, FileText, Check } from 'lucide-react';
import { parseEmdatCsv } from '../../services/emdat';
import { parseEmdatXlsx } from '../../services/xlsx';
import { DisasterEvent } from '../../types/disaster';
import ErrorBoundary from '../ErrorBoundary';

interface CsvUploadProps {
  onDataParsed: (data: DisasterEvent[]) => void;
}

const CsvUpload: React.FC<CsvUploadProps> = ({ onDataParsed }) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['csv', 'xlsx'].includes(fileExtension)) {
      setError('Please upload a CSV or XLSX file');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setError('');
    setIsSuccess(false);

    try {
      if (fileExtension === 'csv') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const text = e.target?.result as string;
            setFileContent(text);
            const parsedData = await parseEmdatCsv(text);
            console.log('Parsed CSV data:', parsedData.length, 'records');
            onDataParsed(parsedData);
            setIsSuccess(true);
            setError('');
          } catch (err) {
            console.error('CSV parsing error:', err);
            setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
            setIsSuccess(false);
          } finally {
            setIsProcessing(false);
          }
        };
        reader.readAsText(file);
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const parsedData = await parseEmdatXlsx(arrayBuffer);
            console.log('Parsed XLSX data:', parsedData.length, 'records');
            onDataParsed(parsedData);
            setIsSuccess(true);
            setError('');
          } catch (err) {
            console.error('XLSX parsing error:', err);
            setError(err instanceof Error ? err.message : 'Failed to parse XLSX file');
            setIsSuccess(false);
          } finally {
            setIsProcessing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      console.error('File reading error:', err);
      setError('Error reading file. Please try again.');
      setIsSuccess(false);
      setIsProcessing(false);
    }
  };

  const handleTextAreaChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setFileContent(text);
    if (!text.trim()) {
      setError('');
      setIsSuccess(false);
      return;
    }

    setIsProcessing(true);
    try {
      const parsedData = await parseEmdatCsv(text);
      console.log('Parsed text data:', parsedData.length, 'records');
      onDataParsed(parsedData);
      setIsSuccess(true);
      setError('');
    } catch (err) {
      console.error('Text parsing error:', err);
      setError('Failed to parse CSV data. Please check the format.');
      setIsSuccess(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearData = () => {
    setFileContent('');
    setFileName('');
    setError('');
    setIsSuccess(false);
    onDataParsed([]);
  };

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload EMDAT Data</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-700">Choose CSV or XLSX file</span>
            </label>
            {fileName && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-1" />
                <span className="truncate">{fileName}</span>
                <button
                  onClick={clearData}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  title="Remove file"
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              {isSuccess && <Check className="w-5 h-5 text-green-500" />}
            </div>
            <textarea
              value={fileContent}
              onChange={handleTextAreaChange}
              placeholder="Or paste your CSV data here..."
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              disabled={isProcessing}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          {isSuccess && (
            <div className="text-green-600 text-sm">
              Data successfully parsed!
            </div>
          )}

          {isProcessing && (
            <div className="text-primary-600 text-sm flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
              Processing data...
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CsvUpload;