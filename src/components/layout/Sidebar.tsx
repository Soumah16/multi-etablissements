import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Coins, 
  TrendingUp, 
  QrCode, 
  Megaphone, 
  ShieldCheck, 
  Database, 
  Sliders, 
  UserCheck,
  X,
  Lock,
  Server,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, t, schools, admins, isRtl } = useApp();

  // Categorized Navigation for Super Admin
  const navigationGroups: {
    groupTitle: string;
    items: { tab: NavTab; label: string; icon: React.ReactNode; count?: number }[];
  }[] = [
    {
      groupTitle: 'PILOTAGE GLOBAL',
      items: [
        { tab: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
        { tab: 'users', label: 'Gestion des Comptes', icon: <UserCheck className="w-4 h-4 text-cyan-600" /> },
        { tab: 'schools', label: t.nav.schools, icon: <Building2 className="w-4 h-4 text-blue-600" />, count: schools.length },
        { tab: 'admins', label: t.nav.schoolAdmins, icon: <Users className="w-4 h-4 text-emerald-600" />, count: admins.length }
      ]
    },
    {
      groupTitle: 'FINANCES & REVENUS',
      items: [
        { tab: 'subscriptions', label: t.nav.subscriptions, icon: <CreditCard className="w-4 h-4 text-purple-600" /> },
        { tab: 'revenue', label: t.nav.revenue, icon: <Coins className="w-4 h-4 text-amber-600" /> },
        { tab: 'analytics', label: t.nav.analytics, icon: <TrendingUp className="w-4 h-4 text-cyan-600" /> }
      ]
    },
    {
      groupTitle: 'OUTILS & INFRASTRUCTURE',
      items: [
        { tab: 'badges', label: 'Cartes PVC & Badges', icon: <QrCode className="w-4 h-4 text-teal-600" /> },
        { tab: 'architecture', label: 'Architecture & Déploiement', icon: <BookOpen className="w-4 h-4 text-cyan-600" /> },
        { tab: 'communication', label: t.nav.communication, icon: <Megaphone className="w-4 h-4 text-rose-600" /> },
        { tab: 'backups', label: t.nav.backups, icon: <Database className="w-4 h-4 text-indigo-600" /> }
      ]
    },
    {
      groupTitle: 'GOUVERNANCE & SÉCURITÉ',
      items: [
        { tab: 'security', label: t.nav.security, icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
        { tab: 'settings', label: t.nav.settings, icon: <Sliders className="w-4 h-4" /> },
        { tab: 'profile', label: t.nav.profile, icon: <UserCheck className="w-4 h-4" /> }
      ]
    }
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed md:sticky top-0 h-screen w-[270px] sm:w-64 max-w-[85vw] bg-white/95 backdrop-blur-md border-r border-blue-100 flex flex-col z-50 transition-transform duration-200 ease-in-out shrink-0 shadow-xl md:shadow-none ${
          mobileOpen 
            ? 'translate-x-0' 
            : isRtl 
              ? 'translate-x-full md:translate-x-0' 
              : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Tricolor Guinean top strip */}
        <div className="h-1 w-full grid grid-cols-3 shrink-0">
          <div className="bg-[#CE1126]" />
          <div className="bg-[#FCD116]" />
          <div className="bg-[#009460]" />
        </div>

        {/* Brand header on mobile / small screens */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-blue-100 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/25">
              S
            </div>
            <span className="font-black text-blue-950 text-sm">SmartSchool ERP</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-50"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title with sovereign badge */}
        <div className="px-4 pt-3.5 pb-2.5 bg-blue-50/50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
              Console MEPU-A
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
              🇬🇳 Guinée
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Gouvernance Multi-Tenant
          </div>
        </div>

        {/* Categorized Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-3.5 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.groupTitle}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => handleSelect(item.tab)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? '[&>svg]:text-white text-white' : ''}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white text-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom system isolation indicator */}
        <div className="p-4 border-t border-blue-100 bg-blue-50/50">
          <div className="flex items-center gap-2 text-xs text-blue-950">
            <Server className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold text-[11px] truncate">Hébergement Multi-Écoles</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 font-mono">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">Partitionnement school_id Actif</span>
          </div>
        </div>
      </aside>
    </>
  );
};
