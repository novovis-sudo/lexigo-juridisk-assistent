
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Scale, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FileService } from '@/services/fileService';
import { DocumentService } from '@/services/documentService';
import { DocumentProcessor } from '@/utils/documentProcessor';
import { DocumentType, UrgencyLevel } from '@/types/legal';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
      console.log('File selected:', file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Ingen fil vald",
        description: "Vänligen välj en fil först",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log('Starting file upload process...');
      
      // Upload file to storage
      const fileUrl = await FileService.uploadFile(selectedFile, 'legal-documents');
      console.log('File uploaded to storage:', fileUrl);
      
      // Extract text content (placeholder for now)
      const textContent = await DocumentProcessor.extractTextFromFile(selectedFile);
      console.log('Text extracted from file');
      
      // Detect document type
      const documentType = DocumentProcessor.detectDocumentType(selectedFile.name, textContent);
      console.log('Document type detected:', documentType);
      
      // Assess urgency
      const urgencyLevel = DocumentProcessor.assessUrgency(textContent, documentType);
      console.log('Urgency level assessed:', urgencyLevel);
      
      // Store document in database
      const documentData = {
        type: documentType,
        content: textContent,
        metadata: {
          filename: selectedFile.name,
          language: 'sv' as const,
          confidence: 0.8,
          parties: [],
          dates: [],
          amounts: [],
          keywords: [],
          urgency_level: urgencyLevel
        }
      };
      
      const storedDocument = await DocumentService.storeDocument(documentData);
      console.log('Document stored in database:', storedDocument.id);
      
      setUploadSuccess(true);
      toast({
        title: "Dokument uppladdat!",
        description: `${selectedFile.name} har analyserats och sparats framgångsrikt.`,
      });
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Uppladdning misslyckades",
        description: "Ett fel uppstod vid uppladdning av dokumentet. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
          <p className="text-xl text-gray-600">Din AI-drivna juridiska assistent</p>
          <p className="text-gray-500 mt-2">Ladda upp dokument för analys och få juridiska insikter</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Dokumentuppladdning
            </CardTitle>
            <CardDescription>
              Ladda upp dina juridiska dokument för AI-driven analys och insikter
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
                  disabled={isUploading}
                />
                <p className="text-sm text-gray-500">
                  Stödda format: PDF, DOC, DOCX, TXT
                </p>
              </div>
            </div>

            {/* Selected File Display */}
            {selectedFile && (
              <div className={`border rounded-lg p-4 ${uploadSuccess ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {uploadSuccess ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    )}
                    <span className={`font-medium ${uploadSuccess ? 'text-green-900' : 'text-blue-900'}`}>
                      {selectedFile.name}
                    </span>
                  </div>
                  <span className={`text-sm ${uploadSuccess ? 'text-green-600' : 'text-blue-600'}`}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                {uploadSuccess && (
                  <p className="text-sm text-green-600 mt-2">
                    Dokumentet har analyserats och sparats framgångsrikt!
                  </p>
                )}
              </div>
            )}

            {/* Upload Button */}
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyserar dokument...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFile ? 'Analysera dokument' : 'Välj en fil för att fortsätta'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Dokumentanalys</h3>
              <p className="text-sm text-gray-600 mt-1">AI-driven dokumentgranskning och insikter</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Scale className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Juridisk forskning</h3>
              <p className="text-sm text-gray-600 mt-1">Omedelbar tillgång till relevant juridisk information</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Upload className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Snabb uppladdning</h3>
              <p className="text-sm text-gray-600 mt-1">Snabb och säker dokumentbehandling</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
