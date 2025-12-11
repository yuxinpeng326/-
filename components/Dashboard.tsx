
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { Mascot } from './Mascot';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  username?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, username = "朋友" }) => {
  
  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === TransactionType.INCOME ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const monthlyIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 9) return "早上好";
    if (hour < 12) return "上午好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider">{getGreeting()}</h2>
          <h1 className="text-3xl font-bold text-gray-800">{username}!</h1>
        </div>
        <Mascot mood={totalBalance < 0 ? 'shocked' : 'happy'} />
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-rose-400 to-orange-300 rounded-[2rem] p-6 text-white shadow-xl shadow-rose-200 transform transition-transform hover:scale-[1.02]">
        <p className="text-rose-100 font-medium mb-1">总资产</p>
        <h2 className="text-4xl font-extrabold tracking-tight">¥{totalBalance.toFixed(2)}</h2>
        
        <div className="mt-6 flex gap-4">
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
            <div className="bg-white/30 p-2 rounded-full">
              <ArrowDownCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-rose-50">本月收入</p>
              <p className="font-bold text-sm">¥{monthlyIncome.toFixed(0)}</p>
            </div>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
            <div className="bg-white/30 p-2 rounded-full">
              <ArrowUpCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-rose-50">本月支出</p>
              <p className="font-bold text-sm">¥{monthlyExpense.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-end mb-4 px-2">
          <h3 className="font-bold text-lg text-gray-700">最近变动</h3>
          <span className="text-xs text-gray-400">最新3笔</span>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map(t => (
            <div key={t.id} className="bg-white border border-gray-100 p-4 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl">
                  {t.emoji || '💸'}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{t.category}</p>
                  <p className="text-xs text-gray-400">{t.note || t.date}</p>
                </div>
              </div>
              <span className={`font-bold text-lg ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'}¥{t.amount}
              </span>
            </div>
          ))}
          {recentTransactions.length === 0 && (
             <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               还没有账单哦! <br/> 点击 + 号记一笔吧。
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
