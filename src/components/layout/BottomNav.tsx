import React from 'react';
import { Home, Calendar, Dumbbell, Scale, Menu } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openMenuDrawer: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, openMenuDrawer }) => {
  const { activeSession } = useWorkout();

  const navItems = [
    { id: 'dashboard', label: 'INÍCIO', icon: Home },
    { id: 'week', label: 'SEMANA', icon: Calendar },
    { id: 'workout_today', label: 'TREINO', icon: Dumbbell, hasBadge: !!activeSession },
    { id: 'weight', label: 'PESO', icon: Scale },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070B12]/95 backdrop-blur-xl border-t border-[#1E2B3D] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isWorkoutButton = item.id === 'workout_today';

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isWorkoutButton && activeSession
                  ? 'text-[#22C55E]'
                  : isActive
                  ? 'text-[#1677FF]'
                  : 'text-[#8B98AA] hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-[#070B12] animate-ping" />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wider mt-1 uppercase">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#1677FF] mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Menu / Mais */}
        <button
          onClick={openMenuDrawer}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            currentTab === 'menu' || currentTab === 'admin'
              ? 'text-[#1677FF]'
              : 'text-[#8B98AA] hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5 stroke-2" />
          <span className="text-[10px] font-bold tracking-wider mt-1 uppercase">
            MENU
          </span>
        </button>
      </div>
    </nav>
  );
};
