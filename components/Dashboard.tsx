import React, { useState } from 'react';
import { PlayCircle, Zap, Trophy, MessageSquare, Send, Loader2, CheckCircle2, Settings } from 'lucide-react';
import { Button } from './Button';
import { QuizMode, User, AdminMessage } from '../types';

interface DashboardProps {
  user: User;
  onStartQuiz: (mode: QuizMode) => void;
  onShowRanking: () => void;
  onShowAdmin: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartQuiz, onShowRanking, onShowAdmin }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSendMessage = async () => {
    if (!message.trim() || status !== 'idle') return;
    
    setStatus('sending');

    // 送信データの作成
    const newMessage: AdminMessage = {
      id: Date.now().toString(),
      senderName: user.name,
      branch: user.branch,
      text: message,
      timestamp: new Date().toLocaleString('ja-JP'),
    };

    // localStorageへの保存処理 (管理者ページで読み込むため)
    try {
      const existingRaw = localStorage.getItem('admin_messages');
      const existingMessages: AdminMessage[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedMessages = [newMessage, ...existingMessages];
      localStorage.setItem('admin_messages', JSON.stringify(updatedMessages));
    } catch (e) {
      console.error("Failed to save message", e);
    }

    // 擬似的なネットワーク遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStatus('success');
    setMessage('');
    
    setTimeout(() => {
      setStatus('idle');
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Main Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-tiger-orange hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onStartQuiz(QuizMode.PAST)}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg text-tiger-orange">
              <PlayCircle className="w-8 h-8" />
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-bold">基本</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">過去問学習</h3>
          <p className="text-gray-500 text-sm mb-4">実際の過去の出題データを使って、基礎力を徹底的に固めます。</p>
          <Button fullWidth size="sm">スタート</Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-tiger-red hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onStartQuiz(QuizMode.PREDICTED)}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg text-tiger-red">
              <Zap className="w-8 h-8" />
            </div>
            <span className="bg-red-100 text-tiger-red text-xs px-2 py-1 rounded font-bold">実戦</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">予想問題学習</h3>
          <p className="text-gray-500 text-sm mb-4">傾向分析に基づいた予想問題で、応用力を磨きます。</p>
          <Button fullWidth variant="secondary" size="sm">挑戦する</Button>
        </div>
      </div>

      {/* Sub Menu Grid */}
      <div className="grid grid-cols-1 gap-4">
         <div 
          className="bg-white p-4 rounded-xl shadow border border-gray-100 flex items-center space-x-4 cursor-pointer hover:bg-gray-50"
          onClick={onShowRanking}
         >
           <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
             <Trophy className="w-6 h-6" />
           </div>
           <div>
             <h4 className="font-bold text-gray-800">ランキング</h4>
             <p className="text-xs text-gray-500">全道のライバルと競う</p>
           </div>
         </div>
      </div>

      {/* Message to Admin Area */}
      <div className="bg-slate-800 text-slate-200 p-5 rounded-lg border border-slate-700 shadow-inner">
        <div className="flex items-center space-x-2 mb-3 font-bold text-orange-400">
          <MessageSquare className="w-5 h-5" />
          <span className="text-base tracking-wider">管理者へメッセージ</span>
        </div>
        <p className="text-sm mb-4 opacity-90 font-medium">問題、解答、解説に間違いがありましたら報告お願いします</p>
        
        {status === 'success' ? (
          <div className="bg-green-500/10 border border-green-500/50 rounded-md p-4 flex items-center space-x-3 text-green-400 animate-fade-in">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <span className="text-sm font-bold">送信が完了しました。ありがとうございます！</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === 'sending'}
              placeholder="不備の報告や要望を入力..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white placeholder-slate-400 disabled:opacity-50"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-md transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px] shadow-lg active:scale-95"
              disabled={!message.trim() || status === 'sending'}
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-tighter">Sending</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  <span className="text-sm font-bold">送信</span>
                </>
              )}
            </button>
          </div>
        )}
        <div className="mt-3 text-[10px] text-slate-500 italic">
          ※管理者ページへ直接送信されます
        </div>
      </div>

      {/* Admin Access (Demo purposes) */}
      <div className="pt-10 flex justify-center opacity-40 hover:opacity-100 transition-opacity">
        <button 
          onClick={onShowAdmin}
          className="flex items-center text-[10px] text-gray-500 hover:text-tiger-orange border border-gray-300 rounded px-2 py-1"
        >
          <Settings className="w-3 h-3 mr-1" />
          管理者メニュー
        </button>
      </div>
    </div>
  );
};