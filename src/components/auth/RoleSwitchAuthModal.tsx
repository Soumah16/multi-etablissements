import React, { useState } from 'react';
import { WorkspaceMode } from '../../App';
import { AuthenticatedUser } from './AuthPortal';
import { getAccountByRole, DemoAccount } from '../../data/accountsData';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  X, 
  LogOut,
  Building2,
  Sparkles
} from 'lucide-react';

interface RoleSwitchAuthModalProps {
  targetRole: WorkspaceMode;
  targetSchoolId?: string;
  currentUser: AuthenticatedUser;
  onSuccess: (newUser: AuthenticatedUser) => void;
  onCancel: () => void;
  onLogout: () => void;
}

export const RoleSwitchAuthModal: React.FC<RoleSwitchAuthModalProps> = ({
  targetRole,
  targetSchoolId,
  currentUser,
  onSuccess,
  onCancel,
  onLogout
}) => {
  const targetAccount = getAccountByRole(targetRole);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!targetAccount) {
    return null;
  }

  const handleFillDemoPassword = () => {
    setPassword(targetAccount.plainPassword || (targetAccount as any).password || 'Smart@2026');
    setErrorMessage(null);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strict multi-school isolation check:
    if (targetSchoolId && currentUser.ecoleId && currentUser.ecoleId !== 'NATIONAL' && targetSchoolId !== currentUser.ecoleId && currentUser.role !== 'super_admin') {
      setErrorMessage(
        "Accès refusé. Isolation stricte : Vous n'avez pas l'autorisation d'accéder à l'établissement d'un autre administrateur."
      );
      return;
    }

    // Accept real password, or universal dev pass, or super admin override
    const expected = targetAccount.plainPassword || (targetAccount as any).password;
    const isValid = 
      password === expected ||
      password === 'Smart@2026' ||
      password === '123456' ||
      password === 'smartschool' ||
      (currentUser.role === 'super_admin' && password === 'AdminSuper2026!');

    if (!isValid) {
      setErrorMessage(
        'Mot de passe ou code PIN incorrect pour ce compte. Veuillez saisir le mot de passe assigné à ce rôle pour autoriser le basculement.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        role: targetAccount.role,
        name: targetAccount.name,
        email: targetAccount.email,
        matricule: targetAccount.matricule,
        schoolName: targetAccount.schoolName,
        photo: targetAccount.photo
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Authentification Obligatoire de Sécurité</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Accès Restreint
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Confirmation d'identité requise pour basculer de rôle
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Annuler et rester sur ma session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="flex-1 flex flex-col min-h-0 text-xs">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            
            {/* Security Notice */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-300 space-y-1">
              <div className="font-bold text-amber-300 text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Cloisonnement Stricte des Données Scolaires</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Pour empêcher toute intrusion non autorisée entre collègues ou personnes non habilitées, chaque changement d'espace exige la saisie du mot de passe du compte ciblé.
              </p>
            </div>

            {/* Target Account Badge */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center justify-between">
                <span>Compte cible demandé :</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${targetAccount.badgeColor}`}>
                  {targetAccount.matricule}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={targetAccount.photo}
                  alt={targetAccount.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white text-xs truncate">
                    {targetAccount.name}
                  </div>
                  <div className="text-[11px] text-blue-400 font-semibold truncate">
                    {targetAccount.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>{targetAccount.schoolName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-slate-400">
                <div>
                  <span className="text-slate-500">Email : </span>
                  <span className="text-slate-300 font-mono">{targetAccount.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Délivré par : </span>
                  <span className="text-slate-300">{targetAccount.provisionedBy}</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="text-[11px] leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Password Input Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-200">
                  Mot de passe ou Code PIN du compte cible *
                </label>
                <button
                  type="button"
                  onClick={handleFillDemoPassword}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  title="Remplir le mot de passe préconfiguré de ce rôle"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Remplir mot de passe test</span>
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Saisissez le mot de passe officiel..."
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center">
              Session actuelle active : <strong className="text-slate-300">{currentUser.name}</strong> ({currentUser.role})
            </div>
          </div>

          {/* Modal Footer with Strict Choices */}
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1.5 text-[11px] text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-3 h-3 text-slate-500 hover:text-rose-400" />
              <span>Quitter et se déconnecter</span>
            </button>

            <div className="w-full sm:w-auto flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || !password}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Valider & Basculer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
