import React from 'react';
import { Dumbbell, Shield, Play, LogOut, User as UserIcon } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { getPortugueseTodayHeader } from '../../utils/formatters';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openActiveWorkout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, openActiveWorkout }) => {
  const { currentUser, logout, activeSession, isAdmin, setAdminMode } = useWorkout();
  const { dayOfWeek, dateFormatted } = getPortugueseTodayHeader();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070B12]/95 backdrop-blur-md border-b border-[#1E2B3D] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1677FF] to-[#0A5BE7] flex items-center justify-center text-white shadow-lg shadow-[#1677FF]/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-white uppercase">SILAS VINÍCIUS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1677FF]/15 text-[#4DA3FF] border border-[#1677FF]/30 hidden sm:inline-block">
                SISTEMA PESSOAL
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#8B98AA] tracking-wider uppercase">
              MEU TREINO <span className="text-[#4DA3FF] opacity-60">• PERSONAL SYSTEM</span>
            </p>
          </div>
        </div>

        {/* Center / Date badge */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-xs font-semibold text-[#4DA3FF] uppercase tracking-wider">{dayOfWeek}</span>
          <span className="text-[11px] text-[#8B98AA] font-medium">{dateFormatted}</span>
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Workout Floating Banner */}
          {activeSession && (
            <button
              onClick={openActiveWorkout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs font-bold animate-pulse hover:bg-[#22C55E]/25 transition-all shadow-sm"
              title="Continuar treino em andamento"
            >
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">EM ANDAMENTO:</span>
              <span className="max-w-[110px] truncate">{activeSession.workoutName}</span>
            </button>
          )}

          {/* Admin Toggle button */}
          <button
            onClick={() => {
              if (currentTab === 'admin') {
                setCurrentTab('dashboard');
              } else {
                setCurrentTab('admin');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'admin'
                ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                : 'bg-[#111B2A] text-[#8B98AA] hover:text-white hover:bg-[#15243A] border border-[#1E2B3D]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#4DA3FF]" />
            <span className="hidden sm:inline">PAINEL ADMIN</span>
            <span className="sm:hidden">ADMIN</span>
          </button>

          {/* User profile / Logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-[#1E2B3D]">
            <div className="w-8 h-8 rounded-full bg-[#15243A] border border-[#1E2B3D] flex items-center justify-center text-[#4DA3FF]">
              <UserIcon className="w-4 h-4" />
            </div>
            <button
              onClick={logout}
              title="Sair da conta"
              className="p-1.5 rounded-lg text-[#8B98AA] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
