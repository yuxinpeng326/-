
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface StatsProps {
  transactions: Transaction[];
}

interface CategoryStat {
  name: string;
  value: number;
  [key: string]: any;
}

const COLORS = ['#FFB7C5', '#C1E1FF', '#FFF5BA', '#E0BBE4', '#957DAD', '#FEC8D8', '#B5EAD7'];

export const Stats: React.FC<StatsProps> = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  
  // Group by Category
  const groupedStats = expenseTransactions.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { name: curr.category, value: 0 };
    }
    acc[curr.category].value += curr.amount;
    return acc;
  }, {} as Record<string, CategoryStat>);

  const categoryData: CategoryStat[] = Object.values(groupedStats);

  // Sort and take top 5
  categoryData.sort((a, b) => b.value - a.value);

  // Weekly Data (Mock logic for simplicity, just grouping by day)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const weeklyData = last7Days.map(date => {
    const dayExpenses = transactions
      .filter(t => t.date === date && t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      day: new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' }),
      amount: dayExpenses
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">消费习惯</h2>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-center font-bold text-gray-500 mb-4">分类支出</h3>
        <div className="h-64 w-full">
            {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                >
                    {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#555', fontWeight: 'bold' }}
                    formatter={(value: number) => `¥${value.toFixed(2)}`}
                />
                </PieChart>
            </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-300">暂无数据</div>
            )}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
            {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length]}} />
                    <span className="text-xs text-gray-500 font-medium">{entry.name}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-center font-bold text-gray-500 mb-4">近7天趋势</h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                <Tooltip 
                    cursor={{fill: '#f3f4f6', radius: 8}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`¥${value}`, '支出']}
                />
                <Bar dataKey="amount" fill="#FFB7C5" radius={[10, 10, 10, 10]} barSize={12} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
