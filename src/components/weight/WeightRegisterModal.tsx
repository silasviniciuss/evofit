import React, { useState, useEffect } from 'react';
import { X, Scale, AlertCircle, Check, Calendar } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { getTodayDateString } from '../../utils/formatters';

interface WeightRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export const WeightRegisterModal: React.FC<WeightRegisterModalProps> = ({
  isOpen,
  onClose,
  initialDate,
}) => {
  const { todayWeightRecord, getWeightForDate, saveWeightRecord } = useWorkout();

  const [date, setDate] = useState<string>(initialDate || getTodayDateString());
  const [weight, setWeight] = useState<string>('78.8');
  const [duplicateWarning, setDuplicateWarning] = useState<{
    show: boolean;
    existingWeight: number;
  }>({ show: false, existingWeight: 0 });

  useEffect(() => {
    if (isOpen) {
      const selectedDate = initialDate || getTodayDateString();
      setDate(selectedDate);
      const existing = getWeightForDate(selectedDate);
      if (existing) {
        setWeight(existing.weight.toString());
      } else if (todayWeightRecord) {
        setWeight(todayWeightRecord.weight.toString());
      } else {
        setWeight('78.8');
      }
      setDuplicateWarning({ show: false, existingWeight: 0 });
    }
  }, [isOpen, initialDate, todayWeightRecord, getWeightForDate]);

  if (!isOpen) return null;

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const existing = getWeightForDate(newDate);
    if (existing) {
      setWeight(existing.weight.toString());
    }
  };

  const handleSave = (overwrite = false) => {
    const numWeight = parseFloat(weight.replace(',', '.'));
    if (isNaN(numWeight) || numWeight <= 30 || numWeight >= 300) {
      alert('Por favor insira um peso válido (ex: 78,8 kg)');
      return;
    }

    const res = saveWeightRecord(date, numWeight, overwrite);
    if (!res.success && res.existingRecord) {
      // PRD Section 25: duplicate confirmation prompt
      setDuplicateWarning({
        show: true,
        existingWeight: res.existingRecord.weight,
      });
      return;
    }

    onClose();
  };

  const adjustWeight = (delta: number) => {
    const current = parseFloat(weight.replace(',', '.')) || 78.8;
    const updated = Math.max(30, Math.min(250, current + delta));
    setWeight(updated.toFixed(1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0D1420] border border-[#1E2B3D] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1677FF]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 border border-[#1677FF]/40 flex items-center justify-center text-[#4DA3FF]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">REGISTRAR PESO</h3>
              <p className="text-xs text-[#8B98AA]">Acompanhamento diário Silas Vinícius</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#111B2A] text-[#8B98AA] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning Prompt (PRD Section 25) */}
        {duplicateWarning.show ? (
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-white mb-1">Registro Existente</p>
                <p className="text-[#8B98AA]">
                  Você já registrou seu peso nesta data:{' '}
                  <strong className="text-[#F59E0B] font-black">
                    {duplicateWarning.existingWeight.toString().replace('.', ',')} kg
                  </strong>
                  . Deseja atualizar esse registro?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDuplicateWarning({ show: false, existingWeight: 0 })}
                className="flex-1 py-3 px-4 rounded-xl bg-[#111B2A] hover:bg-[#15243A] text-white font-bold text-sm border border-[#1E2B3D] transition-colors"
              >
                CANCELAR
              </button>
              <button
                onClick={() => handleSave(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-bold text-sm shadow-lg shadow-[#1677FF]/30 transition-colors"
              >
                ATUALIZAR
              </button>
            </div>
          </div>
        ) : (
          <div className="py-5 space-y-5">
            {/* Date Input */}
            <div>
              <label className="block text-xs font-bold text-[#8B98AA] uppercase tracking-wider mb-2">
                Data do Registro
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-[#1677FF] transition-colors"
                />
                <Calendar className="w-4 h-4 text-[#8B98AA] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Weight Input with Stepper */}
            <div>
              <label className="block text-xs font-bold text-[#8B98AA] uppercase tracking-wider mb-2">
                Peso Corporal (kg)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustWeight(-0.1)}
                  className="w-12 h-14 rounded-2xl bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] text-xl font-black text-white flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="78.8"
                    className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-2xl py-3 px-4 text-center text-3xl font-black text-white tracking-wider focus:outline-none focus:border-[#1677FF] transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8B98AA]">
                    kg
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => adjustWeight(0.1)}
                  className="w-12 h-14 rounded-2xl bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] text-xl font-black text-white flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>

              {/* Quick Stepper Pills */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {[-1.0, -0.5, +0.5, +1.0].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => adjustWeight(step)}
                    className="px-2.5 py-1 rounded-lg bg-[#111B2A] hover:bg-[#15243A] border border-[#1E2B3D] text-xs font-bold text-[#8B98AA] hover:text-white transition-colors"
                  >
                    {step > 0 ? `+${step}` : step} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#1E2B3D] flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl bg-[#111B2A] hover:bg-[#15243A] text-[#8B98AA] hover:text-white font-bold text-sm border border-[#1E2B3D] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="flex-1 py-3 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#1677FF]/25 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Salvar Peso
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
