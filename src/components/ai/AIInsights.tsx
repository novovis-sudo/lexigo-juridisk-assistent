
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'urgent';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

interface AIInsightsProps {
  insights?: Insight[];
  showConfidence?: boolean;
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
  insights = [], 
  showConfidence = true 
}) => {
  const defaultInsights: Insight[] = [
    {
      id: '1',
      type: 'success',
      title: 'Stark juridisk position',
      description: 'Din situation har goda förutsättningar för framgång baserat på svensk rättspraxis.',
      confidence: 85,
      priority: 'high',
      action: 'Se detaljerad analys'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Viktiga tidsfrister',
      description: 'Du har 3 veckor kvar att överklaga beslutet enligt förvaltningslagen.',
      confidence: 95,
      priority: 'high',
      action: 'Planera åtgärder'
    },
    {
      id: '3',
      type: 'info',
      title: 'Liknande fall identifierade',
      description: 'AI har hittat 12 relevanta prejudikat som stödjer din sak.',
      confidence: 78,
      priority: 'medium',
      action: 'Granska prejudikat'
    }
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'urgent':
        return <Clock className="h-5 w-5 text-red-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI-insikter</h3>
        </div>
        <Badge variant="outline" className="text-blue-600">
          {displayInsights.length} insikter
        </Badge>
      </div>

      <div className="space-y-3">
        {displayInsights.map((insight) => (
          <Card key={insight.id} className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getPriorityColor(insight.priority)}`}
                    >
                      {insight.priority === 'high' ? 'Hög' : insight.priority === 'medium' ? 'Medium' : 'Låg'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  
                  {showConfidence && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">Säkerhet:</span>
                      <Progress value={insight.confidence} className="flex-1 h-2" />
                      <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}%
                      </span>
                    </div>
                  )}
                  
                  {insight.action && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      {insight.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
