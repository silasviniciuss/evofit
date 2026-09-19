import React, { useState, useMemo } from 'react';
import { Search, Filter, Dumbbell, Play, Plus, ArrowRight } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { Exercise, MuscleGroup, WorkoutLocation } from '../../types';
import { ExerciseDetailModal } from '../workout/ExerciseDetailModal';

interface ExerciseLibraryViewProps {
  onStartExerciseWorkout?: (exercise: Exercise) => void;
  onOpenAdminNewExercise?: () => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  onStartExerciseWorkout,
  onOpenAdminNewExercise,
}) => {
  const { exercises } = useWorkout();
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Todos');
  const [selectedLocation, setSelectedLocation] = useState<WorkoutLocation>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B3D]">
        <div>
          <span className="text-xs font-black text-[#4DA3FF] uppercase tracking-wider">
            BIBLIOTECA COMPLETA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            MEUS EXERCÍCIOS
          </h1>
        </div>

        {onOpenAdminNewExercise && (
          <button
            onClick={onOpenAdminNewExercise}
            className="px-4 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-md shadow-[#1677FF]/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Novo Exercício
          </button>
        )}
      </div>

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
          {filteredExercises.map((exercise) => (
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
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide group-hover:text-[#4DA3FF] transition-colors line-clamp-1">
                    {exercise.name}
                  </h3>
                  {exercise.equipmentName && (
                    <p className="text-xs text-[#8B98AA] line-clamp-1 mt-0.5">
                      {exercise.equipmentName}
                    </p>
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
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-[#8B98AA] bg-[#111B2A] rounded-3xl border border-[#1E2B3D]">
          Nenhum exercício encontrado com esses filtros.
        </div>
      )}

      {/* Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onStartExercise={onStartExerciseWorkout}
        />
      )}
    </div>
  );
};
