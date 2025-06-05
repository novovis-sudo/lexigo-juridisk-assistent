
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f11] via-[#151517] to-[#1a1a1d] relative">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mb-8 accent-glow">
            <Scale className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-5xl font-serif font-semibold text-white mb-6 tracking-tight text-gradient">
            Dokumentjämförelse
          </h2>
          <p className="text-xl text-dark-300 font-sans max-w-3xl mx-auto leading-relaxed">
            Jämför två dokument och hitta skillnader, svagheter och juridiska konflikter
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-lg accent-glow">
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
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg accent-glow">
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

        <div className="text-center mb-12">
          <Button 
            onClick={handleCompare}
            disabled={isComparing || filesA.length === 0 || filesB.length === 0}
            className="premium-button text-xl px-12 py-5"
          >
            {isComparing ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Jämför dokument...
              </>
            ) : (
              <>
                <Scale className="mr-3 h-6 w-6" />
                Jämför dokument
              </>
            )}
          </Button>
        </div>

        <Card className="premium-card p-10">
          <h3 className="text-2xl font-serif font-semibold text-white mb-8">
            Jämförelseresultat
          </h3>
          {comparisonResult ? (
            <div className="bg-[#1a1a1d] border border-[#232329] p-8 rounded-xl">
              <pre className="whitespace-pre-wrap text-sm text-dark-200 font-sans leading-relaxed">
                {comparisonResult}
              </pre>
            </div>
          ) : (
            <div className="text-center text-dark-400 py-24">
              <Scale className="mx-auto h-20 w-20 text-dark-500 mb-8" />
              <p className="text-lg font-sans">
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
