
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Lightbulb, AlertTriangle, Scale, Clock, ExternalLink } from 'lucide-react';
import { LexigoAnalysisResponse } from '@/services/lexigoAIService';
import { getUrgencyColor } from '../utils/chatUtils';

interface AnalysisResultsProps {
  analysis: LexigoAnalysisResponse;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  return (
    <div className="mt-3 space-y-3">
      {/* Urgency Badge */}
      <div className="flex items-center gap-2">
        <Badge className={`${getUrgencyColor(analysis.urgency)} flex items-center gap-1`}>
          <Clock className="h-3 w-3" />
          {analysis.urgency === 'critical' ? 'Kritisk' :
           analysis.urgency === 'high' ? 'Hög' :
           analysis.urgency === 'medium' ? 'Medel' : 'Låg'} prioritet
        </Badge>
      </div>

      {/* Summary Card */}
      <Card className="bg-white border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Sammanfattning
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-700">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Key Points */}
      {analysis.keyPoints && analysis.keyPoints.length > 0 && (
        <Card className="bg-white border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Viktiga punkter
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="list-disc list-inside space-y-1">
              {analysis.keyPoints.map((point, idx) => (
                <li key={idx} className="text-sm text-gray-700">{point}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses && analysis.weaknesses.length > 0 && (
        <Card className="bg-white border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Identifierade svagheter
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="list-disc list-inside space-y-1">
              {analysis.weaknesses.map((weakness, idx) => (
                <li key={idx} className="text-sm text-gray-700">{weakness}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Legal References */}
      {analysis.legalReferences && analysis.legalReferences.length > 0 && (
        <Card className="bg-white border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Juridiska referenser
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {analysis.legalReferences.map((ref, idx) => (
                <div key={idx} className="text-sm border-l-2 border-purple-300 pl-2">
                  <div className="font-medium">{ref.law} {ref.section}</div>
                  <div className="text-gray-600">{ref.description}</div>
                  {ref.url && (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {ref.source}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deadlines */}
      {analysis.deadlines && analysis.deadlines.length > 0 && (
        <Card className="bg-white border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Viktiga tidsfrister
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="list-disc list-inside space-y-1">
              {analysis.deadlines.map((deadline, idx) => (
                <li key={idx} className="text-sm text-orange-700 font-medium">{deadline}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResults;
