import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { PaymentRecord } from '../../types/accountant';
import { ReceiptModal } from './ReceiptModal';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Plus, 
  Smartphone, 
  Landmark, 
  Coins, 
  ArrowRight,
  TrendingUp,
  Receipt
} from 'lucide-react';

export const AccountantDashboardView: React.FC = () => {
  const { 
    payments, 
    debtors, 
    expenses, 
    salaries, 
    formatGnf, 
    setActiveAccountantTab 
  } = useAccountant();

  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<PaymentRecord | null>(null);

  // Computations
  const totalCollectedGnf = payments
    .filter(p => p.status === 'valide')
    .reduce((sum, p) => sum + p.amountPaidGnf, 0);

  const todayStr = '2026-11-03';
  const todayCollectedGnf = payments
    .filter(p => p.status === 'valide' && p.date === todayStr)
    .reduce((sum, p) => sum + p.amountPaidGnf, 0);

  const monthCollectedGnf = payments
    .filter(p => p.status === 'valide' && p.date.startsWith('2026-11'))
    .reduce((sum, p) => sum + p.amountPaidGnf, 0);

  const totalExpensesMonthGnf = expenses
    .filter(e => e.status === 'valide' && e.date.startsWith('2026-11'))
    .reduce((sum, e) => sum + e.amountGnf, 0);

  const totalSalariesMonthGnf = salaries
    .filter(s => s.status === 'paye')
    .reduce((sum, s) => sum + s.netSalaryGnf, 0);

  const availableCashGnf = totalCollectedGnf - (totalExpensesMonthGnf + totalSalariesMonthGnf);

  const totalDebtorsRemainingGnf = debtors.reduce((sum, d) => sum + d.balanceRemainingGnf, 0);

  // Breakdown by payment method
  const orangeMoneyTotal = payments.filter(p => p.method === 'orange_money').reduce((sum, p) => sum + p.amountPaidGnf, 0);
  const mtnMomoTotal = payments.filter(p => p.method === 'mtn_momo').reduce((sum, p) => sum + p.amountPaidGnf, 0);
  const cashTotal = payments.filter(p => p.method === 'especes').reduce((sum, p) => sum + p.amountPaidGnf, 0);
  const bankTotal = payments.filter(p => p.method === 'virement' || p.method === 'cheque').reduce((sum, p) => sum + p.amountPaidGnf, 0);

  return (
    <div className="space-y-6">
      {/* Receipt Modal */}
      {selectedReceiptPayment && (
        <ReceiptModal 
          payment={selectedReceiptPayment} 
          onClose={() => setSelectedReceiptPayment(null)} 
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-blue-50/40 to-blue-50/80 border border-emerald-800/40 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Devise Officielle : Franc Guinéen (GNF) · Trésorerie Ouverte</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tight">
              Tableau de Bord Financier & Trésorerie
            </h1>
            <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
              Supervision des encaissements, facturations, relances d'impayés, dépenses opérationnelles et paie du personnel en temps réel.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => setActiveAccountantTab('payments')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Encaisser un paiement</span>
            </button>
            <button
              onClick={() => setActiveAccountantTab('expenses')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100 border border-slate-200 text-slate-900 text-xs font-bold transition-colors"
            >
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
              <span>Saisir une dépense</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Tiles (10 required indicators) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Collected */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Encaissé</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-600 truncate font-mono">
            {formatGnf(totalCollectedGnf)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Année scolaire 2026-2027</div>
        </div>

        {/* Today Collected */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Recette du Jour</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl md:text-2xl font-black text-blue-950 truncate font-mono">
            {formatGnf(todayCollectedGnf)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Aujourd'hui (03 nov.)</div>
        </div>

        {/* Month Collected */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Recette du Mois</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl md:text-2xl font-black text-blue-950 truncate font-mono">
            {formatGnf(monthCollectedGnf)}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">Novembre 2026</div>
        </div>

        {/* Available Balance */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Solde Disponible</span>
            <Coins className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-700 truncate font-mono">
            {formatGnf(availableCashGnf)}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">Caisse & Comptes</div>
        </div>

        {/* Debtors Amount */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Impayés Débiteurs</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl md:text-2xl font-black text-rose-600 truncate font-mono">
            {formatGnf(totalDebtorsRemainingGnf)}
          </div>
          <div className="text-[11px] text-rose-600 mt-1">{debtors.length} élèves en retard</div>
        </div>

        {/* Month Expenses */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Dépenses du Mois</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-blue-950 truncate font-mono">
            {formatGnf(totalExpensesMonthGnf)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Énergie, internet, maintenance</div>
        </div>

        {/* Salaries Paid */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Salaires Versés</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-blue-950 truncate font-mono">
            {formatGnf(totalSalariesMonthGnf)}
          </div>
          <div className="text-[11px] text-indigo-600 mt-1">{salaries.length} employés payés</div>
        </div>

        {/* Payments Count */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Paiements Effectués</span>
            <CreditCard className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-blue-950">{payments.length}</div>
          <div className="text-[11px] text-teal-600 mt-1">Transactions validées</div>
        </div>

        {/* Receipts Generated */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Reçus Générés</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-blue-950">{payments.length}</div>
          <div className="text-[11px] text-purple-600 mt-1">Avec QR Code unique</div>
        </div>

        {/* Debtors Count */}
        <div className="p-4 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Élèves Débiteurs</span>
            <Users className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl font-bold text-amber-700">{debtors.length}</div>
          <div className="text-[11px] text-amber-700 mt-1">Relances en cours</div>
        </div>
      </div>

      {/* Payment Channels Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-blue-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
            OM
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-semibold">Orange Money Guinée</div>
            <div className="text-sm font-bold text-blue-950 font-mono truncate">{formatGnf(orangeMoneyTotal)}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
            MTN
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-semibold">MTN Mobile Money</div>
            <div className="text-sm font-bold text-blue-950 font-mono truncate">{formatGnf(mtnMomoTotal)}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
            GNF
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-semibold">Espèces au Guichet</div>
            <div className="text-sm font-bold text-blue-950 font-mono truncate">{formatGnf(cashTotal)}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-semibold">Virements & Chèques</div>
            <div className="text-sm font-bold text-blue-950 font-mono truncate">{formatGnf(bankTotal)}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Payments & Recent Expenses / Debtors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Payments (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Derniers Encaissements Réalisés</span>
                </h2>
                <p className="text-xs text-slate-500">Transactions validées avec délivrance de quittance officielle</p>
              </div>
              <button
                onClick={() => setActiveAccountantTab('payments')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Voir tout ({payments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-blue-50/70 text-[10px] uppercase font-bold text-slate-500 border-b border-blue-100">
                  <tr>
                    <th className="py-2.5 px-3">Réf Reçu</th>
                    <th className="py-2.5 px-3">Élève & Classe</th>
                    <th className="py-2.5 px-3">Frais & Mode</th>
                    <th className="py-2.5 px-3 text-right">Montant Versé</th>
                    <th className="py-2.5 px-3 text-right">Solde Dû</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100 font-medium">
                  {payments.slice(0, 5).map(pay => (
                    <tr key={pay.id} className="hover:bg-blue-50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-mono text-emerald-600 font-bold">{pay.reference}</span>
                        <div className="text-[10px] text-slate-500 font-mono">{pay.date} · {pay.time}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-blue-950 truncate max-w-[150px]">{pay.studentName}</div>
                        <div className="text-[10px] text-slate-500 truncate">{pay.className}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="truncate max-w-[140px] text-slate-900">{pay.feeType}</div>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-50 text-slate-700 uppercase">
                          {pay.method.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                        {formatGnf(pay.amountPaidGnf)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        {pay.balanceRemainingGnf > 0 ? (
                          <span className="text-rose-600 font-semibold">{formatGnf(pay.balanceRemainingGnf)}</span>
                        ) : (
                          <span className="text-emerald-500 font-bold">Soldé (0 GNF)</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setSelectedReceiptPayment(pay)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold transition-colors"
                        >
                          Reçu →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Debtors Alert & Recent Expenses */}
        <div className="space-y-6">
          {/* Debtors Alert Card */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Alertes Impayés & Retards</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 font-mono">
                {debtors.length} dossiers
              </span>
            </div>

            <div className="space-y-3">
              {debtors.map(debtor => (
                <div 
                  key={debtor.studentId}
                  className="p-3 rounded-xl bg-blue-50/60 border border-rose-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950">{debtor.studentName}</span>
                    <span className="text-rose-600 font-mono font-bold">{formatGnf(debtor.balanceRemainingGnf)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{debtor.className}</span>
                    <span className="text-amber-700 font-mono">+{debtor.overdueDays} jours retard</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveAccountantTab('debtors')}
              className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Gérer les relances débiteurs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Expenses summary */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                <span>Dernières Dépenses Enregistrées</span>
              </h3>
              <button
                onClick={() => setActiveAccountantTab('expenses')}
                className="text-xs font-semibold text-slate-500 hover:text-blue-950"
              >
                Voir tout →
              </button>
            </div>

            <div className="space-y-2.5">
              {expenses.slice(0, 3).map(exp => (
                <div key={exp.id} className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate max-w-[170px]">{exp.title}</span>
                    <span className="font-mono font-bold text-rose-600">{formatGnf(exp.amountGnf)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{exp.beneficiary}</span>
                    <span className="font-mono">{exp.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
