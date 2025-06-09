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
    <div className="cyber-container space-y-6">
      {/* Header Stats */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 cyber-text-gradient">
          Level {userStats.level} Legal Hacker
        </h1>
        <div className="xp-badge animate-glow-pulse">
          {userStats.xp.toLocaleString()} XP
        </div>
      </div>

      {/* Progress Section */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Zap className="h-5 w-5 text-cyber-green" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* XP Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">XP Progress</span>
              <span className="text-sm text-cyber-green font-medium">
                {userStats.xp} / {userStats.xpToNext} XP
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill animate-progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Challenge Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Legal Challenges</span>
              <span className="text-sm text-swedish-lightBlue font-medium">
                {userStats.completedChallenges} / {userStats.totalChallenges}
              </span>
            </div>
            <Progress value={challengeProgress} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-dark-surface rounded-lg cyber-border">
              <Target className="h-6 w-6 text-cyber-green mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{userStats.completedChallenges}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 bg-dark-surface rounded-lg cyber-border">
              <Clock className="h-6 w-6 text-swedish-yellow mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{userStats.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-dark-surface rounded-lg cyber-border">
              <Trophy className="h-6 w-6 text-cyber-orange mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{userStats.level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Award className="h-5 w-5 text-swedish-yellow" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {userStats.badges.map((badge, index) => (
              <div 
                key={badge}
                className="skill-badge unlocked animate-badge-unlock text-center p-3"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Star className="h-4 w-4 mx-auto mb-1" />
                <div className="text-xs font-medium">{badge}</div>
              </div>
            ))}
            {/* Locked badge placeholder */}
            <div className="skill-badge text-center p-3 opacity-50">
              <Star className="h-4 w-4 mx-auto mb-1" />
              <div className="text-xs">Next Badge</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-dark-surface rounded-lg">
              <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground">Completed "Contract Analysis Challenge"</span>
              <Badge variant="secondary" className="ml-auto">+150 XP</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-surface rounded-lg">
              <div className="w-2 h-2 bg-swedish-blue rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground">Unlocked "Legal Expert" badge</span>
              <Badge variant="outline" className="ml-auto">Achievement</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-surface rounded-lg">
              <div className="w-2 h-2 bg-swedish-yellow rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground">12-day learning streak achieved!</span>
              <Badge variant="secondary" className="ml-auto">+50 XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;