import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Play,
  RotateCcw,
  SkipForward,
  Plus,
  Minus,
  Clock,
  Dumbbell,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { formatTimeSeconds } from '../../utils/formatters';
import { ExerciseDetailModal } from './ExerciseDetailModal';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({ isOpen, onClose }) => {
  const {
    activeSession,
    completeSet,
    skipRest,
    addRestSeconds,
    finishWorkout,
    cancelWorkout,
  } = useWorkout();

  const [currentReps, setCurrentReps] = useState<number>(12);
  const [currentWeight, setCurrentWeight] = useState<number>(20);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [viewExerciseDetail, setViewExerciseDetail] = useState<boolean>(false);

  // Sync inputs with current exercise defaults
  useEffect(() => {
    if (activeSession) {
      const currentItem = activeSession.exercises[activeSession.currentExerciseIndex];
      if (currentItem) {
        // If there's an already completed set for this exercise, use its values, or defaults
        const doneSets = activeSession.completedSets[currentItem.id] || [];
        if (doneSets.length > 0) {
          const lastSet = doneSets[doneSets.length - 1];
          setCurrentReps(lastSet.reps);
          setCurrentWeight(lastSet.weight);
        } else {
          setCurrentReps(currentItem.reps || currentItem.exercise.defaultReps || 12);
          setCurrentWeight(currentItem.weight || currentItem.exercise.defaultWeight || 20);
        }
      }
    }
  }, [activeSession?.currentExerciseIndex, activeSession?.currentSetIndex]);

  if (!isOpen || !activeSession) return null;

  const currentItem = activeSession.exercises[activeSession.currentExerciseIndex];
  const doneSets = currentItem ? activeSession.completedSets[currentItem.id] || [] : [];
  const currentSetNum = doneSets.length + 1;
  const totalSetsForExercise = currentItem?.sets || 4;

  // Calculate overall stats
  let totalSetsDone = 0;
  let totalSetsGoal = 0;
  let totalExercisesDone = 0;

  activeSession.exercises.forEach((item) => {
    totalSetsGoal += item.sets;
    const sets = activeSession.completedSets[item.id] || [];
    totalSetsDone += sets.length;
    if (sets.length >= item.sets && item.sets > 0) {
      totalExercisesDone += 1;
    }
  });

  const isLastSetOfAll =
    activeSession.currentExerciseIndex >= activeSession.exercises.length - 1 &&
    currentSetNum > totalSetsForExercise;

  const handleFinish = () => {
    finishWorkout(workoutNotes);
    setIsFinishing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070B12] text-white overflow-y-auto animate-fade-in">
      {/* Top sticky bar */}
      <div className="sticky top-0 z-30 bg-[#070B12]/95 backdrop-blur-md border-b border-[#1E2B3D] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#111B2A] text-[#8B98AA] hover:text-white border border-[#1E2B3D]"
            title="Minimizar treino (continua rodando em segundo plano)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {activeSession.workoutName}
              </h2>
            </div>
            <p className="text-[10px] text-[#8B98AA] font-bold">
              Exercício {activeSession.currentExerciseIndex + 1} de {activeSession.exercises.length}
            </p>
          </div>
        </div>

        {/* Workout elapsed timer (PRD Section 20) */}
        <div className="flex items-center gap-2 bg-[#111B2A] px-3 py-1.5 rounded-xl border border-[#1E2B3D]">
          <Clock className="w-4 h-4 text-[#1677FF]" />
          <span className="font-mono text-sm sm:text-base font-black text-[#4DA3FF] tracking-wider">
            {formatTimeSeconds(activeSession.elapsedSeconds)}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFinishing(true)}
            className="px-3 py-1.5 rounded-xl bg-[#22C55E]/15 hover:bg-[#22C55E]/30 text-[#22C55E] border border-[#22C55E]/30 text-xs font-black tracking-wider transition-colors"
          >
            FINALIZAR
          </button>
        </div>
      </div>

      {/* Main workout body */}
      <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between space-y-6 pb-24">
        {/* Current Exercise Header Card */}
        {currentItem && (
          <div className="space-y-4">
            <div className="relative w-full h-52 sm:h-64 rounded-3xl overflow-hidden bg-[#111B2A] border border-[#1E2B3D] group shadow-xl">
              <img
                src={currentItem.exercise.imageUrl}
                alt={currentItem.exercise.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B12] via-[#070B12]/40 to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#1677FF] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                  {currentItem.exercise.muscleGroup}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white/90 border border-white/10">
                  {currentItem.exercise.location}
                </span>
              </div>

              <button
                onClick={() => setViewExerciseDetail(true)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/90 hover:text-white border border-white/10 flex items-center gap-1 text-xs font-bold"
              >
                <Info className="w-4 h-4 text-[#4DA3FF]" />
                <span className="hidden sm:inline">Instruções</span>
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-bold text-[#4DA3FF] uppercase tracking-wider block mb-0.5">
                  {currentItem.exercise.equipmentName || 'Aparelho Padrão'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide drop-shadow-md">
                  {currentItem.exercise.name}
                </h3>
              </div>
            </div>

            {/* Set tracker bubbles (e.g. SÉRIE 2 / 4) */}
            <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-[#8B98AA] uppercase tracking-wider">
                  PROGRESSO DO EXERCÍCIO
                </span>
                <span className="text-xs font-black text-[#1677FF]">
                  SÉRIE {Math.min(currentSetNum, totalSetsForExercise)} / {totalSetsForExercise}
                </span>
              </div>

              {/* Set indicators */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: totalSetsForExercise }).map((_, idx) => {
                  const setItem = doneSets[idx];
                  const isDone = !!setItem;
                  const isCurrent = idx === doneSets.length;

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isDone
                          ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
                          : isCurrent
                          ? 'bg-[#1677FF]/20 border-[#1677FF] text-white ring-2 ring-[#1677FF]/30'
                          : 'bg-[#0D1420] border-[#1E2B3D] text-[#8B98AA]'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider">
                        Série {idx + 1}
                      </div>
                      <div className="text-xs font-black mt-0.5">
                        {isDone ? (
                          <span className="flex items-center justify-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            {setItem.reps} × {setItem.weight}k
                          </span>
                        ) : (
                          <span>{currentItem.reps} reps</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* REST COUNTDOWN OVERLAY / BANNER (PRD Section 20) */}
        {activeSession.isResting ? (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#15243A] to-[#111B2A] border-2 border-[#1677FF] text-center shadow-2xl relative overflow-hidden animate-pulse">
            <span className="text-xs font-black text-[#4DA3FF] uppercase tracking-widest block mb-2">
              DESCANSO EM ANDAMENTO
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight my-2">
              {formatTimeSeconds(activeSession.restRemaining)}
            </div>
            <p className="text-xs text-[#8B98AA] mb-5">
              Respire fundo, hidrate-se e prepare-se para a próxima série.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => addRestSeconds(15)}
                className="px-4 py-2.5 rounded-xl bg-[#0D1420] hover:bg-[#111B2A] border border-[#1E2B3D] text-xs font-bold text-[#8B98AA] hover:text-white transition-colors"
              >
                +15s
              </button>
              <button
                onClick={skipRest}
                className="px-6 py-3 rounded-2xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#1677FF]/40 transition-all"
              >
                <SkipForward className="w-4 h-4 fill-current" />
                PRÓXIMA SÉRIE
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE SET INPUTS & BIG COMPLETE BUTTON (PRD Section 19) */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Repetições */}
              <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-black text-[#8B98AA] uppercase tracking-wider block mb-2">
                  REPETIÇÕES
                </span>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentReps((r) => Math.max(1, r - 1))}
                    className="w-10 h-10 rounded-xl bg-[#0D1420] border border-[#1E2B3D] text-lg font-black text-white hover:bg-[#15243A] flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={currentReps}
                    onChange={(e) => setCurrentReps(parseInt(e.target.value) || 0)}
                    className="w-16 text-center text-2xl font-black text-white bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => setCurrentReps((r) => r + 1)}
                    className="w-10 h-10 rounded-xl bg-[#0D1420] border border-[#1E2B3D] text-lg font-black text-white hover:bg-[#15243A] flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Carga (kg) */}
              <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-black text-[#8B98AA] uppercase tracking-wider block mb-2">
                  CARGA (KG)
                </span>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentWeight((w) => Math.max(0, w - 2))}
                    className="w-10 h-10 rounded-xl bg-[#0D1420] border border-[#1E2B3D] text-lg font-black text-white hover:bg-[#15243A] flex items-center justify-center"
                  >
                    -
                  </button>
                  <div className="flex items-baseline justify-center">
                    <input
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                      className="w-16 text-center text-2xl font-black text-white bg-transparent focus:outline-none"
                    />
                    <span className="text-[10px] text-[#8B98AA] font-bold">kg</span>
                  </div>
                  <button
                    onClick={() => setCurrentWeight((w) => w + 2)}
                    className="w-10 h-10 rounded-xl bg-[#0D1420] border border-[#1E2B3D] text-lg font-black text-white hover:bg-[#15243A] flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* BIG CONCLUIR SÉRIE BUTTON (PRD Section 19) */}
            <button
              onClick={() => completeSet(currentReps, currentWeight)}
              className="w-full py-5 rounded-3xl bg-gradient-to-r from-[#1677FF] to-[#0A5BE7] hover:from-[#4DA3FF] hover:to-[#1677FF] text-white font-black text-lg sm:text-xl uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-[#1677FF]/40 active:scale-95 transition-all"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              CONCLUIR SÉRIE
            </button>
          </div>
        )}

        {/* Global Progress Bar */}
        <div className="pt-4 border-t border-[#1E2B3D] flex items-center justify-between text-xs text-[#8B98AA]">
          <span>
            Treino total: <strong className="text-white">{totalSetsDone}</strong> / {totalSetsGoal} séries
          </span>
          <button
            onClick={() => {
              if (window.confirm('Deseja realmente cancelar e descartar este treino?')) {
                cancelWorkout();
                onClose();
              }
            }}
            className="text-[#EF4444] hover:underline"
          >
            Cancelar Treino
          </button>
        </div>
      </div>

      {/* FINISH WORKOUT MODAL (PRD Section 21: TREINO CONCLUÍDO 🎉) */}
      {isFinishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-md bg-[#0D1420] border-2 border-[#22C55E]/50 rounded-3xl p-6 text-center relative shadow-2xl overflow-hidden">
            {/* Glow accent */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#22C55E]/20 rounded-full blur-3xl pointer-events-none" />

            <span className="text-4xl mb-3 block">🎉</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-1">
              TREINO CONCLUÍDO
            </h3>
            <p className="text-sm font-bold text-[#4DA3FF] uppercase tracking-wide mb-6">
              {activeSession.workoutName}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-black text-[#8B98AA] uppercase tracking-wider block mb-1">
                  TEMPO
                </span>
                <p className="text-lg font-black text-white font-mono">
                  {formatTimeSeconds(activeSession.elapsedSeconds)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-black text-[#8B98AA] uppercase tracking-wider block mb-1">
                  EXERCÍCIOS
                </span>
                <p className="text-lg font-black text-white">
                  {totalExercisesDone} / {activeSession.exercises.length}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-black text-[#8B98AA] uppercase tracking-wider block mb-1">
                  SÉRIES
                </span>
                <p className="text-lg font-black text-[#22C55E]">
                  {totalSetsDone} / {totalSetsGoal}
                </p>
              </div>
            </div>

            {/* Notes input */}
            <div className="mb-6 text-left">
              <label className="block text-xs font-bold text-[#8B98AA] uppercase tracking-wider mb-2">
                Observações do Treino (opcional)
              </label>
              <textarea
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="Ex: Boa intensidade no supino, aumentei carga no crossover..."
                rows={2}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#1677FF] resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsFinishing(false)}
                className="w-1/3 py-3 rounded-xl bg-[#111B2A] hover:bg-[#15243A] text-[#8B98AA] font-bold text-xs border border-[#1E2B3D] transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-[#22C55E]/30 transition-all"
              >
                FINALIZAR TREINO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Exercise Detail Modal */}
      {viewExerciseDetail && currentItem && (
        <ExerciseDetailModal
          exercise={currentItem.exercise}
          isOpen={viewExerciseDetail}
          onClose={() => setViewExerciseDetail(false)}
        />
      )}
    </div>
  );
};
