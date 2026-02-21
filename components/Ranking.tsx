import React, { useEffect, useState } from 'react';
import { RankingEntry } from '../types';
import { getRanking } from '../services/mockDataService';
import { Trophy, Medal, MapPin } from 'lucide-react';
import { Button } from './Button';

interface RankingProps {
  onBack: () => void;
  currentUserBranch: string;
}

export const Ranking: React.FC<RankingProps> = ({ onBack, currentUserBranch }) => {
  const [data, setData] = useState<RankingEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'branch'>('all');

  useEffect(() => {
    getRanking().then(setData);
  }, []);

  const filteredData = filter === 'all' 
    ? data 
    : data.filter(d => d.branch === currentUserBranch);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold flex items-center">
           <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
           ランキング
         </h2>
         <div className="flex bg-gray-200 rounded-lg p-1">
           <button 
             onClick={() => setFilter('all')}
             className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filter === 'all' ? 'bg-white shadow text-tiger-dark' : 'text-gray-500'}`}
           >
             全道
           </button>
           <button 
             onClick={() => setFilter('branch')}
             className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filter === 'branch' ? 'bg-white shadow text-tiger-dark' : 'text-gray-500'}`}
           >
             営業所
           </button>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">データがありません</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">順位</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">ドライバー名</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">所属</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">最高得点</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((entry, idx) => (
                <tr key={idx} className="hover:bg-orange-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      {entry.rank === 1 && <Medal className="w-6 h-6 text-yellow-500" />}
                      {entry.rank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                      {entry.rank === 3 && <Medal className="w-6 h-6 text-amber-700" />}
                      {entry.rank > 3 && <span className="font-bold text-gray-500 w-6 text-center">{entry.rank}</span>}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    {entry.name}
                    <div className="sm:hidden text-xs text-gray-400 font-normal mt-0.5">{entry.branch}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 hidden sm:table-cell">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {entry.branch}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-tiger-orange text-lg">{entry.score} 点</div>
                    <div className="text-xs text-gray-500 font-medium">{entry.examTitle}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-center pt-4">
        <Button variant="outline" onClick={onBack}>ダッシュボードへ戻る</Button>
      </div>
    </div>
  );
};