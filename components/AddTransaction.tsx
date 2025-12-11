
import React, { useState } from 'react';
import { CATEGORIES, Transaction, TransactionType } from '../types';
import { parseTransactionWithGemini } from '../services/geminiService';
import { Mascot } from './Mascot';
import { Sparkles, Save, X } from 'lucide-react';

interface AddTransactionProps {
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ onSave, onCancel }) => {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: CATEGORIES[0].name,
    type: TransactionType.EXPENSE,
    note: '',
    date: new Date().toISOString().split('T')[0],
    emoji: CATEGORIES[0].emoji
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;
    onSave({
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      note: formData.note,
      date: formData.date,
      emoji: formData.emoji
    });
  };

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setError(null);
    try {
      const result = await parseTransactionWithGemini(aiInput);
      if (result) {
        // Map the result to form data but let user confirm
        const matchedCategory = CATEGORIES.find(c => c.name === result.category) || 
                              CATEGORIES.find(c => c.id === 'other');

        setFormData({
          amount: result.amount?.toString() || '',
          category: matchedCategory?.name || '其他',
          type: (result.type?.toLowerCase() === 'income') ? TransactionType.INCOME : TransactionType.EXPENSE,
          note: result.note || '',
          date: result.date || new Date().toISOString().split('T')[0],
          emoji: result.emoji || matchedCategory?.emoji || '✨'
        });
        setMode('manual'); // Switch to manual for review
      }
    } catch (err) {
      setError("哎呀，AI大脑短路了，再试一次？");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">记一笔</h2>
        <button onClick={onCancel} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200">
            <X size={20} />
        </button>
      </div>

      {/* Toggle */}
      <div className="bg-gray-100 p-1 rounded-2xl flex relative overflow-hidden">
        <div 
          className={`absolute top-1 bottom-1 w-[48%] bg-white rounded-xl shadow-sm transition-all duration-300 ease-spring ${mode === 'manual' ? 'left-1' : 'left-[51%]'}`} 
        />
        <button 
          onClick={() => setMode('manual')}
          className={`flex-1 relative z-10 py-3 text-sm font-bold text-center transition-colors ${mode === 'manual' ? 'text-gray-800' : 'text-gray-400'}`}
        >
          手动记账
        </button>
        <button 
          onClick={() => setMode('ai')}
          className={`flex-1 relative z-10 py-3 text-sm font-bold text-center transition-colors flex items-center justify-center gap-2 ${mode === 'ai' ? 'text-rose-500' : 'text-gray-400'}`}
        >
          <Sparkles size={16} />
          AI智能
        </button>
      </div>

      {mode === 'ai' ? (
        <div className="bg-rose-50 border-2 border-rose-100 rounded-[2rem] p-6 space-y-4">
          <div className="flex justify-center mb-2">
            <Mascot mood="thinking" />
          </div>
          <p className="text-center text-rose-400 font-medium text-sm">
            告诉我发生了什么？ <br/> 例如: "打车去公司花了25元"
          </p>
          <textarea 
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="在这里输入..."
            className="w-full h-32 p-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-rose-300 resize-none text-gray-700"
          />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button 
            onClick={handleAiParse}
            disabled={isAiLoading || !aiInput}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-rose-200 transition-all transform active:scale-95 flex items-center justify-center gap-2
              ${isAiLoading ? 'bg-rose-300' : 'bg-rose-500 hover:bg-rose-600'}
            `}
          >
            {isAiLoading ? '思考中...' : <><Sparkles size={20} /> AI 识别</>}
          </button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          {/* Amount Input */}
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-300">¥</span>
            <input 
              type="number" 
              inputMode="decimal"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              className="w-full bg-white border-2 border-gray-100 rounded-[2rem] py-6 pl-12 pr-6 text-4xl font-bold text-gray-700 focus:outline-none focus:border-rose-300 text-center"
              autoFocus
            />
          </div>

          {/* Type Selection */}
          <div className="flex gap-4">
            {[TransactionType.EXPENSE, TransactionType.INCOME].map(t => (
               <button
                key={t}
                type="button"
                onClick={() => setFormData({...formData, type: t})}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                  formData.type === t 
                  ? (t === TransactionType.EXPENSE ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-emerald-200 bg-emerald-50 text-emerald-500')
                  : 'border-transparent bg-gray-50 text-gray-400'
                }`}
               >
                 {t === TransactionType.EXPENSE ? '支出 💸' : '收入 💰'}
               </button>
            ))}
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-4 gap-3 py-2">
            {CATEGORIES.filter(c => c.type === formData.type || c.id === 'other').slice(0, 8).map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({...formData, category: cat.name, emoji: cat.emoji})}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
                  formData.category === cat.name ? 'bg-gray-800 text-white shadow-lg scale-110' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl mb-1">{cat.emoji}</span>
                <span className="text-[10px] font-bold">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-[2rem]">
            <input 
              type="text" 
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              placeholder="添加备注..."
              className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-rose-300"
            />
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-transparent py-2 text-gray-500 text-sm focus:outline-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gray-800 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-gray-200 hover:bg-gray-900 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            保存账单
          </button>
        </form>
      )}
    </div>
  );
};
