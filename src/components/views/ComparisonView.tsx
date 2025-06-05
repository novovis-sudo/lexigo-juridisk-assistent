
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Scale } from 'lucide-react';
import SmartUploadArea from '../SmartUploadArea';
import { useToast } from '@/hooks/use-toast';
import { LexigoEngine } from '../../services/lexigoEngine';

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

const ComparisonView = () => {
  const [filesA, setFilesA] = useState<UploadedFile[]>([]);
  const [filesB, setFilesB] = useState<UploadedFile[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string>('');
  const { toast } = useToast();

  const handleCompare = async () => {
    if (filesA.length === 0 || filesB.length === 0) {
      toast({
        title: "Ofullständig uppladdning",
        description: "Vänligen ladda upp ett dokument i varje område för jämförelse.",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    try {
      // Process both documents
      const docA = await LexigoEngine.processDocumentWithOCR(filesA[0].file);
      const docB = await LexigoEngine.processDocumentWithOCR(filesB[0].file);

      // Create comparison instruction
      const comparisonInstruction = `Jämför dessa två dokument och identifiera:
1. Viktiga skillnader mellan dokumenten
2. Juridiska styrkor och svagheter i varje dokument
3. Potentiella konflikter eller motsägelser
4. Rekommendationer baserat på svensk lag

DOKUMENT A: ${docA.content.substring(0, 1000)}...
DOKUMENT B: ${docB.content.substring(0, 1000)}...`;

      const analysis = await LexigoEngine.answerLegalQuestionWithAnalysis(
        comparisonInstruction,
        'administrative_law' as any,
        `${docA.content}\n\n--- JÄMFÖRELSE ---\n\n${docB.content}`
      );

      setComparisonResult(`
JÄMFÖRELSERESULTAT

${analysis.advice.answer}

REKOMMENDERADE ÅTGÄRDER:
${analysis.advice.practical_steps?.map(step => `• ${step}`).join('\n') || 'Inga specifika åtgärder rekommenderade.'}

VIKTIGA OBSERVATIONER:
${analysis.advice.warnings?.map(warning => `⚠️ ${warning}`).join('\n') || 'Inga kritiska observationer.'}

UPPFÖLJNING:
${analysis.advice.follow_up_questions?.map(q => `? ${q}`).join('\n') || 'Inga uppföljningsfrågor.'}
      `);

      toast({
        title: "Jämförelse slutförd",
        description: "Dokumenten har jämförts framgångsrikt."
      });
    } catch (error) {
      console.error('Comparison error:', error);
      toast({
        title: "Jämförelse misslyckades",
        description: "Ett fel uppstod vid jämförelsen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-50 via-parchment-100 to-parchment-200 relative">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30 wood-texture pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12 space-y-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl mb-6 shadow-gold-glow">
            <Scale className="h-8 w-8 text-ebony-950" />
          </div>
          <h2 className="text-4xl font-serif font-semibold text-ebony-950 mb-4 tracking-tight">
            Dokumentjämförelse
          </h2>
          <p className="text-lg text-charcoal-600 font-legal max-w-2xl mx-auto">
            Jämför två dokument och hitta skillnader, svagheter och juridiska konflikter
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium">
                Dokument A
              </div>
            </div>
            <SmartUploadArea 
              onFilesChange={setFilesA}
              maxFiles={1}
              title="Ladda upp första dokumentet"
            />
          </div>

          <div>
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium">
                Dokument B
              </div>
            </div>
            <SmartUploadArea 
              onFilesChange={setFilesB}
              maxFiles={1}
              title="Ladda upp andra dokumentet"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <Button 
            onClick={handleCompare}
            disabled={isComparing || filesA.length === 0 || filesB.length === 0}
            className="premium-button text-lg px-8 py-4"
          >
            {isComparing ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Jämför dokument...
              </>
            ) : (
              <>
                <Scale className="mr-3 h-5 w-5" />
                Jämför dokument
              </>
            )}
          </Button>
        </div>

        <Card className="premium-card p-8">
          <h3 className="text-xl font-serif font-semibold text-ebony-950 mb-6">
            Jämförelseresultat
          </h3>
          {comparisonResult ? (
            <div className="bg-parchment-100 border border-parchment-300 p-6 rounded-xl">
              <pre className="whitespace-pre-wrap text-sm text-ebony-950 font-legal leading-relaxed">
                {comparisonResult}
              </pre>
            </div>
          ) : (
            <div className="text-center text-charcoal-500 py-20">
              <Scale className="mx-auto h-16 w-16 text-charcoal-300 mb-6" />
              <p className="text-lg font-legal">
                Jämförelseresultat kommer att visas här efter bearbetning
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ComparisonView;
