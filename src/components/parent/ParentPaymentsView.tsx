import React, { useState } from 'react';
import { useParent } from '../../context/ParentContext';
import { ParentPaymentItem } from '../../types/parent';
import { triggerPrint, exportPrintableDocument } from '../../utils/printHelper';
import { 
  CreditCard, 
  Smartphone, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  ShieldCheck,
  Plus
} from 'lucide-react';

export const ParentPaymentsView: React.FC = () => {
  const { payments, selectedChild, formatGnf, initiateMobilePayment } = useParent();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalPayment, setReceiptModalPayment] = useState<ParentPaymentItem | null>(null);

  // Form state
  const [feeType, setFeeType] = useState('2ème Tranche Scolarité');
  const [amount, setAmount] = useState(700000);
  const [method, setMethod] = useState<'Orange Money' | 'MTN MoMo'>('Orange Money');
  const [phone, setPhone] = useState('622 11 22 33');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    initiateMobilePayment(selectedChild.id, feeType, amount, method, phone);
    setPaymentModalOpen(false);
  };

  const childPayments = payments.filter(p => p.childMatricule === selectedChild.matricule || p.childName.includes(selectedChild.firstName));
  const totalPaid = childPayments.reduce((acc, p) => p.status === 'paye' ? acc + p.amountGnf : acc, 0);

  return (
    <div className="space-y-6">
      {/* Header & Pay Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Trésorerie & Scolarité (GNF)
            </span>
            <span className="text-xs text-slate-500">Élève : {selectedChild.firstName} {selectedChild.lastName} ({selectedChild.className})</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950 mt-1">Historique des Paiements & Reçus Officiels</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Paiements sécurisés Orange Money & MTN MoMo, téléchargement des reçus avec QR Code de certification.
          </p>
        </div>

        <button
          onClick={() => setPaymentModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Smartphone className="w-4 h-4" />
          <span>Effectuer un Paiement Mobile</span>
        </button>
      </div>

      {/* Financial Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="text-[11px] text-slate-500 font-semibold">Total Déjà Réglé</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{formatGnf(totalPaid)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{childPayments.length} versements enregistrés</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="text-[11px] text-slate-500 font-semibold">Solde Restant à Régler</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{formatGnf(selectedChild.feesDueGnf)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Échéance finale : 30 Nov 2026</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="text-[11px] text-slate-500 font-semibold">Canaux Disponibles</div>
          <div className="text-sm font-bold text-blue-950 mt-2 flex items-center gap-2">
            <span className="text-orange-600">Orange Money (*144#)</span>
            <span>·</span>
            <span className="text-amber-700">MTN MoMo (*440#)</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">Reçu instantané sans déplacement</div>
        </div>
      </div>

      {/* Payments History Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-blue-100 text-[11px] text-slate-500 uppercase font-semibold bg-blue-50/60">
                <th className="py-3 px-4">N° de Reçu</th>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Libellé du Frais</th>
                <th className="py-3 px-4">Mode de Règlement</th>
                <th className="py-3 px-4">Réf. Transaction</th>
                <th className="py-3 px-4">Montant (GNF)</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Reçu PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {childPayments.map(pay => (
                <tr key={pay.id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 text-xs">
                    {pay.receiptNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{pay.date}</td>
                  <td className="py-3 px-4 font-medium text-blue-950">{pay.feeType}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
                      {pay.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{pay.transactionRef}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 text-xs">
                    {formatGnf(pay.amountGnf)}
                  </td>
                  <td className="py-3 px-4">
                    {pay.status === 'paye' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Validé</span>
                      </span>
                    )}
                    {pay.status === 'en_attente' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setReceiptModalPayment(pay)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      Voir Reçu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt Modal (Reçu de Paiement Imprimable) */}
      {receiptModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-950">Reçu Officiel d'Encaissement Scolaire</h3>
              <button
                onClick={() => setReceiptModalPayment(null)}
                className="text-xs text-slate-500 hover:text-blue-950"
              >
                Fermer
              </button>
            </div>

            {/* Printable Paper Voucher */}
            <div 
              id="parent-receipt-printable"
              className="p-5 rounded-xl bg-white text-slate-950 font-serif border-2 border-slate-200 shadow-lg space-y-3 printable-document"
            >
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 font-sans">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-600">LYCÉE D'EXCELLENCE DE CONAKRY</div>
                  <div className="text-sm font-black text-slate-900">REÇU DE CAISSE SCOLAIRE</div>
                  <div className="text-[10px] text-slate-500">Service Comptabilité & Finances</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-blue-800">{receiptModalPayment.receiptNumber}</div>
                  <div className="text-[10px] text-slate-500">{receiptModalPayment.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-sans py-2 border-b border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">Élève bénéficiaire :</span>
                  <strong>{receiptModalPayment.childName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Matricule :</span>
                  <strong className="font-mono">{receiptModalPayment.childMatricule}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Motif de versement :</span>
                  <strong>{receiptModalPayment.feeType}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Canal / Opérateur :</span>
                  <strong>{receiptModalPayment.method}</strong>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-100 font-sans flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700">Montant Encaissé :</span>
                <span className="text-base font-black text-slate-950 font-mono">
                  {formatGnf(receiptModalPayment.amountGnf)}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] font-sans text-slate-500 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-8 h-8 text-slate-800" />
                  <div>
                    <div className="font-mono text-slate-900">Réf : {receiptModalPayment.transactionRef}</div>
                    <div>Signature électronique horodatée</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>Le Chef Comptable</div>
                  <div className="font-bold text-slate-900">M. Ibrahima Kalil Camara</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('parent-receipt-printable');
                  if (el) {
                    exportPrintableDocument(`Recu_${receiptModalPayment.receiptNumber}`, el.innerHTML);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Télécharger</span>
              </button>
              <button
                onClick={() => triggerPrint('parent-receipt-printable')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer le reçu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Initiation Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-blue-950">Nouveau Paiement Mobile Money</h3>
            <p className="text-xs text-slate-500">
              Paiement instantané en Francs Guinéens (GNF) pour <strong>{selectedChild.firstName} {selectedChild.lastName}</strong>.
            </p>

            <form onSubmit={handlePay} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Frais à régler</label>
                <select
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                >
                  <option value="2ème Tranche Scolarité">2ème Tranche Scolarité (700 000 GNF)</option>
                  <option value="3ème Tranche Scolarité">3ème Tranche Scolarité (800 000 GNF)</option>
                  <option value="Cantine Mensuelle">Cantine Mensuelle (350 000 GNF)</option>
                  <option value="Transport Bus Conakry">Transport Bus Conakry (200 000 GNF)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Montant (GNF)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Opérateur</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('Orange Money')}
                    className={`p-2.5 rounded-lg border text-xs font-bold cursor-pointer ${
                      method === 'Orange Money' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Orange Money (*144#)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('MTN MoMo')}
                    className={`p-2.5 rounded-lg border text-xs font-bold cursor-pointer ${
                      method === 'MTN MoMo' ? 'bg-amber-100 border-amber-500 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    MTN MoMo (*440#)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Numéro de Téléphone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="622 00 00 00"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer"
                >
                  Lancer le paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
