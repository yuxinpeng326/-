
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AddTransaction } from './components/AddTransaction';
import { Stats } from './components/Stats';
import { TransactionList } from './components/TransactionList';
import { Savings } from './components/Savings';
import { Transaction, ViewState, TransactionType, SavingsGoal } from './types';

// Mock initial data
const INITIAL_DATA: Transaction[] = [
  { id: '1', amount: 25.00, category: '餐饮', note: '午餐汉堡', date: new Date().toISOString().split('T')[0], type: TransactionType.EXPENSE, emoji: '🍔' },
  { id: '2', amount: 15000, category: '薪资', note: '发工资啦', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], type: TransactionType.INCOME, emoji: '💰' },
  { id: '3', amount: 80.00, category: '娱乐', note: '看电影', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], type: TransactionType.EXPENSE, emoji: '🎬' },
];

const INITIAL_GOALS: SavingsGoal[] = [
  { id: '1', name: '新手机', targetAmount: 6000, savedAmount: 1500, emoji: '📱', color: '#C1E1FF' }
];

const App: React.FC = () => {
  // Use state for transactions. In a real app, use LocalStorage or Database.
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('qmoney_transactions');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('qmoney_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [view, setView] = useState<ViewState>('dashboard');

  useEffect(() => {
    localStorage.setItem('qmoney_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('qmoney_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Date.now().toString(),
    };
    setTransactions(prev => [transaction, ...prev]);
    setView('dashboard');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Savings Logic
  const handleAddGoal = (newGoal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => {
    const goal: SavingsGoal = {
      ...newGoal,
      id: Date.now().toString(),
      savedAmount: 0
    };
    setSavingsGoals(prev => [...prev, goal]);
  };

  const handleUpdateSavings = (id: string, amount: number) => {
    setSavingsGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        return { ...goal, savedAmount: goal.savedAmount + amount };
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <Layout activeView={view} onNavigate={setView}>
      {view === 'dashboard' && <Dashboard transactions={transactions} />}
      {view === 'add' && <AddTransaction onSave={handleAddTransaction} onCancel={() => setView('dashboard')} />}
      {view === 'stats' && <Stats transactions={transactions} />}
      {view === 'history' && <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />}
      {view === 'savings' && <Savings goals={savingsGoals} onAddGoal={handleAddGoal} onUpdateProgress={handleUpdateSavings} onDeleteGoal={handleDeleteGoal} />}
    </Layout>
  );
};

export default App;
