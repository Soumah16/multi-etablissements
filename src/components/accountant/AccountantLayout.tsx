import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { AccountantNavTab } from '../../types/accountant';
import { 
  LayoutDashboard, 
  Sliders, 
  CreditCard, 
  AlertTriangle, 
  ArrowDownRight, 
  Users, 
  Award, 
  BarChart3, 
  ShieldCheck, 
  ArrowLeft, 
  Menu, 
  X, 
  CheckCircle2, 
  Wallet,
  Sparkles,
  Coins,
  ArrowRightLeft,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { AccountantDashboardView } from './AccountantDashboardView';
import { FeeSettingsView } from './FeeSettingsView';
import { PaymentsView } from './PaymentsView';
import { DebtorsView } from './DebtorsView';
import { ExpensesView } from './ExpensesView';
import { SalariesView } from './SalariesView';
import { ScholarshipsView } from './ScholarshipsView';
import { FinancialReportsView } from './FinancialReportsView';
import { AccountantSecurityView } from './AccountantSecurityView';
import { AccountantPinModal } from './AccountantPinModal';

interface AccountantLayoutProps {
  onReturnToSchoolAdmin: () => void;
  onReturnToDirector: () => void;
  onReturnToSecretary: () => void;
  onReturnToTeacher: () => void;
  onReturnToSuperAdmin: () => void;
  onLogout?: () => void;
  onSwitchToSupervisor?: () => void;
}

export const AccountantLayout: React.FC<AccountantLayoutProps> = ({ 
  onReturnToSchoolAdmin, 
  onReturnToDirector, 
  onReturnToSecretary,
  onReturnToTeacher,
  onReturnToSuperAdmin,
  onLogout,
  onSwitchToSupervisor
}) => {
  const { 
    activeAccountantTab, 
    setActiveAccountantTab, 
    profile, 
    debtors, 
    payments, 
    toastMessage, 
    formatGnf 
  } = useAccountant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Categorized Navigation Groups for Accountant
  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: AccountantNavTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      groupTitle: 'VUE GÉNÉRALE',
      items: [
        { tab: 'dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      groupTitle: 'RECETTES & ENCAISSEMENTS',
      items: [
        { tab: 'fees', label: 'Grille des Frais', icon: <Sliders className="w-4 h-4" /> },
        { 
          tab: 'payments', 
          label: 'Paiements & Reçus', 
          icon: <CreditCard className="w-4 h-4 text-emerald-600" />, 
          badge: payments.length,
          badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
        },
        { 
          tab: 'debtors', 
          label: 'Gestion des Débiteurs', 
          icon: <AlertTriangle className="w-4 h-4 text-rose-600" />, 
          badge: debtors.length,
          badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200'
        }
      ]
    },
    {
      groupTitle: 'DÉPENSES & TRÉSORERIE',
      items: [
        { tab: 'expenses', label: 'Dépenses & Factures', icon: <ArrowDownRight className="w-4 h-4 text-amber-600" /> },
        { tab: 'salaries', label: 'Salaires & Paie', icon: <Users className="w-4 h-4 text-blue-600" /> },
        { tab: 'scholarships', label: 'Bourses & Réductions', icon: <Award className="w-4 h-4 text-purple-600" /> },
        { tab: 'reports', label: 'Rapports & Bilans', icon: <BarChart3 className="w-4 h-4 text-teal-600" /> }
      ]
    },
    {
      groupTitle: 'SÉCURITÉ & ACCÈS',
      items: [
        { tab: 'security', label: 'Sécurité & Code PIN', icon: <ShieldCheck className="w-4 h-4" /> }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeAccountantTab) {
      case 'dashboard': return <AccountantDashboardView />;
      case 'fees': return <FeeSettingsView />;
      case 'payments': return <PaymentsView />;
      case 'debtors': return <DebtorsView />;
      case 'expenses': return <ExpensesView />;
      case 'salaries': return <SalariesView />;
      case 'scholarships': return <ScholarshipsView />;
      case 'reports': return <FinancialReportsView />;
      case 'security': return <AccountantSecurityView />;
      default: return <AccountantDashboardView />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex flex-col md:flex-row">
      {/* 6-Digit PIN Modal */}
      <AccountantPinModal />

      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar for Accountant */}
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
              C
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-blue-950 tracking-tight leading-none truncate">
                SmartSchool
              </div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-0.5 truncate">
                Module Comptable
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

        {/* School Identifier */}
        <div className="px-4 py-3 bg-blue-50/60 border-b border-blue-100">
          <div className="text-[10px] uppercase font-bold text-slate-500">Établissement</div>
          <div className="text-xs font-bold text-blue-950 truncate">{profile.schoolName}</div>
          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">Trésorerie Centrale (GNF)</div>
        </div>

        {/* Categorized Navigation list */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.groupTitle}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = activeAccountantTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveAccountantTab(item.tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive 
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                          : 'text-slate-600 hover:text-blue-950 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? '[&>svg]:text-white text-white' : ''}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isActive 
                            ? 'bg-white text-emerald-700' 
                            : (item.badgeColor || 'bg-emerald-100 text-emerald-800 border border-emerald-200')
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Compact Workspace Role Switcher Popover */}
        <div className="p-3 border-t border-blue-100 bg-blue-50/50 relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-white border border-blue-100 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-blue-100">
                Basculer vers un rôle
              </div>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToDirector(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-amber-800 font-medium flex items-center justify-between"
              >
                <span>Espace Directeur</span>
                <span className="text-[10px] text-amber-600">Pédagogie</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSecretary(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-50 text-teal-800 font-medium flex items-center justify-between"
              >
                <span>Espace Secrétariat</span>
                <span className="text-[10px] text-teal-600">Dossiers</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToTeacher(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-800 font-medium flex items-center justify-between"
              >
                <span>Espace Enseignant</span>
                <span className="text-[10px] text-blue-600">Cours & Notes</span>
              </button>
              {onSwitchToSupervisor && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSupervisor(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Surveillant</span>
                  <span className="text-[10px] text-rose-600">Discipline</span>
                </button>
              )}
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSchoolAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-900 font-semibold flex items-center justify-between border-t border-blue-100 mt-1 pt-1.5"
              >
                <span>Espace Admin École</span>
                <span className="text-[10px] text-slate-500">Admin</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-slate-600 border-t border-blue-100 mt-1 pt-1.5 font-medium"
              >
                Portail Super Admin
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
                  Chef Comptable
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveAccountantTab('security')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold hover:bg-emerald-100 transition-colors"
              title="Code PIN 6 chiffres opérationnel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PIN 6 Chiffres Actif</span>
            </button>

            <img 
              src={profile.photo} 
              alt="" 
              className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400" 
            />

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

        {/* Page Content */}
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
