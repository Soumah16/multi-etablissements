import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan, SubscriptionTierId } from '../../types';
import { 
  CreditCard, 
  Check, 
  Users, 
  HardDrive, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Edit3, 
  Plus, 
  X,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const SubscriptionsView: React.FC = () => {
  const { plans, schools, assignPlanToSchool, renewSubscription, updatePlan, t, showToast } = useApp();

  // Assign modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlanForAssign, setSelectedPlanForAssign] = useState<SubscriptionTierId>('standard');
  const [targetSchoolId, setTargetSchoolId] = useState(schools[0]?.id || '');

  // Edit plan modal
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [maxStudents, setMaxStudents] = useState<number>(1000);
  const [maxTeachers, setMaxTeachers] = useState<number>(100);
  const [storageGb, setStorageGb] = useState<number>(50);
  const [priceMonthlyGnf, setPriceMonthlyGnf] = useState<number>(1500000);

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' GNF';
  };

  const handleOpenAssign = (planId: SubscriptionTierId) => {
    setSelectedPlanForAssign(planId);
    setAssignModalOpen(true);
  };

  const handleExecuteAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSchoolId) return;
    assignPlanToSchool(targetSchoolId, selectedPlanForAssign);
    setAssignModalOpen(false);
  };

  const handleOpenEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setMaxStudents(plan.maxStudents);
    setMaxTeachers(plan.maxTeachers);
    setStorageGb(plan.storageGb);
    setPriceMonthlyGnf(plan.priceMonthlyGnf);
  };

  const handleSavePlanEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    updatePlan(editingPlan.id, {
      maxStudents,
      maxTeachers,
      storageGb,
      priceMonthlyGnf,
      priceAnnualGnf: priceMonthlyGnf * 10 // 2 months discount on annual
    });

    setEditingPlan(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.subscriptions.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.subscriptions.subtitle}
          </p>
        </div>

        <button
          onClick={() => handleOpenAssign('standard')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Building2 className="w-4 h-4" />
          <span>Attribuer une Formule</span>
        </button>
      </div>

      {/* Plan Cards Grid: Gratuit, Standard, Premium, Entreprise */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const activeSchoolsOnThisPlan = schools.filter(s => s.subscriptionTier === plan.id);
          const isPro = plan.id === 'premium' || plan.id === 'entreprise';

          return (
            <div
              key={plan.id}
              className={`rounded-xl p-5 flex flex-col justify-between transition-all ${
                isPro 
                  ? 'bg-slate-800/90 border-2 border-blue-500/50 shadow-lg shadow-blue-500/5' 
                  : 'bg-slate-800/60 border border-slate-700/60'
              }`}
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider font-mono">
                    {plan.badge}
                  </span>
                  <button
                    onClick={() => handleOpenEditPlan(plan)}
                    className="p-1 text-slate-400 hover:text-white rounded"
                    title="Modifier les quotas et tarifs"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white mt-1">
                  {plan.name}
                </h3>

                {/* Price in GNF */}
                <div className="mt-4 pb-4 border-b border-slate-700/60">
                  <div className="text-xl font-extrabold text-white font-mono tabular-nums">
                    {plan.priceMonthlyGnf === 0 ? '0 GNF' : formatGnf(plan.priceMonthlyGnf)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {plan.priceMonthlyGnf === 0 ? 'Gratuit sans engagement' : 'Par établissement / mois'}
                  </div>
                </div>

                {/* Quotas & Specs */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Élèves max :</span>
                    <span className="font-semibold text-white font-mono">{plan.maxStudents.toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Enseignants max :</span>
                    <span className="font-semibold text-white font-mono">{plan.maxTeachers}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Stockage cloud :</span>
                    <span className="font-semibold text-white font-mono">{plan.storageGb} Go</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Sauvegardes :</span>
                    <span className="text-white text-[11px]">{plan.backupFrequency}</span>
                  </div>
                </div>

                {/* Modules list */}
                <div className="mt-4 pt-3 border-t border-slate-700/60">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Modules inclus
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {plan.modules.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Assign Button & Active Count */}
              <div className="mt-6 pt-4 border-t border-slate-700/60 space-y-2">
                <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Établissements :</span>
                  <span className="text-blue-400 font-semibold">{activeSchoolsOnThisPlan.length} actives</span>
                </div>
                <button
                  onClick={() => handleOpenAssign(plan.id)}
                  className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isPro 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  Attribuer ce Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Schools List: Monitoring active renewals */}
      <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60">
        <h3 className="text-sm font-bold text-white mb-1">
          État des Abonnements par Établissement
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Actions directes de renouvellement, suspension de contrat ou changement de palier
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-[11px] uppercase font-semibold">
                <th className="py-2.5 px-3">Établissement</th>
                <th className="py-2.5 px-3">Formule Actuelle</th>
                <th className="py-2.5 px-3">Montant Mensuel</th>
                <th className="py-2.5 px-3">Date d'Expiration</th>
                <th className="py-2.5 px-3">Statut</th>
                <th className="py-2.5 px-3 text-right">Action Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-300">
              {schools.map(s => {
                const plan = plans.find(p => p.id === s.subscriptionTier);
                return (
                  <tr key={s.id} className="hover:bg-slate-700/30">
                    <td className="py-3 px-3 font-semibold text-white">
                      {s.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-[11px] font-mono">
                        {plan?.name || s.subscriptionTier}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400">
                      {formatGnf(s.stats.monthlyRevenueGnf)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {s.subscriptionExpiresAt}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-medium ${
                        s.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {s.status === 'active' ? 'En cours' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => renewSubscription(s.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                          title="Renouveler pour 1 an supplémentaire"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Renouveler</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedPlanForAssign(s.subscriptionTier);
                            setTargetSchoolId(s.id);
                            setAssignModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                        >
                          Changer de formule
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Plan Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                Attribuer une Formule d'Abonnement
              </h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAssign} className="mt-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Sélectionner l'établissement scolaire *</label>
                <select
                  value={targetSchoolId}
                  onChange={e => setTargetSchoolId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Formule à assigner *</label>
                <select
                  value={selectedPlanForAssign}
                  onChange={e => setSelectedPlanForAssign(e.target.value as SubscriptionTierId)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatGnf(p.priceMonthlyGnf)}/mois
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/30 text-slate-300 space-y-1 text-[11px]">
                <div className="font-semibold text-blue-300">Effet immédiat :</div>
                <p>
                  Les quotas d'élèves et les modules correspondants seront automatiquement débloqués dans l'espace de l'école. Une facture sera générée pour validation comptable.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white rounded bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded"
                >
                  Confirmer l'attribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Quotas Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                Configurer Quotas : {editingPlan.name}
              </h3>
              <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlanEdits} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Tarif Mensuel (GNF) *</label>
                <input
                  type="number"
                  value={priceMonthlyGnf}
                  onChange={e => setPriceMonthlyGnf(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Nombre max d'élèves *</label>
                  <input
                    type="number"
                    value={maxStudents}
                    onChange={e => setMaxStudents(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Nombre max d'enseignants *</label>
                  <input
                    type="number"
                    value={maxTeachers}
                    onChange={e => setMaxTeachers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Espace de stockage alloué (Go) *</label>
                <input
                  type="number"
                  value={storageGb}
                  onChange={e => setStorageGb(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white rounded bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded"
                >
                  Sauvegarder les quotas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
