import React, { useState } from 'react';
import { Wrench, Plus, Video, ExternalLink, Dumbbell } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { Equipment } from '../../types';

interface EquipmentLibraryViewProps {
  onOpenAdminNewEquipment?: () => void;
}

export const EquipmentLibraryView: React.FC<EquipmentLibraryViewProps> = ({
  onOpenAdminNewEquipment,
}) => {
  const { equipment, exercises } = useWorkout();
  const [activeVideoModal, setActiveVideoModal] = useState<Equipment | null>(null);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B3D]">
        <div>
          <span className="text-xs font-black text-[#4DA3FF] uppercase tracking-wider">
            ESTRUTURA & MÁQUINAS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            MEUS APARELHOS
          </h1>
        </div>

        {onOpenAdminNewEquipment && (
          <button
            onClick={onOpenAdminNewEquipment}
            className="px-4 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-md shadow-[#1677FF]/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Novo Aparelho
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {equipment.map((item) => {
          // Find exercises that use this equipment
          const relatedExercises = exercises.filter((ex) => ex.equipmentId === item.id);

          return (
            <div
              key={item.id}
              className="bg-[#111B2A] border border-[#1E2B3D] rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm group hover:border-[#1677FF]/40 transition-all"
            >
              {/* Photo */}
              <div className="relative h-48 w-full bg-[#070B12] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111B2A] via-transparent to-black/30" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#1677FF] text-white text-[10px] font-black uppercase tracking-wider">
                    {item.location}
                  </span>
                </div>

                {item.videoUrl && (
                  <button
                    onClick={() => setActiveVideoModal(item)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#1677FF] transition-colors border border-white/10"
                    title="Vídeo demonstrativo"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    {item.name}
                  </h3>
                  {item.notes && (
                    <p className="text-xs text-[#8B98AA] mt-1.5 leading-relaxed">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Related Exercises list (PRD Section 31) */}
                <div className="pt-3 border-t border-[#1E2B3D]">
                  <span className="text-[10px] font-black text-[#8B98AA] uppercase tracking-wider block mb-1.5">
                    EXERCÍCIOS ASSOCIADOS ({relatedExercises.length})
                  </span>
                  {relatedExercises.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {relatedExercises.map((rel) => (
                        <span
                          key={rel.id}
                          className="px-2.5 py-1 rounded-lg bg-[#0D1420] border border-[#1E2B3D] text-[11px] font-bold text-white/90"
                        >
                          {rel.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8B98AA] italic">
                      Nenhum exercício vinculado ainda.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal if clicked */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#0D1420] border border-[#1E2B3D] rounded-3xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3D] mb-4">
              <h3 className="text-base font-black text-white uppercase">
                {activeVideoModal.name}
              </h3>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-xl bg-[#111B2A] text-[#8B98AA] hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black mb-4">
              <iframe
                src={
                  activeVideoModal.videoUrl?.includes('watch?v=')
                    ? activeVideoModal.videoUrl.replace('watch?v=', 'embed/')
                    : activeVideoModal.videoUrl
                }
                title={activeVideoModal.name}
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
