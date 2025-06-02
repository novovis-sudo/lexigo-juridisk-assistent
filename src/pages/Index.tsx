
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Scale } from 'lucide-react';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      // TODO: Implement actual upload logic later
      alert(`File "${selectedFile.name}" ready for upload!`);
    } else {
      alert('Please select a file first');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Lexigo</h1>
          </div>
          <p className="text-xl text-gray-600">Your AI-Powered Legal Assistant</p>
          <p className="text-gray-500 mt-2">Upload documents for analysis and get instant legal insights</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Document Upload
            </CardTitle>
            <CardDescription>
              Upload your legal documents for AI-powered analysis and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="max-w-xs mx-auto"
                />
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX, TXT
                </p>
              </div>
            </div>

            {/* Selected File Display */}
            {selectedFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">{selectedFile.name}</span>
                  </div>
                  <span className="text-sm text-blue-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={!selectedFile}
            >
              <Upload className="h-4 w-4 mr-2" />
              {selectedFile ? 'Analyze Document' : 'Select a file to continue'}
            </Button>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Document Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">AI-powered document review and insights</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Scale className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Legal Research</h3>
              <p className="text-sm text-gray-600 mt-1">Instant access to relevant legal information</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Upload className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Quick Upload</h3>
              <p className="text-sm text-gray-600 mt-1">Fast and secure document processing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
