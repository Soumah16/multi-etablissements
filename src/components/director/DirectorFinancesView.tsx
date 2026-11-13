import React from 'react';
import { useDirector } from '../../context/DirectorContext';
import { 
  Wallet, 
  Lock, 
  ShieldAlert, 
  AlertCircle, 
  TrendingUp, 
  ArrowDownRight, 
  CreditCard, 
  Users, 
  Phone, 
  Download, 
  Info,
  Building2
} from 'lucide-react';

export const DirectorFinancesView: React.FC = () => {
  const { financialOverview } = useDirector();

  const formatGnf = (val: number) => {
    return new Intl.NumberFormat('fr-GN').format(val) + ' GNF';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Non-Interference Warning Banner (Critical Requirement) */}
      <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-start gap-4 shadow-lg shadow-amber-500/5">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-700">
              Accès Financier en Consultation Pédagogique Stricte
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Lecture Seule
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Conformément aux principes de gouvernance SmartSchool ERP, <strong>le Directeur ne participe jamais à la saisie, modification ou suppression d'écritures comptables</strong>. La gestion des factures, règlements et mouvements de caisse relève de la responsabilité exclusive du <strong>Comptable de l'établissement</strong>.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Visibilité Budgétaire Établissement
            </span>
            <span className="text-xs text-slate-500">Devise Officielle : Franc Guinéen (GNF)</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" />
            <span>Synthèse Financière & Recouvrement Scolaire</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Indicateurs d'encaissement des scolarités et suivi des élèves débiteurs pour l'encadrement administratif.
          </p>
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recouvrement Scolarités */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Taux de Recouvrement</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {financialOverview.collectionRatePct}%
          </div>
          <div className="w-full bg-blue-100/70 h-2 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-500 h-full rounded-full" 
              style={{ width: `${financialOverview.collectionRatePct}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            Attendu : <span className="font-semibold text-blue-950">{formatGnf(financialOverview.tuitionExpectedGnf)}</span>
          </div>
        </div>

        {/* Total Scolarités Encaissées */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Scolarités Encaissées</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-950 font-mono truncate">
            {formatGnf(financialOverview.tuitionCollectedGnf)}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium mt-2">
            <span>Recouvrement fluide sur 850 élèves</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Trésorerie nette : <span className="font-bold text-blue-950">{formatGnf(financialOverview.netTreasuryGnf)}</span>
          </div>
        </div>

        {/* Dépenses Globales */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Dépenses Établissement</span>
            <ArrowDownRight className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl font-black text-slate-900 font-mono truncate">
            {formatGnf(financialOverview.totalExpensesGnf)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Salaires des enseignants, matériel pédagogique, consommables.
          </div>
        </div>

        {/* Débiteurs */}
        <div className="p-5 rounded-2xl bg-white border border-rose-200 bg-rose-50 space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-700">
            <span>Élèves Débiteurs</span>
            <Users className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {financialOverview.totalDebtorsCount} élèves
          </div>
          <div className="text-[11px] text-rose-700">
            Reliquat dû : <span className="font-bold">{formatGnf(financialOverview.totalDebtAmountGnf)}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Relances automatiques envoyées par SMS
          </div>
        </div>
      </div>

      {/* Debtors List (Essential for pedagogical coordination - e.g. exam access permissions) */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden space-y-2">
        <div className="p-4 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" />
              <span>Liste des Élèves en Retard de Paiement des Frais de Scolarité</span>
            </h3>
            <p className="text-xs text-slate-500">
              Information consultable par la Direction pour le suivi des convocations et accès aux épreuves.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Élève</th>
                <th className="py-2.5 px-3">Matricule</th>
                <th className="py-2.5 px-3">Classe</th>
                <th className="py-2.5 px-3 text-right">Montant Restant Dû</th>
                <th className="py-2.5 px-3">Date Limite Dépassée</th>
                <th className="py-2.5 px-3">Parent Responsable</th>
                <th className="py-2.5 px-4">Statut Relance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {financialOverview.debtorsList.map(deb => (
                <tr key={deb.id} className="hover:bg-blue-50">
                  <td className="py-3 px-4 font-bold text-blue-950">{deb.studentName}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{deb.matricule}</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">{deb.className}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                    {formatGnf(deb.amountDueGnf)}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{deb.dueDate}</td>
                  <td className="py-3 px-3">
                    <div className="text-slate-700 font-medium">{deb.parentName}</div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" />
                      <span>{deb.parentPhone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      deb.status === 'retard_critique' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {deb.status === 'retard_critique' ? 'Retard Critique' : 'Retard Léger'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
