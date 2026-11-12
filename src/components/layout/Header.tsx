import React, { useState } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { LanguageCode } from '../../types';
import { 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Menu,
  ChevronDown,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
  onLogout?: () => void;
  onSwitchToSchoolAdmin?: (schoolId?: string) => void;
  onSwitchToDirector?: () => void;
  onSwitchToSecretary?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToAccountant?: () => void;
  onSwitchToSupervisor?: () => void;
  onSwitchToLibrarian?: () => void;
  onSwitchToParent?: () => void;
  onSwitchToStudent?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebarMobile, 
  onLogout,
  onSwitchToSchoolAdmin, 
  onSwitchToDirector,
  onSwitchToSecretary,
  onSwitchToTeacher,
  onSwitchToAccountant,
  onSwitchToSupervisor,
  onSwitchToLibrarian,
  onSwitchToParent,
  onSwitchToStudent
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    language, 
    setLanguage, 
    profile, 
    t, 
    isRtl,
    schools,
    admins
  } = useApp();
  
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [switcherTab, setSwitcherTab] = useState<'roles' | 'schools'>('roles');

  const languagesList: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇬🇳 FR' },
    { code: 'en', label: 'English', flag: '🇬🇧 EN' },
    { code: 'ar', label: 'العربية (RTL)', flag: '🇸🇦 AR' },
    { code: 'es', label: 'Español', flag: '🇪🇸 ES' },
    { code: 'pt', label: 'Português', flag: '🇵🇹 PT' }
  ];

  const getBreadcrumb = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard': return t.nav.dashboard;
      case 'schools': return t.nav.schools;
      case 'admins': return t.nav.schoolAdmins;
      case 'subscriptions': return t.nav.subscriptions;
      case 'revenue': return t.nav.revenue;
      case 'analytics': return t.nav.analytics;
      case 'badges': return t.nav.badges;
      case 'communication': return t.nav.communication;
      case 'security': return t.nav.security;
      case 'backups': return t.nav.backups;
      case 'settings': return t.nav.settings;
      case 'profile': return t.nav.profile;
      default: return '';
    }
  };

  return (
    <header className="flex items-center justify-between gap-6 px-4 md:px-8 py-3.5 bg-slate-900 border-b border-slate-800 shrink-0 sticky top-0 z-30">
      {/* Zone 1: Brand Zone */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            S
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            SmartSchool ERP
          </span>
        </div>
      </div>

      {/* Zone 2: Contextual Breadcrumb & Scope */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 whitespace-nowrap">
        <span className="font-medium text-slate-200">{getBreadcrumb(activeTab)}</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>{schools.filter(s => s.status === 'active').length} établissements actifs</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span className="text-blue-400 font-mono">Devise : GNF</span>
      </div>

      {/* Zone 3: Primary Action & Profile Switcher */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => {
              setLangMenuOpen(!langMenuOpen);
              setAccountMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="uppercase font-semibold">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {langMenuOpen && (
            <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-1.5 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in`}>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-700/50">
                Langue d'interface
              </div>
              {languagesList.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    language === lang.code 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <span>{lang.label}</span>
                  <span className="text-[11px] opacity-75">{lang.flag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account / Workspace Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setAccountMenuOpen(!accountMenuOpen);
              setLangMenuOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20 text-slate-200 transition-all text-xs font-medium"
            title="Changer de compte ou d'espace de travail"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile.name.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-semibold text-xs text-white leading-tight truncate max-w-[120px]">
                {profile.name}
              </span>
              <span className="text-[10px] text-blue-400 font-mono leading-tight">
                Super Admin (Global)
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {accountMenuOpen && (
            <div className="fixed sm:absolute top-14 sm:top-12 right-2 sm:right-0 w-[calc(100vw-20px)] sm:w-[440px] max-h-[88vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
              {/* Header: Current Active User */}
              <div className="p-3 border-b border-slate-800 bg-slate-800/90 shrink-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Session Super Admin Actuelle
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                      M
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="font-bold text-white text-xs truncate">{profile.name}</div>
                      <div className="text-[10px] text-blue-400 truncate">{profile.email}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                    Super Admin
                  </span>
                </div>

                {/* Direct Shortcut to User Management */}
                <button
                  onClick={() => {
                    setActiveTab('users');
                    setAccountMenuOpen(false);
                  }}
                  className="w-full mt-2.5 flex items-center justify-between p-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Créer / Gérer tous les comptes d'accès</span>
                  </span>
                  <span className="text-[11px] font-mono">Consulter →</span>
                </button>
              </div>

              {/* Subtabs: Espaces Métiers vs Écoles */}
              <div className="p-1.5 border-b border-slate-800 bg-slate-950/60 flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setSwitcherTab('roles')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    switcherTab === 'roles' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Tous les Espaces Métiers ({8})
                </button>
                <button
                  onClick={() => setSwitcherTab('schools')}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    switcherTab === 'schools' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Admins Écoles ({schools.length})
                </button>
              </div>

              {/* Scrollable Roles Body with comfortable height */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 overscroll-contain max-h-[52vh] sm:max-h-[380px]">
                {switcherTab === 'roles' ? (
                  <>
                    {/* Directeur */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToDirector) onSwitchToDirector();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-amber-500/20 bg-amber-500/5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                          D
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-amber-300 truncate">
                            Directeur des Études
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Dr. Ibrahima Sory Bangoura · Pédagogie & Examens
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Secrétaire */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToSecretary) onSwitchToSecretary();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-teal-500/20 bg-teal-500/5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                          S
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-teal-300 truncate">
                            Secrétaire Générale
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Mme Kadiatou Diallo · Inscriptions & Scolarité
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-300 px-2 py-0.5 rounded bg-teal-500/20 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Enseignant */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToTeacher) onSwitchToTeacher();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-blue-500/20 bg-blue-500/5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                          E
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-blue-300 truncate">
                            Espace Enseignant
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            M. Mamadou Lamarana Diallo · Maths & Devoirs
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-300 px-2 py-0.5 rounded bg-blue-500/20 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Surveillant */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToSupervisor) onSwitchToSupervisor();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-rose-500/20 bg-rose-500/5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                          V
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-rose-300 truncate">
                            Surveillant Général
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            M. Ibrahima Kalil Keïta · Vie Scolaire & Présences
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-rose-300 px-2 py-0.5 rounded bg-rose-500/20 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Comptable */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToAccountant) onSwitchToAccountant();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-emerald-500/20 bg-emerald-500/5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                          C
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-emerald-300 truncate">
                            Chef Comptable
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            M. Ibrahima Kalil Camara · Finances GNF
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/20 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Bibliothécaire */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToLibrarian) onSwitchToLibrarian();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-indigo-500/20 bg-indigo-500/5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                          B
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-indigo-300 truncate">
                            Bibliothécaire
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Mme Aïssatou Sow · Livres, E-Books & Prêts
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/20 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Parent */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToParent) onSwitchToParent();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-cyan-500/20 bg-cyan-500/5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                          P
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-cyan-300 truncate">
                            Espace Parent (Consultation)
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Elhadj Amadou Diallo · Notes & Mobile Money
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/20 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Élève */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToStudent) onSwitchToStudent();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-pink-500/20 bg-pink-500/5 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                          É
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-100 group-hover:text-pink-300 truncate">
                            Espace Élève (Apprenant)
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            Fatoumata Binta Diallo · TSM · Badge & Devoirs
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-pink-300 px-2 py-0.5 rounded bg-pink-500/20 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    {schools.map(school => {
                      const assignedAdmin = admins.find(a => a.schoolId === school.id);
                      return (
                        <button
                          key={school.id}
                          onClick={() => {
                            setAccountMenuOpen(false);
                            if (onSwitchToSchoolAdmin) {
                              onSwitchToSchoolAdmin(school.id);
                            }
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors border border-slate-800 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                              {school.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-slate-200 group-hover:text-emerald-300 truncate">
                                {school.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : 'Admin École'} · {school.city}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 group-hover:bg-emerald-500/20 shrink-0 ml-2">
                            Connexion →
                          </span>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs shrink-0 rounded-b-2xl">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setAccountMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 text-blue-400 hover:text-blue-300 font-bold rounded hover:bg-slate-800 transition-colors"
                >
                  Mon Profil
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold transition-colors cursor-pointer border border-rose-500/30"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Déconnexion</span>
                  </button>
                )}
                <button
                  onClick={() => setAccountMenuOpen(false)}
                  className="px-2.5 py-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Logout Button in Header */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        )}
      </div>
    </header>
  );
};
