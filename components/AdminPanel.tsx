import React, { useEffect, useState } from 'react';
import { AdminMessage, UserStats, UserDetail } from '../types';
import { getUserStats, getUserDetail } from '../services/mockDataService';
import { MessageSquare, Trash2, ChevronLeft, Clock, User, Building2, Database, Upload, FileText, CheckCircle2, Lock, ShieldAlert, LogOut, Loader2, BarChart3, Search, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { verifyAdmin } from '../services/authService';

interface AdminPanelProps {
  onBack: () => void;
}

type AdminTab = 'messages' | 'questions' | 'stats';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('messages');
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [statsFilter, setStatsFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  
  // Question Editor State
  const [pastCsv, setPastCsv] = useState('');
  const [pastExplanationCsv, setPastExplanationCsv] = useState('');
  const [predictedCsv, setPredictedCsv] = useState('');
  const [predictedExplanationCsv, setPredictedExplanationCsv] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    if (isAuthenticated) {
      // Load messages
      const rawMsg = localStorage.getItem('admin_messages');
      if (rawMsg) setMessages(JSON.parse(rawMsg));

      // Load user stats
      getUserStats().then(setUserStats);

      // Load custom CSVs
      const savedPast = localStorage.getItem('custom_past_questions_csv');
      const savedPastExplanation = localStorage.getItem('custom_past_explanations_csv');
      const savedPredicted = localStorage.getItem('custom_predicted_questions_csv');
      const savedPredictedExplanation = localStorage.getItem('custom_predicted_explanations_csv');
      
      if (savedPast) setPastCsv(savedPast);
      else setPastCsv('ID,形式,カテゴリ,問題文,選択肢1,選択肢2,選択肢3,選択肢4,正解番号');

      if (savedPastExplanation) setPastExplanationCsv(savedPastExplanation);
      else setPastExplanationCsv('ID,解説');

      if (savedPredicted) setPredictedCsv(savedPredicted);
      else setPredictedCsv('通し番号,カテゴリ,問題文,正解');

      if (savedPredictedExplanation) setPredictedExplanationCsv(savedPredictedExplanation);
      else setPredictedExplanationCsv('通し番号,解説');
    }
  }, [isAuthenticated]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthenticating(true);

    const success = await verifyAdmin(adminCode, adminPass);
    if (success) {
      setIsAuthenticated(true);
    } else {
      setLoginError('管理者コードまたはパスワードが正しくありません。');
    }
    setIsAuthenticating(false);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    localStorage.setItem('admin_messages', JSON.stringify(updated));
  };

  const handleSaveQuestions = async () => {
    setSaveStatus('saving');
    localStorage.setItem('custom_past_questions_csv', pastCsv);
    localStorage.setItem('custom_past_explanations_csv', pastExplanationCsv);
    localStorage.setItem('custom_predicted_questions_csv', predictedCsv);
    localStorage.setItem('custom_predicted_explanations_csv', predictedExplanationCsv);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setAdminPass('');
    onBack();
  };

  const handleUserClick = async (userId: string) => {
    setIsLoadingDetail(true);
    const detail = await getUserDetail(userId);
    setSelectedUser(detail);
    setIsLoadingDetail(false);
  };

  const filteredStats = userStats.filter(stat => 
    stat.name.includes(statsFilter) || 
    stat.branch.includes(statsFilter)
  );

  // --- Login View ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-fade-in-up">
          <div className="bg-tiger-orange p-6 text-white text-center">
            <ShieldAlert className="w-12 h-12 mx-auto mb-2 opacity-90" />
            <h2 className="text-xl font-black tracking-widest uppercase">Admin Login</h2>
            <p className="text-[10px] opacity-80 font-bold">管理者以外アクセス禁止</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="p-8 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Admin Code</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-tiger-orange transition-all"
                  placeholder="管理者コード"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-tiger-orange transition-all"
                  placeholder="パスワード"
                  required
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-400 text-[10px] font-bold text-center bg-red-900/20 py-1.5 rounded border border-red-900/30">
                {loginError}
              </p>
            )}

            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-tiger-orange hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '認証する'
              )}
            </button>

            <button 
              type="button"
              onClick={onBack}
              className="w-full text-slate-500 hover:text-slate-300 text-xs font-bold pt-2 transition-colors"
            >
              ダッシュボードへ戻る
            </button>
          </form>
          
          <div className="bg-slate-950 p-3 text-center">
            <p className="text-[8px] text-slate-600 font-mono tracking-widest uppercase">Security System v2.0 Activated</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Authenticated Main View ---
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <button 
          onClick={onBack}
          className="flex items-center text-tiger-orange font-bold hover:underline"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          ダッシュボード
        </button>
        <div className="flex items-center space-x-2">
          <Database className="w-6 h-6 text-tiger-orange" />
          <h2 className="text-xl font-black text-gray-800 tracking-tight">管理者パネル</h2>
        </div>
        <button 
          onClick={handleAdminLogout}
          className="flex items-center text-gray-400 hover:text-red-500 transition-colors"
          title="管理者ログアウト"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-200 p-1 rounded-xl overflow-x-auto">
        <button 
          onClick={() => { setActiveTab('messages'); setSelectedUser(null); }}
          className={`flex-1 flex items-center justify-center py-3 px-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'messages' ? 'bg-white shadow text-tiger-orange' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          メッセージBOX ({messages.length})
        </button>
        <button 
          onClick={() => { setActiveTab('stats'); setSelectedUser(null); }}
          className={`flex-1 flex items-center justify-center py-3 px-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'stats' ? 'bg-white shadow text-tiger-orange' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          成績管理
        </button>
        <button 
          onClick={() => { setActiveTab('questions'); setSelectedUser(null); }}
          className={`flex-1 flex items-center justify-center py-3 px-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'questions' ? 'bg-white shadow text-tiger-orange' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Upload className="w-4 h-4 mr-2" />
          問題データ管理
        </button>
      </div>

      {/* Content: Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-dashed border-gray-200">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">現在メッセージはありません</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 group relative animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center font-bold text-gray-600">
                      <User className="w-3 h-3 mr-1 text-tiger-orange" />
                      {msg.senderName}
                    </span>
                    <span className="flex items-center">
                      <Building2 className="w-3 h-3 mr-1" />
                      {msg.branch}
                    </span>
                  </div>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {msg.timestamp}
                  </span>
                </div>
                <div className="text-gray-700 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>
                <button 
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content: User Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-4 animate-fade-in">
          {selectedUser ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedUser(null)}
                className="flex items-center text-sm font-bold text-gray-500 hover:text-tiger-orange transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                一覧に戻る
              </button>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h3>
                    <div className="flex items-center text-gray-500 mt-1">
                      <Building2 className="w-4 h-4 mr-1" />
                      {selectedUser.branch}
                    </div>
                  </div>
                  <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                     <span className="text-xs font-bold text-tiger-orange uppercase block text-center">Total Attempts</span>
                     <span className="text-2xl font-black text-gray-800 block text-center">
                       {selectedUser.results.reduce((acc, r) => acc + r.attemptCount, 0)}
                     </span>
                  </div>
                </div>

                <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">学習状況詳細</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-3 font-bold text-gray-500 whitespace-nowrap">試験・問題集</th>
                        <th className="p-3 font-bold text-gray-500 whitespace-nowrap text-center">状態</th>
                        <th className="p-3 font-bold text-gray-500 whitespace-nowrap text-center">回答回数</th>
                        <th className="p-3 font-bold text-gray-500 whitespace-nowrap text-right">最高得点</th>
                        <th className="p-3 font-bold text-gray-500 whitespace-nowrap text-right">平均得点</th>
                        <th className="p-3 font-bold text-gray-500 whitespace-nowrap text-right">最終実施日</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedUser.results.map((result, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-gray-800">{result.examTitle}</td>
                          <td className="p-3 text-center">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                              result.status === '完了' ? 'bg-green-100 text-green-700' :
                              result.status === '学習中' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {result.status}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-gray-600">{result.attemptCount}</td>
                          <td className="p-3 text-right font-bold text-tiger-orange">{result.bestScore}</td>
                          <td className="p-3 text-right font-mono text-gray-600">{result.averageScore}</td>
                          <td className="p-3 text-right text-xs text-gray-400">{result.lastAttemptDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="名前、営業所で検索..." 
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                  value={statsFilter}
                  onChange={(e) => setStatsFilter(e.target.value)}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-4 font-bold text-gray-500 whitespace-nowrap">氏名</th>
                        <th className="p-4 font-bold text-gray-500 whitespace-nowrap">営業所</th>
                        <th className="p-4 font-bold text-gray-500 whitespace-nowrap text-center">総回答回数</th>
                        <th className="p-4 font-bold text-gray-500 whitespace-nowrap text-right">最高得点</th>
                        <th className="p-4 font-bold text-gray-500 whitespace-nowrap text-right">平均得点</th>
                        <th className="p-4 font-bold text-gray-500 whitespace-nowrap text-center">詳細</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStats.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400">
                            該当するデータがありません
                          </td>
                        </tr>
                      ) : (
                        filteredStats.map((stat) => (
                          <tr 
                            key={stat.id} 
                            className="hover:bg-orange-50 transition-colors cursor-pointer group"
                            onClick={() => handleUserClick(stat.id)}
                          >
                            <td className="p-4 font-bold text-gray-800 whitespace-nowrap">{stat.name}</td>
                            <td className="p-4 text-gray-600 whitespace-nowrap">{stat.branch}</td>
                            <td className="p-4 text-center font-mono text-gray-600">{stat.attemptCount}</td>
                            <td className="p-4 text-right font-bold text-tiger-orange">{stat.bestScore}</td>
                            <td className="p-4 text-right font-mono text-gray-600">{stat.averageScore}</td>
                            <td className="p-4 text-center text-gray-400 group-hover:text-tiger-orange">
                              {isLoadingDetail ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <ChevronRight className="w-5 h-5 mx-auto" />}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Content: Question Management */}
      {activeTab === 'questions' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-tiger-orange" />
                <h3 className="font-bold text-gray-800">過去問データ (CSV)</h3>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                形式: ID,形式(4択/〇×),カテゴリ,問題文,選択肢1,選択肢2,選択肢3,選択肢4,正解番号(1-4)
              </p>
              <textarea 
                value={pastCsv}
                onChange={(e) => setPastCsv(e.target.value)}
                className="w-full h-48 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-tiger-orange transition-colors"
                placeholder="CSVデータを貼り付けてください..."
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-tiger-orange" />
                <h3 className="font-bold text-gray-800">過去問解説データ (CSV)</h3>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                形式: ID,解説
              </p>
              <textarea 
                value={pastExplanationCsv}
                onChange={(e) => setPastExplanationCsv(e.target.value)}
                className="w-full h-48 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-tiger-orange transition-colors"
                placeholder="CSVデータを貼り付けてください..."
              />
            </div>

            <hr className="border-gray-100" />

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-tiger-red" />
                <h3 className="font-bold text-gray-800">予想問題データ (CSV)</h3>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                形式: 通し番号,カテゴリ,問題文,正解(1-4)
              </p>
              <textarea 
                value={predictedCsv}
                onChange={(e) => setPredictedCsv(e.target.value)}
                className="w-full h-48 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-tiger-red transition-colors"
                placeholder="CSVデータを貼り付けてください..."
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-tiger-red" />
                <h3 className="font-bold text-gray-800">予想問題解説データ (CSV)</h3>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                形式: 通し番号,解説
              </p>
              <textarea 
                value={predictedExplanationCsv}
                onChange={(e) => setPredictedExplanationCsv(e.target.value)}
                className="w-full h-48 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-tiger-red transition-colors"
                placeholder="CSVデータを貼り付けてください..."
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <p className="text-[10px] text-gray-400">
                ※保存すると即座にユーザー画面へ反映されます（要リロード）
              </p>
              <Button 
                onClick={handleSaveQuestions}
                disabled={saveStatus !== 'idle'}
                className="min-w-[160px]"
              >
                {saveStatus === 'saving' ? '保存中...' : 
                 saveStatus === 'success' ? (
                   <span className="flex items-center">
                     <CheckCircle2 className="w-4 h-4 mr-2" /> 保存完了
                   </span>
                 ) : 'データを保存する'}
              </Button>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <h4 className="text-sm font-bold text-tiger-orange mb-2 flex items-center">
              <Database className="w-4 h-4 mr-2" /> データリセット
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              全てのカスタム問題を削除し、アプリ初期状態のデータに戻します。
            </p>
            <button 
              onClick={() => {
                if(window.confirm('カスタム問題をすべて削除して初期化しますか？')) {
                  localStorage.removeItem('custom_past_questions_csv');
                  localStorage.removeItem('custom_past_explanations_csv');
                  localStorage.removeItem('custom_predicted_questions_csv');
                  localStorage.removeItem('custom_predicted_explanations_csv');
                  window.location.reload();
                }
              }}
              className="text-xs font-bold text-red-500 hover:text-red-700 underline"
            >
              初期化を実行
            </button>
          </div>
        </div>
      )}

      <div className="text-center text-[10px] text-gray-400 pt-10 pb-4">
        ドラコンの虎 管理システム v1.1
      </div>
    </div>
  );
};
