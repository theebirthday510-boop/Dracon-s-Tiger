import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Quiz } from './components/Quiz';
import { Ranking } from './components/Ranking';
import { AdminPanel } from './components/AdminPanel';
import { PastExamSelect } from './components/PastExamSelect';
import { User, Screen, QuizMode } from './types';
import { CheckCircle } from 'lucide-react';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('login');
  const [quizMode, setQuizMode] = useState<QuizMode>(QuizMode.PAST);
  const [selectedCategory, setSelectedCategory] = useState<string>('全問');
  
  // Quiz Result State (Temporary)
  const [lastScore, setLastScore] = useState<{score: number, total: number} | null>(null);

  const handleLogin = (u: User) => {
    setUser(u);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('login');
    setLastScore(null);
  };

  const startQuiz = (mode: QuizMode) => {
    setQuizMode(mode);
    if (mode === QuizMode.PAST) {
      setScreen('past_select');
    } else {
      setSelectedCategory('全問'); // Default for predicted
      setScreen('quiz');
    }
  };

  const handlePastExamSelect = (category: string) => {
    setSelectedCategory(category);
    setScreen('quiz');
  };

  const finishQuiz = (score: number, total: number) => {
    setLastScore({ score, total });
    // In a real app, save score to DB here
  };

  if (!user || screen === 'login') {
    return <Login onLoginSuccess={handleLogin} />;
  }

  // Result Screen Overlay
  if (lastScore && screen === 'quiz') {
    const percentage = Math.round((lastScore.score / lastScore.total) * 100);
    return (
      <Layout user={user} onLogout={handleLogout}>
         <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
            <div className="mb-6 flex justify-center">
               <div className="bg-green-100 p-4 rounded-full">
                 <CheckCircle className="w-16 h-16 text-green-500" />
               </div>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">学習完了！</h2>
            <p className="text-gray-500 mb-8">お疲れ様でした。今回の結果は...</p>
            
            <div className="text-6xl font-black text-tiger-orange mb-2">
              {lastScore.score} <span className="text-2xl text-gray-400">/ {lastScore.total}</span>
            </div>
            <div className="text-xl font-bold text-gray-600 mb-8">
              正答率: {percentage}%
            </div>

            <div className="space-y-3">
              <Button fullWidth onClick={() => { setLastScore(null); setScreen('dashboard'); }}>
                ダッシュボードへ戻る
              </Button>
              <Button fullWidth variant="outline" onClick={() => { setLastScore(null); setScreen('quiz'); /* Restart same quiz */ }}>
                もう一度挑戦する
              </Button>
            </div>
         </div>
      </Layout>
    );
  }

  const getTitle = () => {
    switch(screen) {
      case 'dashboard': return 'ダッシュボード';
      case 'admin': return '管理者パネル';
      default: return undefined;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} title={getTitle()}>
      {screen === 'dashboard' && (
        <Dashboard 
          user={user}
          onStartQuiz={startQuiz} 
          onShowRanking={() => setScreen('ranking')} 
          onShowAdmin={() => setScreen('admin')}
        />
      )}

      {screen === 'past_select' && (
        <PastExamSelect 
          onSelect={handlePastExamSelect}
          onBack={() => setScreen('dashboard')}
        />
      )}
      
      {screen === 'quiz' && (
        <Quiz 
          mode={quizMode} 
          categoryFilter={quizMode === QuizMode.PAST ? selectedCategory : undefined}
          onFinish={finishQuiz} 
          onExit={() => setScreen('dashboard')} 
        />
      )}
      
      {screen === 'ranking' && (
        <Ranking 
          currentUserBranch={user.branch} 
          onBack={() => setScreen('dashboard')} 
        />
      )}

      {screen === 'admin' && (
        <AdminPanel onBack={() => setScreen('dashboard')} />
      )}
    </Layout>
  );
};

export default App;