import React from 'react';
import { Award, FileText, ChevronLeft, Star } from 'lucide-react';
import { Button } from './Button';

interface PastExamSelectProps {
  onSelect: (examId: string) => void;
  onBack: () => void;
}

export const PastExamSelect: React.FC<PastExamSelectProps> = ({ onSelect, onBack }) => {
  const exams = [
    {
      id: '46',
      title: '第46回 全国トラックドライバーコンテスト',
      subtitle: '学科試験（法規・構造・常識）',
      questionCount: 80,
      difficulty: '★★★★☆',
      isNew: true
    },
    {
      id: '45',
      title: '第45回 全国トラックドライバーコンテスト',
      subtitle: '学科試験（法規・構造・常識）',
      questionCount: 80,
      difficulty: '★★★☆☆',
      isNew: false
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="text-gray-400 hover:text-tiger-dark transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">過去問学習メニュー</h2>
      </div>
      
      <p className="text-sm text-gray-500">
        学習したい大会（回数）を選択してください。<br/>
        <span className="text-xs text-orange-500">※各大会 全80問（法規40問・構造20問・常識20問）</span>
      </p>

      <div className="grid grid-cols-1 gap-4">
        {exams.map((exam) => (
          <div 
            key={exam.id}
            onClick={() => onSelect(exam.id)}
            className="group relative p-5 rounded-xl border-2 border-gray-200 bg-white cursor-pointer transition-all hover:border-tiger-orange hover:shadow-md active:scale-[0.99]"
          >
            {exam.isNew && (
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center animate-bounce">
                <Star className="w-3 h-3 mr-1 fill-white" /> NEW
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                  <Award className="w-8 h-8 text-tiger-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-tiger-orange transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{exam.subtitle}</p>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {exam.questionCount}問
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                      難易度: {exam.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="self-center hidden sm:block">
                <Button size="sm" variant="outline" className="group-hover:bg-tiger-orange group-hover:text-white border-gray-200 group-hover:border-tiger-orange">
                  挑戦する
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
        <p className="font-bold mb-1">💡 ヒント</p>
        過去問は本番と同じ形式（全80問）で出題されます。時間は無制限ですが、本番を意識して解答することをお勧めします。
      </div>
    </div>
  );
};