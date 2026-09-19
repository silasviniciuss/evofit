import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { MenuDrawer } from './components/layout/MenuDrawer';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkoutDetailView } from './components/workout/WorkoutDetailView';
import { ActiveWorkoutModal } from './components/workout/ActiveWorkoutModal';
import { WeekView } from './components/week/WeekView';
import { ExerciseLibraryView } from './components/exercises/ExerciseLibraryView';
import { EquipmentLibraryView } from './components/equipment/EquipmentLibraryView';
import { WorkoutHistoryView } from './components/history/WorkoutHistoryView';
import { WeightChartView } from './components/weight/WeightChartView';
import { WeightRegisterModal } from './components/weight/WeightRegisterModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { LoginView } from './components/auth/LoginView';
import { formatTimeSeconds } from './utils/formatters';
import { Play, Clock, Dumbbell, Scale, Plus, Shield } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentUser,
    activeSession,
    startWorkout,
    isAdmin,
  } = useWorkout();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | undefined>(undefined);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState<boolean>(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState<boolean>(false);
  const [isActiveWorkoutModalOpen, setIsActiveWorkoutModalOpen] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // If user is not logged in, do not show any information or panels!
  if (!currentUser) {
    return <LoginView />;
  }

  // Tab change handler with Admin check
  const handleTabChange = (tab: string) => {
    if (tab === 'admin' && !isAdmin) {
      setIsAdminLoginModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start workout flow
  const handleStartWorkout = (workoutId: string) => {
    startWorkout(workoutId);
    setIsActiveWorkoutModalOpen(true);
  };

  // Select day workout from week or dashboard
  const handleSelectDayWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setCurrentTab('workout_today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isWorkoutTab = currentTab === 'workout' || currentTab === 'workout_today';

  return (
    <div className="min-h-screen bg-[#070B12] text-white flex flex-col font-sans selection:bg-[#1677FF] selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        openActiveWorkout={() => setIsActiveWorkoutModalOpen(true)}
      />

      {/* Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (PRD Section 38) */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={handleTabChange}
          openActiveWorkout={() => setIsActiveWorkoutModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full max-w-5xl">
          {/* TAB 1: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <DashboardView
              onStartWorkout={handleStartWorkout}
              onOpenWeightModal={() => setIsWeightModalOpen(true)}
              onSelectDayWorkout={handleSelectDayWorkout}
              setCurrentTab={handleTabChange}
            />
          )}

          {/* TAB 2: TREINO DO DIA / DETALHES */}
          {isWorkoutTab && (
            <WorkoutDetailView
              selectedWorkoutId={selectedWorkoutId}
              onStartWorkout={handleStartWorkout}
            />
          )}

          {/* TAB 3: MINHA SEMANA */}
          {currentTab === 'week' && (
            <WeekView
              onStartWorkout={handleStartWorkout}
              onSelectDayWorkout={handleSelectDayWorkout}
              onOpenAdminSchedule={() => {
                if (isAdmin) {
                  setCurrentTab('admin');
                } else {
                  setIsAdminLoginModalOpen(true);
                }
              }}
            />
          )}

          {/* TAB 4: MEUS EXERCÍCIOS */}
          {currentTab === 'exercises' && (
            <ExerciseLibraryView
              onStartExerciseWorkout={() => {
                setSelectedWorkoutId(undefined);
                setCurrentTab('workout_today');
              }}
              onSelectWorkout={(workoutId) => {
                setSelectedWorkoutId(workoutId);
                setCurrentTab('workout_today');
              }}
              onOpenAdminNewExercise={() => {
                if (isAdmin) {
                  setCurrentTab('admin');
                } else {
                  setIsAdminLoginModalOpen(true);
                }
              }}
            />
          )}

          {/* TAB 5: MEUS APARELHOS */}
          {currentTab === 'equipment' && (
            <EquipmentLibraryView
              onOpenAdminNewEquipment={() => {
                if (isAdmin) {
                  setCurrentTab('admin');
                } else {
                  setIsAdminLoginModalOpen(true);
                }
              }}
            />
          )}

          {/* TAB 6: HISTÓRICO DE TREINOS */}
          {currentTab === 'history' && <WorkoutHistoryView />}

          {/* TAB 7: EVOLUÇÃO DO PESO */}
          {currentTab === 'weight' && (
            <div className="space-y-6 pb-24">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3D]">
                <div>
                  <span className="text-xs font-black text-[#4DA3FF] uppercase tracking-wider">
                    PESO CORPORAL
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    EVOLUÇÃO & HISTÓRICO
                  </h1>
                </div>
                <button
                  onClick={() => setIsWeightModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#1677FF]/30"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  + REGISTRAR PESO
                </button>
              </div>

              <WeightChartView />
            </div>
          )}

          {/* TAB 8: PAINEL ADMINISTRATIVO (PRD Section 12-15, 33-36) */}
          {currentTab === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Floating Active Workout Pill (if minimized & active) */}
      {activeSession && !isActiveWorkoutModalOpen && (
        <div
          onClick={() => setIsActiveWorkoutModalOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-40 cursor-pointer animate-bounce group"
        >
          <div className="flex items-center gap-3 bg-[#111B2A] border-2 border-[#1677FF] hover:border-[#4DA3FF] rounded-2xl p-3 pr-4 shadow-2xl shadow-[#1677FF]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1677FF] flex items-center justify-center text-white shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                <span className="text-xs font-black uppercase text-white tracking-wider">
                  {activeSession.workoutName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#4DA3FF] font-black">
                <Clock className="w-3 h-3" />
                {formatTimeSeconds(activeSession.elapsedSeconds)}
                {activeSession.isResting && (
                  <span className="text-[#F59E0B] font-bold">
                    • Descanso: {formatTimeSeconds(activeSession.restRemaining)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation (PRD Section 38) */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        openMenuDrawer={() => setIsMenuDrawerOpen(true)}
      />

      {/* Mobile Side Drawer */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        setCurrentTab={handleTabChange}
      />

      {/* Weight Register Modal */}
      <WeightRegisterModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
      />

      {/* Active Workout Screen Modal */}
      <ActiveWorkoutModal
        isOpen={isActiveWorkoutModalOpen}
        onClose={() => setIsActiveWorkoutModalOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={() => setCurrentTab('admin')}
      />
    </div>
  );
};

export default function App() {
  return (
    <WorkoutProvider>
      <MainContent />
    </WorkoutProvider>
  );
}
