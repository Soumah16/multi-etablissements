import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentTransaction, SubscriptionTierId } from '../../types';
import { 
  Coins, 
  Download, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Printer, 
  X,
  CreditCard,
  Send
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const RevenueView: React.FC = () => {
  const { transactions, schools, plans, createTransaction, updateTransactionStatus, t, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  // New Invoice Modal
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionTierId>('standard');
  const [invoiceAmountGnf, setInvoiceAmountGnf] = useState<number>(1500000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentTransaction['paymentMethod']>('Orange Money Guinée');
  const [notes, setNotes] = useState('');

  // Invoice Inspection / Printable View Modal
  const [viewingInvoice, setViewingInvoice] = useState<PaymentTransaction | null>(null);

  // Financial calculations
  const totalReceivedGnf = transactions
    .filter(t => t.status === 'payé')
    .reduce((acc, t) => acc + t.amountGnf, 0);

  const pendingAmountGnf = transactions
    .filter(t => t.status === 'en_attente')
    .reduce((acc, t) => acc + t.amountGnf, 0);

  const thisMonthGnf = transactions
    .filter(t => t.status === 'payé' && t.date.startsWith('2026-11'))
    .reduce((acc, t) => acc + t.amountGnf, 0);

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' GNF';
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || tx.paymentMethod === filterMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const school = schools.find(s => s.id === selectedSchoolId);
    if (!school) return;

    createTransaction({
      invoiceNumber: `FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      schoolId: school.id,
      schoolName: school.name,
      planId: selectedPlanId,
      amountGnf: Number(invoiceAmountGnf),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      paymentMethod,
      reference: `${paymentMethod.startsWith('Orange') ? 'OM' : paymentMethod.startsWith('MTN') ? 'MTN' : 'VIR'}-GN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: 'en_attente',
      notes: notes || `Facture abonnement ${selectedPlanId.toUpperCase()}`
    });

    setIsInvoiceModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ["Numero_Facture", "Etablissement", "Montant_GNF", "Date", "Methode_Paiement", "Statut", "Reference"];
    const rows = filteredTransactions.map(t => [
      t.invoiceNumber,
      `"${t.schoolName}"`,
      t.amountGnf,
      t.date,
      `"${t.paymentMethod}"`,
      t.status,
      t.reference
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartschool_rapport_revenus_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Rapport financier exporté au format CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.revenue.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.revenue.subtitle} · <span className="text-emerald-400 font-mono font-medium">Devise légale : Franc Guinéen (GNF)</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>{t.revenue.exportReport}</span>
          </button>

          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t.revenue.generateInvoice}</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cash In GNF */}
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <div className="text-xs text-slate-400">Total Encaissé (GNF)</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono tabular-nums truncate">
            {formatGnf(totalReceivedGnf)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Depuis le lancement de la plateforme
          </div>
        </div>

        {/* Current Month In GNF */}
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <div className="text-xs text-slate-400">Revenus Mois en Cours</div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono tabular-nums truncate">
            {formatGnf(thisMonthGnf)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            +18.5% vs mois précédent
          </div>
        </div>

        {/* Pending Invoices In GNF */}
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <div className="text-xs text-slate-400">En Attente de Règlement</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2 font-mono tabular-nums truncate">
            {formatGnf(pendingAmountGnf)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {transactions.filter(t => t.status === 'en_attente').length} factures en relance
          </div>
        </div>

        {/* Annual Projected In GNF */}
        <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <div className="text-xs text-slate-400">Revenus Annuels Projetés</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-2 font-mono tabular-nums truncate">
            {formatGnf(thisMonthGnf * 12)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            ARR estimé basé sur les actifs
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par numéro de facture, école, référence bancaire/OM..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tous les états</option>
          <option value="payé">Payé (Encaissé)</option>
          <option value="en_attente">En attente</option>
          <option value="échoué">Échoué</option>
        </select>

        <select
          value={filterMethod}
          onChange={e => setFilterMethod(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tous les modes de règlement</option>
          <option value="Orange Money Guinée">Orange Money Guinée</option>
          <option value="MTN Mobile Money">MTN Mobile Money</option>
          <option value="Virement bancaire">Virement bancaire</option>
          <option value="Carte bancaire">Carte bancaire</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">N° Facture</th>
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Montant (GNF)</th>
                <th className="py-3 px-4">Canal & Réf</th>
                <th className="py-3 px-4">Date Émission</th>
                <th className="py-3 px-4">État</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Aucune transaction financière ne correspond aux filtres.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                    {/* Invoice ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">
                      {tx.invoiceNumber}
                    </td>

                    {/* School */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{tx.schoolName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Plan: {tx.planId.toUpperCase()}
                      </div>
                    </td>

                    {/* Amount GNF */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                      {formatGnf(tx.amountGnf)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{tx.paymentMethod}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {tx.reference}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {tx.date}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        tx.status === 'payé' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : tx.status === 'en_attente'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {tx.status === 'payé' ? 'Payé' : tx.status === 'en_attente' ? 'En attente' : 'Échoué'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {tx.status === 'en_attente' && (
                          <button
                            onClick={() => updateTransactionStatus(tx.id, 'payé')}
                            className="px-2 py-1 text-[11px] rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                            title="Marquer comme payé"
                          >
                            Valider
                          </button>
                        )}

                        <button
                          onClick={() => setViewingInvoice(tx)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                          title="Visualiser et imprimer la facture"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Facture</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                Émettre une Facture d'Abonnement Plateforme
              </h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Établissement débiteur *</label>
                <select
                  value={selectedSchoolId}
                  onChange={e => setSelectedSchoolId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Formule *</label>
                  <select
                    value={selectedPlanId}
                    onChange={e => {
                      const pId = e.target.value as SubscriptionTierId;
                      setSelectedPlanId(pId);
                      const plan = plans.find(p => p.id === pId);
                      if (plan) setInvoiceAmountGnf(plan.priceMonthlyGnf);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Montant en Franc Guinéen (GNF) *</label>
                  <input
                    type="number"
                    required
                    value={invoiceAmountGnf}
                    onChange={e => setInvoiceAmountGnf(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Moyen de règlement prévu</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Orange Money Guinée">Orange Money Guinée</option>
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Virement bancaire">Virement bancaire (Vista Bank / BCRG / Ecobank)</option>
                  <option value="Carte bancaire">Carte bancaire internationale</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Objet / Remarques</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Abonnement trimestriel serveurs et passerelle SMS"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white rounded bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded"
                >
                  Générer la facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer / Printable View Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div id="invoice-printable-paper" className="relative w-full max-w-2xl rounded-xl bg-white text-slate-900 shadow-2xl p-8 overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                  S
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 uppercase">SmartSchool Technologies SARL</div>
                  <div className="text-[11px] text-slate-500">Immeuble Palm Camayenne, Conakry, République de Guinée</div>
                </div>
              </div>
              <button
                onClick={() => setViewingInvoice(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Meta */}
            <div className="mt-6 flex justify-between items-start text-xs">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Facturé à :</div>
                <div className="font-bold text-sm text-slate-900 mt-1">{viewingInvoice.schoolName}</div>
                <div className="text-slate-600 mt-0.5">Identifiant Établissement : {viewingInvoice.schoolId}</div>
              </div>

              <div className="text-right">
                <div className="text-lg font-extrabold text-blue-600 font-mono">{viewingInvoice.invoiceNumber}</div>
                <div className="text-slate-500 mt-0.5">Date : {viewingInvoice.date}</div>
                <div className="text-slate-500">Échéance : {viewingInvoice.dueDate}</div>
              </div>
            </div>

            {/* Line items */}
            <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Désignation</th>
                    <th className="py-2.5 px-3 text-left">Canal</th>
                    <th className="py-2.5 px-3 text-right">Montant (GNF)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="py-3 px-3">
                      <div className="font-semibold">Licence SaaS SmartSchool - Formule {viewingInvoice.planId.toUpperCase()}</div>
                      <div className="text-[11px] text-slate-500">{viewingInvoice.notes || 'Hébergement, maintenance et accès portails'}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {viewingInvoice.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatGnf(viewingInvoice.amountGnf)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total box */}
            <div className="mt-4 flex justify-between items-center p-3 rounded-lg bg-slate-100">
              <div className="text-xs text-slate-600 font-medium">
                Statut du règlement : <strong className={viewingInvoice.status === 'payé' ? 'text-emerald-600' : 'text-amber-600'}>
                  {viewingInvoice.status.toUpperCase()}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 mr-2">Total TTC :</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {formatGnf(viewingInvoice.amountGnf)}
                </span>
              </div>
            </div>

            {/* Official seal & signature */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
              <div>
                <div>Mode de versement : {viewingInvoice.paymentMethod}</div>
                <div>Référence transaction : {viewingInvoice.reference}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-800">La Direction Générale</div>
                <div className="text-[10px] text-slate-400 mt-1 italic">Signature électronique certifiée SmartSchool</div>
              </div>
            </div>

            {/* Print button */}
            <div className="mt-6 flex justify-end gap-2 no-print">
              <button
                onClick={() => triggerPrint('invoice-printable-paper', `Facture_${viewingInvoice.invoiceNumber}`)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer la Facture / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
