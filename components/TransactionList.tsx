
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';
import { Trash2, Search, X, Calendar, Filter } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search Text (Note or Amount)
      const matchesSearch = 
        t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.amount.toString().includes(searchTerm);
      
      // Category Filter
      const matchesCategory = selectedCategory === '全部' || t.category === selectedCategory;

      // Date Filter
      const matchesDate = !selectedDate || t.date === selectedDate;

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [transactions, searchTerm, selectedCategory, selectedDate]);
  
  // Group by Date using filtered data
  const grouped = filteredTransactions.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {} as Record<string, Transaction[]>);

  // Sort dates descending
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Get unique categories that actually exist in transactions + '全部'
  const activeCategories = ['全部', ...Array.from(new Set(transactions.map(t => t.category)))];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">账单明细</h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-rose-100 text-rose-500' : 'bg-gray-100 text-gray-400'}`}
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="space-y-3 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索备注或金额..."
            className="w-full bg-gray-50 rounded-2xl py-3 pl-11 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Extended Filters */}
        <div className={`space-y-3 overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
            <Calendar size={16} className="text-gray-400" />
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm text-gray-600 w-full focus:outline-none"
            />
            {selectedDate && (
               <button onClick={() => setSelectedDate('')} className="text-xs text-rose-400 font-bold">清除</button>
            )}
          </div>
        </div>

        {/* Category Chips (Horizontal Scroll) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
             <button
               key={cat.id}
               onClick={() => setSelectedCategory(selectedCategory === cat.name ? '全部' : cat.name)}
               className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                 selectedCategory === cat.name 
                   ? 'bg-gray-800 text-white border-gray-800' 
                   : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
               }`}
             >
               <span>{cat.emoji}</span>
               {cat.name}
             </button>
          ))}
        </div>
      </div>
      
      {/* List */}
      <div className="space-y-6 pt-2">
        {sortedDates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                <span className="text-4xl mb-4 opacity-50">🔍</span>
                <p className="text-gray-400 font-medium">没有找到相关账单</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedCategory('全部'); setSelectedDate('');}}
                  className="mt-2 text-rose-400 text-sm hover:underline"
                >
                  清除所有筛选
                </button>
            </div>
        ) : (
            sortedDates.map(date => (
              <div key={date} className="animate-fade-in-up">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2 flex justify-between items-center">
                  <span>{new Date(date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}</span>
                  <span className="text-[10px] bg-rose-50 text-rose-400 px-2 py-1 rounded-lg">
                    {grouped[date].length} 笔
                  </span>
                </h3>
                <div className="space-y-3">
                  {grouped[date].map(t => (
                    <div key={t.id} className="group relative bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex justify-between items-center overflow-hidden transition-transform hover:scale-[1.01]">
                      <div className="flex items-center gap-4 relative z-10">
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl shadow-inner">
                              {t.emoji}
                          </div>
                          <div>
                              <p className="font-bold text-gray-700 text-sm">{t.category}</p>
                              <p className="text-xs text-gray-400">{t.note}</p>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-4 relative z-10">
                           <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {t.type === TransactionType.INCOME ? '+' : '-'}¥{t.amount}
                          </span>
                          <button 
                              onClick={() => onDelete(t.id)}
                              className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"
                          >
                              <Trash2 size={16} />
                          </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};
