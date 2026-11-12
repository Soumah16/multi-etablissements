import React from 'react';
import { PaymentRecord } from '../../types/accountant';
import { useAccountant } from '../../context/AccountantContext';
import { Printer, X, QrCode, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface ReceiptModalProps {
  payment: PaymentRecord;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  const { formatGnf, profile } = useAccountant();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-6 text-white">
        {/* Actions bar at top */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-sm text-slate-200">Reçu Officiel d'Encaissement</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerPrint('receipt-paper-printable', `Recu_Paiement_${payment.reference}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le reçu</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="receipt-paper-printable" className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border-2 border-slate-200 font-sans space-y-6 print:border-none print:shadow-none print:p-0">
          {/* Header MEPU-A */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-700">
                RÉPUBLIQUE DE GUINÉE
              </div>
              <div className="text-[9px] font-semibold text-slate-600 italic">
                Travail - Justice - Solidarité
              </div>
              <div className="text-[10px] font-bold text-slate-800 uppercase mt-1">
                MEPU-A · Enseignement Pré-Universitaire
              </div>
              <div className="text-sm font-black text-blue-900 tracking-tight mt-1">
                {profile.schoolName}
              </div>
              <div className="text-[9px] text-slate-600 font-mono">
                Commune de Ratoma, Conakry · Tél : +224 624 88 99 00
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="px-3 py-1 rounded bg-slate-100 border border-slate-300 font-mono text-xs font-black text-slate-900 inline-block">
                QUITTANCE N° {payment.reference}
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                Date : <strong>{payment.date}</strong> à {payment.time}
              </div>
              <div className="text-[9px] font-bold text-emerald-700 uppercase">
                {payment.status === 'valide' ? 'Paiement Validé & Encaissé ✓' : 'Statut : ' + payment.status}
              </div>
            </div>
          </div>

          {/* Student & Parent Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500">Bénéficiaire (Élève)</div>
              <div className="text-sm font-extrabold text-slate-900">{payment.studentName}</div>
              <div className="text-[11px] font-mono text-slate-600">Matricule : {payment.studentMatricule}</div>
              <div className="text-[11px] text-slate-700">Classe : <strong>{payment.className}</strong></div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500">Payeur (Parent / Tuteur)</div>
              <div className="text-sm font-bold text-slate-900">{payment.parentName}</div>
              <div className="text-[11px] text-slate-600 font-mono">Contact : {payment.parentPhone}</div>
              <div className="text-[11px] text-slate-700">Mode : <strong className="uppercase font-mono">{payment.method.replace('_', ' ')}</strong></div>
            </div>
          </div>

          {/* Payment Table */}
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white font-bold text-[10px] uppercase">
                <th className="py-2 px-3">Désignation du Frais</th>
                <th className="py-2 px-3 text-right">Montant Total</th>
                <th className="py-2 px-3 text-right">Montant Versé</th>
                <th className="py-2 px-3 text-right">Solde Restant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="font-semibold text-slate-800">
                <td className="py-3 px-3">
                  <div>{payment.feeType}</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">{payment.notes}</div>
                </td>
                <td className="py-3 px-3 text-right font-mono">{formatGnf(payment.totalFeeGnf)}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 text-sm">
                  {formatGnf(payment.amountPaidGnf)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-rose-700">
                  {formatGnf(payment.balanceRemainingGnf)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary Box */}
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-emerald-900 font-bold block">
                Total Encaissé en Francs Guinéens (GNF) :
              </span>
              <span className="text-[11px] text-emerald-800 font-medium">
                Type de paiement : {payment.paymentType === 'total' ? 'Paiement Intégral (Solde 100%)' : 'Paiement Partiel / Échelonné (' + payment.percentagePaid + '%)'}
              </span>
            </div>
            <div className="text-lg font-black font-mono text-emerald-800">
              {formatGnf(payment.amountPaidGnf)}
            </div>
          </div>

          {/* Footer: Signatures & QR Code */}
          <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-between text-xs">
            {/* QR Code */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg border border-slate-300 bg-white">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
              <div className="text-[9px] text-slate-500 space-y-0.5 max-w-[180px]">
                <div className="font-bold text-slate-800">VÉRIFICATION D'AUTHENTICITÉ</div>
                <div className="font-mono text-[8px] break-all">{payment.qrCodeToken}</div>
                <div className="text-emerald-700 font-semibold">Certifié SmartSchool ERP</div>
              </div>
            </div>

            {/* Stamp & Signatures */}
            <div className="text-right space-y-1">
              <div className="text-[10px] text-slate-600">Le Chef Comptable & Caissier :</div>
              <div className="font-black text-slate-900 text-xs">{payment.cashierName}</div>
              <div className="inline-block px-3 py-1 rounded-full border border-blue-400 bg-blue-50 text-blue-900 font-mono text-[9px] font-bold">
                [Visa & Cachet Trésorerie]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
