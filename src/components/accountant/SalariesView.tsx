import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { SalaryRecord } from '../../types/accountant';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Search,
  Sparkles,
  QrCode,
  X
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const SalariesView: React.FC = () => {
  const { salaries, paySalary, formatGnf, profile } = useAccountant();
  const [selectedPayslip, setSelectedPayslip] = useState<SalaryRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const totalPayrollGnf = salaries.reduce((sum, s) => sum + s.netSalaryGnf, 0);

  const filteredSalaries = salaries.filter(s => 
    s.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.payslipRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-6 text-blue-950">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <span className="font-bold text-sm text-slate-900">Bulletin de Paie Officiel</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerPrint('payslip-printable-paper', `Bulletin_Paie_${selectedPayslip.employeeName.replace(/\s+/g, '_')}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="text-slate-500 hover:text-blue-950 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div id="payslip-printable-paper" className="bg-white text-slate-900 p-8 rounded-xl border border-slate-300 font-sans space-y-6 print:border-none print:shadow-none print:p-0">
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-700 uppercase">RÉPUBLIQUE DE GUINÉE</div>
                  <div className="text-base font-black text-blue-900">{profile.schoolName}</div>
                  <div className="text-[9px] text-slate-600 font-mono">Service Comptabilité & Ressources Humaines</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900">BULLETIN DE PAIE</div>
                  <div className="text-[10px] font-mono text-slate-600">Réf : {selectedPayslip.payslipRef}</div>
                  <div className="text-[10px] text-indigo-700 font-bold">Période : {selectedPayslip.month}</div>
                </div>
              </div>

              {/* Employee info */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Salarié</div>
                  <div className="font-extrabold text-sm text-slate-900">{selectedPayslip.employeeName}</div>
                  <div className="text-[10px] text-slate-600">Fonction : <strong>{selectedPayslip.role}</strong></div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Paiement</div>
                  <div className="font-semibold text-slate-800">Date : {selectedPayslip.paymentDate}</div>
                  <div className="text-[10px] text-slate-600">Mode : <strong className="uppercase font-mono">{selectedPayslip.paymentMethod}</strong></div>
                </div>
              </div>

              {/* Salary lines */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-blue-950 font-bold text-[10px] uppercase">
                      <th className="py-2 px-3">Rubrique</th>
                      <th className="py-2 px-3 text-right">Gains (GNF)</th>
                      <th className="py-2 px-3 text-right">Retenues (GNF)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-2 px-3">Salaire de Base Conventionnel</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">{formatGnf(selectedPayslip.baseSalaryGnf)}</td>
                      <td className="py-2 px-3 text-right font-mono">-</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Primes de fonction & assiduité</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-700">+{formatGnf(selectedPayslip.bonusGnf)}</td>
                      <td className="py-2 px-3 text-right font-mono">-</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Cotisations CNSS & Retenues légales</td>
                      <td className="py-2 px-3 text-right font-mono">-</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-rose-700">-{formatGnf(selectedPayslip.deductionsGnf)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net to pay */}
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-indigo-900 font-black block text-sm">
                    NET À PAYER :
                  </span>
                  <span className="text-[10px] text-indigo-700 font-mono">Virement certifié conforme</span>
                </div>
                <div className="text-xl font-black font-mono text-indigo-900">
                  {formatGnf(selectedPayslip.netSalaryGnf)}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <div>Visa du Salarié</div>
                <div className="text-right">
                  <div>Le Chef Comptable</div>
                  <div className="font-bold text-slate-800">{profile.firstName} {profile.lastName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Gestion de la Paie & Salaires du Personnel</span>
          </h1>
          <p className="text-xs text-slate-500">
            Calcul des salaires bruts, primes, retenues CNSS et édition des fiches de paie certifiées
          </p>
        </div>

        <button
          onClick={() => triggerPrint('salaries-table-printable', 'Etat_Des_Salaires')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Imprimer État des Salaires</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold text-slate-500">Masse Salariale Mensuelle Totale</span>
          <div className="text-2xl md:text-3xl font-black font-mono text-indigo-600">
            {formatGnf(totalPayrollGnf)}
          </div>
          <div className="text-xs text-slate-500">Pour {salaries.length} employés sous contrat régulier</div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher par employé ou poste..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Salaries Table */}
      <div id="salaries-table-printable" className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-xl">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-blue-50/70 text-[10px] uppercase font-bold text-slate-500 border-b border-blue-100">
            <tr>
              <th className="py-3 px-4">Salarié & Rôle</th>
              <th className="py-3 px-3">Mois</th>
              <th className="py-3 px-3 text-right">Salaire Base</th>
              <th className="py-3 px-3 text-right">Primes</th>
              <th className="py-3 px-3 text-right">Retenues</th>
              <th className="py-3 px-3 text-right">Salaire Net</th>
              <th className="py-3 px-3 text-center">Statut</th>
              <th className="py-3 px-4 text-center">Fiche de Paie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 font-medium">
            {filteredSalaries.map(sal => (
              <tr key={sal.id} className="hover:bg-blue-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-blue-950 text-xs">{sal.employeeName}</div>
                  <span className="text-[10px] text-slate-500">{sal.role}</span>
                </td>

                <td className="py-3 px-3 font-mono text-slate-700">
                  {sal.month}
                </td>

                <td className="py-3 px-3 text-right font-mono text-slate-700">
                  {formatGnf(sal.baseSalaryGnf)}
                </td>

                <td className="py-3 px-3 text-right font-mono text-emerald-600">
                  +{formatGnf(sal.bonusGnf)}
                </td>

                <td className="py-3 px-3 text-right font-mono text-rose-600">
                  -{formatGnf(sal.deductionsGnf)}
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-indigo-700 text-sm">
                  {formatGnf(sal.netSalaryGnf)}
                </td>

                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Payé ✓
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => setSelectedPayslip(sal)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Bulletin</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
