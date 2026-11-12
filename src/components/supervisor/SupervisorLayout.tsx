import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { SupervisorNavTab } from '../../types/supervisor';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileCheck, 
  Gavel, 
  Eye, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Lock, 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronDown,
  Building2,
  Sparkles,
  ArrowRightLeft,
  LogOut
} from 'lucide-react';
import { SupervisorDashboardView } from './SupervisorDashboardView';
import { SupervisorAttendanceView } from './SupervisorAttendanceView';
import { SupervisorAdmissionSlipsView } from './SupervisorAdmissionSlipsView';
import { SupervisorDisciplineView } from './SupervisorDisciplineView';
import { SupervisorWatchlistView } from './SupervisorWatchlistView';
import { SupervisorPatrolsView } from './SupervisorPatrolsView';
import { SupervisorMeetingsView } from './SupervisorMeetingsView';
import { SupervisorBadgeView } from './SupervisorBadgeView';
import { SupervisorSecurityView } from './SupervisorSecurityView';

interface SupervisorLayoutProps {
  onReturnToSchoolAdmin: () => void;
  onReturnToDirector: () => void;
  onReturnToSecretary: () => void;
  onReturnToTeacher: () => void;
  onReturnToAccountant: () => void;
  onReturnToSuperAdmin: () => void;
  onLogout?: () => void;
}

export const SupervisorLayout: React.FC<SupervisorLayoutProps> = ({
  onReturnToSchoolAdmin,
  onReturnToDirector,
  onReturnToSecretary,
  onReturnToTeacher,
  onReturnToAccountant,
  onReturnToSuperAdmin,
  onLogout
}) => {
  const { 
    activeSupervisorTab, 
    setActiveSupervisorTab, 
    profile, 
    attendanceRecords,
    incidents,
    watchlist,
    toastMessage 
  } = useSupervisor();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const pendingAttendanceCount = attendanceRecords.filter(r => r.status === 'non_justifie').length;
  const activeIncidentsCount = incidents.filter(i => i.status === 'en_cours').length;
  const watchlistCount = watchlist.length;

  // Categorized Navigation Groups to prevent crowding
  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: SupervisorNavTab;
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
      groupTitle: 'PRÉSENCES & CONTRÔLE D\'ACCÈS',
      items: [
        { 
          tab: 'attendance', 
          label: 'Absences & Retards', 
          icon: <ClipboardCheck className="w-4 h-4 text-emerald-400" />,
          badge: pendingAttendanceCount,
          badgeColor: 'bg-rose-500/20 text-rose-300'
        },
        { 
          tab: 'admission_slips', 
          label: 'Billets de Rentrée', 
          icon: <FileCheck className="w-4 h-4 text-red-400" />
        }
      ]
    },
    {
      groupTitle: 'DISCIPLINE & SURVEILLANCE',
      items: [
        { 
          tab: 'incidents', 
          label: 'Incidents & Sanctions', 
          icon: <Gavel className="w-4 h-4 text-amber-400" />,
          badge: activeIncidentsCount,
          badgeColor: 'bg-amber-500/20 text-amber-300'
        },
        { 
          tab: 'watchlist', 
          label: 'Élèves sous Surveillance', 
          icon: <Eye className="w-4 h-4 text-cyan-400" />,
          badge: watchlistCount,
          badgeColor: 'bg-cyan-500/20 text-cyan-300'
        },
        { 
          tab: 'patrols', 
          label: 'Rondes & Objets Consignés', 
          icon: <ShieldCheck className="w-4 h-4 text-blue-400" />
        }
      ]
    },
    {
      groupTitle: 'RELATIONS & SÉCURITÉ',
      items: [
        { 
          tab: 'parent_meetings', 
          label: 'Convocations Parents', 
          icon: <Calendar className="w-4 h-4 text-purple-400" />
        },
        { 
          tab: 'badge', 
          label: 'Badge Professionnel', 
          icon: <CreditCard className="w-4 h-4" />
        },
        { 
          tab: 'security', 
          label: 'Sécurité & Code PIN', 
          icon: <Lock className="w-4 h-4" />
        }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeSupervisorTab) {
      case 'dashboard': return <SupervisorDashboardView />;
      case 'attendance': return <SupervisorAttendanceView />;
      case 'admission_slips': return <SupervisorAdmissionSlipsView />;
      case 'incidents': return <SupervisorDisciplineView />;
      case 'watchlist': return <SupervisorWatchlistView />;
      case 'patrols': return <SupervisorPatrolsView />;
      case 'parent_meetings': return <SupervisorMeetingsView />;
      case 'badge': return <SupervisorBadgeView />;
      case 'security': return <SupervisorSecurityView />;
      default: return <SupervisorDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-red-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar for Supervisor */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-200
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Area */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-base shadow-sm">
              S
            </div>
            <div>
              <div className="font-black text-sm text-white tracking-tight leading-none">
                SmartSchool
              </div>
              <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-0.5">
                Module Surveillant
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School Identifier */}
        <div className="px-4 py-2.5 bg-slate-800/40 border-b border-slate-800">
          <div className="text-[9px] uppercase font-bold text-slate-400">Établissement</div>
          <div className="text-xs font-bold text-white truncate">{profile.schoolName}</div>
          <div className="text-[10px] text-red-400 font-mono mt-0.5 truncate">{profile.department}</div>
        </div>

        {/* Categorized Navigation list - CLEAN, ELEGANT & UNCLUTTERED */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.groupTitle}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = activeSupervisorTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveSupervisorTab(item.tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive 
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
                          isActive 
                            ? 'bg-white text-red-600' 
                            : (item.badgeColor || 'bg-red-500/20 text-red-300 border border-red-500/30')
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

        {/* Compact Workspace Role Switcher (Prevents crowding and leaves plenty of room!) */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowRightLeft className="w-3.5 h-3.5 text-red-400" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Basculer vers un rôle
              </div>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToDirector(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 text-amber-300 flex items-center justify-between"
              >
                <span>Espace Directeur</span>
                <span className="text-[10px] text-amber-400">Pédagogie</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSecretary(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-500/10 text-teal-300 flex items-center justify-between"
              >
                <span>Espace Secrétariat</span>
                <span className="text-[10px] text-teal-400">Dossiers</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToTeacher(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 text-blue-300 flex items-center justify-between"
              >
                <span>Espace Enseignant</span>
                <span className="text-[10px] text-blue-400">Cours & Notes</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToAccountant(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-300 flex items-center justify-between"
              >
                <span>Espace Comptabilité</span>
                <span className="text-[10px] text-emerald-400">Finances</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSchoolAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
              >
                <span>Espace Admin École</span>
                <span className="text-[10px] text-slate-400">Admin</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 border-t border-slate-800 mt-1 pt-1.5"
              >
                Portail Super Admin
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{profile.firstName} {profile.lastName}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  {profile.roleTitle}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>Vie Scolaire Active</span>
            </span>

            <button
              onClick={() => setActiveSupervisorTab('badge')}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-red-500 transition-all"
              title="Voir mon badge de surveillant"
            >
              <img 
                src={profile.photo} 
                alt="" 
                className="w-8 h-8 rounded-full object-cover border border-red-500/50" 
              />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-[1560px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
