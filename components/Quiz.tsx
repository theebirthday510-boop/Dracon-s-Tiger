import React, { useState, useEffect } from 'react';
import { Question, QuestionType, QuizMode } from '../types';
import { getQuestions } from '../services/mockDataService';
import { Button } from './Button';
import { CheckCircle, XCircle, HelpCircle, ArrowRight, Loader2, Bot } from 'lucide-react';
import { getAiExplanation } from '../services/geminiService';

interface QuizProps {
  mode: QuizMode;
  categoryFilter?: string; // This can be ExamID (for PAST) or Category (for PREDICTED)
  onFinish: (score: number, total: number) => void;
  onExit: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ mode, categoryFilter, onFinish, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Quiz State
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showReview, setShowReview] = useState(false);
  
  // AI Coach State (for Review Mode)
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [activeAiQuestionId, setActiveAiQuestionId] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Pass the filter (examId or category) to the service
      const data = await getQuestions(mode, categoryFilter);
      setQuestions(data);
      setLoading(false);
    };
    loadData();
  }, [mode, categoryFilter]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answerIndex;
    setUserAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowReview(true);
    }
  };

  const calculateScore = () => {
    return questions.reduce((acc, q, idx) => {
      return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleFinish = () => {
    const score = calculateScore();
    onFinish(score, questions.length);
  };

  const handleAskAi = async (questionIndex: number) => {
    const q = questions[questionIndex];
    const userAnswer = userAnswers[questionIndex];
    
    if (userAnswer === null || userAnswer === undefined) return;
    
    setLoadingAi(true);
    setActiveAiQuestionId(q.id);
    setAiExplanation(null);
    
    // Determine text representation of answers
    let userAnsText = "";
    let correctAnsText = "";

    if (q.type === QuestionType.TRUE_FALSE) {
      userAnsText = userAnswer === 1 ? "正 (〇)" : "誤 (×)";
      correctAnsText = q.correctAnswer === 1 ? "正 (〇)" : "誤 (×)";
    } else {
      userAnsText = q.options ? q.options[userAnswer - 1] : String(userAnswer);
      correctAnsText = q.options ? q.options[q.correctAnswer - 1] : String(q.correctAnswer);
    }

    const explanation = await getAiExplanation(q.text, userAnsText, correctAnsText);
    setAiExplanation(explanation);
    setLoadingAi(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-tiger-orange animate-spin mb-4" />
        <p className="text-gray-500 font-bold">問題データを読み込み中...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">選択されたカテゴリの問題が見つかりませんでした。</p>
        <Button onClick={onExit}>戻る</Button>
      </div>
    );
  }

  // --- REVIEW MODE ---
  if (showReview) {
    const correctCount = calculateScore();
    const totalScore = correctCount * 5;
    const maxScore = questions.length * 5;

    return (
      <div className="max-w-4xl mx-auto pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center animate-fade-in-up">
          <h2 className="text-2xl font-black text-gray-800 mb-2">回答終了！</h2>
          <div className="text-5xl font-black text-tiger-orange mb-2">
            {totalScore} <span className="text-2xl text-gray-400">/ {maxScore} 点</span>
          </div>
          <div className="flex justify-center space-x-4 mt-6">
             <Button onClick={handleFinish} size="lg">ダッシュボードへ戻る</Button>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <div key={q.id} className={`bg-white rounded-xl shadow-sm border-l-8 overflow-hidden ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-500">Q{idx + 1}</span>
                      {isCorrect ? (
                        <span className="flex items-center text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" /> 正解
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">
                          <XCircle className="w-4 h-4 mr-1" /> 不正解
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {q.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-4">{q.text}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-xs font-bold text-gray-500 block mb-1">あなたの回答</span>
                      <div className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {q.type === QuestionType.TRUE_FALSE 
                          ? (userAnswer === 1 ? '〇' : '×')
                          : (q.options && userAnswer ? `${userAnswer}. ${q.options[userAnswer - 1]}` : userAnswer)
                        }
                      </div>
                    </div>
                    {!isCorrect && (
                      <div>
                        <span className="text-xs font-bold text-gray-500 block mb-1">正解</span>
                        <div className="font-bold text-green-700">
                          {q.type === QuestionType.TRUE_FALSE 
                            ? (q.correctAnswer === 1 ? '〇' : '×')
                            : (q.options ? `${q.correctAnswer}. ${q.options[q.correctAnswer - 1]}` : q.correctAnswer)
                          }
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-800 block mb-1">【解説】</span>
                    {q.explanation}
                  </div>

                  {/* AI Coach for Review */}
                  <div className="mt-4">
                    {activeAiQuestionId === q.id && aiExplanation ? (
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg relative animate-fade-in">
                        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-tiger-orange flex items-center border border-orange-200 rounded-full">
                           <Bot className="w-3 h-3 mr-1" /> AI Coach Tiger
                        </div>
                        <p className="text-sm text-gray-800 italic">"{aiExplanation}"</p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAskAi(idx)}
                        disabled={loadingAi}
                        className="flex items-center text-sm font-bold text-tiger-orange hover:text-orange-700 transition-colors mt-2"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        {loadingAi && activeAiQuestionId === q.id ? 'AIコーチが思考中...' : 'AIコーチに詳しく聞く'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
           <Button onClick={handleFinish} size="lg">終了してダッシュボードへ</Button>
        </div>
      </div>
    );
  }

  // --- QUIZ MODE ---
  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-lg shadow-sm">
        <span className="font-bold text-tiger-dark">
          第 {currentIndex + 1} 問 <span className="text-gray-400 text-sm">/ {questions.length}</span>
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
             {currentQ.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded text-white ${currentQ.type === QuestionType.TRUE_FALSE ? 'bg-blue-500' : 'bg-purple-500'}`}>
            {currentQ.type}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6 animate-fade-in">
        {currentQ.image && (
          <div className="w-full h-48 bg-gray-200 relative">
             <img src={currentQ.image} alt="Question" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-6">
            {currentQ.text}
          </h3>

          <div className="space-y-3">
             {currentQ.type === QuestionType.FOUR_CHOICE && currentQ.options && (
               currentQ.options.map((opt, idx) => {
                 const optIdx = idx + 1;
                 return (
                   <button
                    key={idx}
                    onClick={() => handleAnswer(optIdx)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:bg-orange-50 hover:border-tiger-orange transition-all flex items-start group"
                   >
                     <span className="font-bold mr-3 flex-shrink-0 bg-white w-6 h-6 rounded-full flex items-center justify-center border text-sm shadow-sm group-hover:border-tiger-orange group-hover:text-tiger-orange">
                       {optIdx}
                     </span>
                     <span>{opt}</span>
                   </button>
                 );
               })
             )}

             {currentQ.type === QuestionType.TRUE_FALSE && (
               <div className="grid grid-cols-2 gap-4 h-32">
                  <button
                    onClick={() => handleAnswer(1)}
                    className="rounded-xl text-4xl font-black border-4 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center"
                  >
                    〇
                  </button>
                  <button
                    onClick={() => handleAnswer(2)}
                    className="rounded-xl text-4xl font-black border-4 border-red-500 text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                  >
                    ×
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
         <button onClick={onExit} className="text-gray-400 text-sm hover:text-gray-600 underline">
           学習を中断して戻る
         </button>
      </div>
    </div>
  );
};