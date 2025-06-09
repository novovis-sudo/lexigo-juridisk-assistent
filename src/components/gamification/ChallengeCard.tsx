import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  CheckCircle, 
  Clock, 
  Zap, 
  Star, 
  Flag,
  Play,
  Trophy,
  Target
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  xpReward: number;
  timeEstimate: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress?: number;
  tags: string[];
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStartChallenge?: (id: string) => void;
  onContinueChallenge?: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onStartChallenge,
  onContinueChallenge
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-cyber-green text-black';
      case 'intermediate': return 'bg-swedish-yellow text-black';
      case 'advanced': return 'bg-cyber-orange text-white';
      case 'expert': return 'bg-cyber-purple text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (challenge.status) {
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-cyber-green" />;
      case 'in-progress':
        return <Play className="h-5 w-5 text-swedish-blue" />;
      default:
        return <Target className="h-5 w-5 text-swedish-lightBlue" />;
    }
  };

  const getCardClassName = () => {
    let baseClass = 'challenge-card';
    
    if (challenge.status === 'completed') {
      baseClass += ' completed';
    } else if (challenge.status === 'locked') {
      baseClass += ' opacity-60 cursor-not-allowed';
    }
    
    return baseClass;
  };

  const handleCardClick = () => {
    if (challenge.status === 'locked') return;
    
    if (challenge.status === 'in-progress' && onContinueChallenge) {
      onContinueChallenge(challenge.id);
    } else if (challenge.status === 'available' && onStartChallenge) {
      onStartChallenge(challenge.id);
    }
  };

  return (
    <Card 
      className={getCardClassName()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-cyber-green">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">{challenge.xpReward} XP</span>
          </div>
        </div>
        
        <CardTitle className="text-lg text-foreground mt-2">
          {challenge.title}
        </CardTitle>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {challenge.timeEstimate}
          </div>
          <Badge variant="outline" className="text-xs">
            {challenge.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {challenge.description}
        </p>

        {/* Progress bar for in-progress challenges */}
        {challenge.status === 'in-progress' && challenge.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs text-cyber-green">{challenge.progress}%</span>
            </div>
            <Progress value={challenge.progress} className="h-2" />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {challenge.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-dark-accent text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
          {challenge.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-dark-accent text-muted-foreground">
              +{challenge.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {challenge.status === 'completed' && (
            <div className="flex items-center gap-2 text-cyber-green">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
          
          {challenge.status === 'available' && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onStartChallenge?.(challenge.id);
              }}
              className="cyber-button-primary w-full"
            >
              Start Challenge
            </Button>
          )}
          
          {challenge.status === 'in-progress' && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onContinueChallenge?.(challenge.id);
              }}
              className="cyber-button-accent w-full"
            >
              Continue
            </Button>
          )}
          
          {challenge.status === 'locked' && (
            <Button disabled className="w-full opacity-50">
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          )}
        </div>

        {/* Hover effect indicator */}
        {isHovered && challenge.status !== 'locked' && (
          <div className="absolute top-2 right-2 animate-pulse">
            <Flag className="h-4 w-4 text-cyber-green" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;