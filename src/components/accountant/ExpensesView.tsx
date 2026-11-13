import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { ExpenseRecord, ExpenseCategory, PaymentMethod } from '../../types/accountant';
import { ImageUploadField } from '../common/ImageUploadField';
import { 
  ArrowDownRight, 
  Plus, 
  Search, 
  FileText, 
  Printer, 
  Calendar, 
  Tag, 
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, formatGnf, profile } = useAccountant();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('fournitures');
  const [amountGnf, setAmountGnf] = useState<number>(1500000);
  const [beneficiary, setBeneficiary] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [description, setDescription] = useState('');
  const [proofDocumentUrl, setProofDocumentUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('especes');

  const totalExpenses = expenses
    .filter(e => e.status === 'valide')
    .reduce((sum, e) => sum + e.amountGnf, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amountGnf <= 0) return;

    addExpense({
      category,
      title,
      amountGnf,
      beneficiary: beneficiary.trim() || 'Fournisseur externe',
      date,
      description,
      proofDocumentUrl: proofDocumentUrl.trim() || undefined,
      paymentMethod,
      approvedBy: `${profile.firstName} ${profile.lastName}`
    });

    setModalOpen(false);
    setTitle('');
    setBeneficiary('');
    setDescription('');
    setProofDocumentUrl('');
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.beneficiary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <ArrowDownRight className="w-6 h-6 text-rose-600" />
            <span>Gestion des Dépenses & Charges Opérationnelles</span>
          </h1>
          <p className="text-xs text-slate-500">
            Suivi des factures d'énergie, fournitures, maintenance, internet et pièces justificatives
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer une Dépense</span>
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-slate-500">Total des Dépenses Exécutées</span>
          <div className="text-2xl md:text-3xl font-black font-mono text-rose-600 mt-1">
            {formatGnf(totalExpenses)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Toutes catégories confondues pour l'exercice en cours</div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'electricite', label: 'Électricité' },
            { id: 'internet', label: 'Internet' },
            { id: 'fournitures', label: 'Fournitures' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'salaires', label: 'Salaires' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === c.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-50 text-slate-500 hover:text-blue-950'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-xl">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-blue-50/70 text-[10px] uppercase font-bold text-slate-500 border-b border-blue-100">
            <tr>
              <th className="py-3 px-4">Réf. / Date</th>
              <th className="py-3 px-4">Libellé & Catégorie</th>
              <th className="py-3 px-3">Bénéficiaire</th>
              <th className="py-3 px-3 text-right">Montant (GNF)</th>
              <th className="py-3 px-3">Mode</th>
              <th className="py-3 px-3 text-center">Justificatif</th>
              <th className="py-3 px-4 text-center">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 font-medium">
            {filteredExpenses.map(expense => (
              <tr key={expense.id} className="hover:bg-blue-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono text-rose-600 font-bold">{expense.reference}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{expense.date}</div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-blue-950 text-xs">{expense.title}</div>
                  <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-50 text-slate-500">
                    {expense.category}
                  </span>
                </td>

                <td className="py-3 px-3 text-slate-700 font-semibold">
                  {expense.beneficiary}
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 text-sm">
                  {formatGnf(expense.amountGnf)}
                </td>

                <td className="py-3 px-3">
                  <span className="text-[10px] font-mono uppercase text-slate-700">
                    {expense.paymentMethod.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-3 px-3 text-center">
                  {expense.proofDocumentUrl ? (
                    <a
                      href={expense.proofDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 underline font-semibold"
                    >
                      <span>Facture</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600 text-[10px]">Non joint</span>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Payé ✓
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Expense */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white border border-blue-100 shadow-2xl overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="px-5 py-3.5 border-b border-blue-100 flex items-center justify-between shrink-0 bg-white">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                <span>Enregistrer une nouvelle dépense</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-blue-950 p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 text-xs">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Libellé / Titre de la dépense *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Facture d'électricité EDG Campus Kipé - Octobre"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Catégorie *</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  >
                    <option value="electricite">Électricité (EDG)</option>
                    <option value="internet">Internet & Télécoms</option>
                    <option value="fournitures">Fournitures & Manuels</option>
                    <option value="maintenance">Maintenance & Carburant</option>
                    <option value="transport">Transport & Révision Bus</option>
                    <option value="cantine">Achats Cantine</option>
                    <option value="equipements">Équipements & Mobilier</option>
                    <option value="salaires">Salaires & Vacations</option>
                    <option value="charges_diverses">Charges diverses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Montant en GNF *</label>
                  <input 
                    type="number" 
                    required
                    min="1000"
                    step="50000"
                    value={amountGnf}
                    onChange={e => setAmountGnf(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bénéficiaire / Fournisseur *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: EDG, Orange, Station Total..."
                    value={beneficiary}
                    onChange={e => setBeneficiary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date d'engagement *</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mode de règlement *</label>
                <select 
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                >
                  <option value="especes">Espèces</option>
                  <option value="virement">Virement bancaire</option>
                  <option value="cheque">Chèque certifié</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="mtn_momo">MTN Mobile Money</option>
                </select>
              </div>

              {/* Justificatif / Facture with ImageUploadField (URL + PC file import) */}
              <ImageUploadField
                label="Pièce justificative / Reçu de dépense"
                value={proofDocumentUrl}
                onChange={setProofDocumentUrl}
                helperText="Vous pouvez importer un scan de facture depuis votre PC ou insérer une URL."
              />

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description & Justification</label>
                <textarea 
                  rows={2}
                  placeholder="Détails complémentaires sur la prestation ou les fournitures achetées..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-rose-500"
                />
              </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="px-5 py-3 border-t border-blue-100 bg-white flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-blue-950 bg-slate-50 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
                >
                  Enregistrer la Dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
