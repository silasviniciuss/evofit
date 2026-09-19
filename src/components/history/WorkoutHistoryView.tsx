import React, { useState, useMemo } from 'react';
import { History, CheckCircle2, Clock, Dumbbell, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { formatShortDatePT, formatTimeSeconds } from '../../utils/formatters';
import { WorkoutHistory } from '../../types';

type HistoryFilter = 'Semana' | 'Mês' | 'Ano' | 'Todos';

export const WorkoutHistoryView: React.FC = () => {
  const { workoutHistory } = useWorkout();
  const [filter, setFilter] = useState<HistoryFilter>('Semana');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredHistory = useMemo(() => {
    if (!workoutHistory.length) return [];
    const sorted = [...workoutHistory].sort((a, b) => b.date.localeCompare(a.date));

    if (filter === 'Todos') return sorted;

    const now = new Date();
    let daysToKeep = 7;
    if (filter === 'Semana') daysToKeep = 7;
    else if (filter === 'Mês') daysToKeep = 30;
    else if (filter === 'Ano') daysToKeep = 365;

    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - daysToKeep);

    return sorted.filter((h) => new Date(h.date) >= cutoff);
  }, [workoutHistory, filter]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Filter Row (PRD Section 22) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B3D]">
        <div>
          <span className="text-xs font-black text-[#4DA3FF] uppercase tracking-wider">
            REGISTRO DE ATIVIDADES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            MEUS TREINOS
          </h1>
        </div>

        {/* Filters: Semana | Mês | Ano */}
        <div className="flex items-center gap-1 bg-[#111B2A] p-1 rounded-xl border border-[#1E2B3D]">
          {(['Semana', 'Mês', 'Ano', 'Todos'] as HistoryFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-[#1677FF] text-white shadow-sm'
                  : 'text-[#8B98AA] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            const minutes = Math.round(item.durationSeconds / 60);

            return (
              <div
                key={item.id}
                className="bg-[#111B2A] border border-[#1E2B3D] rounded-3xl overflow-hidden transition-all shadow-sm"
              >
                {/* Header card summary */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#15243A]/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Date badge: e.g. 19 SET (PRD Section 22) */}
                    <div className="w-16 h-16 rounded-2xl bg-[#0D1420] border border-[#1E2B3D] flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-lg font-black text-white leading-none">
                        {item.date.split('-')[2] || '19'}
                      </span>
                      <span className="text-[10px] font-black text-[#1677FF] uppercase tracking-wider mt-0.5">
                        {formatShortDatePT(item.date).split(' ')[1] || 'SET'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Concluído
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        {item.workoutName}
                      </h3>
                    </div>
                  </div>

                  {/* Metrics: Tempo, Exercícios, Séries */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pl-20 sm:pl-0">
                    <div className="flex items-center gap-4 text-xs font-bold text-[#8B98AA]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#1677FF]" />
                        <span className="text-white font-black">{minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Dumbbell className="w-4 h-4 text-[#1677FF]" />
                        <span className="text-white font-black">{item.completedExercises}</span> ex
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#22C55E] font-black">{item.completedSets}</span> séries
                      </div>
                    </div>

                    <button className="text-[#8B98AA] hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#1E2B3D]/80 bg-[#0D1420]/60 space-y-3">
                    {item.notes && (
                      <div className="p-3.5 rounded-2xl bg-[#111B2A] border border-[#1E2B3D] text-xs text-[#8B98AA]">
                        <strong className="text-white">Observações:</strong> {item.notes}
                      </div>
                    )}

                    {item.logs && item.logs.length > 0 ? (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-[#8B98AA] uppercase tracking-wider block">
                          DETALHAMENTO DE SÉRIES E CARGAS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.logs.map((log) => (
                            <div
                              key={log.id}
                              className="p-2.5 rounded-xl bg-[#111B2A] border border-[#1E2B3D] flex items-center justify-between text-xs font-bold"
                            >
                              <span className="text-white truncate mr-2">
                                {log.exerciseName} (S{log.setNumber})
                              </span>
                              <span className="text-[#4DA3FF] shrink-0">
                                {log.actualReps} reps × {log.actualWeight} kg
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#8B98AA]">
                        Treino concluído com sucesso e contabilizado no resumo semanal.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-[#8B98AA] bg-[#111B2A] rounded-3xl border border-[#1E2B3D]">
          Nenhum treino registrado neste período.
        </div>
      )}
    </div>
  );
};
