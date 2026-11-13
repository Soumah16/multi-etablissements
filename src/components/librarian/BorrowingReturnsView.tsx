import React, { useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import { LoanRecord } from '../../types/librarian';
import { 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  FileWarning, 
  QrCode, 
  ShieldAlert,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';

export const BorrowingReturnsView: React.FC = () => {
  const { loans, books, returnBook, renewLoan, declareLost, declareDamaged, formatGnf, showToast } = useLibrarian();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modals
  const [damagedModalLoan, setDamagedModalLoan] = useState<LoanRecord | null>(null);
  const [damageFine, setDamageFine] = useState<number>(50000);
  const [lostModalLoan, setLostModalLoan] = useState<LoanRecord | null>(null);
  const [lostFine, setLostFine] = useState<number>(150000);

  const statuses = [
    { key: 'all', label: 'Tous les prêts' },
    { key: 'en_cours', label: 'En cours' },
    { key: 'en_retard', label: 'En retard' },
    { key: 'retourne', label: 'Retournés' },
    { key: 'perdu', label: 'Déclarés perdus' },
    { key: 'degrade', label: 'Dégradés' }
  ];

  const filteredLoans = loans.filter(l => {
    const matchesSearch = l.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      l.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
      l.borrowerMatricule.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmDamage = () => {
    if (!damagedModalLoan) return;
    declareDamaged(damagedModalLoan.id, damageFine);
    setDamagedModalLoan(null);
  };

  const handleConfirmLost = () => {
    if (!lostModalLoan) return;
    declareLost(lostModalLoan.id, lostFine);
    setLostModalLoan(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">Gestion des Emprunts & des Retours</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des rotations d'ouvrages, relances retards, renouvellements et gestion des pénalités GNF.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par élève, matricule ou titre du livre..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-blue-100 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statuses.map(st => (
            <button
              key={st.key}
              onClick={() => setSelectedStatus(st.key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === st.key 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-white hover:bg-blue-50 text-slate-500 border border-blue-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loans Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-blue-100 text-[11px] text-slate-500 uppercase font-semibold bg-blue-50/60">
                <th className="py-3 px-4">Ouvrage & Titre</th>
                <th className="py-3 px-4">Bénéficiaire</th>
                <th className="py-3 px-4">Dates Prêt / Échéance</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Renouvellements</th>
                <th className="py-3 px-4">Pénalité / Amende</th>
                <th className="py-3 px-4 text-right">Actions Opérationnelles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredLoans.map(loan => {
                const isOverdue = loan.status === 'en_retard';
                return (
                  <tr key={loan.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-blue-950 text-xs">{loan.bookTitle}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {loan.bookId}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{loan.borrowerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] text-indigo-600">{loan.borrowerMatricule}</span>
                        <span>·</span>
                        <span>{loan.borrowerRole} {loan.borrowerClass ? `(${loan.borrowerClass})` : ''}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-700">Du : {loan.borrowDate}</div>
                      <div className={`font-mono mt-0.5 ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                        Au : {loan.dueDate}
                      </div>
                      {loan.returnDate && (
                        <div className="text-[10px] text-emerald-600 mt-0.5">
                          Rendu le : {loan.returnDate}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {loan.status === 'en_cours' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          En cours
                        </span>
                      )}
                      {loan.status === 'en_retard' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                          En retard
                        </span>
                      )}
                      {loan.status === 'retourne' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Retourné
                        </span>
                      )}
                      {loan.status === 'perdu' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-900/40 text-red-700 border border-red-200">
                          Perdu
                        </span>
                      )}
                      {loan.status === 'degrade' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-900/40 text-orange-700 border border-orange-200">
                          Dégradé
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-xs font-mono text-slate-700">
                        {loan.renewCount} fois
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {loan.fineGnf > 0 ? (
                        <span className="font-bold text-rose-600 font-mono text-xs">
                          {formatGnf(loan.fineGnf)}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">0 GNF</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {loan.status === 'en_cours' || loan.status === 'en_retard' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => returnBook(loan.id)}
                            className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-[11px] font-semibold transition-all cursor-pointer"
                            title="Valider le retour physique du livre"
                          >
                            Retour
                          </button>
                          <button
                            onClick={() => renewLoan(loan.id)}
                            className="p-1 rounded bg-slate-50 hover:bg-blue-100 text-slate-700 hover:text-blue-950 border border-slate-200 transition-colors cursor-pointer"
                            title="Prolonger de 14 jours"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDamagedModalLoan(loan);
                              setDamageFine(50000);
                            }}
                            className="p-1 rounded bg-amber-50 hover:bg-amber-50 text-amber-700 transition-colors cursor-pointer"
                            title="Déclarer une dégradation"
                          >
                            <FileWarning className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setLostModalLoan(loan);
                              setLostFine(150000);
                            }}
                            className="p-1 rounded bg-rose-50 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                            title="Déclarer comme livre perdu"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">Dossier archivé</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dégradation */}
      {damagedModalLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-amber-700">
              <FileWarning className="w-5 h-5" />
              <h3 className="text-base font-bold text-blue-950">Constat de Dégradation</h3>
            </div>
            <p className="text-xs text-slate-500">
              L'ouvrage « <strong>{damagedModalLoan.bookTitle}</strong> » rendu par <strong>{damagedModalLoan.borrowerName}</strong> présente des pages arrachées, annotées ou une couverture détériorée.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-700">Amende de restauration (GNF) :</label>
              <input
                type="number"
                value={damageFine}
                onChange={(e) => setDamageFine(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono"
              />
              <div className="text-[10px] text-slate-500">
                Montant conseillé par le règlement intérieur : 50 000 GNF
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
              <button
                type="button"
                onClick={() => setDamagedModalLoan(null)}
                className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDamage}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
              >
                Enregistrer la dégradation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Perte */}
      {lostModalLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-blue-950">Déclaration de Perte Définitive</h3>
            </div>
            <p className="text-xs text-slate-500">
              L'ouvrage « <strong>{lostModalLoan.bookTitle}</strong> » a été déclaré égaré ou détruit par l'emprunteur <strong>{lostModalLoan.borrowerName}</strong> ({lostModalLoan.borrowerMatricule}).
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-700">Frais de rachat & pénalité (GNF) :</label>
              <input
                type="number"
                value={lostFine}
                onChange={(e) => setLostFine(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono"
              />
              <div className="text-[10px] text-slate-500">
                Couvre le prix de rachat MEPU-A + frais de traitement (150 000 GNF).
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
              <button
                type="button"
                onClick={() => setLostModalLoan(null)}
                className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmLost}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Valider la perte & pénalité
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
