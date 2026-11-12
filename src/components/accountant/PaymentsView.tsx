import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { PaymentRecord, PaymentMethod } from '../../types/accountant';
import { ReceiptModal } from './ReceiptModal';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  Landmark, 
  Coins, 
  ShieldAlert,
  Sparkles,
  Receipt
} from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { 
    payments, 
    addPayment, 
    cancelPayment, 
    fees, 
    formatGnf, 
    requirePinAction 
  } = useAccountant();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // New Payment Form State
  const [studentName, setStudentName] = useState('Mamadou Alpha Diallo');
  const [studentMatricule, setStudentMatricule] = useState('LEC-2026-001');
  const [className, setClassName] = useState('Terminale Sciences Mathématiques (TSM)');
  const [parentName, setParentName] = useState('M. Thierno Diallo');
  const [parentPhone, setParentPhone] = useState('+224 621 11 22 33');
  const [selectedFeeId, setSelectedFeeId] = useState(fees[0]?.id || '');
  const [customTotalFeeGnf, setCustomTotalFeeGnf] = useState<number>(fees[0]?.amountGnf || 2400000);
  const [amountPaidGnf, setAmountPaidGnf] = useState<number>(800000);
  const [method, setMethod] = useState<PaymentMethod>('orange_money');
  const [notes, setNotes] = useState('');

  const handleFeeChange = (feeId: string) => {
    setSelectedFeeId(feeId);
    const selected = fees.find(f => f.id === feeId);
    if (selected) {
      setCustomTotalFeeGnf(selected.amountGnf);
      setAmountPaidGnf(selected.amountGnf); // default full
    }
  };

  const remaining = Math.max(0, customTotalFeeGnf - amountPaidGnf);
  const percent = customTotalFeeGnf > 0 ? Math.min(100, Number(((amountPaidGnf / customTotalFeeGnf) * 100).toFixed(1))) : 0;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || amountPaidGnf <= 0) return;

    const chosenFee = fees.find(f => f.id === selectedFeeId);
    const feeTypeName = chosenFee ? chosenFee.name : 'Frais de Scolarité';

    const createdPayment = addPayment({
      studentId: `std-${Date.now()}`,
      studentName,
      studentMatricule,
      className,
      parentName,
      parentPhone,
      feeType: feeTypeName,
      totalFeeGnf: customTotalFeeGnf,
      amountPaidGnf,
      method,
      notes
    });

    setModalOpen(false);
    setSelectedReceipt(createdPayment);
  };

  const handleRequestCancel = (payment: PaymentRecord) => {
    requirePinAction({
      type: 'cancel_payment',
      id: payment.id,
      title: `Annulation du Reçu ${payment.reference} (${formatGnf(payment.amountPaidGnf)})`,
      callback: () => {
        cancelPayment(payment.id, 'Annulation autorisée par le Chef Comptable');
      }
    });
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal 
          payment={selectedReceipt} 
          onClose={() => setSelectedReceipt(null)} 
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>Gestion des Encaissements & Règlements</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enregistrement des paiements complets, partiels ou échelonnés avec calcul automatique du solde
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Encaisser un Paiement</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher par élève, parent, reçu..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tous modes' },
            { id: 'orange_money', label: 'Orange Money' },
            { id: 'mtn_momo', label: 'MTN MoMo' },
            { id: 'especes', label: 'Espèces' },
            { id: 'virement', label: 'Virement / Chèque' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMethodFilter(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                methodFilter === m.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 bg-slate-900 border border-slate-800 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Réf. Reçu</th>
              <th className="py-3 px-4">Élève & Classe</th>
              <th className="py-3 px-3">Parent / Contact</th>
              <th className="py-3 px-3">Mode & Frais</th>
              <th className="py-3 px-3 text-right">Versé</th>
              <th className="py-3 px-3 text-right">Reste Dû</th>
              <th className="py-3 px-3 text-center">Statut</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredPayments.map(payment => (
              <tr key={payment.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono text-emerald-400 font-bold">{payment.reference}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{payment.date} à {payment.time}</div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{payment.studentName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{payment.studentMatricule} · {payment.className}</div>
                </td>

                <td className="py-3 px-3">
                  <div className="text-slate-200">{payment.parentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{payment.parentPhone}</div>
                </td>

                <td className="py-3 px-3">
                  <div className="text-slate-300 truncate max-w-[150px]">{payment.feeType}</div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                    {payment.method.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                  {formatGnf(payment.amountPaidGnf)}
                </td>

                <td className="py-3 px-3 text-right font-mono">
                  {payment.balanceRemainingGnf > 0 ? (
                    <span className="text-rose-400 font-semibold">{formatGnf(payment.balanceRemainingGnf)}</span>
                  ) : (
                    <span className="text-emerald-500 font-bold">Soldé (0 GNF)</span>
                  )}
                </td>

                <td className="py-3 px-3 text-center">
                  {payment.status === 'valide' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Validé
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Annulé
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedReceipt(payment)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Voir le reçu officiel imprimable"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Reçu</span>
                    </button>

                    {payment.status === 'valide' && (
                      <button
                        onClick={() => handleRequestCancel(payment)}
                        className="px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                        title="Annuler ce paiement (Code PIN 6 chiffres requis)"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Record New Payment */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Encaisser un paiement & Délivrer un reçu</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleRecordPayment} className="flex-1 flex flex-col min-h-0 text-xs">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
              {/* Student info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nom complet de l'élève *</label>
                  <input 
                    type="text" 
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Matricule élève *</label>
                  <input 
                    type="text" 
                    required
                    value={studentMatricule}
                    onChange={e => setStudentMatricule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Classe *</label>
                  <input 
                    type="text" 
                    required
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mode de règlement *</label>
                  <select 
                    value={method}
                    onChange={e => setMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="orange_money">Orange Money Guinée</option>
                    <option value="mtn_momo">MTN Mobile Money</option>
                    <option value="especes">Espèces au guichet</option>
                    <option value="virement">Virement bancaire</option>
                    <option value="cheque">Chèque certifié</option>
                    <option value="carte">Carte bancaire</option>
                  </select>
                </div>
              </div>

              {/* Parent info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nom du Parent / Payeur *</label>
                  <input 
                    type="text" 
                    required
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Téléphone du Parent *</label>
                  <input 
                    type="text" 
                    required
                    value={parentPhone}
                    onChange={e => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Fee and Amount selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rubrique / Frais scolaire concerné *</label>
                <select 
                  value={selectedFeeId}
                  onChange={e => handleFeeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  {fees.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({formatGnf(f.amountGnf)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amounts and Live Calculation */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Montant Total du Frais (GNF)</label>
                    <input 
                      type="number" 
                      value={customTotalFeeGnf}
                      onChange={e => setCustomTotalFeeGnf(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 font-bold mb-1">Montant Versé Aujourd'hui (GNF) *</label>
                    <input 
                      type="number" 
                      required
                      min="1000"
                      value={amountPaidGnf}
                      onChange={e => setAmountPaidGnf(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-emerald-500/60 text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Solde Restant Dû : </span>
                    <strong className={remaining > 0 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                      {formatGnf(remaining)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Pourcentage payé : </span>
                    <strong className="text-white font-mono">{percent}%</strong>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observations / Référence transaction</label>
                <input 
                  type="text" 
                  placeholder="Ex: N° Transaction Orange Money OM-98214..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              </div>

              {/* Pinned Modal Footer */}
              <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Valider & Générer Reçu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
