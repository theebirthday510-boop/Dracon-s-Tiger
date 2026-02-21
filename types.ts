export enum QuestionType {
  FOUR_CHOICE = '4択',
  TRUE_FALSE = '〇×'
}

export enum QuizMode {
  PAST = 'past',
  PREDICTED = 'predicted'
}

export interface Question {
  id: string;
  type: QuestionType;
  category: string;
  text: string;
  options?: string[]; // Only for 4-choice
  image?: string; // Image filename/URL
  correctAnswer: number; // 1-4 for 4-choice, 1 for True(〇), 2 for False(×)
  explanation: string;
}

export interface User {
  id: string;
  name: string;
  employeeCode: string;
  branch: string;
}

export interface QuizResult {
  date: string;
  score: number;
  total: number;
  mode: QuizMode;
}

export interface RankingEntry {
  rank: number;
  name: string;
  branch: string;
  score: number; // Total Score (e.g. 395)
  examTitle: string; // e.g. "第46回 過去問" or "予想問題: 法規"
}

export interface AdminMessage {
  id: string;
  senderName: string;
  branch: string;
  text: string;
  timestamp: string;
}

export interface UserStats {
  id: string;
  name: string;
  branch: string;
  attemptCount: number;
  bestScore: number;
  averageScore: number;
}

export interface UserExamResult {
  examTitle: string;
  attemptCount: number;
  bestScore: number;
  averageScore: number;
  status: '完了' | '学習中' | '未着手';
  lastAttemptDate: string;
}

export interface UserDetail {
  id: string;
  name: string;
  branch: string;
  results: UserExamResult[];
}

export type Screen = 'login' | 'dashboard' | 'past_select' | 'quiz' | 'ranking' | 'admin';