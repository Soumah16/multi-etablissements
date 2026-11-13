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

import { WorkspaceMode } from '../../App';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface HeaderProps {
  currentUserRole?: WorkspaceMode;
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
  currentUserRole = 'super_admin',
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
    <header className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 bg-white/95 backdrop-blur-md border-b border-blue-100 shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Zone 1: Brand Zone */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebarMobile}
          className="md:hidden p-2 text-slate-600 hover:text-blue-950 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/25 ring-2 ring-blue-100 shrink-0">
            S
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm sm:text-lg font-black tracking-tight text-blue-950 truncate">
              SmartSchool ERP
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold hidden sm:inline-block shrink-0">
              🇬🇳 GUINÉE
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Contextual Breadcrumb & Scope */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 whitespace-nowrap">
        <span className="font-bold text-blue-950">{getBreadcrumb(activeTab)}</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span>{schools.filter(s => s.status === 'active').length} établissements actifs</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="text-blue-700 font-mono font-semibold">Devise : GNF</span>
      </div>

      {/* Zone 3: Primary Action & Profile Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <PWAInstallButton variant="compact" />
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => {
              setLangMenuOpen(!langMenuOpen);
              setAccountMenuOpen(false);
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="uppercase font-bold">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {langMenuOpen && (
            <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-1.5 w-44 max-w-[calc(100vw-24px)] bg-white border border-blue-100 rounded-xl shadow-xl py-1 z-50 animate-in fade-in`}>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-500 border-b border-blue-100">
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
                      ? 'bg-blue-600 text-white font-semibold' 
                      : 'text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  <span>{lang.label}</span>
                  <span className="text-[11px] opacity-80">{lang.flag}</span>
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
            className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-950 transition-all text-xs font-medium"
            title="Changer de compte ou d'espace de travail"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-bold text-xs text-blue-950 leading-tight truncate max-w-[120px]">
                {profile.name}
              </span>
              <span className="text-[10px] text-blue-600 font-mono font-semibold leading-tight">
                Super Admin (Global)
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {accountMenuOpen && (
            <div className="fixed sm:absolute top-14 sm:top-12 right-2 sm:right-0 w-[calc(100vw-16px)] sm:w-[440px] max-w-[calc(100vw-16px)] max-h-[85vh] flex flex-col bg-white border border-blue-100 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
              {/* Header: Current Active User */}
              <div className="p-3 border-b border-blue-100 bg-blue-50/60 shrink-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Session Super Admin Actuelle
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                      M
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="font-bold text-blue-950 text-xs truncate">{profile.name}</div>
                      <div className="text-[10px] text-blue-600 truncate">{profile.email}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                    Super Admin
                  </span>
                </div>

                {/* Direct Shortcut to User Management */}
                <button
                  onClick={() => {
                    setActiveTab('users');
                    setAccountMenuOpen(false);
                  }}
                  className="w-full mt-2.5 flex items-center justify-between p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-100 shrink-0" />
                    <span className="truncate">Créer / Gérer tous les comptes</span>
                  </span>
                  <span className="text-[11px] font-mono shrink-0 ml-2">Consulter →</span>
                </button>
              </div>

              {/* Subtabs: Espaces Métiers vs Écoles (Only Super Admin can see/switch schools) */}
              {currentUserRole === 'super_admin' ? (
                <div className="p-1.5 border-b border-blue-100 bg-slate-50 flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setSwitcherTab('roles')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      switcherTab === 'roles' 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-blue-950 hover:bg-blue-50'
                    }`}
                  >
                    Espaces Métiers (8)
                  </button>
                  <button
                    onClick={() => setSwitcherTab('schools')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      switcherTab === 'schools' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-blue-950 hover:bg-blue-50'
                    }`}
                  >
                    Admins Écoles ({schools.length})
                  </button>
                </div>
              ) : (
                <div className="px-3 py-1.5 border-b border-blue-100 bg-emerald-50 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Établissement Attribué Unique (Isolation Stricte)</span>
                </div>
              )}

              {/* Scrollable Roles Body */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 overscroll-contain max-h-[52vh] sm:max-h-[380px]">
                {switcherTab === 'roles' ? (
                  <>
                    {/* Directeur */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToDirector) onSwitchToDirector();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 text-left transition-colors border border-amber-200 bg-amber-50/50 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center text-xs font-bold shrink-0">
                          D
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-amber-800 truncate">
                            Directeur des Études
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Dr. Ibrahima Sory Bangoura · Pédagogie & Examens
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 px-2 py-0.5 rounded bg-amber-100 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Secrétaire */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToSecretary) onSwitchToSecretary();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-teal-50 text-left transition-colors border border-teal-200 bg-teal-50/50 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center text-xs font-bold shrink-0">
                          S
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-teal-800 truncate">
                            Secrétaire Générale
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Mme Kadiatou Diallo · Inscriptions & Scolarité
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-800 px-2 py-0.5 rounded bg-teal-100 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Enseignant */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToTeacher) onSwitchToTeacher();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 text-left transition-colors border border-blue-200 bg-blue-50/50 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center text-xs font-bold shrink-0">
                          E
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-blue-800 truncate">
                            Espace Enseignant
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            M. Mamadou Lamarana Diallo · Maths & Devoirs
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-800 px-2 py-0.5 rounded bg-blue-100 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Surveillant */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToSupervisor) onSwitchToSupervisor();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-left transition-colors border border-rose-200 bg-rose-50/50 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 flex items-center justify-center text-xs font-bold shrink-0">
                          V
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-rose-800 truncate">
                            Surveillant Général
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            M. Ibrahima Kalil Keïta · Vie Scolaire & Présences
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-rose-800 px-2 py-0.5 rounded bg-rose-100 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Comptable */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToAccountant) onSwitchToAccountant();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 text-left transition-colors border border-emerald-200 bg-emerald-50/50 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xs font-bold shrink-0">
                          C
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 truncate">
                            Chef Comptable
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            M. Ibrahima Kalil Camara · Finances GNF
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Bibliothécaire */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToLibrarian) onSwitchToLibrarian();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50 text-left transition-colors border border-indigo-200 bg-indigo-50/50 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center justify-center text-xs font-bold shrink-0">
                          B
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-800 truncate">
                            Bibliothécaire
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Mme Aïssatou Sow · Livres, E-Books & Prêts
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-800 px-2 py-0.5 rounded bg-indigo-100 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Parent */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToParent) onSwitchToParent();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-cyan-50 text-left transition-colors border border-cyan-200 bg-cyan-50/50 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-200 flex items-center justify-center text-xs font-bold shrink-0">
                          P
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-cyan-800 truncate">
                            Espace Parent (Consultation)
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Elhadj Amadou Diallo · Notes & Mobile Money
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-800 px-2 py-0.5 rounded bg-cyan-100 shrink-0 ml-2">
                        Accéder →
                      </span>
                    </button>

                    {/* Élève */}
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onSwitchToStudent) onSwitchToStudent();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-pink-50 text-left transition-colors border border-pink-200 bg-pink-50/50 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-800 border border-pink-200 flex items-center justify-center text-xs font-bold shrink-0">
                          É
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 group-hover:text-pink-800 truncate">
                            Espace Élève (Apprenant)
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Fatoumata Binta Diallo · TSM · Badge & Devoirs
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-pink-800 px-2 py-0.5 rounded bg-pink-100 shrink-0 ml-2">
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
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 text-left transition-colors border border-blue-100 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                              {school.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-slate-900 group-hover:text-emerald-800 truncate">
                                {school.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : 'Admin École'} · {school.city}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-800 px-2 py-1 rounded bg-emerald-100 group-hover:bg-emerald-200 shrink-0 ml-2">
                            Connexion →
                          </span>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-3 bg-blue-50/60 border-t border-blue-100 flex items-center justify-between text-xs shrink-0 rounded-b-2xl">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setAccountMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 text-blue-700 hover:text-blue-900 font-bold rounded hover:bg-blue-100 transition-colors"
                >
                  Mon Profil
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-colors cursor-pointer border border-rose-200"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Déconnexion</span>
                  </button>
                )}
                <button
                  onClick={() => setAccountMenuOpen(false)}
                  className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors font-medium"
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        )}
      </div>
    </header>
  );
};
