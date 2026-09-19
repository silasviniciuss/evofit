import React from 'react';
import { Play, Clock, Dumbbell, Calendar, ArrowRight, Shield } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface WeekViewProps {
  onStartWorkout: (workoutId: string) => void;
  onSelectDayWorkout: (workoutId: string) => void;
  onOpenAdminSchedule?: () => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  onStartWorkout,
  onSelectDayWorkout,
  onOpenAdminSchedule,
}) => {
  const { schedule, workouts } = useWorkout();
  const currentDayOfWeek = new Date().getDay();

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B3D]">
        <div>
          <span className="text-xs font-black text-[#4DA3FF] uppercase tracking-wider">
            PLANEJAMENTO SEMANAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            MINHA SEMANA
          </h1>
        </div>

        {onOpenAdminSchedule && (
          <button
            onClick={onOpenAdminSchedule}
            className="px-4 py-2 rounded-xl bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] text-xs font-bold text-[#8B98AA] hover:text-white flex items-center gap-2 self-start sm:self-auto transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#1677FF]" />
            Editar Programação da Semana
          </button>
        )}
      </div>

      {/* Days List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedule.map((dayItem) => {
          const isToday = dayItem.dayOfWeek === currentDayOfWeek;
          const matchedWorkout = dayItem.workoutId
            ? workouts.find((w) => w.id === dayItem.workoutId)
            : null;

          return (
            <div
              key={dayItem.dayOfWeek}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isToday
                  ? 'bg-gradient-to-br from-[#15243A] to-[#111B2A] border-[#1677FF] ring-2 ring-[#1677FF]/40 shadow-xl shadow-[#1677FF]/10'
                  : 'bg-[#111B2A] border-[#1E2B3D] hover:border-[#1677FF]/30'
              }`}
            >
              <div>
                {/* Day header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-black uppercase tracking-wider ${
                        isToday ? 'text-[#4DA3FF]' : 'text-white'
                      }`}
                    >
                      {dayItem.dayName}
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full bg-[#1677FF] text-white text-[10px] font-black uppercase">
                        HOJE
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      dayItem.isRestDay
                        ? 'bg-[#0D1420] text-[#8B98AA]'
                        : 'bg-[#1677FF]/20 text-[#4DA3FF] border border-[#1677FF]/30'
                    }`}
                  >
                    {dayItem.isRestDay ? 'Descanso' : dayItem.type}
                  </span>
                </div>

                {/* Workout Title */}
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                  {dayItem.workoutName}
                </h3>

                {/* Specs or Rest message */}
                {dayItem.isRestDay ? (
                  <p className="text-xs text-[#8B98AA] leading-relaxed mb-4">
                    Recuperação muscular e regeneração das fibras. Ótimo dia para caminhada leve ou mobilidade.
                  </p>
                ) : (
                  <div className="flex items-center gap-4 text-xs font-bold text-[#8B98AA] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#1677FF]" />
                      <span>{dayItem.estimatedDuration} minutos</span>
                    </div>
                    {matchedWorkout && (
                      <div className="flex items-center gap-1.5">
                        <Dumbbell className="w-4 h-4 text-[#1677FF]" />
                        <span>{matchedWorkout.exercises.length} exercícios</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              {!dayItem.isRestDay && matchedWorkout && (
                <div className="pt-3 border-t border-[#1E2B3D]/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectDayWorkout(matchedWorkout.id)}
                    className="text-xs font-bold text-[#8B98AA] hover:text-white flex items-center gap-1"
                  >
                    Ver exercícios <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onStartWorkout(matchedWorkout.id)}
                    className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#1677FF]/20 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Iniciar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
