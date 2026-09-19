import React, { useState } from 'react';
import { Shield, Lock, Mail, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { login } = useWorkout();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const ok = login(email, password);
    if (ok) {
      onSuccess();
      onClose();
    } else {
      setError('Credenciais incorretas. Verifique os dados informados.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0D1420] border border-[#1E2B3D] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#111B2A] text-[#8B98AA] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1677FF]/20 border border-[#1677FF]/40 flex items-center justify-center text-[#4DA3FF] mx-auto shadow-lg shadow-[#1677FF]/20">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            ACESSO ADMINISTRATIVO
          </h2>
          <p className="text-xs text-[#8B98AA]">
            Área restrita de Silas Vinícius para gerenciamento de treinos
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center gap-2 text-xs text-[#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase tracking-wider mb-1.5">
              Usuário ou E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu usuário ou e-mail"
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#8B98AA] focus:outline-none focus:border-[#1677FF] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B98AA] uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#8B98AA] focus:outline-none focus:border-[#1677FF] transition-colors"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#1677FF]/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              ENTRAR NO PAINEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
