import React, { useState } from 'react';
import { Dumbbell, Lock, User as UserIcon, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export const LoginView: React.FC = () => {
  const { login } = useWorkout();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small timeout for smooth feedback
    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) {
        setError('Usuário ou senha incorretos.');
        setIsLoading(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#070B12] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans selection:bg-[#1677FF] selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1677FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#0A5BE7]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1677FF] to-[#0A5BE7] text-white shadow-xl shadow-[#1677FF]/25 mb-4 ring-4 ring-[#1677FF]/20">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">
            SILAS VINÍCIUS
          </h1>
          <p className="text-xs font-bold text-[#4DA3FF] uppercase tracking-widest mt-1">
            MEU TREINO • SISTEMA PESSOAL
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-[#111B2A] border border-[#1E2B3D] text-[11px] text-[#8B98AA] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            Acesso Restrito ao Painel & Informações
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D1420] border border-[#1E2B3D] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="mb-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wide">
              Entrar no Sistema
            </h2>
            <p className="text-xs text-[#8B98AA] mt-1">
              Informe seu usuário e senha para desbloquear seu painel e rotinas.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center gap-3 text-xs text-[#EF4444] animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuário Input */}
            <div>
              <label className="block text-xs font-bold text-[#8B98AA] uppercase tracking-wider mb-2">
                Usuário ou E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B98AA]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário ou e-mail"
                  className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#8B98AA] focus:outline-none focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] transition-all"
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Senha Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#8B98AA] uppercase tracking-wider">
                  Senha de Acesso
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B98AA]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-[#111B2A] border border-[#1E2B3D] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-[#8B98AA] focus:outline-none focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] transition-all"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8B98AA] hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1677FF] hover:bg-[#0A5BE7] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#1677FF]/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>ACESSAR MEU TREINO</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Footer Note */}
        <p className="text-center text-[11px] text-[#8B98AA]/70 mt-6">
          Área de uso pessoal e intransferível de Silas Vinícius. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
