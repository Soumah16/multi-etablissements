import React, { useState } from 'react';
import { WorkspaceMode } from '../../App';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  School, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  DollarSign,
  Users,
  Compass,
  FileCheck2,
  Sparkles,
  Award,
  Building2,
  ShieldAlert,
  Info,
  Check,
  RefreshCw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  DEMO_ACCOUNTS, 
  DemoAccount, 
  authenticateUser, 
  isDemoModeActive, 
  setDemoModeActive, 
  getStoredAccounts, 
  saveStoredAccounts 
} from '../../data/accountsData';

export interface AuthenticatedUser {
  role: WorkspaceMode;
  name: string;
  email: string;
  matricule?: string;
  schoolName?: string;
  photo?: string;
  ecoleId?: string;
  nationalUid?: string;
  badgeNumber?: string;
  status?: string;
  mustChangePassword?: boolean;
}

interface AuthPortalProps {
  onLogin: (user: AuthenticatedUser) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLogin }) => {
  // Mode Démonstration state
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => isDemoModeActive());
  
  // Credentials
  const [selectedRole, setSelectedRole] = useState<WorkspaceMode>('super_admin');
  const [identifier, setIdentifier] = useState('superadmin@smartschool.gn');
  const [password, setPassword] = useState('AdminSuper2026!');
  const [schoolId, setSchoolId] = useState<string>('NATIONAL');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [showAccountIssuanceModal, setShowAccountIssuanceModal] = useState(false);

  // Forced password change modal on first login
  const [pendingFirstLoginUser, setPendingFirstLoginUser] = useState<DemoAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  const categories = ['Tous', 'Direction & Administration', 'Pédagogie & Encadrement', 'Finances & Ressources', 'Famille & Apprenant'];

  const schoolsList = [
    { id: 'NATIONAL', name: 'Direction Nationale MEPU-A (Niveau Central)' },
    { id: 'ECOLE-001', name: 'Lycée d\'Excellence de Conakry (Conakry)' },
    { id: 'ECOLE-002', name: 'Collège & Lycée Sainte-Marie (Dixinn)' },
    { id: 'ECOLE-003', name: 'Groupe Scolaire Hadja Mafory Bangoura' }
  ];

  const handleToggleDemoMode = () => {
    const nextVal = !isDemoMode;
    setIsDemoMode(nextVal);
    setDemoModeActive(nextVal);
    setErrorMessage(null);
  };

  const handleSelectRoleForAutofill = (acc: DemoAccount) => {
    setSelectedRole(acc.role);
    setIdentifier(acc.email);
    setPassword(acc.plainPassword || acc.password || 'Smart@2026');
    setSchoolId(acc.ecoleId || 'ECOLE-001');
    setErrorMessage(null);
  };

  const handleCompleteLogin = (user: DemoAccount) => {
    onLogin({
      role: user.role,
      name: user.name,
      email: user.email,
      matricule: user.matricule,
      schoolName: user.schoolName,
      photo: user.photo,
      ecoleId: user.ecoleId,
      nationalUid: user.nationalUid,
      badgeNumber: user.badgeNumber,
      status: user.status,
      mustChangePassword: user.mustChangePassword
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      // Call enterprise authenticateUser verification
      const result = authenticateUser(identifier, password, schoolId);

      setIsLoading(false);

      if (!result.success || !result.user) {
        // Displays exact required messages:
        // "Identifiant ou mot de passe incorrect."
        // "Compte désactivé."
        // "Compte verrouillé."
        setErrorMessage(result.errorMessage || 'Identifiant ou mot de passe incorrect.');
        return;
      }

      // Check if user must change initial temporary password
      if (result.mustChangePassword) {
        setPendingFirstLoginUser(result.user);
        return;
      }

      handleCompleteLogin(result.user);
    }, 400);
  };

  const handleApplyNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);

    if (newPassword.length < 8) {
      setPasswordChangeError('Le mot de passe doit contenir au minimum 8 caractères.');
      return;
    }
    if (newPassword === 'Smart@2026') {
      setPasswordChangeError('Vous ne pouvez pas réutiliser le mot de passe temporaire initial.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (!pendingFirstLoginUser) return;

    // Update account in stored accounts
    const all = getStoredAccounts();
    const updated = all.map(a => {
      if (a.id === pendingFirstLoginUser.id) {
        return {
          ...a,
          plainPassword: newPassword,
          mustChangePassword: false,
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    });
    saveStoredAccounts(updated);

    const readyUser = {
      ...pendingFirstLoginUser,
      plainPassword: newPassword,
      mustChangePassword: false
    };

    setPendingFirstLoginUser(null);
    handleCompleteLogin(readyUser);
  };

  const filteredDemoAccounts = selectedCategory === 'Tous'
    ? DEMO_ACCOUNTS
    : DEMO_ACCOUNTS.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Government & System Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">
            S
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              <span>SmartSchool ERP Guinée</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                MEPU-A SOUVERAIN
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              Portail National Sécurisé · République de Guinée (Travail - Justice - Solidarité)
            </div>
          </div>
        </div>

        {/* Mode Demo Switcher & RBAC Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleDemoMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isDemoMode
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30 shadow-md shadow-rose-900/30'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title="Activer ou désactiver le mode démonstration"
          >
            {isDemoMode ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>MODE DÉMONSTRATION</span>
                <ToggleRight className="w-4 h-4 text-rose-400" />
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>MODE PRODUCTION STRICT</span>
                <ToggleLeft className="w-4 h-4 text-emerald-400" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center overflow-y-auto">
        {/* Prominent State Banner */}
        {isDemoMode ? (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-rose-950/40 border-2 border-rose-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[11px] tracking-wide animate-pulse">
                MODE DÉMONSTRATION
              </span>
              <span className="text-slate-200 text-xs">
                Les profils ci-dessous permettent de tester le comportement réel de chaque rôle avec vérification sécurisée des identifiants.
              </span>
            </div>
            <span className="text-[11px] font-mono text-rose-300">
              10 Rôles MEPU-A Disponibles
            </span>
          </div>
        ) : (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200 text-xs font-semibold">
                <strong>Environnement de Production MEPU-A :</strong> Connexion rapide désactivée. Saisie manuelle de vos identifiants d'établissement requise.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] shrink-0 font-bold">
              ISO/IEC 27001
            </span>
          </div>
        )}

        <div className={`grid grid-cols-1 ${isDemoMode ? 'lg:grid-cols-12' : 'max-w-xl mx-auto w-full'} gap-5 items-start`}>
          {/* Left Column (or Center in Prod): Direct Login Form */}
          <div className={`${isDemoMode ? 'lg:col-span-5' : 'w-full'} rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h1 className="text-base font-black text-white flex items-center gap-2">
                  <span>Authentification Unique</span>
                  <Lock className="w-4 h-4 text-blue-400" />
                </h1>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Accès cloisonné par rôle et établissement MEPU-A
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Error Message banner with exact specifications */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border-2 border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-rose-300">{errorMessage}</div>
                  <div className="text-[10px] text-rose-300/80">
                    Vérifiez la concordance de votre identifiant, mot de passe et école de rattachement.
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* School selection field for strict multi-school isolation */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Établissement de rattachement *</span>
                  <span className="text-[10px] font-mono text-slate-500">Partitionnement ecoleId</span>
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    {schoolsList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Identifier / Email / Matricule */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Identifiant officiel, Email ou Matricule MEPU-A *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ex: prof.diallo@smartschool.gn ou ENS-EXC-015"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Mot de passe *
                  </label>
                  <span className="text-[10px] text-blue-400 font-mono">Chiffrement AES-256</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
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

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 text-blue-600 focus:ring-0 w-3.5 h-3.5 bg-slate-800" />
                  <span>Mémoriser session</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAccountIssuanceModal(true)}
                  className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-medium"
                >
                  Qui délivre les comptes ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Se connecter à mon Espace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Protection Anti-Bruteforce (Max 5 essais)</span>
              </span>
              <span className="font-mono">v3.2 Guinée</span>
            </div>
          </div>

          {/* Right Column: Demo Profiles (Visible only when isDemoMode is TRUE) */}
          {isDemoMode && (
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fiches Démo Certifiées (Sélectionnez pour pré-remplir)</span>
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    Cliquez sur une fiche pour charger ses identifiants officiels dans le formulaire de connexion.
                  </p>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[calc(100vh-220px)] sm:max-h-[460px] overflow-y-auto pr-1">
                {filteredDemoAccounts.map((acc) => {
                  const isSelected = selectedRole === acc.role;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleSelectRoleForAutofill(acc)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/10'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={acc.photo}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="text-xs font-bold text-white leading-tight">
                                {acc.name}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-tight">
                                {acc.title}
                              </div>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${acc.badgeColor} whitespace-nowrap`}>
                            {acc.matricule}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                          {acc.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">
                          {acc.email}
                        </span>
                        <span className="text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
                          <span>Charger</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mandatory First-Login Password Change Modal */}
      {pendingFirstLoginUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Changement de Mot de Passe Obligatoire</h3>
                <p className="text-[11px] text-slate-400">Premier accès détecté pour {pendingFirstLoginUser.name}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-xs space-y-1">
              <strong className="text-amber-300 block font-semibold">Protocole MEPU-A Sécurité :</strong>
              <p>
                Votre compte a été initialisé avec un mot de passe temporaire (ex: <code>Smart@2026</code>). Pour sécuriser vos accès, vous devez définir votre mot de passe personnel définitif.
              </p>
            </div>

            {passwordChangeError && (
              <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                {passwordChangeError}
              </div>
            )}

            <form onSubmit={handleApplyNewPassword} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Nouveau mot de passe personnel *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 caractères..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Confirmer le nouveau mot de passe *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingFirstLoginUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Enregistrer & Ouvrir la session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Provisioning Governance Modal */}
      {showAccountIssuanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Attribution & Délivrance des Comptes SmartSchool
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Protocole de sécurité hiérarchique et gouvernance MEPU-A
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountIssuanceModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-slate-300 space-y-1">
                <strong className="text-white block font-bold">Règle de Sécurité Fondamentale :</strong>
                <span>
                  Sur SmartSchool ERP, les comptes ne sont jamais créés en libre-service. Chaque compte est délivré selon une hiérarchie stricte d'habilitation.
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400">1. Super Administrateur National (MEPU-A)</span>
                    <span className="text-[10px] font-mono text-slate-400">Niveau Central</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Crée les établissements scolaires et délivre les comptes officiels des <strong>Admins École (Fondateurs & Directions Générales)</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">2. Admin École (Fondateur)</span>
                    <span className="text-[10px] font-mono text-slate-400">Niveau Établissement</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Crée et administre les comptes professionnels du personnel : <strong>Directeur des Études, Censeur, Secrétaire Générale, Chef Comptable, Surveillant Général, Bibliothécaire, Enseignants, Élèves et Parents</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
                  <strong className="block font-bold">Isolation Établissement (Multi-Tenant) :</strong>
                  <span className="text-[11px] text-slate-300 block">
                    Un utilisateur rattaché à une école (ex: <code>ECOLE-001</code>) ne peut en aucun cas accéder aux données, notes ou finances d'une autre école.
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowAccountIssuanceModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
