import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Dumbbell,
  Play,
  Plus,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Clock,
  Layers,
  CheckCircle2,
  Video,
  Camera,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { Exercise, MuscleGroup, WorkoutLocation, Workout } from '../../types';
import { ExerciseDetailModal } from '../workout/ExerciseDetailModal';

interface ExerciseLibraryViewProps {
  onStartExerciseWorkout?: (exercise: Exercise) => void;
  onOpenAdminNewExercise?: () => void;
  onSelectWorkout?: (workoutId: string) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  onStartExerciseWorkout,
  onOpenAdminNewExercise,
  onSelectWorkout,
}) => {
  const { exercises, workouts, equipment, deleteExercise, deleteWorkout } = useWorkout();
  const [activeTab, setActiveTab] = useState<'exercises' | 'workouts'>('exercises');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Todos');
  const [selectedLocation, setSelectedLocation] = useState<WorkoutLocation>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Deletion modals state
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState<Exercise | null>(null);
  const [confirmDeleteWorkout, setConfirmDeleteWorkout] = useState<Workout | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteExerciseConfirmed = () => {
    if (!confirmDeleteExercise) return;
    const name = confirmDeleteExercise.name;
    deleteExercise(confirmDeleteExercise.id);
    setConfirmDeleteExercise(null);
    showToast(`Exercício "${name}" apagado com sucesso!`);
  };

  const handleDeleteWorkoutConfirmed = () => {
    if (!confirmDeleteWorkout) return;
    const name = confirmDeleteWorkout.name;
    deleteWorkout(confirmDeleteWorkout.id);
    setConfirmDeleteWorkout(null);
    showToast(`Treino "${name}" apagado com sucesso!`);
  };

  // Muscle filter options matching PRD section 32:
  // Todos, Peito, Costas, Pernas, Ombros, Braços, Abdômen, Cardio
  const filterOptions = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Cardio'];

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Muscle filter
      if (selectedMuscle !== 'Todos') {
        if (selectedMuscle === 'Braços') {
          if (ex.muscleGroup !== 'Bíceps' && ex.muscleGroup !== 'Tríceps') return false;
        } else if (ex.muscleGroup !== selectedMuscle) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation !== 'Todos' && ex.location !== selectedLocation) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = ex.name.toLowerCase().includes(query);
        const matchMuscle = ex.muscleGroup.toLowerCase().includes(query);
        const matchEquip = ex.equipmentName?.toLowerCase().includes(query) || false;
        if (!matchName && !matchMuscle && !matchEquip) return false;
      }

      return true;
    });
  }, [exercises, selectedMuscle, selectedLocation, searchQuery]);

  const activeWorkouts = useMemo(() => {
    return workouts.filter((w) => !w.isRestDay);
  }, [workouts]);

  return (
    <div className="space-y-6 pb-24 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#0D1420] border border-[#1677FF] shadow-2xl flex items-center gap-3 text-xs font-bold text-white animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B3D]">
        <div>
          <span className="text-xs font-black text-[#4DA3FF] uppercase tracking-wider">
            BIBLIOTECA COMPLETA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            MEUS EXERCÍCIOS & TREINOS
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenAdminNewExercise && (
            <button
              onClick={onOpenAdminNewExercise}
              className="px-4 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#1677FF]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Novo Exercício
            </button>
          )}
        </div>
      </div>

      {/* Main Switcher: Exercícios vs Treinos Adicionados */}
      <div className="flex items-center gap-2 p-1.5 bg-[#111B2A] rounded-2xl border border-[#1E2B3D] w-full sm:w-auto self-start">
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'exercises'
              ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
              : 'text-[#8B98AA] hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Exercícios ({filteredExercises.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'workouts'
              ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
              : 'text-[#8B98AA] hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Treinos Adicionados ({activeWorkouts.length})</span>
        </button>
      </div>

      {/* TAB 1: EXERCISES LIST */}
      {activeTab === 'exercises' && (
        <div className="space-y-6">
          {/* Search & Location Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar exercício ou aparelho..."
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#8B98AA] focus:outline-none focus:border-[#1677FF] transition-colors"
              />
            </div>

            {/* Location Toggle (Academia / Casa) */}
            <div className="flex items-center gap-1 bg-[#111B2A] p-1 rounded-xl border border-[#1E2B3D]">
              {(['Todos', 'Academia', 'Casa'] as WorkoutLocation[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedLocation === loc
                      ? 'bg-[#1677FF] text-white shadow-sm'
                      : 'text-[#8B98AA] hover:text-white'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Muscle Group Pills (PRD Section 32) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {filterOptions.map((muscle) => (
              <button
                key={muscle}
                onClick={() => setSelectedMuscle(muscle)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedMuscle === muscle
                    ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                    : 'bg-[#111B2A] text-[#8B98AA] hover:text-white border border-[#1E2B3D]'
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>

          {/* Exercise Cards Grid */}
          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => {
                const linkedEq = equipment.find(
                  (eq) =>
                    eq.id === exercise.equipmentId ||
                    (exercise.equipmentName && eq.name.toLowerCase() === exercise.equipmentName.toLowerCase())
                );
                const hasVideo = !!(exercise.videoUrl || linkedEq?.videoUrl);

                return (
                  <div
                    key={exercise.id}
                    onClick={() => setSelectedExercise(exercise)}
                    className="group bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] hover:border-[#1677FF]/50 rounded-3xl overflow-hidden cursor-pointer transition-all shadow-sm flex flex-col justify-between"
                  >
                    {/* Exercise photo header */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#070B12]">
                      <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111B2A] via-transparent to-black/30" />

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-[#1677FF] text-white text-[10px] font-black uppercase tracking-wider shadow">
                          {exercise.muscleGroup}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[#4DA3FF] text-[10px] font-semibold border border-white/10">
                          {exercise.location}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {hasVideo && (
                          <span
                            className="px-2 py-1 rounded-xl bg-black/65 backdrop-blur-md text-[#4DA3FF] text-[10px] font-black flex items-center gap-1 border border-white/10"
                            title="Vídeo demonstrativo interligado"
                          >
                            <Video className="w-3 h-3 text-[#1677FF]" />
                            <span className="hidden xs:inline">Vídeo</span>
                          </span>
                        )}

                        {/* Quick delete button on top right */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteExercise(exercise);
                          }}
                          className="p-2 rounded-xl bg-black/60 backdrop-blur-md hover:bg-[#EF4444] text-[#8B98AA] hover:text-white transition-all border border-white/10"
                          title="Apagar este exercício"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wide group-hover:text-[#4DA3FF] transition-colors line-clamp-1">
                          {exercise.name}
                        </h3>

                        {/* Linked Equipment Badge & Thumbnail */}
                        {linkedEq ? (
                          <div className="flex items-center gap-2 mt-2 p-1.5 rounded-xl bg-[#0D1420] border border-[#1E2B3D]/80">
                            <img
                              src={linkedEq.imageUrl}
                              alt={linkedEq.name}
                              className="w-7 h-7 rounded-lg object-cover border border-[#1E2B3D] shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-white truncate">
                                {linkedEq.name}
                              </p>
                              <p className="text-[9px] text-[#4DA3FF] uppercase font-black tracking-wider flex items-center gap-1">
                                <Camera className="w-2.5 h-2.5" /> Foto do Aparelho
                              </p>
                            </div>
                          </div>
                        ) : (
                          exercise.equipmentName && (
                            <p className="text-xs text-[#8B98AA] line-clamp-1 mt-0.5">
                              {exercise.equipmentName}
                            </p>
                          )
                        )}
                      </div>

                      {/* Specs row */}
                      <div className="pt-2 border-t border-[#1E2B3D] flex items-center justify-between text-xs font-bold text-[#8B98AA]">
                        <span>
                          <strong className="text-white">{exercise.defaultSets}</strong> ×{' '}
                          <strong className="text-white">{exercise.defaultReps}</strong> reps
                        </span>
                        <span>
                          {exercise.defaultWeight > 0 ? `${exercise.defaultWeight} kg` : 'Corporal'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-[#8B98AA] bg-[#111B2A] rounded-3xl border border-[#1E2B3D]">
              Nenhum exercício encontrado com esses filtros.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TREINOS ADICIONADOS (PRD & USER REQUEST: BOTÃO PARA APAGAR UM TREINO ADICIONADO) */}
      {activeTab === 'workouts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-[#8B98AA] uppercase tracking-wider">
              TODOS OS TREINOS CADASTRADOS ({activeWorkouts.length})
            </h2>
            <span className="text-xs text-[#4DA3FF]">Gerencie ou exclua treinos da sua lista</span>
          </div>

          {activeWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="p-5 rounded-3xl bg-[#111B2A] border border-[#1E2B3D] hover:border-[#1677FF]/40 transition-all flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {workout.dayName && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1677FF]/20 border border-[#1677FF]/30 text-[#4DA3FF] text-[10px] font-black uppercase tracking-wider">
                            {workout.dayName}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-[#0D1420] text-[#8B98AA] text-[10px] font-semibold border border-[#1E2B3D]">
                          {workout.type}
                        </span>
                      </div>

                      {/* Prominent DELETE WORKOUT Button */}
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteWorkout(workout)}
                        className="px-3 py-1.5 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/30 hover:border-[#EF4444]/50 text-[#EF4444] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Apagar este treino adicionado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Apagar Treino</span>
                      </button>
                    </div>

                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      {workout.name}
                    </h3>

                    {workout.notes && (
                      <p className="text-xs text-[#8B98AA] line-clamp-2">
                        {workout.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-4 pt-1 text-xs font-bold text-[#8B98AA]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#1677FF]" />
                        <span>{workout.estimatedDuration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-[#1677FF]" />
                        <span>{workout.exercises.length} exercícios</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1E2B3D] flex items-center justify-between">
                    <span className="text-[11px] text-[#8B98AA]">
                      Ordem: {workout.exercises.map((e, idx) => (idx > 0 ? `, ` : '') + (exercises.find(ex => ex.id === e.exerciseId)?.name || 'Exercício')).slice(0, 3).join('')}...
                    </span>

                    {onSelectWorkout && (
                      <button
                        type="button"
                        onClick={() => onSelectWorkout(workout.id)}
                        className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Ver Treino</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-[#8B98AA] bg-[#111B2A] rounded-3xl border border-[#1E2B3D]">
              Nenhum treino adicionado no momento.
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE WORKOUT */}
      {confirmDeleteWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0D1420] border border-[#EF4444]/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Apagar Treino Adicionado?
            </h3>

            <p className="text-xs text-[#8B98AA] mt-2 leading-relaxed">
              Tem certeza que deseja apagar o treino{' '}
              <strong className="text-white">"{confirmDeleteWorkout.name}"</strong>?
              Esta ação removerá permanentemente o treino da sua lista e da sua programação semanal.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmDeleteWorkout(null)}
                className="px-4 py-2.5 rounded-xl bg-[#111B2A] hover:bg-[#15243A] text-[#8B98AA] hover:text-white font-bold text-xs uppercase tracking-wider border border-[#1E2B3D] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteWorkoutConfirmed}
                className="px-5 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#EF4444]/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Sim, Apagar Treino
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE EXERCISE */}
      {confirmDeleteExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0D1420] border border-[#EF4444]/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Apagar Exercício da Biblioteca?
            </h3>

            <p className="text-xs text-[#8B98AA] mt-2 leading-relaxed">
              Tem certeza que deseja apagar o exercício{' '}
              <strong className="text-white">"{confirmDeleteExercise.name}"</strong>?
              Esta ação removerá o exercício da biblioteca.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmDeleteExercise(null)}
                className="px-4 py-2.5 rounded-xl bg-[#111B2A] hover:bg-[#15243A] text-[#8B98AA] hover:text-white font-bold text-xs uppercase tracking-wider border border-[#1E2B3D] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteExerciseConfirmed}
                className="px-5 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#EF4444]/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Sim, Apagar Exercício
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onStartExercise={onStartExerciseWorkout}
          onDeleteExercise={(id) => {
            deleteExercise(id);
            setSelectedExercise(null);
            showToast('Exercício apagado com sucesso!');
          }}
        />
      )}
    </div>
  );
};
