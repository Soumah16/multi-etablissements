import React, { useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { buildWhatsAppUrl, getSchoolWhatsAppNumber } from '../../utils/whatsapp';
import { LibrarianNavTab } from '../../types/librarian';
import { LibrarianDashboardView } from './LibrarianDashboardView';
import { BooksCatalogView } from './BooksCatalogView';
import { EbooksDigitalView } from './EbooksDigitalView';
import { BorrowingReturnsView } from './BorrowingReturnsView';
import { LibrarianStatsView } from './LibrarianStatsView';
import { LibrarianBadgeView } from './LibrarianBadgeView';
import { LibrarianSecurityView } from './LibrarianSecurityView';
import {
  Library,
  BookOpen,
  FileText,
  RotateCcw,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  ArrowLeftRight,
  LogOut,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  UserCheck,
  ArrowLeft,
  ShieldAlert,
  MessageCircle,
  MessageSquare
} from 'lucide-react';
import { CrossRoleHubPanel } from '../common/CrossRoleHubPanel';
import { HubRole, useUnreadSharedMessagesCount } from '../../utils/communicationHub';

interface LibrarianLayoutProps {
  onReturnToSuperAdmin: () => void;
  onReturnToSchoolAdmin: () => void;
  onExitLibrary?: () => void;
  onLogout?: () => void;
  onSwitchToDirector?: () => void;
  onSwitchToSecretary?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToAccountant?: () => void;
  onSwitchToSupervisor?: () => void;
  onSwitchToParent?: () => void;
  onSwitchToStudent?: () => void;
}

export const LibrarianLayout: React.FC<LibrarianLayoutProps> = ({
  onReturnToSuperAdmin,
  onReturnToSchoolAdmin,
  onExitLibrary,
  onLogout,
  onSwitchToDirector,
  onSwitchToSecretary,
  onSwitchToTeacher,
  onSwitchToAccountant,
  onSwitchToSupervisor,
  onSwitchToParent,
  onSwitchToStudent
}) => {
  const {
    activeLibrarianTab,
    setActiveLibrarianTab,
    profile,
    loans,
    toastMessage,
    libraryUser,
    canManageLibrary,
    loginToLibrary,
    logoutFromLibrary
  } = useLibrarian();
  const { currentSchool } = useSchoolAdmin();
  const schoolWaPhone = getSchoolWhatsAppNumber(currentSchool);
  const schoolWaUrl = buildWhatsAppUrl(
    schoolWaPhone,
    `Bonjour ${currentSchool.name}, Bibliothèque scolaire.`
  );
  const effectiveHubRole: HubRole = (libraryUser?.role as HubRole) || 'librarian';
  const unreadMessagesCount = useUnreadSharedMessagesCount(effectiveHubRole, currentSchool.id);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Personal Library Login Gate state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLibraryLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = loginToLibrary(identifier, password);
    if (!res.success) {
      setLoginError(res.errorMessage || 'Identifiant ou mot de passe incorrect.');
    } else {
      setIdentifier('');
      setPassword('');
    }
  };

  // MANDATORY PERSONAL LOGIN GATE FOR ANYONE ENTERING THE LIBRARY
  if (!libraryUser) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-blue-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Tricolor top strip */}
          <div className="h-1.5 w-full grid grid-cols-3">
            <div className="bg-[#CE1126]" />
            <div className="bg-[#FCD116]" />
            <div className="bg-[#009460]" />
          </div>

          <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-indigo-50 via-blue-50/50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md shrink-0">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-black text-blue-950">
                  Accès Bibliothèque de l'École
                </h1>
                <p className="text-xs text-slate-600">
                  {profile.schoolName} · Identification personnelle obligatoire
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLibraryLogin} className="p-6 space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-slate-700 space-y-1.5 leading-relaxed">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Règle stricte de la Bibliothèque</span>
              </div>
              <p className="text-[11px]">
                • <strong>Connexion individuelle :</strong> Chaque personne qui vient à la bibliothèque (élève, enseignant, parent, direction, ou bibliothécaire) doit se connecter avec <strong>son propre compte</strong>.
              </p>
              <p className="text-[11px]">
                • <strong>Modifications verrouillées :</strong> Personne ne peut ajouter, modifier ou supprimer un livre/e-book/prêt sauf l'<strong>Admin de la Bibliothèque de l'école</strong>.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">
                Email ou Matricule personnel *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="ex: ELV-EXC-120 ou biblio@smartschool.gn"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">
                Mot de passe personnel *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Saisissez votre mot de passe personnel..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Me connecter à la Bibliothèque</span>
            </button>

            <div className="pt-2 border-t border-blue-100 flex items-center justify-between gap-2">
              {onExitLibrary && (
                <button
                  type="button"
                  onClick={onExitLibrary}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-blue-950 font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour à mon espace</span>
                </button>
              )}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold ml-auto cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion totale</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  const visibleLoans = canManageLibrary
    ? loans
    : loans.filter(
        l =>
          l.borrowerMatricule === libraryUser.matricule ||
          l.borrowerName.toLowerCase() === libraryUser.name.toLowerCase()
      );
  const pendingOverdueCount = visibleLoans.filter(l => l.status === 'en_retard').length;

  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: LibrarianNavTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      groupTitle: 'VUE GÉNÉRALE',
      items: [
        { tab: 'dashboard', label: 'Tableau de Bord', icon: <Library className="w-4 h-4 text-indigo-600" /> }
      ]
    },
    {
      groupTitle: 'CATALOGUE & MÉDIATHÈQUE',
      items: [
        { tab: 'books', label: 'Catalogue des Livres', icon: <BookOpen className="w-4 h-4 text-blue-600" /> },
        { tab: 'ebooks', label: 'E-Books & Cours Numériques', icon: <FileText className="w-4 h-4 text-purple-600" /> }
      ]
    },
    {
      groupTitle: 'CIRCULATION & CONTRÔLE',
      items: [
        {
          tab: 'loans',
          label: canManageLibrary ? 'Emprunts & Retours' : 'Mes Emprunts',
          icon: <RotateCcw className="w-4 h-4 text-amber-600" />,
          badge: pendingOverdueCount,
          badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200'
        },
        { tab: 'stats', label: 'Statistiques & Fréquentation', icon: <BarChart3 className="w-4 h-4 text-teal-600" /> },
        {
          tab: 'communication',
          label: 'Messages & Demandes',
          icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
          badge: unreadMessagesCount,
          badgeColor: 'bg-blue-100 text-blue-800 border border-blue-200'
        }
      ]
    },
    ...(canManageLibrary
      ? [
          {
            groupTitle: 'ADMINISTRATION BIBLIO',
            items: [
              { tab: 'badge' as LibrarianNavTab, label: 'Badge & Carte Pro ISO-7810', icon: <CreditCard className="w-4 h-4 text-cyan-600" /> },
              { tab: 'security' as LibrarianNavTab, label: 'Sécurité, PIN & Audit', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> }
            ]
          }
        ]
      : [])
  ];

  const renderActiveView = () => {
    switch (activeLibrarianTab) {
      case 'dashboard':
        return <LibrarianDashboardView />;
      case 'books':
        return <BooksCatalogView />;
      case 'ebooks':
        return <EbooksDigitalView />;
      case 'loans':
        return <BorrowingReturnsView />;
      case 'communication':
        return (
          <CrossRoleHubPanel
            role={effectiveHubRole}
            userName={libraryUser.name}
            schoolId={currentSchool.id}
            schoolName={currentSchool.name}
            canManageRequests={canManageLibrary}
            defaultRecipientRoles={['school_admin', 'teacher', 'student']}
          />
        );
      case 'stats':
        return <LibrarianStatsView />;
      case 'badge':
        return canManageLibrary ? <LibrarianBadgeView /> : <LibrarianDashboardView />;
      case 'security':
        return canManageLibrary ? <LibrarianSecurityView /> : <LibrarianDashboardView />;
      default:
        return <LibrarianDashboardView />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-indigo-200 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-[270px] sm:w-64 max-w-[85vw] bg-white/95 backdrop-blur-md border-r border-blue-100 flex flex-col z-50 transition-transform duration-200 shadow-xl md:shadow-none
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Tricolor Guinean top strip */}
        <div className="h-1 w-full grid grid-cols-3 shrink-0">
          <div className="bg-[#CE1126]" />
          <div className="bg-[#FCD116]" />
          <div className="bg-[#009460]" />
        </div>

        {/* Brand Area */}
        <div className="p-4 border-b border-blue-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
              B
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-blue-950 tracking-tight leading-none truncate">
                SmartSchool
              </div>
              <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider mt-0.5 truncate">
                {canManageLibrary ? 'Admin Bibliothèque' : 'Bibliothèque (Lecture)'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-50 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connected User & Permissions Badge */}
        <div className="px-4 py-3 bg-blue-50/60 border-b border-blue-100 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500">Session Bibliothèque</div>
          <div className="text-xs font-bold text-blue-950 truncate">{libraryUser.name}</div>
          <div className="text-[10px] text-indigo-700 font-mono truncate">
            {libraryUser.matricule || libraryUser.email}
          </div>
          <div className="pt-1">
            {canManageLibrary ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <UserCheck className="w-3 h-3" />
                <span>Admin Biblio · Gestion complète</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Lock className="w-3 h-3" />
                <span>Lecture seule (Modifs bloquées)</span>
              </span>
            )}
          </div>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.groupTitle}
              </div>
              {group.items.map(item => {
                const isActive = activeLibrarianTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveLibrarianTab(item.tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 hover:text-blue-950 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? '[&>svg]:text-white text-white' : ''}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isActive
                            ? 'bg-white text-indigo-700'
                            : item.badgeColor || 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Actions: Change Library Visitor / Switch Workspace */}
        <div className="p-3 border-t border-blue-100 relative bg-blue-50/50 space-y-2">
          <button
            onClick={logoutFromLibrary}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors text-xs font-bold cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Changer de compte Biblio</span>
          </button>

          {canManageLibrary ? (
            <>
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 transition-colors text-xs font-semibold shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Changer d'espace</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute bottom-24 left-3 right-3 bg-white border border-blue-100 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs max-h-72 overflow-y-auto">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-500 border-b border-blue-100">
                    Bascule sécurisée
                  </div>
                  {onSwitchToDirector && (
                    <button
                      onClick={() => {
                        setRoleSwitcherOpen(false);
                        onSwitchToDirector();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-amber-800 font-medium"
                    >
                      Directeur des Études
                    </button>
                  )}
                  {onSwitchToSecretary && (
                    <button
                      onClick={() => {
                        setRoleSwitcherOpen(false);
                        onSwitchToSecretary();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-50 text-teal-800 font-medium"
                    >
                      Secrétariat &amp; Admissions
                    </button>
                  )}
                  {onSwitchToTeacher && (
                    <button
                      onClick={() => {
                        setRoleSwitcherOpen(false);
                        onSwitchToTeacher();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-800 font-medium"
                    >
                      Espace Enseignant
                    </button>
                  )}
                  {onSwitchToAccountant && (
                    <button
                      onClick={() => {
                        setRoleSwitcherOpen(false);
                        onSwitchToAccountant();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium"
                    >
                      Comptabilité &amp; Finances
                    </button>
                  )}
                  {onSwitchToSupervisor && (
                    <button
                      onClick={() => {
                        setRoleSwitcherOpen(false);
                        onSwitchToSupervisor();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-800 font-medium"
                    >
                      Surveillant Général
                    </button>
                  )}
                  {onSwitchToParent && (
                    <button
                      onClick={() => {
                        setRoleSwitcherOpen(false);
                        onSwitchToParent();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-50 text-cyan-800 font-medium"
                    >
                      Espace Parent
                    </button>
                  )}
                  {onSwitchToStudent && (
                    <button
                      onClick={() => {
                        setRoleSwitcherOpen(false);
                        onSwitchToStudent();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-pink-50 text-pink-800 font-medium"
                    >
                      Espace Élève
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setRoleSwitcherOpen(false);
                      onReturnToSchoolAdmin();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-900 font-semibold border-t border-blue-100 mt-1 pt-1.5"
                  >
                    Admin École
                  </button>
                  <button
                    onClick={() => {
                      setRoleSwitcherOpen(false);
                      onReturnToSuperAdmin();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-slate-600 font-medium"
                  >
                    Super Admin
                  </button>
                </div>
              )}
            </>
          ) : (
            onExitLibrary && (
              <button
                onClick={onExitLibrary}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 transition-colors text-xs font-semibold shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                <span>Quitter la Bibliothèque</span>
              </button>
            )
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 bg-white/95 backdrop-blur-md border-b border-blue-100 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-blue-950 rounded-lg hover:bg-blue-50 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-bold text-blue-950 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="truncate">{libraryUser.name}</span>
                {canManageLibrary ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 hidden sm:inline-block">
                    Admin Bibliothèque · Écriture OK
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 hidden sm:inline-block">
                    Lecture Seule · {libraryUser.role}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {libraryUser.schoolName || profile.schoolName} · Matricule {libraryUser.matricule || 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {schoolWaUrl && (
              <a
                href={schoolWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                title={`WhatsApp ${currentSchool.name} (${schoolWaPhone})`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden md:inline">WhatsApp {currentSchool.code || 'École'}</span>
              </a>
            )}

            <button
              onClick={logoutFromLibrary}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
              title="Permet à la personne suivante de se connecter avec son propre compte"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Changer de compte</span>
            </button>

            {canManageLibrary && (
              <button
                onClick={() => setActiveLibrarianTab('security')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sécurité &amp; Audit</span>
              </button>
            )}

            {libraryUser.photo && (
              <img
                src={libraryUser.photo}
                alt=""
                className="w-7 h-7 rounded-full object-cover border-2 border-indigo-400"
              />
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-[1560px] w-full mx-auto min-w-0 space-y-4">
          {!canManageLibrary && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <strong>Mode Lecture Seule activé :</strong> Vous consultez la bibliothèque avec votre compte personnel ({libraryUser.name}). Seul l'<strong>Admin de la Bibliothèque de l'école</strong> peut ajouter, modifier ou supprimer des livres, e-books ou prêts.
              </div>
            </div>
          )}

          {renderActiveView()}
        </main>

        <footer className="mt-auto px-3 sm:px-6 py-3.5 text-center text-[11px] sm:text-xs text-slate-600 border-t border-blue-100 bg-white/75">
          <span className="break-words">
            SmartSchool ERP Guinée · Conçu et développé par <strong className="text-blue-950">Saïd Soumah</strong> (
            <a href="mailto:saidsoumah23@gmail.com" className="text-blue-600 hover:underline font-medium">
              saidsoumah23@gmail.com
            </a>
            )
          </span>
        </footer>
      </div>
    </div>
  );
};
