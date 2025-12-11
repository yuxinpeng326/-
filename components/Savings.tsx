
import React, { useState, useEffect, useRef } from 'react';
import { SavingsGoal } from '../types';
import { Mascot } from './Mascot';
import { Plus, Trash2, Check, X, Coins, PiggyBank } from 'lucide-react';

interface SavingsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => void;
  onUpdateProgress: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

const GOAL_COLORS = ['#FFD1DC', '#C1E1FF', '#FFF5BA', '#E0BBE4', '#B5EAD7'];

// Hook for smooth number animation
const useAnimatedValue = (target: number, duration = 1000) => {
  const [displayValue, setDisplayValue] = useState(target);
  const valueRef = useRef(target); // Tracks current displayed value to allow interruption

  useEffect(() => {
    const startValue = valueRef.current;
    const startTime = performance.now();
    let animationId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease out function for smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 3);

      const newValue = startValue + (target - startValue) * ease;
      
      valueRef.current = newValue;
      setDisplayValue(newValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [target, duration]);

  return displayValue;
};

// Extracted Item Component
const GoalItem: React.FC<{
  goal: SavingsGoal;
  selectedGoalId: string | null;
  onSelect: (id: string) => void;
  onCancelSelect: () => void;
  onDeposit: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}> = ({ goal, selectedGoalId, onSelect, onCancelSelect, onDeposit, onDelete }) => {
  const [depositAmount, setDepositAmount] = useState('');
  
  // Animate Saved Amount
  const animatedSaved = useAnimatedValue(goal.savedAmount);
  
  // Calculate Progress
  const rawProgress = goal.targetAmount === 0 ? 0 : Math.min(100, (goal.savedAmount / goal.targetAmount) * 100);
  const animatedProgress = useAnimatedValue(rawProgress);
  
  const isCompleted = goal.savedAmount >= goal.targetAmount;
  const isDepositMode = selectedGoalId === goal.id;

  const handleDepositClick = () => {
    if (!depositAmount) return;
    onDeposit(goal.id, parseFloat(depositAmount));
    setDepositAmount('');
  };

  return (
    <div className="relative bg-white rounded-[2rem] p-5 shadow-sm border border-gray-50 overflow-hidden group transition-all hover:shadow-md">
      {/* Background Progress Fill - subtle animation */}
      <div 
        className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-rose-200 to-rose-100 opacity-50 transition-none"
        style={{ width: `${animatedProgress}%` }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform transform group-hover:scale-110" style={{ backgroundColor: goal.color }}>
              {goal.emoji}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{goal.name}</h3>
              <p className="text-xs text-gray-400 font-mono">
                已存 ¥{animatedSaved.toFixed(0)} / 目标 ¥{goal.targetAmount.toFixed(0)}
              </p>
            </div>
          </div>
          <button onClick={() => onDelete(goal.id)} className="text-gray-200 hover:text-red-300 transition-colors p-1">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-5 bg-gray-100 rounded-full overflow-hidden mb-4 border border-gray-50 relative shadow-inner">
            <div 
              className={`h-full rounded-full flex items-center justify-end pr-2 relative overflow-hidden ${isCompleted ? 'bg-gradient-to-r from-emerald-300 to-emerald-400' : 'bg-gradient-to-r from-rose-300 to-rose-400'}`}
              style={{ width: `${animatedProgress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 -skew-x-12 animate-[shimmer_2s_infinite]" />
              
              {animatedProgress > 10 && (
                <span className="text-[10px] text-white font-bold drop-shadow-md z-10">
                  {animatedProgress.toFixed(1)}%
                </span>
              )}
            </div>
        </div>

        {isDepositMode ? (
          <div className="flex gap-2 animate-fade-in-up">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">¥</span>
              <input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="金额"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-7 pr-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-rose-300"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleDepositClick()}
              />
            </div>
            <button 
              onClick={handleDepositClick}
              className="px-4 bg-emerald-400 text-white rounded-xl hover:bg-emerald-500 transition-colors flex items-center shadow-lg shadow-emerald-100 active:scale-95"
            >
              <Check size={18} />
            </button>
            <button 
              onClick={onCancelSelect}
              className="px-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-colors flex items-center"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onSelect(goal.id)}
            disabled={isCompleted}
            className={`w-full py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
              ${isCompleted 
                ? 'bg-emerald-100 text-emerald-600 cursor-default' 
                : 'bg-white border-2 border-rose-100 text-rose-400 hover:bg-rose-50 hover:border-rose-200 hover:shadow-sm active:scale-95'}
            `}
          >
            {isCompleted ? '目标达成! 🎉' : <><Coins size={16} /> 存入一笔</>}
          </button>
        )}
      </div>
    </div>
  );
};

export const Savings: React.FC<SavingsProps> = ({ goals, onAddGoal, onUpdateProgress, onDeleteGoal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  
  // New Goal Form State
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalEmoji, setNewGoalEmoji] = useState('✈️');
  const [newGoalColor, setNewGoalColor] = useState(GOAL_COLORS[0]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalTarget) return;
    onAddGoal({
      name: newGoalName,
      targetAmount: parseFloat(newGoalTarget),
      emoji: newGoalEmoji,
      color: newGoalColor
    });
    setIsAdding(false);
    // Reset form
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalEmoji('✈️');
  };

  const handleDepositWrapper = (id: string, amount: number) => {
    onUpdateProgress(id, amount);
    setSelectedGoalId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">许个愿望</h2>
          <h1 className="text-2xl font-bold text-gray-800">我的存钱罐</h1>
        </div>
        <Mascot mood={isAdding ? 'thinking' : 'happy'} />
      </div>

      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-3 bg-gray-800 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 hover:bg-gray-900 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          新建目标
        </button>
      ) : (
        <form onSubmit={handleCreate} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 animate-fade-in-up">
           <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-700">新罐子</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
           </div>
           
           <div className="flex gap-4">
             <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 relative overflow-hidden transition-colors">
                <input 
                  type="text" 
                  value={newGoalEmoji} 
                  onChange={(e) => setNewGoalEmoji(e.target.value)}
                  maxLength={2}
                  className="w-full h-full text-center bg-transparent focus:outline-none z-10 absolute inset-0 cursor-pointer" 
                />
             </div>
             <div className="flex-1 space-y-3">
               <input 
                  type="text" 
                  placeholder="目标名称 (例如: 日本旅游)" 
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  autoFocus
                />
                <input 
                  type="number" 
                  placeholder="目标金额 (¥)" 
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                />
             </div>
           </div>

           <div className="flex gap-2 justify-between">
              {GOAL_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewGoalColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${newGoalColor === c ? 'border-gray-600 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
           </div>

           <button 
            type="submit" 
            className="w-full py-3 bg-rose-400 text-white rounded-xl font-bold hover:bg-rose-500 transition-colors shadow-md shadow-rose-100 active:scale-95"
           >
             创建存钱罐
           </button>
        </form>
      )}

      <div className="space-y-4">
        {goals.map(goal => (
          <GoalItem 
            key={goal.id}
            goal={goal}
            selectedGoalId={selectedGoalId}
            onSelect={setSelectedGoalId}
            onCancelSelect={() => setSelectedGoalId(null)}
            onDeposit={handleDepositWrapper}
            onDelete={onDeleteGoal}
          />
        ))}
        
        {goals.length === 0 && !isAdding && (
          <div className="text-center p-8 text-gray-400 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200 animate-fade-in">
            <PiggyBank size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="font-bold">还没有存钱目标</p>
            <p className="text-xs">快来许下你的第一个愿望吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};
