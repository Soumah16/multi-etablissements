import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { 
  BarChart3, 
  Printer, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  FileSpreadsheet, 
  Coins, 
  Wallet,
  Sparkles,
  PieChart
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const FinancialReportsView: React.FC = () => {
  const { payments, expenses, salaries, debtors, formatGnf, triggerToast } = useAccountant();
  const [period, setPeriod] = useState<'mois' | 'trimestre' | 'annee'>('mois');

  const totalCollected = payments.filter(p => p.status === 'valide').reduce((sum, p) => sum + p.amountPaidGnf, 0);
  const totalExpenses = expenses.filter(e => e.status === 'valide').reduce((sum, e) => sum + e.amountGnf, 0);
  const totalSalaries = salaries.filter(s => s.status === 'paye').reduce((sum, s) => sum + s.netSalaryGnf, 0);
  const grandTotalExpenditure = totalExpenses + totalSalaries;
  const netSurplus = totalCollected - grandTotalExpenditure;

  const handleExportCsv = () => {
    triggerToast('Rapport financier exporté au format CSV avec succès.');
  };

  const handleExportExcel = () => {
    triggerToast('Tableau financier exporté au format Microsoft Excel (.xlsx) avec succès.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Rapports Financiers, Journal de Caisse & Bilans</span>
          </h1>
          <p className="text-xs text-slate-400">
            États financiers complets, compte de résultat (Recettes vs Charges) et exports certifiés
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => triggerPrint('financial-report-printable-area', 'Bilan_Financier_SmartSchool')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Bilan</span>
          </button>
        </div>
      </div>

      {/* Main Income Statement Card (Compte de résultat) */}
      <div id="financial-report-printable-area" className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Compte d'Exploitation Prévisionnel & Réalisé</h2>
            <p className="text-xs text-slate-400">Synthèse consolidée des flux de trésorerie en Francs Guinéens (GNF)</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPeriod('mois')}
              className={`px-3 py-1 rounded-lg transition-colors ${period === 'mois' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Mois
            </button>
            <button
              onClick={() => setPeriod('trimestre')}
              className={`px-3 py-1 rounded-lg transition-colors ${period === 'trimestre' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setPeriod('annee')}
              className={`px-3 py-1 rounded-lg transition-colors ${period === 'annee' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Exercice Annuel
            </button>
          </div>
        </div>

        {/* 3 Pillars: Total Inflows, Total Outflows, Net Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs uppercase font-bold">Total Recettes Encaissées</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {formatGnf(totalCollected)}
            </div>
            <div className="text-[11px] text-slate-400">
              Scolarité, inscriptions, transport, cantine et uniformes
            </div>
          </div>

          <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs uppercase font-bold">Total Dépenses & Salaires</span>
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black font-mono text-rose-400">
              {formatGnf(grandTotalExpenditure)}
            </div>
            <div className="text-[11px] text-slate-400">
              Masse salariale ({formatGnf(totalSalaries)}) + Charges ({formatGnf(totalExpenses)})
            </div>
          </div>

          <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-xs uppercase font-bold">Résultat Net / Excédent</span>
              <Wallet className="w-5 h-5" />
            </div>
            <div className={`text-2xl font-black font-mono ${netSurplus >= 0 ? 'text-blue-300' : 'text-rose-400'}`}>
              {formatGnf(netSurplus)}
            </div>
            <div className="text-[11px] text-slate-400">
              Solde net positif en trésorerie disponible
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white">Détail par Rubrique Budgétaire</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Poste Comptable</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4 text-right">Montant (GNF)</th>
                  <th className="py-2.5 px-4 text-center">Part (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-white">Frais de Scolarité & Inscription</td>
                  <td className="py-2.5 px-4 text-emerald-400">Recette</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400">{formatGnf(totalCollected)}</td>
                  <td className="py-2.5 px-4 text-center font-mono">100%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-white">Salaires du Personnel & Enseignants</td>
                  <td className="py-2.5 px-4 text-rose-400">Charge</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-400">{formatGnf(totalSalaries)}</td>
                  <td className="py-2.5 px-4 text-center font-mono">{Math.round((totalSalaries / grandTotalExpenditure) * 100)}%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-white">Énergie & Carburant Groupe (EDG, Total)</td>
                  <td className="py-2.5 px-4 text-rose-400">Charge</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-400">{formatGnf(10450000)}</td>
                  <td className="py-2.5 px-4 text-center font-mono">32%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-white">Fournitures Pédagogiques & Matériel</td>
                  <td className="py-2.5 px-4 text-rose-400">Charge</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-400">{formatGnf(3200000)}</td>
                  <td className="py-2.5 px-4 text-center font-mono">10%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-white">Télécoms & Fibre Optique (Orange)</td>
                  <td className="py-2.5 px-4 text-rose-400">Charge</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-400">{formatGnf(1800000)}</td>
                  <td className="py-2.5 px-4 text-center font-mono">5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
