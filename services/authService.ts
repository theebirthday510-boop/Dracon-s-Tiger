import { User } from '../types';

export const loginUser = async (code: string, pass: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock login: any non-empty code is valid if password is '1423'
  if (code.trim().length > 0 && pass === '1423') {
    return {
      id: 'u1',
      name: '山田 太郎',
      employeeCode: code,
      branch: '札幌輸送営業所'
    };
  }
  return null;
};

export const registerUser = async (name: string, code: string, branch: string, pass: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    id: 'u_new',
    name,
    employeeCode: code,
    branch
  };
};

export const verifyAdmin = async (adminCode: string, adminPass: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // 管理者用コード: ADMIN, パスワード: 9999 (デモ用)
  return adminCode === 'ADMIN' && adminPass === '9999';
};
