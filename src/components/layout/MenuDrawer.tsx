import React from 'react';
import {
  X,
  Layers,
  Wrench,
  History,
  Shield,
  RotateCcw,
  LogOut,
  Calendar,
  Home,
  Scale,
  Dumbbell,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentTab: (tab: string) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose, setCurrentTab }) => {
  const { logout, resetAllData } = useWorkout();

  if (!isOpen) return null;

  const navigate = (tab: string) => {
    setCurrentTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm md:hidden animate-fade-in">
      <div
        className="w-full bg-[#0D1420] border-t border-[#1E2B3D] rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3D]">
          <div>
            <span className="text-xs font-bold text-[#4DA3FF] uppercase tracking-wider">SILAS VINÍCIUS</span>
            <h3 className="text-base font-extrabold text-white">MENU DO SISTEMA</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#111B2A] text-[#8B98AA] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="py-4 space-y-1">
          <button
            onClick={() => navigate('dashboard')}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold text-white hover:bg-[#111B2A]"
          >
            <Home className="w-5 h-5 text-[#1677FF]" />
            <span>Dashboard Principal</span>
          </button>

          <button
            onClick={() => navigate('week')}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold text-white hover:bg-[#111B2A]"
          >
            <Calendar className="w-5 h-5 text-[#1677FF]" />
            <span>Minha Semana</span>
          </button>

          <button
            onClick={() => navigate('workout_today')}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold text-white hover:bg-[#111B2A]"
          >
            <Dumbbell className="w-5 h-5 text-[#1677FF]" />
            <span>Treino do Dia</span>
          </button>

          <button
            onClick={() => navigate('exercises')}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold text-white hover:bg-[#111B2A]"
          >
            <Layers className="w-5 h-5 text-[#4DA3FF]" />
            <span>Biblioteca de Exercícios</span>
          </button>

          <button
            onClick={() => navigate('equipment')}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold text-white hover:bg-[#111B2A]"
          >
            <Wrench className="w-5 h-5 text-[#4DA3FF]" />
            <span>Biblioteca de Aparelhos</span>
          </button>

          <button
            onClick={() => navigate('weight')}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold text-white hover:bg-[#111B2A]"
          >
            <Scale className="w-5 h-5 text-[#4DA3FF]" />
            <span>Controle de Peso & Evolução</span>
          </button>

          <button
            onClick={() => navigate('history')}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold text-white hover:bg-[#111B2A]"
          >
            <History className="w-5 h-5 text-[#4DA3FF]" />
            <span>Histórico de Treinos</span>
          </button>
        </div>

        {/* Administration highlight */}
        <div className="pt-3 border-t border-[#1E2B3D] space-y-2">
          <button
            onClick={() => navigate('admin')}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left text-sm font-bold bg-[#15243A] text-[#4DA3FF] border border-[#1677FF]/40 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#1677FF]" />
              <span>Painel Administrativo Silas</span>
            </div>
            <span className="text-xs bg-[#1677FF] text-white px-2 py-0.5 rounded-full font-bold">ADMIN</span>
          </button>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                if (window.confirm('Deseja redefinir todos os dados de treino e peso para os valores padrão originais?')) {
                  resetAllData();
                  onClose();
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#111B2A] text-xs font-semibold text-[#8B98AA] hover:text-white border border-[#1E2B3D]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Padrão
            </button>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#EF4444]/10 text-xs font-semibold text-[#EF4444] border border-[#EF4444]/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
