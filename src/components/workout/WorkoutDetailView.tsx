import React, { useState } from 'react';
import {
  Play,
  Clock,
  Dumbbell,
  ArrowRight,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { Workout, Exercise } from '../../types';
import { ExerciseDetailModal } from './ExerciseDetailModal';

interface WorkoutDetailViewProps {
  selectedWorkoutId?: string;
  onStartWorkout: (workoutId: string) => void;
}

export const WorkoutDetailView: React.FC<WorkoutDetailViewProps> = ({
  selectedWorkoutId,
  onStartWorkout,
}) => {
  const { workouts, exercises, activeSession } = useWorkout();

  // Pick selected workout, or fallback to first active / today's workout
  const currentWorkout =
    workouts.find((w) => w.id === selectedWorkoutId) ||
    workouts.find((w) => !w.isRestDay) ||
    workouts[0];

  const [activeWorkoutId, setActiveWorkoutId] = useState<string>(currentWorkout?.id || '');
  const [inspectExercise, setInspectExercise] = useState<Exercise | null>(null);

  const displayWorkout = workouts.find((w) => w.id === (selectedWorkoutId || activeWorkoutId)) || currentWorkout;

  if (!displayWorkout) {
    return (
      <div className="p-8 text-center text-[#8B98AA]">
        Nenhum treino cadastrado no momento.
      </div>
    );
  }

  // Resolve exercises with catalog
  const workoutExercises = displayWorkout.exercises.map((item) => {
    const ex = exercises.find((e) => e.id === item.exerciseId) || {
      id: item.exerciseId,
      name: 'Exercício',
      muscleGroup: 'Peito',
      location: 'Academia',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      instructions: 'Execute com postura correta e respiração ritmada.',
      defaultSets: item.sets,
      defaultReps: item.reps,
      defaultWeight: item.weight,
      defaultRest: item.rest,
    };
    return {
      ...item,
      exercise: ex as Exercise,
    };
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Workout Selector Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {workouts
          .filter((w) => !w.isRestDay)
          .map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveWorkoutId(w.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                displayWorkout.id === w.id
                  ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                  : 'bg-[#111B2A] text-[#8B98AA] hover:text-white border border-[#1E2B3D]'
              }`}
            >
              {w.dayName ? `${w.dayName} • ` : ''}{w.name}
            </button>
          ))}
      </div>

      {/* Main Hero Card for the Selected Workout (PRD Section 14) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#15243A] via-[#111B2A] to-[#0D1420] border border-[#1E2B3D] p-6 lg:p-8 shadow-2xl overflow-hidden">
        {/* Glow circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1677FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1677FF]/20 border border-[#1677FF]/40 text-[#4DA3FF] text-xs font-black uppercase tracking-wider">
                {displayWorkout.dayName || 'ROTINA'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#111B2A] border border-[#1E2B3D] text-[#8B98AA] text-xs font-semibold">
                {displayWorkout.type}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
              {displayWorkout.name}
            </h1>

            {displayWorkout.notes && (
              <p className="text-xs sm:text-sm text-[#8B98AA] max-w-xl">
                {displayWorkout.notes}
              </p>
            )}

            {/* Quick Metrics */}
            <div className="flex items-center gap-6 pt-1 text-xs font-bold text-[#8B98AA]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1677FF]" />
                <span className="text-white font-black">{displayWorkout.estimatedDuration} MIN</span>
                <span>ESTIMADOS</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#1677FF]" />
                <span className="text-white font-black">{workoutExercises.length} EXERCÍCIOS</span>
              </div>
            </div>
          </div>

          {/* Big Start Workout Button (PRD Section 9 / 14) */}
          <div className="shrink-0">
            <button
              onClick={() => onStartWorkout(displayWorkout.id)}
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1677FF] to-[#0A5BE7] hover:from-[#4DA3FF] hover:to-[#1677FF] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-[#1677FF]/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              INICIAR TREINO
            </button>
          </div>
        </div>
      </div>

      {/* Exercises List (PRD Section 14: 01 — Supino reto, foto, 4 x 12, 20 kg, VER EXERCÍCIO →) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black text-[#8B98AA] uppercase tracking-wider">
            ORDEM DOS EXERCÍCIOS ({workoutExercises.length})
          </h2>
          <span className="text-xs text-[#4DA3FF] font-bold">Toque no card para ver detalhes</span>
        </div>

        <div className="space-y-3">
          {workoutExercises.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setInspectExercise(item.exercise)}
              className="group p-4 sm:p-5 rounded-2xl bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] hover:border-[#1677FF]/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                {/* Number badge */}
                <span className="w-9 h-9 rounded-xl bg-[#0D1420] border border-[#1E2B3D] flex items-center justify-center text-xs font-black text-[#4DA3FF] group-hover:border-[#1677FF] shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Photo thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0D1420] border border-[#1E2B3D] shrink-0">
                  <img
                    src={item.exercise.imageUrl}
                    alt={item.exercise.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Title & Muscle group */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#1677FF] uppercase tracking-wider">
                      {item.exercise.muscleGroup}
                    </span>
                    {item.exercise.equipmentName && (
                      <span className="text-[10px] text-[#8B98AA] hidden sm:inline">
                        • {item.exercise.equipmentName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide group-hover:text-[#4DA3FF] transition-colors">
                    {item.exercise.name}
                  </h3>
                </div>
              </div>

              {/* Sets x Reps & Weight and Action */}
              <div className="flex items-center justify-between sm:justify-end gap-5 pl-14 sm:pl-0 border-t sm:border-t-0 border-[#1E2B3D]/50 pt-2 sm:pt-0">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="px-3 py-1.5 rounded-xl bg-[#0D1420] border border-[#1E2B3D] text-white">
                    <span className="text-[#8B98AA]">SÉRIES: </span>
                    <span className="text-white font-black">{item.sets} × {item.reps}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#0D1420] border border-[#1E2B3D] text-white">
                    <span className="text-[#8B98AA]">CARGA: </span>
                    <span className="text-[#4DA3FF] font-black">
                      {item.weight > 0 ? `${item.weight} kg` : 'Corporal'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-extrabold text-[#1677FF] group-hover:translate-x-1 transition-transform">
                  <span className="hidden md:inline">VER EXERCÍCIO</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {inspectExercise && (
        <ExerciseDetailModal
          exercise={inspectExercise}
          isOpen={!!inspectExercise}
          onClose={() => setInspectExercise(null)}
          onStartExercise={() => onStartWorkout(displayWorkout.id)}
        />
      )}
    </div>
  );
};
