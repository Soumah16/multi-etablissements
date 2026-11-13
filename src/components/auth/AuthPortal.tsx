import React, { useState, useRef } from 'react';
import { WorkspaceMode } from '../../App';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  Building2, 
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  MapPin,
  ArrowUpRight,
  Code2,
  CheckCircle2,
  BookOpen,
  Users
} from 'lucide-react';
import { 
  DemoAccount, 
  authenticateUser 
} from '../../data/accountsData';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import heroImg from '../../assets/images/guinea_school_hero_1794497471323.jpg';
import classroomImg from '../../assets/images/students_modern_classroom_1794497472286.jpg';
import teacherImg from '../../assets/images/teacher_excellence_portrait_1794497472066.jpg';
import libraryImg from '../../assets/images/library_students_reading_1794497472173.jpg';

// High-fidelity image assets bundled by Vite for production web & APK builds
const IMAGES = {
  hero: heroImg,
  classroom: classroomImg,
  teacher: teacherImg,
  library: libraryImg,
};

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
  const { settings } = useApp();
  const customPhotos = settings.homepagePhotos;
  const activePhotos = {
    hero: customPhotos?.hero?.trim() || IMAGES.hero,
    classroom: customPhotos?.classroom?.trim() || IMAGES.classroom,
    teacher: customPhotos?.teacher?.trim() || IMAGES.teacher,
    library: customPhotos?.library?.trim() || IMAGES.library,
  };

  // Production Credentials Form State (No demo pre-fill)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState<string>('ECOLE-001');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAccountIssuanceModal, setShowAccountIssuanceModal] = useState(false);

  // Forced password change modal on first login
  const [pendingFirstLoginUser, setPendingFirstLoginUser] = useState<DemoAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Ref to scroll to login box
  const loginSectionRef = useRef<HTMLDivElement>(null);

  const schoolsList = [
    { id: 'ECOLE-001', name: 'Lycée d\'Excellence de Conakry', city: 'Kaloum, Conakry' },
    { id: 'ECOLE-002', name: 'Collège & Lycée Sainte-Marie', city: 'Dixinn, Conakry' },
    { id: 'ECOLE-003', name: 'Groupe Scolaire Hadja Mafory Bangoura', city: 'Matam, Conakry' },
    { id: 'NATIONAL', name: 'Direction Nationale MEPU-A (Niveau Central)', city: 'Conakry' }
  ];

  const scrollToLogin = () => {
    if (loginSectionRef.current) {
      loginSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

    if (!identifier.trim() || !password) {
      setErrorMessage('Veuillez renseigner votre identifiant et votre mot de passe.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Real authentication verification
      const result = authenticateUser(identifier.trim(), password, schoolId);
      setIsLoading(false);

      if (!result.success || !result.user) {
        setErrorMessage(result.errorMessage || 'Identifiant ou mot de passe incorrect.');
        return;
      }

      // Check if user must change initial temporary password
      if (result.mustChangePassword) {
        setPendingFirstLoginUser(result.user);
        return;
      }

      handleCompleteLogin(result.user);
    }, 350);
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

    if (pendingFirstLoginUser) {
      const updatedUser: DemoAccount = {
        ...pendingFirstLoginUser,
        plainPassword: newPassword,
        password: newPassword,
        mustChangePassword: false
      };
      setPendingFirstLoginUser(null);
      handleCompleteLogin(updatedUser);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Republic of Guinea Official Tricolor Banner */}
      <div className="h-1.5 w-full grid grid-cols-3 shrink-0 shadow-sm">
        <div className="bg-[#CE1126]" title="Rouge: Le sang des martyrs / Travail" />
        <div className="bg-[#FCD116]" title="Jaune: L'or et le soleil / Justice" />
        <div className="bg-[#009460]" title="Vert: La végétation et l'agriculture / Solidarité" />
      </div>

      {/* Modern, Clean Light Top Header */}
      <header className="border-b border-blue-100 bg-white/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 sticky top-0 z-40 transition-all shadow-xs">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shadow-blue-500/25 ring-2 ring-blue-100 shrink-0">
            S
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-tight text-blue-950 truncate">SmartSchool ERP</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold hidden sm:inline-flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                RÉPUBLIQUE DE GUINÉE
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium hidden md:block truncate">
              Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A)
            </div>
          </div>
        </div>

        {/* Right Header Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton variant="header" />
          <button
            type="button"
            onClick={scrollToLogin}
            className="px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Connexion</span>
            <span className="hidden sm:inline">Espace</span>
          </button>
        </div>
      </header>

      {/* Main Content Area with Light Blue Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-8 sm:space-y-12 min-w-0">
        {/* =========================================================================
            SECTION 1: HERO AVEC IMAGE SOUVERAINE GUINÉENNE & FOND BLEU CLAIR
        ========================================================================= */}
        <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/95 border border-blue-100 p-4 sm:p-8 lg:p-12 shadow-xl shadow-blue-900/5">
          {/* Subtle Ambient Pastel Blue Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Column: Inspiring Presentation */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left min-w-0">
              {/* Sovereign National Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] sm:text-xs text-blue-900 font-semibold max-w-full">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                <span className="truncate">Plateforme Nationale MEPU-A · Production</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-blue-950 tracking-tight leading-tight">
                L'école moderne & connectée au service de la Guinée
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
                Gestion académique centralisée pour les établissements scolaires guinéens : cartes d'identité scolaires PVC sécurisées, bulletins officiels infalsifiables, suivi continu des cours et comptabilité en Franc Guinéen (GNF).
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={scrollToLogin}
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <Lock className="w-4 h-4 text-blue-100" />
                  <span>Accéder à mon Espace</span>
                  <ArrowRight className="w-4 h-4 text-blue-100 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowAccountIssuanceModal(true)}
                  className="px-5 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Attribution des Comptes</span>
                </button>

                <PWAInstallButton variant="hero" />
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4 border-t border-blue-100">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div className="text-sm sm:text-lg font-black text-blue-900 font-mono">Multi-Écoles</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">Isolation stricte</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-sm sm:text-lg font-black text-emerald-800 font-mono">Cartes PVC</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">Norme ISO 300 DPI</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <div className="text-sm sm:text-lg font-black text-amber-800 font-mono">GNF</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">Franc Guinéen natif</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-sm sm:text-lg font-black text-purple-800 font-mono">10 Rôles</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">Gouvernance RBAC</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero High-Fidelity Photograph */}
            <div className="lg:col-span-5 relative min-w-0">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-blue-900/10 group">
                <img
                  src={activePhotos.hero}
                  alt="Élèves guinéens au Lycée d'Excellence de Conakry"
                  referrerPolicy="no-referrer"
                  className="w-full h-60 sm:h-80 lg:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = '1';
                      e.currentTarget.src = IMAGES.hero;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

                {/* Floating Guinea Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-100 shadow-md flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      🇬🇳
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-950">Lycée d'Excellence de Conakry</div>
                      <div className="text-[10px] text-emerald-700 font-medium">Cadre académique républicain</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    2026-2027
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: AUTHENTIFICATION PRODUCTION PROPRE (SANS MODE DÉMO)
        ========================================================================= */}
        <section ref={loginSectionRef} className="pt-2 scroll-mt-20">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Portail Officiel MEPU-A</span>
              <h2 className="text-2xl sm:text-3xl font-black text-blue-950">Connexion à votre Espace</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Saisissez les identifiants officiels attribués par l'administration de votre établissement.
              </p>
            </div>

            {/* Clean White Login Card on Light Blue */}
            <div className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="text-left">
                  <h3 className="text-base font-black text-blue-950 flex items-center gap-2">
                    <span>Accès Sécurisé</span>
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Élèves, Parents, Enseignants et Administration
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-900">{errorMessage}</div>
                    <div className="text-[11px] text-rose-700 mt-0.5">
                      Veuillez vérifier votre identifiant, mot de passe et école de rattachement.
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* 1. Établissement de rattachement */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Établissement de rattachement *</span>
                    <span className="text-[10px] font-mono text-blue-600">Cloisonnement strict</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors cursor-pointer"
                    >
                      {schoolsList.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Identifiant / Email / Matricule */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Identifiant, Email ou Matricule MEPU-A *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="ex: ens.diallo@smartschool.gn ou ENS-EXC-015"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                {/* 3. Mot de passe */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Mot de passe *
                    </label>
                    <span className="text-[10px] text-blue-600 font-mono">Chiffrement AES-256</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:bg-white font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 bg-white" />
                    <span>Mémoriser ma session</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAccountIssuanceModal(true)}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium text-xs"
                  >
                    Qui délivre mon compte ?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Se Connecter à mon Espace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Isolation Multi-Tenant Active</span>
                </span>
                <span className="font-mono text-blue-700 font-bold">MEPU-A Guinée</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: 3 CARTES VISUELLES AVEC LES BELLES IMAGES GÉNÉRÉES
        ========================================================================= */}
        <section className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pédagogie & Technologies</span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950">Des Outils Conçus pour la Réussite Scolaire</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Une infrastructure complète, moderne et accessible pour l'ensemble des acteurs éducatifs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Classroom */}
            <div className="rounded-3xl overflow-hidden bg-white border border-blue-100 hover:border-blue-200 transition-all shadow-md shadow-blue-900/5 flex flex-col group">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={activePhotos.classroom}
                  alt="Apprentissage et technologie en classe"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = '1';
                      e.currentTarget.src = IMAGES.classroom;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-xs">
                  Élèves & Pédagogie
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
                <div>
                  <h3 className="text-base font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                    Saisie des Notes & Bulletins Officiels
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Calcul automatique des moyennes trimestrielles, rangs, coefficients officiels MEPU-A et impression de bulletins scolaires infalsifiables.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center justify-between">
                  <span>Suivi continu des compétences</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Feature 2: Teachers */}
            <div className="rounded-3xl overflow-hidden bg-white border border-blue-100 hover:border-blue-200 transition-all shadow-md shadow-blue-900/5 flex flex-col group">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={activePhotos.teacher}
                  alt="Enseignants d'excellence"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = '1';
                      e.currentTarget.src = IMAGES.teacher;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-600 text-white text-[11px] font-bold shadow-xs">
                  Corps Enseignant
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
                <div>
                  <h3 className="text-base font-bold text-blue-950 group-hover:text-amber-700 transition-colors">
                    Cartes Scolaires PVC & Emplois du Temps
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Studio de badges PVC haute définition (300 DPI, norme CR-80) avec QR Code anti-fraude, signature et filigrane républicain.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-amber-700 flex items-center justify-between">
                  <span>Conforme aux normes PVC ISO</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Feature 3: Library */}
            <div className="rounded-3xl overflow-hidden bg-white border border-blue-100 hover:border-blue-200 transition-all shadow-md shadow-blue-900/5 flex flex-col group">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={activePhotos.library}
                  alt="Bibliothèque scolaire et lecture"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = '1';
                      e.currentTarget.src = IMAGES.library;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                  Bibliothèque & Savoir
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
                <div>
                  <h3 className="text-base font-bold text-blue-950 group-hover:text-emerald-700 transition-colors">
                    Bibliothèque Numérique & Vrais Livres
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Catalogue enrichi de manuels nationaux, romans guinéens et ouvrages scientifiques consultables directement en liseuse intégrée.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center justify-between">
                  <span>Liseuse intégrée sans publicité</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: ÉTABLISSEMENTS PARTENAIRES DÉPLOYÉS
        ========================================================================= */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 space-y-6 shadow-md shadow-blue-900/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Réseau d'Établissements Pilotes</span>
              <h3 className="text-xl font-bold text-blue-950">Écoles Connectées au Réseau MEPU-A</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                ● 100% Connecté & Opérationnel
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schoolsList.filter(s => s.id !== 'NATIONAL').map(school => (
              <div key={school.id} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-left space-y-2 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {school.id}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{school.city}</span>
                  </span>
                </div>
                <div className="font-bold text-sm text-blue-950">{school.name}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cycle Primaire, Collège & Lycée</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: SIGNATURE & CONTACT DU DÉVELOPPEUR SAÏD SOUMAH
        ========================================================================= */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-mono border border-blue-400/30">
                <Code2 className="w-3.5 h-3.5 text-blue-300" />
                <span>Ingénierie & Architecture Logicielle</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Développé par Saïd Soumah
              </h3>
              <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
                Expert en conception de plateformes numériques scolaires, sécurité applicative et architectures distribuées pour la République de Guinée.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="mailto:saidsoumah23@gmail.com"
                className="px-5 py-3 rounded-xl bg-white text-blue-950 hover:bg-blue-50 text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>saidsoumah23@gmail.com</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Light Footer with Official Credits and Saïd Soumah Signature */}
      <footer className="border-t border-blue-100 bg-white px-4 sm:px-8 py-6 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600">
          <span>SmartSchool ERP Guinée · Système Scolaire National</span>
          <span>·</span>
          <span>MEPU-A République de Guinée (Travail - Justice - Solidarité)</span>
          <span>·</span>
          <span>Développeur : <strong className="text-blue-950 font-bold">Saïd Soumah</strong> (saidsoumah23@gmail.com)</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Tous droits réservés © 2026-2027 Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation.
        </p>
      </footer>

      {/* Mandatory First-Login Password Change Modal */}
      {pendingFirstLoginUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white border border-blue-100 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-blue-950">Changement de Mot de Passe Requis</h3>
                <p className="text-[11px] text-slate-500">Premier accès pour {pendingFirstLoginUser.name}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-slate-700 text-xs space-y-1 text-left">
              <strong className="text-amber-900 block font-semibold">Protocole MEPU-A Sécurité :</strong>
              <p>
                Votre compte a été initialisé avec un mot de passe temporaire. Vous devez obligatoirement choisir un mot de passe personnel pour continuer.
              </p>
            </div>

            {passwordChangeError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left">
                {passwordChangeError}
              </div>
            )}

            <form onSubmit={handleApplyNewPassword} className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nouveau mot de passe *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 caractères..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Confirmer le mot de passe *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingFirstLoginUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Enregistrer & Ouvrir la Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Provisioning Governance Modal */}
      {showAccountIssuanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-blue-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <h3 className="text-sm font-bold text-blue-950">
                    Attribution & Délivrance des Comptes SmartSchool
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Protocole de sécurité hiérarchique et gouvernance MEPU-A
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountIssuanceModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-left">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-slate-700 space-y-1">
                <strong className="text-blue-950 block font-bold">Règle de Sécurité Fondamentale :</strong>
                <span>
                  Sur SmartSchool ERP, les comptes ne sont jamais créés en libre-service. Chaque compte est délivré selon une hiérarchie stricte d'habilitation.
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700">1. Super Administrateur National (MEPU-A)</span>
                    <span className="text-[10px] font-mono text-slate-500">Niveau Central</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Crée les établissements scolaires et délivre les comptes officiels des <strong>Admins École (Fondateurs & Directions Générales)</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700">2. Admin École (Fondateur)</span>
                    <span className="text-[10px] font-mono text-slate-500">Niveau Établissement</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Crée et administre les comptes professionnels du personnel : <strong>Directeur des Études, Censeur, Secrétaire Générale, Chef Comptable, Surveillant Général, Bibliothécaire, Enseignants, Élèves et Parents</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                  <strong className="block font-bold">Isolation Établissement (Multi-Tenant) :</strong>
                  <span className="text-[11px] text-slate-700 block">
                    Un utilisateur rattaché à une école (ex: <code>ECOLE-001</code>) ne peut en aucun cas accéder aux données, notes ou finances d'une autre école.
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowAccountIssuanceModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
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
