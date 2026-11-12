import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { DebtorStudent } from '../../types/accountant';
import { 
  Users, 
  AlertTriangle, 
  Send, 
  Printer, 
  Phone, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Search,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const DebtorsView: React.FC = () => {
  const { debtors, sendDebtorReminder, formatGnf } = useAccountant();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'en_retard' | 'relance_envoyee' | 'contentieux'>('all');
  const [selectedStudentForReminder, setSelectedStudentForReminder] = useState<DebtorStudent | null>(null);
  const [reminderChannel, setReminderChannel] = useState<'SMS' | 'WhatsApp' | 'Email' | 'App'>('SMS');

  const totalOverdueGnf = debtors.reduce((sum, d) => sum + d.balanceRemainingGnf, 0);

  const filteredDebtors = debtors.filter(d => {
    const matchesSearch = 
      d.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.studentMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentForReminder) {
      sendDebtorReminder(selectedStudentForReminder.studentId, reminderChannel);
      setSelectedStudentForReminder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            <span>Gestion des Débiteurs & Relances d'Impayés</span>
          </h1>
          <p className="text-xs text-slate-400">
            Suivi des retards de scolarité, notifications automatiques (SMS, WhatsApp, Email) et relevés
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerPrint('debtors-printable-list', 'Releve_Debiteurs_Impayes')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Relevé Débiteurs</span>
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold text-slate-400">Cumul des Créances Restantes</span>
          <div className="text-2xl md:text-3xl font-black font-mono text-rose-400">
            {formatGnf(totalOverdueGnf)}
          </div>
          <p className="text-xs text-slate-400">
            Réparti sur <strong>{debtors.length}</strong> élèves ayant dépassé la date d'échéance réglementaire
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <div className="text-[10px] text-slate-400">En retard &lt; 15j</div>
            <div className="text-sm font-bold text-amber-400">
              {debtors.filter(d => d.overdueDays <= 15).length} élèves
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <div className="text-[10px] text-slate-400">Contentieux &gt; 15j</div>
            <div className="text-sm font-bold text-rose-400">
              {debtors.filter(d => d.overdueDays > 15).length} élèves
            </div>
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher élève, parent, matricule..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'Tous les débiteurs' },
            { id: 'en_retard', label: 'En retard' },
            { id: 'relance_envoyee', label: 'Relance envoyée' },
            { id: 'contentieux', label: 'Contentieux' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Debtors List */}
      <div id="debtors-printable-list" className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Élève & Matricule</th>
              <th className="py-3 px-3">Classe</th>
              <th className="py-3 px-3">Parent & Contact</th>
              <th className="py-3 px-3 text-right">Frais Dû</th>
              <th className="py-3 px-3 text-right">Reste à Payer</th>
              <th className="py-3 px-3 text-center">Retard</th>
              <th className="py-3 px-3 text-center">Relances</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredDebtors.map(debtor => (
              <tr key={debtor.studentId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{debtor.studentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{debtor.studentMatricule}</div>
                </td>

                <td className="py-3 px-3">
                  <span className="text-slate-300">{debtor.className}</span>
                </td>

                <td className="py-3 px-3">
                  <div className="text-slate-200">{debtor.parentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{debtor.parentPhone}</div>
                </td>

                <td className="py-3 px-3 text-right font-mono text-slate-400">
                  {formatGnf(debtor.totalDueGnf)}
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-rose-400 text-sm">
                  {formatGnf(debtor.balanceRemainingGnf)}
                </td>

                <td className="py-3 px-3 text-center font-mono">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    +{debtor.overdueDays} jours
                  </span>
                </td>

                <td className="py-3 px-3 text-center">
                  <div className="text-xs text-slate-300 font-bold">{debtor.remindersCount} envoyée(s)</div>
                  {debtor.lastReminderDate && (
                    <div className="text-[9px] text-slate-500 font-mono">Dernière: {debtor.lastReminderDate}</div>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedStudentForReminder(debtor)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Relancer</span>
                    </button>
                    <a
                      href={`tel:${debtor.parentPhone}`}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Appeler le parent"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Send Reminder */}
      {selectedStudentForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-400" />
                <span>Envoyer un rappel de paiement</span>
              </h3>
              <button onClick={() => setSelectedStudentForReminder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSendReminder} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                <div>Élève : <strong className="text-white">{selectedStudentForReminder.studentName}</strong></div>
                <div>Parent : <strong className="text-white">{selectedStudentForReminder.parentName}</strong> ({selectedStudentForReminder.parentPhone})</div>
                <div>Reste dû : <strong className="text-rose-400 font-mono">{formatGnf(selectedStudentForReminder.balanceRemainingGnf)}</strong></div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Canal de notification *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'SMS', label: 'SMS Guinée', icon: <Smartphone className="w-3.5 h-3.5" /> },
                    { id: 'WhatsApp', label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                    { id: 'Email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
                    { id: 'App', label: 'Portail Parent', icon: <Users className="w-3.5 h-3.5" /> }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setReminderChannel(c.id as any)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                        reminderChannel === c.id
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {c.icon}
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                <strong>Aperçu du message envoyé :</strong>
                <p className="italic text-slate-400 mt-1">
                  "Lycée d'Excellence : Cher parent de {selectedStudentForReminder.studentName}, nous vous rappelons que le solde de scolarité de {formatGnf(selectedStudentForReminder.balanceRemainingGnf)} est en attente de règlement. Merci de régulariser sous 48h au guichet comptable ou par Orange Money."
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForReminder(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Envoyer le Rappel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
