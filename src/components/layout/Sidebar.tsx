import React from 'react';
import {
  Home,
  Calendar,
  Dumbbell,
  Layers,
  Wrench,
  Scale,
  History,
  Shield,
  LogOut,
  Play,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openActiveWorkout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, openActiveWorkout }) => {
  const { logout, activeSession } = useWorkout();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'week', label: 'Semana', icon: Calendar },
    { id: 'workout_today', label: 'Treino de Hoje', icon: Dumbbell, highlight: !!activeSession },
    { id: 'exercises', label: 'Exercícios', icon: Layers },
    { id: 'equipment', label: 'Aparelhos', icon: Wrench },
    { id: 'weight', label: 'Peso Corporal', icon: Scale },
    { id: 'history', label: 'Histórico', icon: History },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0D1420] border-r border-[#1E2B3D] min-h-[calc(100vh-61px)] p-4 select-none shrink-0">
      {/* Active Workout Banner if running */}
      {activeSession && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#22C55E]/20 to-[#1677FF]/20 border border-[#22C55E]/40">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-extrabold text-[#22C55E] tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              TREINO ATIVO
            </span>
            <span className="text-[11px] font-mono text-[#8B98AA]">
              {Math.floor(activeSession.elapsedSeconds / 60)}m {activeSession.elapsedSeconds % 60}s
            </span>
          </div>
          <p className="text-xs font-bold text-white truncate mb-2">{activeSession.workoutName}</p>
          <button
            onClick={openActiveWorkout}
            className="w-full py-1.5 px-2.5 rounded-lg bg-[#22C55E] hover:bg-[#16a34a] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Continuar Treino
          </button>
        </div>
      )}

      {/* Main Navigation links */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider mb-2">
          SISTEMA PRINCIPAL
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/25'
                  : 'text-[#8B98AA] hover:text-white hover:bg-[#111B2A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8B98AA]'}`} />
                <span>{item.label}</span>
              </div>
              {item.highlight && (
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Admin section */}
      <div className="mt-6 pt-5 border-t border-[#1E2B3D] space-y-1">
        <p className="px-3 text-[10px] font-extrabold text-[#4DA3FF] uppercase tracking-wider mb-2">
          ADMINISTRAÇÃO
        </p>
        <button
          onClick={() => setCurrentTab('admin')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentTab === 'admin'
              ? 'bg-[#15243A] text-[#4DA3FF] border border-[#1677FF]/50 shadow-sm'
              : 'text-[#8B98AA] hover:text-white hover:bg-[#111B2A]'
          }`}
        >
          <Shield className="w-4 h-4 text-[#4DA3FF]" />
          <span>Painel Silas</span>
        </button>
      </div>

      {/* Footer logout */}
      <div className="mt-auto pt-4 border-t border-[#1E2B3D]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#8B98AA] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};
