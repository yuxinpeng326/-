
export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income'
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO Date string
  type: TransactionType;
  emoji?: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  emoji: string;
  type: TransactionType;
  color: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'food', name: '餐饮', emoji: '🍔', type: TransactionType.EXPENSE, color: '#FFB7C5' },
  { id: 'transport', name: '交通', emoji: '🚌', type: TransactionType.EXPENSE, color: '#C1E1FF' },
  { id: 'shopping', name: '购物', emoji: '🛍️', type: TransactionType.EXPENSE, color: '#FFF5BA' },
  { id: 'entertainment', name: '娱乐', emoji: '🎮', type: TransactionType.EXPENSE, color: '#E0BBE4' },
  { id: 'bills', name: '账单', emoji: '🧾', type: TransactionType.EXPENSE, color: '#957DAD' },
  { id: 'health', name: '医疗', emoji: '💊', type: TransactionType.EXPENSE, color: '#FEC8D8' },
  { id: 'salary', name: '薪资', emoji: '💰', type: TransactionType.INCOME, color: '#B5EAD7' },
  { id: 'gift', name: '人情', emoji: '🎁', type: TransactionType.INCOME, color: '#FFDAC1' },
  { id: 'other', name: '其他', emoji: '✨', type: TransactionType.EXPENSE, color: '#E2F0CB' },
];

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  emoji: string;
  color: string;
}

export type ViewState = 'dashboard' | 'add' | 'stats' | 'history' | 'savings';
