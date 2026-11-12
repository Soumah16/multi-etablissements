import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Briefcase, 
  Coins, 
  CreditCard, 
  ShieldAlert, 
  ArrowUpRight, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  ExternalLink,
  HardDrive
} from 'lucide-react';
import { GovernanceBanner } from '../common/GovernanceBanner';

export const DashboardView: React.FC = () => {
  const { 
    schools, 
    admins, 
    plans, 
    transactions, 
    auditLogs, 
    profile, 
    setActiveTab, 
    t 
  } = useApp();

  const [revenuePeriod, setRevenuePeriod] = useState<'monthly' | 'annual'>('monthly');

  // Aggregated totals
  const totalSchools = schools.length;
  const activeSchools = schools.filter(s => s.status === 'active').length;
  const suspendedSchools = schools.filter(s => s.status === 'suspended').length;

  const totalStudents = schools.reduce((acc, s) => acc + (s.stats.studentsCount || 0), 0);
  const totalParents = schools.reduce((acc, s) => acc + (s.stats.parentsCount || 0), 0);
  const totalTeachers = schools.reduce((acc, s) => acc + (s.stats.teachersCount || 0), 0);
  const totalEmployees = schools.reduce((acc, s) => acc + (s.stats.employeesCount || 0), 0);
  const totalUsers = totalStudents + totalParents + totalTeachers + totalEmployees;

  // Revenue in GNF
  const totalRevenueGnf = transactions
    .filter(t => t.status === 'payé')
    .reduce((acc, t) => acc + t.amountGnf, 0);

  const monthlyRevenueGnf = schools
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + (s.stats.monthlyRevenueGnf || 0), 0);

  const annualRevenueGnf = monthlyRevenueGnf * 12;

  const activeSubscriptions = schools.filter(s => s.status === 'active').length;
  const expiredSubscriptions = schools.filter(s => {
    if (s.status === 'suspended') return true;
    const exp = new Date(s.subscriptionExpiresAt);
    return exp.getTime() < Date.now();
  }).length;

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' GNF';
  };

  // Mock timeline data for monthly revenue chart
  const revenueHistory = [
    { month: 'Mai', amount: 16500000 },
    { month: 'Juin', amount: 18000000 },
    { month: 'Juil', amount: 15000000 },
    { month: 'Août', amount: 19500000 },
    { month: 'Sept', amount: 24000000 },
    { month: 'Oct', amount: 25500000 },
    { month: 'Nov', amount: monthlyRevenueGnf }
  ];
  const maxRevenue = Math.max(...revenueHistory.map(r => r.amount));

  // User growth history
  const userGrowth = [
    { period: 'T1 2025', count: 3200 },
    { period: 'T2 2025', count: 5400 },
    { period: 'T3 2025', count: 8100 },
    { period: 'T4 2025', count: 11200 },
    { period: 'T1 2026', count: 14500 },
    { period: 'T2 2026', count: 18900 },
    { period: 'En cours', count: totalUsers }
  ];
  const maxUserGrowth = Math.max(...userGrowth.map(u => u.count));

  // School tier distribution
  const tierDistribution = [
    { tier: 'Entreprise', count: schools.filter(s => s.subscriptionTier === 'entreprise').length, color: 'bg-purple-500' },
    { tier: 'Premium Pro', count: schools.filter(s => s.subscriptionTier === 'premium').length, color: 'bg-blue-500' },
    { tier: 'Standard', count: schools.filter(s => s.subscriptionTier === 'standard').length, color: 'bg-emerald-500' },
    { tier: 'Gratuit', count: schools.filter(s => s.subscriptionTier === 'gratuit').length, color: 'bg-slate-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Strict Governance Boundary */}
      <GovernanceBanner />

      {/* Primary KPI Grid: High-level overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Schools */}
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.dashboard.totalSchools}</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {totalSchools}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">{activeSchools} actives</span>
              <span>·</span>
              <span className="text-rose-400 font-medium">{suspendedSchools} suspendues</span>
            </div>
          </div>
        </div>

        {/* Global Users */}
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.dashboard.totalUsers}</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {totalUsers.toLocaleString('fr-FR')}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 truncate">
              <span>{totalStudents.toLocaleString('fr-FR')} élèves</span>
              <span>·</span>
              <span>{totalTeachers} profs</span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue (GNF) */}
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.dashboard.monthlyRevenue}</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-400 font-mono tabular-nums truncate">
              {formatGnf(monthlyRevenueGnf)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
              <span>Annuel récurrent : </span>
              <span className="text-slate-300 font-mono tabular-nums">{formatGnf(annualRevenueGnf)}</span>
            </div>
          </div>
        </div>

        {/* Subscriptions Status */}
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.dashboard.activeSubs}</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {activeSubscriptions}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="text-slate-300">Taux de rétention 94%</span>
              <span>·</span>
              <span className="text-amber-400">{expiredSubscriptions} à renouveler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Demographic Strip: Student, Parent, Teacher, Employee */}
      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-400">{t.dashboard.totalStudents}</div>
            <div className="font-semibold text-slate-200 text-sm font-mono tabular-nums">
              {totalStudents.toLocaleString('fr-FR')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-400">{t.dashboard.totalParents}</div>
            <div className="font-semibold text-slate-200 text-sm font-mono tabular-nums">
              {totalParents.toLocaleString('fr-FR')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-400">{t.dashboard.totalTeachers}</div>
            <div className="font-semibold text-slate-200 text-sm font-mono tabular-nums">
              {totalTeachers.toLocaleString('fr-FR')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-400">{t.dashboard.totalEmployees}</div>
            <div className="font-semibold text-slate-200 text-sm font-mono tabular-nums">
              {totalEmployees.toLocaleString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Revenue Trends in GNF */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
            <div>
              <h3 className="font-semibold text-sm text-white">
                {t.dashboard.revenueTrend}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Facturations d'abonnements mensuels encaissés en Franc Guinéen
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setRevenuePeriod('monthly')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  revenuePeriod === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setRevenuePeriod('annual')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  revenuePeriod === 'annual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cumul Annuel
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6">
            <div className="h-48 flex items-end gap-3 sm:gap-6 justify-between px-2">
              {revenueHistory.map((item, index) => {
                const heightPercent = Math.round((item.amount / maxRevenue) * 100);
                const isCurrent = index === revenueHistory.length - 1;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 font-mono">
                      {formatGnf(item.amount)}
                    </div>
                    <div className="w-full flex justify-center items-end h-36">
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[36px] rounded-t-sm transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-emerald-500 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20' 
                            : 'bg-blue-600/70 hover:bg-blue-500'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400 border-t border-slate-700/50 mt-2 font-mono">
              <span>Moyenne : ~21 000 000 GNF / mois</span>
              <span className="text-emerald-400 font-semibold">+18.5% de croissance trimestrielle</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Plan Breakdown & Platform Utilization */}
        <div className="p-5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-white">
              {t.dashboard.subDistribution}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Répartition des écoles par palier de licence
            </p>

            <div className="mt-5 space-y-3">
              {tierDistribution.map((item) => {
                const pct = totalSchools > 0 ? Math.round((item.count / totalSchools) * 100) : 0;
                return (
                  <div key={item.tier} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.tier}</span>
                      <span className="text-slate-400 font-mono tabular-nums">{item.count} écoles ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500`} 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50 mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                Stockage Total Consommé
              </span>
              <span className="text-white font-mono font-medium">
                627.1 Go / 2.0 To
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '31.3%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Activities & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Platform Activities */}
        <div className="p-5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-sm text-white">{t.dashboard.recentActivities}</h3>
            </div>
            <button 
              onClick={() => setActiveTab('security')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              Voir tout le journal <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-700/40 mt-2 flex-1">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="text-slate-200 font-medium">{log.action}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-2">
                    <span>{log.actor}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-500">{log.ip}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap font-mono">
                  {log.timestamp.substring(11, 16)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System & Security Alerts */}
        <div className="p-5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-sm text-white">{t.dashboard.systemAlerts}</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Système 100% Opérationnel
            </span>
          </div>

          <div className="space-y-3 mt-3">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-amber-300">Renouvellement Abonnement requis</div>
                <div className="text-slate-300 text-[11px] mt-0.5">
                  L'établissement « École Primaire Bilingue Franco-Arabe de Matam » arrive à échéance le 31/12/2026.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-rose-300">Établissement Suspendu</div>
                <div className="text-slate-300 text-[11px] mt-0.5">
                  « Centre de Formation Professionnelle en Forêt » (Nzérékoré) est actuellement hors-ligne suite à décision administrative.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs flex items-start gap-3">
              <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-300">Dernière Sauvegarde Chiffrée</div>
                <div className="text-slate-300 text-[11px] mt-0.5">
                  Snapshot multi-tenant exécuté automatiquement avec succès ce matin à 02:00 GMT (842.6 Mo, SHA-256 certifié).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
