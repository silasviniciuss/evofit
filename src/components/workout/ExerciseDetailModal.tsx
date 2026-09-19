import React, { useState } from 'react';
import { X, Play, Clock, Dumbbell, Repeat, Shield, ExternalLink, Video, Trash2, AlertTriangle } from 'lucide-react';
import { Exercise } from '../../types';
import { useWorkout } from '../../context/WorkoutContext';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onStartExercise?: (exercise: Exercise) => void;
  onDeleteExercise?: (exerciseId: string) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onStartExercise,
  onDeleteExercise,
}) => {
  const { deleteExercise } = useWorkout();
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  if (!isOpen || !exercise) return null;

  const handleDeleteConfirmed = () => {
    if (onDeleteExercise) {
      onDeleteExercise(exercise.id);
    } else {
      deleteExercise(exercise.id);
    }
    setConfirmDelete(false);
    onClose();
  };

  // Check if youtube video url
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(exercise.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0D1420] border border-[#1E2B3D] rounded-3xl overflow-hidden shadow-2xl relative my-auto">
        {/* Top bar with close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Image Header (PRD Section 16: "A foto deve ser exibida em alta qualidade e ocupar bastante espaço no celular") */}
        <div className="relative w-full h-64 sm:h-72 bg-[#070B12] overflow-hidden group">
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1420] via-transparent to-black/40" />

          {/* Muscle Group & Location Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1677FF] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#1677FF]/40">
                {exercise.muscleGroup}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#111B2A]/90 backdrop-blur-sm border border-[#1E2B3D] text-[#4DA3FF] text-xs font-bold">
                {exercise.location}
              </span>
            </div>
            {exercise.equipmentName && (
              <span className="text-xs font-semibold text-white/90 bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm hidden sm:inline-block">
                {exercise.equipmentName}
              </span>
            )}
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Exercise Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              {exercise.name}
            </h2>
            {exercise.equipmentName && (
              <p className="text-xs font-semibold text-[#8B98AA] mt-1 sm:hidden">
                Aparelho: <span className="text-[#4DA3FF]">{exercise.equipmentName}</span>
              </p>
            )}
          </div>

          {/* Video Section (PRD Section 17) */}
          {exercise.videoUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#8B98AA] uppercase tracking-wider">
                  VÍDEO DE EXECUÇÃO
                </span>
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1677FF] hover:text-[#4DA3FF]"
                >
                  <Video className="w-4 h-4" />
                  {showVideo ? 'Ocultar Vídeo' : '▶ COMO FAZER'}
                </button>
              </div>

              {showVideo && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#1E2B3D] shadow-inner">
                  {embedUrl?.includes('embed') ? (
                    <iframe
                      src={embedUrl}
                      title={exercise.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-xs text-[#8B98AA] mb-2">Vídeo demonstrativo externo:</p>
                      <a
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#1677FF] text-white text-xs font-bold flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir vídeo no YouTube
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SEU TREINO: Specs Grid (PRD Section 18) */}
          <div>
            <h3 className="text-xs font-black text-[#4DA3FF] uppercase tracking-wider mb-3">
              SEU TREINO
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                  SÉRIES
                </span>
                <p className="text-xl font-black text-white">{exercise.defaultSets}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                  REPETIÇÕES
                </span>
                <p className="text-xl font-black text-white">{exercise.defaultReps}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                  CARGA
                </span>
                <p className="text-xl font-black text-white">
                  {exercise.defaultWeight > 0 ? `${exercise.defaultWeight} kg` : 'Corporal'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#111B2A] border border-[#1E2B3D]">
                <span className="text-[10px] font-extrabold text-[#8B98AA] uppercase tracking-wider block mb-1">
                  DESCANSO
                </span>
                <p className="text-xl font-black text-[#4DA3FF]">{exercise.defaultRest}s</p>
              </div>
            </div>
          </div>

          {/* Instructions "COMO EXECUTAR" (PRD Section 18) */}
          <div>
            <h3 className="text-xs font-black text-[#8B98AA] uppercase tracking-wider mb-2">
              COMO EXECUTAR
            </h3>
            <div className="p-4 rounded-2xl bg-[#111B2A]/80 border border-[#1E2B3D] text-sm text-[#8B98AA] leading-relaxed">
              {exercise.instructions}
            </div>
          </div>

          {/* Notes */}
          {exercise.notes && (
            <div className="p-3 rounded-xl bg-[#15243A]/60 border border-[#1677FF]/20 text-xs text-[#8B98AA]">
              <strong className="text-[#4DA3FF]">Observação de Silas:</strong> {exercise.notes}
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="py-3.5 px-4 rounded-2xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] font-black text-xs uppercase tracking-wider border border-[#EF4444]/30 hover:border-[#EF4444]/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Apagar este exercício da biblioteca"
            >
              <Trash2 className="w-4 h-4" />
              <span>Apagar Exercício</span>
            </button>

            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={onClose}
                className="py-3.5 px-5 rounded-2xl bg-[#111B2A] hover:bg-[#15243A] text-[#8B98AA] hover:text-white font-bold text-sm border border-[#1E2B3D] transition-colors"
              >
                Fechar
              </button>
              {onStartExercise && (
                <button
                  onClick={() => {
                    onStartExercise(exercise);
                    onClose();
                  }}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#1677FF]/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Iniciar Exercício
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Delete Exercise */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0D1420] border border-[#EF4444]/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Apagar Exercício da Biblioteca?
            </h3>

            <p className="text-xs text-[#8B98AA] mt-2 leading-relaxed">
              Tem certeza que deseja apagar o exercício <strong className="text-white">"{exercise.name}"</strong>? Esta ação removerá o exercício da sua biblioteca.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2.5 rounded-xl bg-[#111B2A] hover:bg-[#15243A] text-[#8B98AA] hover:text-white font-bold text-xs uppercase tracking-wider border border-[#1E2B3D] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-5 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#EF4444]/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Sim, Apagar Exercício
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
