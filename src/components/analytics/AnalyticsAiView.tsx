import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Coins, 
  Building2, 
  Users, 
  Activity,
  Layers
} from 'lucide-react';

export const AnalyticsAiView: React.FC = () => {
  const { schools, transactions, t } = useApp();

  // Sort schools by activity score
  const sortedSchools = [...schools].sort((a, b) => b.stats.activityScore - a.stats.activityScore);

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' GNF';
  };

  const currentMonthlyRevenue = schools
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + (s.stats.monthlyRevenueGnf || 0), 0);

  // AI revenue forecasts in GNF
  const forecast3Months = Math.round(currentMonthlyRevenue * 3 * 1.12);
  const forecast6Months = Math.round(currentMonthlyRevenue * 6 * 1.25);
  const forecast12Months = Math.round(currentMonthlyRevenue * 12 * 1.45);

  const moduleUsage = [
    { name: "Portail Administratif & Inscriptions", usage: 98, trend: "+4%" },
    { name: "Bulletins & Relevés Automatisés", usage: 91, trend: "+12%" },
    { name: "Comptabilité & Encaissement Scolaire", usage: 84, trend: "+9%" },
    { name: "Passerelle SMS & Alertes Parents", usage: 76, trend: "+22%" },
    { name: "Générateur Cartes Scolaires QR", usage: 68, trend: "+15%" },
    { name: "Application Mobile Familles", usage: 59, trend: "+30%" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.nav.analytics}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Indicateurs d'engagement en temps réel, prévisions de trésorerie en GNF et alertes d'attrition
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Moteur Prédictif SmartSchool AI v2.8</span>
        </div>
      </div>

      {/* Revenue Projections Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Projection à 3 Mois</span>
            <span className="text-emerald-400 font-mono font-semibold">+12% estimé</span>
          </div>
          <div className="text-xl font-bold text-white mt-2 font-mono tabular-nums">
            {formatGnf(forecast3Months)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Basé sur 2 nouvelles souscriptions prévues
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Projection à 6 Mois</span>
            <span className="text-emerald-400 font-mono font-semibold">+25% estimé</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-2 font-mono tabular-nums">
            {formatGnf(forecast6Months)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Rentabilité opérationnelle consolidée
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Projection Annuelle (12 Mois)</span>
            <span className="text-blue-400 font-mono font-semibold">+45% expansion</span>
          </div>
          <div className="text-xl font-bold text-blue-400 mt-2 font-mono tabular-nums">
            {formatGnf(forecast12Months)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Hypothèse 15 écoles rattachées
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Active Schools Ranking & Module Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Active Schools Ranking */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  Classement des Écoles les Plus Actives
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Score d'activité /100</span>
            </div>

            <div className="mt-4 space-y-3">
              {sortedSchools.map((s, index) => (
                <div key={s.id} className="p-3 rounded-lg bg-slate-900 border border-slate-700/70 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      index === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      index === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40' :
                      index === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs">{s.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {s.stats.studentsCount.toLocaleString('fr-FR')} élèves · {s.city} ({s.type})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-emerald-400">
                        {s.stats.activityScore}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Assiduité ERP
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature & Module Utilization Rate */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <h2 className="text-sm font-bold text-white">
                Taux d'Adoption des Modules
              </h2>
              <span className="text-xs text-slate-400 font-mono">Sur 100% des écoles</span>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {moduleUsage.map((mod) => (
                <div key={mod.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{mod.name}</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-white font-bold">{mod.usage}%</span>
                      <span className="text-emerald-400 text-[10px]">{mod.trend}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${mod.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Churn Risk Alert */}
          <div className="mt-6 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              <span>Alerte IA : Risque d'Attrition Détecté (1 Établissement)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Le « Centre de Formation Professionnelle en Forêt » présente un score d'activité de seulement 22% et un abonnement expiré. Une relance commerciale automatique est recommandée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
