import React, { useState } from 'react';
import {
  X,
  Play,
  Clock,
  Dumbbell,
  Repeat,
  Shield,
  ExternalLink,
  Video,
  Trash2,
  AlertTriangle,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Settings,
  Tv,
} from 'lucide-react';
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
  const { deleteExercise, equipment } = useWorkout();
  const [activeMediaTab, setActiveMediaTab] = useState<'exercise' | 'equipment' | 'video'>('exercise');
  const [activeVideoSource, setActiveVideoSource] = useState<'exercise' | 'equipment'>('exercise');
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  if (!isOpen || !exercise) return null;

  // Find linked equipment
  const associatedEquipment = equipment.find(
    (eq) =>
      eq.id === exercise.equipmentId ||
      (exercise.equipmentName && eq.name.toLowerCase() === exercise.equipmentName.toLowerCase())
  );

  const equipmentPhoto = associatedEquipment?.imageUrl;
  const effectiveVideoUrl =
    activeVideoSource === 'equipment' && associatedEquipment?.videoUrl
      ? associatedEquipment.videoUrl
      : exercise.videoUrl || associatedEquipment?.videoUrl;

  const handleDeleteConfirmed = () => {
    if (onDeleteExercise) {
      onDeleteExercise(exercise.id);
    } else {
      deleteExercise(exercise.id);
    }
    setConfirmDelete(false);
    onClose();
  };

  // Format YouTube embed URL
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

  const embedUrl = getEmbedUrl(effectiveVideoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0D1420] border border-[#1E2B3D] rounded-3xl overflow-hidden shadow-2xl relative my-auto">
        {/* Top bar with close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Selector Tabs (Exercise photo vs Equipment photo vs Video) */}
        <div className="bg-[#070B12] px-4 pt-3 pb-2 border-b border-[#1E2B3D]/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveMediaTab('exercise')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMediaTab === 'exercise'
                ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                : 'bg-[#111B2A] text-[#8B98AA] hover:text-white border border-[#1E2B3D]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Foto Exercício</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMediaTab('equipment')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMediaTab === 'equipment'
                ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                : 'bg-[#111B2A] text-[#8B98AA] hover:text-white border border-[#1E2B3D]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto do Aparelho</span>
            {associatedEquipment && (
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" title="Aparelho vinculado" />
            )}
          </button>

          {effectiveVideoUrl && (
            <button
              type="button"
              onClick={() => setActiveMediaTab('video')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMediaTab === 'video'
                  ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                  : 'bg-[#111B2A] text-[#8B98AA] hover:text-white border border-[#1E2B3D]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Vídeo Interligado</span>
            </button>
          )}
        </div>

        {/* Large Media Visual Container */}
        <div className="relative w-full h-64 sm:h-72 bg-[#070B12] overflow-hidden group flex items-center justify-center">
          {/* 1. EXERCISE PHOTO */}
          {activeMediaTab === 'exercise' && (
            <>
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1420] via-transparent to-black/30" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/10 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#1677FF]" />
                  Execução do Exercício
                </span>
              </div>
            </>
          )}

          {/* 2. EQUIPMENT PHOTO */}
          {activeMediaTab === 'equipment' && (
            <>
              {equipmentPhoto ? (
                <>
                  <img
                    src={equipmentPhoto}
                    alt={associatedEquipment?.name || 'Aparelho'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1420] via-transparent to-black/30" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#1677FF] text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Foto do Equipamento Cadastrado
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <p className="text-xs font-black text-white uppercase tracking-tight">
                      {associatedEquipment?.name || exercise.equipmentName}
                    </p>
                    {associatedEquipment?.notes && (
                      <p className="text-[11px] text-[#8B98AA] line-clamp-1 mt-0.5">
                        {associatedEquipment.notes}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <Camera className="w-12 h-12 text-[#8B98AA] mx-auto opacity-50" />
                  <p className="text-xs font-bold text-white uppercase">
                    {exercise.equipmentName || 'Exercício com peso corporal'}
                  </p>
                  <p className="text-[11px] text-[#8B98AA]">
                    Nenhum aparelho específico vinculado a este exercício.
                  </p>
                </div>
              )}
            </>
          )}

          {/* 3. INTERLINKED VIDEO PLAYER */}
          {activeMediaTab === 'video' && (
            <div className="w-full h-full bg-black flex items-center justify-center">
              {embedUrl?.includes('embed') ? (
                <iframe
                  src={embedUrl}
                  title={exercise.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="p-6 text-center space-y-3">
                  <p className="text-xs text-[#8B98AA]">Vídeo demonstrativo externo:</p>
                  <a
                    href={effectiveVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir no YouTube
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Muscle Group & Location Badges */}
          {activeMediaTab !== 'video' && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#1677FF] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#1677FF]/40">
                  {exercise.muscleGroup}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#111B2A]/90 backdrop-blur-sm border border-[#1E2B3D] text-[#4DA3FF] text-xs font-bold">
                  {exercise.location}
                </span>
              </div>
              {exercise.equipmentName && (
                <span className="text-xs font-semibold text-white/90 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 hidden sm:inline-block">
                  {exercise.equipmentName}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Exercise Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-[#1677FF] uppercase tracking-wider">
                EXERCÍCIO CADASTRADO
              </span>
              {associatedEquipment && (
                <span className="px-2 py-0.5 rounded bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Aparelho Interligado
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              {exercise.name}
            </h2>
          </div>

          {/* SECTION: FOTO DO APARELHO / EQUIPAMENTO VINCULADO */}
          {associatedEquipment ? (
            <div className="p-4 rounded-2xl bg-[#111B2A] border border-[#1E2B3D] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#1677FF]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    APARELHO / EQUIPAMENTO VINCULADO
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#4DA3FF] bg-[#1677FF]/10 px-2 py-0.5 rounded border border-[#1677FF]/20">
                  {associatedEquipment.location}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Equipment photo thumbnail */}
                <div
                  onClick={() => setActiveMediaTab('equipment')}
                  className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-[#070B12] border border-[#1E2B3D] group cursor-pointer shrink-0"
                  title="Clique para ver a foto do aparelho em destaque"
                >
                  <img
                    src={associatedEquipment.imageUrl}
                    alt={associatedEquipment.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-3 h-3" /> Ver Foto
                    </span>
                  </div>
                </div>

                {/* Equipment details */}
                <div className="flex-1 space-y-1.5 text-left w-full">
                  <h4 className="text-sm font-black text-white uppercase">
                    {associatedEquipment.name}
                  </h4>
                  {associatedEquipment.notes && (
                    <p className="text-xs text-[#8B98AA] leading-relaxed">
                      {associatedEquipment.notes}
                    </p>
                  )}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('equipment')}
                      className="px-2.5 py-1 rounded-lg bg-[#0D1420] hover:bg-[#1677FF]/20 text-[#4DA3FF] text-[11px] font-bold border border-[#1E2B3D] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      Visualizar Máquina
                    </button>
                    {associatedEquipment.videoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVideoSource('equipment');
                          setActiveMediaTab('video');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#0D1420] hover:bg-[#1677FF]/20 text-[#4DA3FF] text-[11px] font-bold border border-[#1E2B3D] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Tv className="w-3 h-3" />
                        Vídeo do Aparelho
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            exercise.equipmentName && (
              <div className="p-3 rounded-2xl bg-[#111B2A] border border-[#1E2B3D] flex items-center gap-3">
                <Dumbbell className="w-4 h-4 text-[#8B98AA]" />
                <span className="text-xs text-[#8B98AA]">
                  Aparelho:{' '}
                  <strong className="text-white">{exercise.equipmentName}</strong>
                </span>
              </div>
            )
          )}

          {/* SECTION: VÍDEO INTERLIGADO COM O CADASTRO */}
          {(exercise.videoUrl || associatedEquipment?.videoUrl) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#1677FF]" />
                  <span className="text-xs font-black text-[#8B98AA] uppercase tracking-wider">
                    VÍDEO DE EXECUÇÃO INTERLIGADO
                  </span>
                </div>

                {/* Switch between Exercise Video and Equipment Video if both exist */}
                {exercise.videoUrl && associatedEquipment?.videoUrl && (
                  <div className="flex items-center gap-1 bg-[#111B2A] p-0.5 rounded-lg border border-[#1E2B3D]">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVideoSource('exercise');
                        setActiveMediaTab('video');
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        activeVideoSource === 'exercise'
                          ? 'bg-[#1677FF] text-white'
                          : 'text-[#8B98AA] hover:text-white'
                      }`}
                    >
                      Exercício
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVideoSource('equipment');
                        setActiveMediaTab('video');
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        activeVideoSource === 'equipment'
                          ? 'bg-[#1677FF] text-white'
                          : 'text-[#8B98AA] hover:text-white'
                      }`}
                    >
                      Aparelho
                    </button>
                  </div>
                )}
              </div>

              {/* Embedded Player in body when not in top video tab */}
              {activeMediaTab !== 'video' && (
                <div className="p-3 rounded-2xl bg-[#111B2A] border border-[#1E2B3D] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF] shrink-0">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase">
                        {activeVideoSource === 'equipment' && associatedEquipment
                          ? `Vídeo do Aparelho: ${associatedEquipment.name}`
                          : `Vídeo de Execução: ${exercise.name}`}
                      </p>
                      <p className="text-[11px] text-[#8B98AA]">
                        Interligado diretamente com o cadastro do exercício
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className="px-3.5 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#1677FF]/20 transition-all cursor-pointer shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Assistir
                  </button>
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
                className="py-3.5 px-5 rounded-2xl bg-[#111B2A] hover:bg-[#15243A] text-[#8B98AA] hover:text-white font-bold text-sm border border-[#1E2B3D] transition-colors cursor-pointer"
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
                className="px-4 py-2.5 rounded-xl bg-[#111B2A] hover:bg-[#15243A] text-[#8B98AA] hover:text-white font-bold text-xs uppercase tracking-wider border border-[#1E2B3D] transition-colors cursor-pointer"
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

