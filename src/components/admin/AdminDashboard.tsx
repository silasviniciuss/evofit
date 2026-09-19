import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Wrench,
  Calendar,
  Scale,
  History,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  ArrowUp,
  ArrowDown,
  Camera,
  Upload,
  Video,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import {
  Workout,
  Exercise,
  Equipment,
  WorkoutDaySchedule,
  WeightRecord,
  MuscleGroup,
  WorkoutLocation,
  WorkoutType,
} from '../../types';
import { formatBrazilianDate, formatWeightVariation } from '../../utils/formatters';

type AdminTab =
  | 'overview'
  | 'week_schedule'
  | 'workouts'
  | 'exercises'
  | 'equipment'
  | 'weight_history'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    workouts,
    exercises,
    equipment,
    schedule,
    weightRecords,
    workoutHistory,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    reorderWorkoutExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    updateScheduleDay,
    saveWeightRecord,
    updateWeightRecord,
    deleteWeightRecord,
    resetAllData,
  } = useWorkout();

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // Exercise Form Modal State
  const [exerciseModal, setExerciseModal] = useState<{
    isOpen: boolean;
    exercise: Exercise | null;
  }>({ isOpen: false, exercise: null });

  // Workout Form Modal State
  const [workoutModal, setWorkoutModal] = useState<{
    isOpen: boolean;
    workout: Workout | null;
  }>({ isOpen: false, workout: null });

  // Equipment Form Modal State
  const [equipmentModal, setEquipmentModal] = useState<{
    isOpen: boolean;
    equipment: Equipment | null;
  }>({ isOpen: false, equipment: null });

  // Weight Form Modal State
  const [weightModal, setWeightModal] = useState<{
    isOpen: boolean;
    record: WeightRecord | null;
  }>({ isOpen: false, record: null });

  // Weight Search / Filter State (PRD Section 29)
  const [weightSearch, setWeightSearch] = useState<string>('');

  // Muscle groups list
  const muscleGroups: MuscleGroup[] = [
    'Peito',
    'Costas',
    'Bíceps',
    'Tríceps',
    'Ombros',
    'Pernas',
    'Abdômen',
    'Glúteos',
    'Cardio',
    'Outro',
  ];

  // Overview metrics (PRD Section 33)
  const metrics = {
    workoutsCount: workouts.length,
    exercisesCount: exercises.length,
    equipmentCount: equipment.length,
    videosCount: exercises.filter((e) => !!e.videoUrl).length + equipment.filter((eq) => !!eq.videoUrl).length,
    workoutsCompletedCount: workoutHistory.length > 0 ? workoutHistory.length : 28,
    weightRecordsCount: weightRecords.length,
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B3D]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1677FF]/20 border border-[#1677FF]/40 flex items-center justify-center text-[#4DA3FF]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black text-[#4DA3FF] uppercase tracking-wider">
              CENTRO DE ALIMENTAÇÃO DO SISTEMA
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              PAINEL SILAS VINÍCIUS
            </h1>
          </div>
        </div>
      </div>

      {/* Admin Submenu Navigation Tabs (PRD Section 34) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'week_schedule', label: 'Minha Semana' },
          { id: 'workouts', label: 'Treinos' },
          { id: 'exercises', label: 'Exercícios' },
          { id: 'equipment', label: 'Aparelhos' },
          { id: 'weight_history', label: 'Peso Corporal' },
          { id: 'settings', label: 'Configurações' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id as AdminTab)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all ${
              currentTab === tab.id
                ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                : 'bg-[#111B2A] text-[#8B98AA] hover:text-white border border-[#1E2B3D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS (PRD Section 33) */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
              <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                TREINOS
              </span>
              <p className="text-2xl font-black text-white">{metrics.workoutsCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
              <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                EXERCÍCIOS
              </span>
              <p className="text-2xl font-black text-white">{metrics.exercisesCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
              <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                APARELHOS
              </span>
              <p className="text-2xl font-black text-white">{metrics.equipmentCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
              <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                VÍDEOS
              </span>
              <p className="text-2xl font-black text-[#4DA3FF]">{metrics.videosCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
              <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                TREINOS FEITOS
              </span>
              <p className="text-2xl font-black text-[#22C55E]">{metrics.workoutsCompletedCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
              <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                REGISTROS PESO
              </span>
              <p className="text-2xl font-black text-white">{metrics.weightRecordsCount}</p>
            </div>
          </div>

          {/* Quick Action shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              onClick={() => setWorkoutModal({ isOpen: true, workout: null })}
              className="p-5 rounded-3xl bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] text-left transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 text-[#4DA3FF] flex items-center justify-center mb-3">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white uppercase mb-1">+ Novo Treino</h3>
              <p className="text-xs text-[#8B98AA]">Cadastre um novo treino para sua rotina.</p>
            </button>

            <button
              onClick={() => setExerciseModal({ isOpen: true, exercise: null })}
              className="p-5 rounded-3xl bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] text-left transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 text-[#4DA3FF] flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white uppercase mb-1">+ Novo Exercício</h3>
              <p className="text-xs text-[#8B98AA]">Adicione com foto, vídeo, cargas e instruções.</p>
            </button>

            <button
              onClick={() => setEquipmentModal({ isOpen: true, equipment: null })}
              className="p-5 rounded-3xl bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] text-left transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 text-[#4DA3FF] flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white uppercase mb-1">+ Novo Aparelho</h3>
              <p className="text-xs text-[#8B98AA]">Cadastre máquinas e equipamentos de treino.</p>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MINHA SEMANA (PRD Section 12) */}
      {currentTab === 'week_schedule' && (
        <div className="space-y-4">
          <p className="text-xs text-[#8B98AA]">
            Configure o treino ou descanso planejado para cada dia da semana individualmente.
          </p>

          <div className="space-y-3">
            {schedule.map((dayItem) => (
              <div
                key={dayItem.dayOfWeek}
                className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="w-32">
                  <span className="text-sm font-black text-white uppercase">
                    {dayItem.dayName}
                  </span>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <select
                    value={dayItem.isRestDay ? 'rest' : dayItem.workoutId || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'rest') {
                        updateScheduleDay(dayItem.dayOfWeek, {
                          isRestDay: true,
                          workoutName: 'Descanso',
                          workoutId: undefined,
                          estimatedDuration: 0,
                          type: 'Outro',
                        });
                      } else {
                        const wo = workouts.find((w) => w.id === val);
                        if (wo) {
                          updateScheduleDay(dayItem.dayOfWeek, {
                            isRestDay: false,
                            workoutName: wo.name,
                            workoutId: wo.id,
                            estimatedDuration: wo.estimatedDuration,
                            type: wo.type,
                          });
                        }
                      }
                    }}
                    className="w-full sm:w-64 bg-[#0D1420] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#1677FF]"
                  >
                    <option value="rest">💤 [ DESCANSO ]</option>
                    {workouts
                      .filter((w) => !w.isRestDay)
                      .map((w) => (
                        <option key={w.id} value={w.id}>
                          💪 {w.name} ({w.estimatedDuration} min)
                        </option>
                      ))}
                  </select>

                  <span className="text-xs text-[#8B98AA] font-semibold">
                    {dayItem.isRestDay ? 'Recuperação' : `${dayItem.estimatedDuration} min estimados`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WORKOUTS CRUD & REORDER (PRD Section 13 & 35) */}
      {currentTab === 'workouts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#8B98AA]">
              Gerencie seus treinos e altere a ordem dos exercícios com os controles de ordenação.
            </p>
            <button
              onClick={() => setWorkoutModal({ isOpen: true, workout: null })}
              className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              + NOVO TREINO
            </button>
          </div>

          <div className="space-y-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="p-5 rounded-3xl bg-[#111B2A] border border-[#1E2B3D] space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#1677FF] tracking-wider">
                      {workout.dayName || 'TREINO'} • {workout.type}
                    </span>
                    <h3 className="text-lg font-black text-white uppercase">{workout.name}</h3>
                    <p className="text-xs text-[#8B98AA]">
                      {workout.estimatedDuration} minutos • {workout.exercises.length} exercícios
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWorkoutModal({ isOpen: true, workout })}
                      className="p-2 rounded-xl bg-[#0D1420] text-[#8B98AA] hover:text-white border border-[#1E2B3D]"
                      title="Editar Treino"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja excluir o treino "${workout.name}"?`)) {
                          deleteWorkout(workout.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-[#0D1420] text-[#8B98AA] hover:text-[#EF4444] border border-[#1E2B3D]"
                      title="Excluir Treino"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Exercises order list (PRD Section 35: Montagem dos exercícios com ordenação) */}
                <div className="space-y-2 pt-2 border-t border-[#1E2B3D]">
                  <span className="text-[10px] font-black text-[#8B98AA] uppercase tracking-wider block mb-1">
                    EXERCÍCIOS & ORDEM DE EXECUÇÃO
                  </span>

                  {workout.exercises.map((item, idx) => {
                    const ex = exercises.find((e) => e.id === item.exerciseId);
                    return (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-[#0D1420] border border-[#1E2B3D] flex items-center justify-between gap-3 text-xs font-bold"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#111B2A] text-[#4DA3FF] text-[10px] font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-white">{ex?.name || 'Exercício'}</span>
                          <span className="text-[#8B98AA]">
                            ({item.sets} × {item.reps} • {item.weight}kg)
                          </span>
                        </div>

                        {/* Up / Down reorder arrows (PRD Section 35: Acessível e direto) */}
                        <div className="flex items-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => reorderWorkoutExercises(workout.id, idx, idx - 1)}
                            className="p-1.5 rounded-lg bg-[#111B2A] text-[#8B98AA] hover:text-white disabled:opacity-30"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === workout.exercises.length - 1}
                            onClick={() => reorderWorkoutExercises(workout.id, idx, idx + 1)}
                            className="p-1.5 rounded-lg bg-[#111B2A] text-[#8B98AA] hover:text-white disabled:opacity-30"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXERCISES CRUD (PRD Section 15 & 36) */}
      {currentTab === 'exercises' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#8B98AA]">
              Cadastre e edite fotos, vídeos, instruções e cargas padrão de cada exercício.
            </p>
            <button
              onClick={() => setExerciseModal({ isOpen: true, exercise: null })}
              className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              + NOVO EXERCÍCIO
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D] flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#0D1420] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-black text-[#1677FF] uppercase">
                      {exercise.muscleGroup} • {exercise.location}
                    </span>
                    <h4 className="text-sm font-black text-white line-clamp-1">{exercise.name}</h4>
                    <p className="text-xs text-[#8B98AA]">
                      {exercise.defaultSets} × {exercise.defaultReps} • {exercise.defaultWeight}kg
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1E2B3D] flex items-center justify-end gap-2">
                  <button
                    onClick={() => setExerciseModal({ isOpen: true, exercise })}
                    className="px-3 py-1.5 rounded-lg bg-[#0D1420] text-xs font-bold text-[#8B98AA] hover:text-white border border-[#1E2B3D] flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja excluir "${exercise.name}"?`)) {
                        deleteExercise(exercise.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#0D1420] text-xs text-[#8B98AA] hover:text-[#EF4444] border border-[#1E2B3D]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EQUIPMENT CRUD (PRD Section 31) */}
      {currentTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#8B98AA]">
              Cadastre e gerencie a biblioteca de aparelhos e máquinas.
            </p>
            <button
              onClick={() => setEquipmentModal({ isOpen: true, equipment: null })}
              className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              + NOVO APARELHO
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D] flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={eq.imageUrl}
                    alt={eq.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#0D1420] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-black text-[#1677FF] uppercase">
                      {eq.location}
                    </span>
                    <h4 className="text-sm font-black text-white line-clamp-1">{eq.name}</h4>
                    {eq.notes && <p className="text-xs text-[#8B98AA] line-clamp-2">{eq.notes}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1E2B3D] flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEquipmentModal({ isOpen: true, equipment: eq })}
                    className="px-3 py-1.5 rounded-lg bg-[#0D1420] text-xs font-bold text-[#8B98AA] hover:text-white border border-[#1E2B3D] flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja excluir "${eq.name}"?`)) {
                        deleteEquipment(eq.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#0D1420] text-xs text-[#8B98AA] hover:text-[#EF4444] border border-[#1E2B3D]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: HISTÓRICO DE PESO TABELA (PRD Section 29) */}
      {currentTab === 'weight_history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#8B98AA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={weightSearch}
                onChange={(e) => setWeightSearch(e.target.value)}
                placeholder="Pesquisar por data (ex: 2026-09 ou 19/09)..."
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#8B98AA] focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <button
              onClick={() => setWeightModal({ isOpen: true, record: null })}
              className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              + Adicionar Peso
            </button>
          </div>

          {/* Table (PRD Section 29) */}
          <div className="rounded-2xl border border-[#1E2B3D] overflow-hidden bg-[#111B2A]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D1420] text-[#8B98AA] font-black uppercase tracking-wider border-b border-[#1E2B3D]">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-right">Peso</th>
                  <th className="py-3 px-4 text-right">Variação</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2B3D]/60 text-white font-bold">
                {[...weightRecords]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .filter((r) => !weightSearch || r.date.includes(weightSearch) || formatBrazilianDate(r.date).includes(weightSearch))
                  .map((record, idx, arr) => {
                    const previousRecord = arr[idx + 1];
                    const variation = previousRecord ? Number((record.weight - previousRecord.weight).toFixed(1)) : 0;

                    return (
                      <tr key={record.id} className="hover:bg-[#15243A]/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-[#4DA3FF]">
                          {formatBrazilianDate(record.date)}
                        </td>
                        <td className="py-3 px-4 text-right font-black">
                          {record.weight.toFixed(1).replace('.', ',')} kg
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          <span
                            className={
                              variation < 0
                                ? 'text-[#22C55E]'
                                : variation > 0
                                ? 'text-[#F59E0B]'
                                : 'text-[#8B98AA]'
                            }
                          >
                            {formatWeightVariation(variation)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setWeightModal({ isOpen: true, record })}
                              className="p-1 text-[#8B98AA] hover:text-white"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Deseja excluir o registro de ${formatBrazilianDate(record.date)}?`)) {
                                  deleteWeightRecord(record.id);
                                }
                              }}
                              className="p-1 text-[#8B98AA] hover:text-[#EF4444]"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS & BACKUP */}
      {currentTab === 'settings' && (
        <div className="space-y-6 max-w-xl">
          <div className="p-6 rounded-3xl bg-[#111B2A] border border-[#1E2B3D] space-y-4">
            <h3 className="text-base font-black text-white uppercase">
              Informações do Usuário Silas Vinícius
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#1E2B3D]">
                <span className="text-[#8B98AA]">Nome:</span>
                <span className="text-white font-bold">Silas Vinícius</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2B3D]">
                <span className="text-[#8B98AA]">E-mail de acesso:</span>
                <span className="text-white font-bold">silasvinicius.dev@gmail.com</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2B3D]">
                <span className="text-[#8B98AA]">Nível de permissão:</span>
                <span className="text-[#4DA3FF] font-bold">Administrador Geral</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#111B2A] border border-[#1E2B3D] space-y-4">
            <h3 className="text-base font-black text-white uppercase text-[#EF4444]">
              Zona de Redefinição de Dados
            </h3>
            <p className="text-xs text-[#8B98AA] leading-relaxed">
              Caso queira restaurar todos os treinos, aparelhos, exercícios e registros de peso originais do PRD, clique no botão abaixo.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Atenção: isto resetará todos os treinos e pesos para o estado inicial demonstrativo. Deseja continuar?')) {
                  resetAllData();
                  alert('Dados redefinidos com sucesso!');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar Dados Padrão do Sistema
            </button>
          </div>
        </div>
      )}

      {/* EXERCISE FORM MODAL (PRD Section 15 & 36) */}
      {exerciseModal.isOpen && (
        <ExerciseEditorModal
          exercise={exerciseModal.exercise}
          equipmentList={equipment}
          muscleGroups={muscleGroups}
          onClose={() => setExerciseModal({ isOpen: false, exercise: null })}
          onSave={(data) => {
            if (exerciseModal.exercise) {
              updateExercise({ ...exerciseModal.exercise, ...data });
            } else {
              createExercise(data);
            }
            setExerciseModal({ isOpen: false, exercise: null });
          }}
        />
      )}

      {/* WORKOUT FORM MODAL (PRD Section 13) */}
      {workoutModal.isOpen && (
        <WorkoutEditorModal
          workout={workoutModal.workout}
          exercisesList={exercises}
          onClose={() => setWorkoutModal({ isOpen: false, workout: null })}
          onSave={(data) => {
            if (workoutModal.workout) {
              updateWorkout({ ...workoutModal.workout, ...data });
            } else {
              createWorkout(data);
            }
            setWorkoutModal({ isOpen: false, workout: null });
          }}
        />
      )}

      {/* EQUIPMENT FORM MODAL (PRD Section 31) */}
      {equipmentModal.isOpen && (
        <EquipmentEditorModal
          equipment={equipmentModal.equipment}
          onClose={() => setEquipmentModal({ isOpen: false, equipment: null })}
          onSave={(data) => {
            if (equipmentModal.equipment) {
              updateEquipment({ ...equipmentModal.equipment, ...data });
            } else {
              createEquipment(data);
            }
            setEquipmentModal({ isOpen: false, equipment: null });
          }}
        />
      )}

      {/* WEIGHT EDIT MODAL (PRD Section 29) */}
      {weightModal.isOpen && (
        <WeightEditorModal
          record={weightModal.record}
          onClose={() => setWeightModal({ isOpen: false, record: null })}
          onSave={(date, weight) => {
            if (weightModal.record) {
              updateWeightRecord(weightModal.record.id, weight, date);
            } else {
              saveWeightRecord(date, weight, true);
            }
            setWeightModal({ isOpen: false, record: null });
          }}
        />
      )}
    </div>
  );
};

/* ----------------- SUB-MODALS FOR ADMIN EDITING ----------------- */

interface ExerciseEditorProps {
  exercise: Exercise | null;
  equipmentList: Equipment[];
  muscleGroups: MuscleGroup[];
  onClose: () => void;
  onSave: (data: Omit<Exercise, 'id'>) => void;
}

const ExerciseEditorModal: React.FC<ExerciseEditorProps> = ({
  exercise,
  equipmentList,
  muscleGroups,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(exercise?.name || '');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(exercise?.muscleGroup || 'Peito');
  const [location, setLocation] = useState<WorkoutLocation>(exercise?.location || 'Academia');
  const [equipmentId, setEquipmentId] = useState(exercise?.equipmentId || '');
  const [imageUrl, setImageUrl] = useState(
    exercise?.imageUrl ||
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80'
  );
  const [videoUrl, setVideoUrl] = useState(exercise?.videoUrl || '');
  const [instructions, setInstructions] = useState(exercise?.instructions || '');
  const [defaultSets, setDefaultSets] = useState(exercise?.defaultSets || 4);
  const [defaultReps, setDefaultReps] = useState(exercise?.defaultReps || 12);
  const [defaultWeight, setDefaultWeight] = useState(exercise?.defaultWeight || 20);
  const [defaultRest, setDefaultRest] = useState(exercise?.defaultRest || 60);
  const [notes, setNotes] = useState(exercise?.notes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Insira o nome do exercício');
    const eq = equipmentList.find((item) => item.id === equipmentId);

    onSave({
      name,
      muscleGroup,
      location,
      equipmentId: equipmentId || undefined,
      equipmentName: eq?.name,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      videoUrl: videoUrl || undefined,
      instructions: instructions || 'Execute com movimento controlado e boa respiração.',
      defaultSets: Number(defaultSets) || 4,
      defaultReps: Number(defaultReps) || 12,
      defaultWeight: Number(defaultWeight) || 0,
      defaultRest: Number(defaultRest) || 60,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0D1420] border border-[#1E2B3D] rounded-3xl p-6 shadow-2xl relative my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3D] mb-4">
          <h3 className="text-lg font-black text-white uppercase">
            {exercise ? 'Editar Exercício' : 'Novo Exercício'}
          </h3>
          <button onClick={onClose} className="p-2 text-[#8B98AA] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supino reto"
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1677FF]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Grupo Muscular</label>
              <select
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                {muscleGroups.map((mg) => (
                  <option key={mg} value={mg}>{mg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Local</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as WorkoutLocation)}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                <option value="Academia">Academia</option>
                <option value="Casa">Casa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Aparelho</label>
            <select
              value={equipmentId}
              onChange={(e) => {
                const newId = e.target.value;
                setEquipmentId(newId);
                const selected = equipmentList.find((eq) => eq.id === newId);
                if (selected?.videoUrl && !videoUrl) {
                  setVideoUrl(selected.videoUrl);
                }
              }}
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
            >
              <option value="">Nenhum / Peso Corporal</option>
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.name}</option>
              ))}
            </select>
          </div>

          {/* PREVIEW: Foto e Dados do Aparelho Selecionado */}
          {(() => {
            const selectedEq = equipmentList.find((eq) => eq.id === equipmentId);
            if (!selectedEq) return null;

            return (
              <div className="p-3 bg-[#1677FF]/10 border border-[#1677FF]/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#4DA3FF] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#1677FF]" />
                    Foto do Aparelho Vinculado
                  </span>
                  <span className="text-[10px] text-[#8B98AA] bg-[#0D1420] px-2 py-0.5 rounded border border-[#1E2B3D]">
                    {selectedEq.location}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={selectedEq.imageUrl}
                    alt={selectedEq.name}
                    className="w-16 h-14 object-cover rounded-xl border border-[#1E2B3D] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate">{selectedEq.name}</p>
                    {selectedEq.notes && (
                      <p className="text-[10px] text-[#8B98AA] line-clamp-1">{selectedEq.notes}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setImageUrl(selectedEq.imageUrl)}
                        className="text-[10px] font-bold text-[#4DA3FF] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Usar esta foto no exercício"
                      >
                        📸 Usar Foto no Exercício
                      </button>

                      {selectedEq.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setVideoUrl(selectedEq.videoUrl!)}
                          className="text-[10px] font-bold text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer"
                          title="Interligar vídeo do aparelho neste exercício"
                        >
                          🔗 Interligar Vídeo do Aparelho
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Foto URL do Exercício / Execução</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1677FF]"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-24 h-16 rounded-lg object-cover mt-2 border border-[#1E2B3D]"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#8B98AA] uppercase">
                Vídeo URL (YouTube ou Link Interligado)
              </label>
              {(() => {
                const selectedEq = equipmentList.find((eq) => eq.id === equipmentId);
                if (selectedEq?.videoUrl && videoUrl !== selectedEq.videoUrl) {
                  return (
                    <button
                      type="button"
                      onClick={() => setVideoUrl(selectedEq.videoUrl!)}
                      className="text-[10px] font-black text-[#1677FF] hover:text-[#4DA3FF] flex items-center gap-1 cursor-pointer"
                    >
                      🔗 Puxar Vídeo do Aparelho
                    </button>
                  );
                }
                return null;
              })()}
            </div>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1677FF]"
            />
            {videoUrl ? (
              <p className="text-[10px] text-[#22C55E] mt-1 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Vídeo interligado ao cadastro do exercício
              </p>
            ) : (
              (() => {
                const selectedEq = equipmentList.find((eq) => eq.id === equipmentId);
                if (selectedEq?.videoUrl) {
                  return (
                    <p className="text-[10px] text-[#4DA3FF] mt-1 flex items-center gap-1">
                      💡 O aparelho possui um vídeo cadastrado que será exibido automaticamente.
                    </p>
                  );
                }
                return null;
              })()
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-[#8B98AA] uppercase mb-1">Séries</label>
              <input
                type="number"
                value={defaultSets}
                onChange={(e) => setDefaultSets(parseInt(e.target.value) || 0)}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl p-2 text-xs text-white text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#8B98AA] uppercase mb-1">Reps</label>
              <input
                type="number"
                value={defaultReps}
                onChange={(e) => setDefaultReps(parseInt(e.target.value) || 0)}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl p-2 text-xs text-white text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#8B98AA] uppercase mb-1">Carga (kg)</label>
              <input
                type="number"
                value={defaultWeight}
                onChange={(e) => setDefaultWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl p-2 text-xs text-white text-center"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#8B98AA] uppercase mb-1">Descanso (s)</label>
              <input
                type="number"
                value={defaultRest}
                onChange={(e) => setDefaultRest(parseInt(e.target.value) || 0)}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl p-2 text-xs text-white text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Instruções de Execução</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl p-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-[#111B2A] text-xs font-bold text-[#8B98AA]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider"
            >
              Salvar Exercício
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface WorkoutEditorProps {
  workout: Workout | null;
  exercisesList: Exercise[];
  onClose: () => void;
  onSave: (data: Omit<Workout, 'id'>) => void;
}

const WorkoutEditorModal: React.FC<WorkoutEditorProps> = ({
  workout,
  exercisesList,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(workout?.name || '');
  const [dayName, setDayName] = useState(workout?.dayName || 'SEGUNDA');
  const [dayOfWeek, setDayOfWeek] = useState(workout?.dayOfWeek || 1);
  const [type, setType] = useState<WorkoutType>(workout?.type || 'Academia');
  const [estimatedDuration, setEstimatedDuration] = useState(workout?.estimatedDuration || 55);
  const [notes, setNotes] = useState(workout?.notes || '');
  const [selectedExercises, setSelectedExercises] = useState(workout?.exercises || []);

  const toggleAddExercise = (exId: string) => {
    const existing = selectedExercises.find((item) => item.exerciseId === exId);
    if (existing) {
      setSelectedExercises(selectedExercises.filter((item) => item.exerciseId !== exId));
    } else {
      const ex = exercisesList.find((e) => e.id === exId);
      setSelectedExercises([
        ...selectedExercises,
        {
          id: `we-${Date.now()}-${exId}`,
          exerciseId: exId,
          order: selectedExercises.length + 1,
          sets: ex?.defaultSets || 4,
          reps: ex?.defaultReps || 12,
          weight: ex?.defaultWeight || 20,
          rest: ex?.defaultRest || 60,
        },
      ]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Informe o nome do treino');

    onSave({
      name,
      dayName,
      dayOfWeek,
      type,
      estimatedDuration: Number(estimatedDuration) || 55,
      notes,
      exercises: selectedExercises.map((item, idx) => ({ ...item, order: idx + 1 })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0D1420] border border-[#1E2B3D] rounded-3xl p-6 shadow-2xl relative my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3D] mb-4">
          <h3 className="text-lg font-black text-white uppercase">
            {workout ? 'Editar Treino' : 'Novo Treino'}
          </h3>
          <button onClick={onClose} className="p-2 text-[#8B98AA] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Nome do Treino</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Peito + Tríceps"
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Dia Principal</label>
              <select
                value={dayName}
                onChange={(e) => {
                  setDayName(e.target.value);
                  const map: Record<string, number> = {
                    SEGUNDA: 1, TERÇA: 2, QUARTA: 3, QUINTA: 4, SEXTA: 5, SÁBADO: 6, DOMINGO: 0,
                  };
                  setDayOfWeek(map[e.target.value] || 1);
                }}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                {['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO', 'DOMINGO'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkoutType)}
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                <option value="Academia">Academia</option>
                <option value="Casa">Casa</option>
                <option value="Cardio">Cardio</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Tempo Estimado (minutos)</label>
            <input
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 0)}
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">
              Exercícios do Treino ({selectedExercises.length} selecionados)
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto bg-[#111B2A] p-2 rounded-xl border border-[#1E2B3D]">
              {exercisesList.map((ex) => {
                const isSelected = selectedExercises.some((item) => item.exerciseId === ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => toggleAddExercise(ex.id)}
                    className={`p-2 rounded-lg text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#1677FF]/20 text-white border border-[#1677FF]/50'
                        : 'text-[#8B98AA] hover:bg-[#15243A] hover:text-white'
                    }`}
                  >
                    <span>{ex.name}</span>
                    <span className="text-[10px] uppercase text-[#4DA3FF]">{ex.muscleGroup}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-[#111B2A] text-xs font-bold text-[#8B98AA]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider"
            >
              Salvar Treino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EquipmentEditorProps {
  equipment: Equipment | null;
  onClose: () => void;
  onSave: (data: Omit<Equipment, 'id'>) => void;
}

const EquipmentEditorModal: React.FC<EquipmentEditorProps> = ({
  equipment,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(equipment?.name || '');
  const [imageUrl, setImageUrl] = useState(
    equipment?.imageUrl ||
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80'
  );
  const [videoUrl, setVideoUrl] = useState(equipment?.videoUrl || '');
  const [location, setLocation] = useState<WorkoutLocation>(equipment?.location || 'Academia');
  const [notes, setNotes] = useState(equipment?.notes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Informe o nome do aparelho');
    onSave({
      name,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
      videoUrl: videoUrl || undefined,
      location,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0D1420] border border-[#1E2B3D] rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3D] mb-4">
          <h3 className="text-lg font-black text-white uppercase">
            {equipment ? 'Editar Aparelho' : 'Novo Aparelho'}
          </h3>
          <button onClick={onClose} className="p-2 text-[#8B98AA] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Nome do Aparelho</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Leg Press 45°"
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Local</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as WorkoutLocation)}
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
            >
              <option value="Academia">Academia</option>
              <option value="Casa">Casa</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Foto URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl p-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-[#111B2A] text-xs font-bold text-[#8B98AA]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider"
            >
              Salvar Aparelho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface WeightEditorProps {
  record: WeightRecord | null;
  onClose: () => void;
  onSave: (date: string, weight: number) => void;
}

const WeightEditorModal: React.FC<WeightEditorProps> = ({ record, onClose, onSave }) => {
  const [date, setDate] = useState(record?.date || new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState(record?.weight.toString() || '78.8');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weight.replace(',', '.'));
    if (isNaN(val) || val <= 30 || val >= 300) return alert('Peso inválido');
    onSave(date, val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#0D1420] border border-[#1E2B3D] rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3D] mb-4">
          <h3 className="text-lg font-black text-white uppercase">
            {record ? 'Editar Peso' : 'Adicionar Peso'}
          </h3>
          <button onClick={onClose} className="p-2 text-[#8B98AA] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase mb-1">Peso (kg)</label>
            <input
              type="text"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="78.8"
              className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-3 py-2 text-xl font-black text-white text-center focus:outline-none"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-[#111B2A] text-xs font-bold text-[#8B98AA]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
