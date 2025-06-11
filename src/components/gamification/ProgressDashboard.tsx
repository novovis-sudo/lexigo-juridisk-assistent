
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Zap, Target, Star, Clock, Award } from 'lucide-react';

interface ProgressDashboardProps {
  userStats?: {
    level: number;
    xp: number;
    xpToNext: number;
    completedChallenges: number;
    totalChallenges: number;
    streak: number;
    badges: string[];
  };
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  userStats = {
    level: 7,
    xp: 2450,
    xpToNext: 3000,
    completedChallenges: 28,
    totalChallenges: 45,
    streak: 12,
    badges: ['Legal Expert', 'Quick Learner', 'Problem Solver', 'Contract Master']
  }
}) => {
  const progressPercentage = (userStats.xp / userStats.xpToNext) * 100;
  const challengeProgress = (userStats.completedChallenges / userStats.totalChallenges) * 100;

  return (
    <div className="professional-container section-spacing content-spacing">
      {/* Header Stats */}
      <div className="text-center mb-12 animate-professional-fade-in">
        <h1 className="text-hero font-heading mb-4 legal-gradient">
          Level {userStats.level} Juridisk Expert
        </h1>
        <div className="status-success">
          {userStats.xp.toLocaleString()} XP
        </div>
      </div>

      {/* Progress Section */}
      <Card className="premium-card animate-professional-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            Framsteg Översikt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* XP Progress */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-caption">XP Framsteg</span>
              <span className="text-sm font-medium text-primary">
                {userStats.xp} / {userStats.xpToNext} XP
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Challenge Progress */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-caption">Juridiska Utmaningar</span>
              <span className="text-sm font-medium text-accent">
                {userStats.completedChallenges} / {userStats.totalChallenges}
              </span>
            </div>
            <Progress value={challengeProgress} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-muted rounded-lg border border-border">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{userStats.completedChallenges}</div>
              <div className="text-caption">Slutförda</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg border border-border">
              <Clock className="h-6 w-6 text-legal-gold mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{userStats.streak}</div>
              <div className="text-caption">Dagars Streak</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg border border-border">
              <Trophy className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{userStats.level}</div>
              <div className="text-caption">Nivå</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="premium-card animate-professional-slide-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 bg-legal-gold rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            Prestationer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userStats.badges.map((badge, index) => (
              <div 
                key={badge}
                className="flex flex-col items-center p-4 bg-primary/5 border border-primary/20 rounded-lg text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Star className="h-6 w-6 mb-2 text-primary" />
                <div className="text-sm font-medium text-foreground">{badge}</div>
              </div>
            ))}
            {/* Locked badge placeholder */}
            <div className="flex flex-col items-center p-4 bg-muted/50 border border-border rounded-lg text-center opacity-60">
              <Star className="h-6 w-6 mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Nästa Badge</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="premium-card animate-professional-fade-in">
        <CardHeader>
          <CardTitle className="text-foreground">Senaste Aktivitet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-body text-foreground flex-1">Slutförde "Kontraktsanalys Utmaning"</span>
              <Badge className="status-success">+150 XP</Badge>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-body text-foreground flex-1">Låste upp "Legal Expert" badge</span>
              <Badge variant="outline" className="text-accent border-accent">Prestation</Badge>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-legal-gold rounded-full"></div>
              <span className="text-body text-foreground flex-1">12-dagars lärande streak uppnådd!</span>
              <Badge className="status-success">+50 XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
