import React, { useState } from 'react';
import { Truck, Award, ShieldCheck, User as UserIcon, Lock, Building2, Hash } from 'lucide-react';
import { Button } from './Button';
import { BRANCHES } from '../constants';
import { loginUser, registerUser } from '../services/authService';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(BRANCHES[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (!name || !code) throw new Error("全ての項目を入力してください");
        // Fixed password for registration
        const user = await registerUser(name, code, branch, "1423");
        onLoginSuccess(user);
      } else {
        if (!code || !password) throw new Error("社員コードとパスワードを入力してください");
        const user = await loginUser(code, password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError("認証失敗: コードまたはパスワードが違います。");
        }
      }
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-end pb-10 sm:pb-20 overflow-hidden">
      {/* Background Image Container */}
      {/* Note: Replace the URL below with the actual path to your 'Tiger & Truck' image asset */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out hover:scale-105"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1517480449906-5381a8f6fb91?q=80&w=2572&auto=format&fit=crop')", // Placeholder: Use your 'Dracon Tiger' image here
          filter: "brightness(0.8)" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in-up">
        
        {/* Logo Title (Visual Match) */}
        <div className="text-center mb-6 sm:mb-12">
            <h1 
                className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 italic tracking-tighter drop-shadow-2xl transform -rotate-2"
                style={{ 
                    filter: "drop-shadow(3px 3px 0px #3f1a04)",
                    WebkitTextStroke: "1px #fff"
                }}
            >
                ドラコンの虎
            </h1>
        </div>

        {/* Login/Register Card */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl border border-orange-500/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
          <h2 className="text-white text-center font-bold mb-6 text-lg tracking-widest border-b border-white/10 pb-2">
            {isRegister ? 'DRIVER REGISTRATION' : 'DRIVER LOGIN'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-orange-400/70 group-focus-within:text-orange-400 transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-orange-700/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-black/60 transition-all"
                    placeholder="氏名 (Name)"
                  />
                </div>
                <div className="relative group">
                  <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-orange-400/70 group-focus-within:text-orange-400 transition-colors" />
                  <select 
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-black/40 border border-orange-700/30 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:bg-black/60 transition-all appearance-none"
                  >
                    {BRANCHES.map(b => <option key={b} value={b} className="text-black">{b}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="relative group">
              <Hash className="absolute left-3 top-3.5 w-5 h-5 text-orange-400/70 group-focus-within:text-orange-400 transition-colors" />
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-black/40 border border-orange-700/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-black/60 transition-all"
                placeholder="社員コード (Code)"
              />
            </div>

            {!isRegister && (
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-orange-400/70 group-focus-within:text-orange-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-orange-700/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-black/60 transition-all"
                  placeholder="パスワード"
                />
              </div>
            )}

            {error && <p className="text-red-400 text-sm font-bold text-center bg-red-900/30 py-1 rounded animate-pulse">{error}</p>}

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              disabled={isLoading}
              className="mt-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white font-black tracking-widest transform transition-transform hover:-translate-y-0.5"
            >
              {isLoading ? 'LOADING...' : (isRegister ? 'REGISTER' : 'ログイン')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-orange-300 hover:text-white text-sm font-medium transition-colors hover:underline underline-offset-4"
            >
              {isRegister ? 'ログイン画面へ戻る' : '新規登録はこちら'}
            </button>
          </div>
        </div>
        
        {/* Footer text */}
        <p className="text-center text-white/40 text-sm mt-8 font-bold tracking-widest">
            ドラコンの頂点を掴み取れ！
        </p>
      </div>
    </div>
  );
};