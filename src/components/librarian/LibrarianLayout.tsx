import React, { useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
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
  LogOut
} from 'lucide-react';

interface LibrarianLayoutProps {
  onReturnToSuperAdmin: () => void;
  onReturnToSchoolAdmin: () => void;
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
  onLogout,
  onSwitchToDirector,
  onSwitchToSecretary,
  onSwitchToTeacher,
  onSwitchToAccountant,
  onSwitchToSupervisor,
  onSwitchToParent,
  onSwitchToStudent
}) => {
  const { activeLibrarianTab, setActiveLibrarianTab, profile, loans, toastMessage } = useLibrarian();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const pendingOverdueCount = loans.filter(l => l.status === 'en_retard').length;

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
          label: 'Emprunts & Retours', 
          icon: <RotateCcw className="w-4 h-4 text-amber-600" />,
          badge: pendingOverdueCount,
          badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200'
        },
        { tab: 'stats', label: 'Statistiques & Fréquentation', icon: <BarChart3 className="w-4 h-4 text-teal-600" /> }
      ]
    },
    {
      groupTitle: 'IDENTITÉ & SÉCURITÉ',
      items: [
        { tab: 'badge', label: 'Badge & Carte Pro ISO-7810', icon: <CreditCard className="w-4 h-4 text-cyan-600" /> },
        { tab: 'security', label: 'Sécurité & Code PIN', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeLibrarianTab) {
      case 'dashboard': return <LibrarianDashboardView />;
      case 'books': return <BooksCatalogView />;
      case 'ebooks': return <EbooksDigitalView />;
      case 'loans': return <BorrowingReturnsView />;
      case 'stats': return <LibrarianStatsView />;
      case 'badge': return <LibrarianBadgeView />;
      case 'security': return <LibrarianSecurityView />;
      default: return <LibrarianDashboardView />;
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
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-[270px] sm:w-64 max-w-[85vw] bg-white/95 backdrop-blur-md border-r border-blue-100 flex flex-col z-50 transition-transform duration-200 shadow-xl md:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
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
              <div className="font-black text-sm text-blue-950 tracking-tight leading-none truncate">SmartSchool</div>
              <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider mt-0.5 truncate">
                Espace Bibliothécaire
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

        {/* School info */}
        <div className="px-4 py-3 bg-blue-50/60 border-b border-blue-100">
          <div className="text-[10px] uppercase font-bold text-slate-500">Section Médiathèque</div>
          <div className="text-xs font-bold text-blue-950 truncate">{profile.schoolName}</div>
          <div className="text-[10px] text-indigo-700 font-mono mt-0.5 truncate">Matricule : {profile.matricule}</div>
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
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isActive ? 'bg-white text-indigo-700' : (item.badgeColor || 'bg-indigo-100 text-indigo-800 border border-indigo-200')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Role Switcher Button */}
        <div className="p-3 border-t border-blue-100 relative bg-blue-50/50">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 transition-colors text-xs font-semibold shadow-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-white border border-blue-100 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-500 border-b border-blue-100">Bascule rapide</div>
              {onSwitchToDirector && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToDirector(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-amber-800 font-medium"
                >
                  Directeur des Études
                </button>
              )}
              {onSwitchToSecretary && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSecretary(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-50 text-teal-800 font-medium"
                >
                  Secrétariat & Admissions
                </button>
              )}
              {onSwitchToTeacher && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToTeacher(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-800 font-medium"
                >
                  Espace Enseignant
                </button>
              )}
              {onSwitchToAccountant && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToAccountant(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium"
                >
                  Comptabilité & Finances
                </button>
              )}
              {onSwitchToSupervisor && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSupervisor(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-800 font-medium"
                >
                  Surveillant Général
                </button>
              )}
              {onSwitchToParent && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToParent(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-50 text-cyan-800 font-medium"
                >
                  Espace Parent
                </button>
              )}
              {onSwitchToStudent && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToStudent(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-pink-50 text-pink-800 font-medium"
                >
                  Espace Élève
                </button>
              )}
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSchoolAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-900 font-semibold border-t border-blue-100 mt-1 pt-1.5"
              >
                Admin École
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-slate-600 font-medium"
              >
                Super Admin
              </button>
            </div>
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
                <span className="truncate">{profile.firstName} {profile.lastName}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 hidden sm:inline-block">
                  Bibliothécaire
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveLibrarianTab('security')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-semibold hover:bg-indigo-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>PIN Configuré</span>
            </button>

            <button
              onClick={() => setActiveLibrarianTab('badge')}
              className="flex items-center gap-2 p-1 rounded-full text-slate-600 hover:bg-blue-50 transition-colors"
            >
              <img 
                src={profile.photo} 
                alt="" 
                className="w-7 h-7 rounded-full object-cover border-2 border-indigo-400" 
              />
            </button>

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

        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-[1560px] w-full mx-auto min-w-0">
          {renderActiveView()}
        </main>

        <footer className="mt-auto px-3 sm:px-6 py-3.5 text-center text-[11px] sm:text-xs text-slate-600 border-t border-blue-100 bg-white/75">
          <span className="break-words">SmartSchool ERP Guinée · Conçu et développé par <strong className="text-blue-950">Saïd Soumah</strong> (<a href="mailto:saidsoumah23@gmail.com" className="text-blue-600 hover:underline font-medium">saidsoumah23@gmail.com</a>)</span>
        </footer>
      </div>
    </div>
  );
};
