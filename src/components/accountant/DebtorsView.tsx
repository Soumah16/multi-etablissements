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
  Search,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { buildWhatsAppUrl, getSchoolWhatsAppNumber } from '../../utils/whatsapp';
import { EmailSendModal } from '../common/EmailSendModal';

export const DebtorsView: React.FC = () => {
  const { debtors, sendDebtorReminder, formatGnf } = useAccountant();
  const { currentSchool } = useSchoolAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'en_retard' | 'relance_envoyee' | 'contentieux'>('all');
  const [selectedStudentForReminder, setSelectedStudentForReminder] = useState<DebtorStudent | null>(null);
  const [reminderChannel, setReminderChannel] = useState<'WhatsApp' | 'Email' | 'App'>('Email');
  const [emailModalDebtor, setEmailModalDebtor] = useState<DebtorStudent | null>(null);

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
    if (!selectedStudentForReminder) return;
    if (reminderChannel === 'Email') {
      const target = selectedStudentForReminder;
      setSelectedStudentForReminder(null);
      setEmailModalDebtor(target);
      return;
    }
    sendDebtorReminder(selectedStudentForReminder.studentId, reminderChannel);
    setSelectedStudentForReminder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span>Gestion des Débiteurs & Relances d'Impayés</span>
          </h1>
          <p className="text-xs text-slate-500">
            Suivi des retards de scolarité, notifications automatiques (Email, WhatsApp, Portail Parent) et relevés
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerPrint('debtors-printable-list', 'Releve_Debiteurs_Impayes')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Relevé Débiteurs</span>
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="p-5 rounded-2xl bg-white border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold text-slate-500">Cumul des Créances Restantes</span>
          <div className="text-2xl md:text-3xl font-black font-mono text-rose-600">
            {formatGnf(totalOverdueGnf)}
          </div>
          <p className="text-xs text-slate-500">
            Réparti sur <strong>{debtors.length}</strong> élèves ayant dépassé la date d'échéance réglementaire
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-blue-50/60 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500">En retard &lt; 15j</div>
            <div className="text-sm font-bold text-amber-700">
              {debtors.filter(d => d.overdueDays <= 15).length} élèves
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-blue-50/60 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500">Contentieux &gt; 15j</div>
            <div className="text-sm font-bold text-rose-600">
              {debtors.filter(d => d.overdueDays > 15).length} élèves
            </div>
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher élève, parent, matricule..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-blue-100 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-rose-500"
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
                  : 'bg-white border border-blue-100 text-slate-500 hover:text-blue-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Debtors List */}
      <div id="debtors-printable-list" className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-xl">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-blue-50/70 text-[10px] uppercase font-bold text-slate-500 border-b border-blue-100">
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
          <tbody className="divide-y divide-blue-100 font-medium">
            {filteredDebtors.map(debtor => (
              <tr key={debtor.studentId} className="hover:bg-blue-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-blue-950 text-xs">{debtor.studentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{debtor.studentMatricule}</div>
                </td>

                <td className="py-3 px-3">
                  <span className="text-slate-700">{debtor.className}</span>
                </td>

                <td className="py-3 px-3">
                  <div className="text-slate-900">{debtor.parentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{debtor.parentPhone}</div>
                </td>

                <td className="py-3 px-3 text-right font-mono text-slate-500">
                  {formatGnf(debtor.totalDueGnf)}
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 text-sm">
                  {formatGnf(debtor.balanceRemainingGnf)}
                </td>

                <td className="py-3 px-3 text-center font-mono">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    +{debtor.overdueDays} jours
                  </span>
                </td>

                <td className="py-3 px-3 text-center">
                  <div className="text-xs text-slate-700 font-bold">{debtor.remindersCount} envoyée(s)</div>
                  {debtor.lastReminderDate && (
                    <div className="text-[9px] text-slate-500 font-mono">Dernière: {debtor.lastReminderDate}</div>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedStudentForReminder(debtor)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Relancer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailModalDebtor(debtor)}
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                      title="Envoyer une relance par Email (Gmail / Mail)"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`tel:${debtor.parentPhone}`}
                      className="p-1.5 rounded-lg bg-slate-50 text-slate-700 hover:text-blue-950 transition-colors"
                      title="Appeler le parent"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    {buildWhatsAppUrl(debtor.parentPhone) && (
                      <a
                        href={buildWhatsAppUrl(
                          debtor.parentPhone,
                          `${currentSchool.name} : Cher(e) ${debtor.parentName}, rappel pour le solde de scolarité de ${debtor.studentName} (${formatGnf(debtor.balanceRemainingGnf)}). WhatsApp École : ${getSchoolWhatsAppNumber(currentSchool)}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        title="Relancer directement sur WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Send Reminder */}
      {selectedStudentForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-blue-100 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-base text-blue-950 flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-600" />
                <span>Envoyer un rappel de paiement</span>
              </h3>
              <button onClick={() => setSelectedStudentForReminder(null)} className="text-slate-500 hover:text-blue-950">✕</button>
            </div>

            <form onSubmit={handleSendReminder} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 space-y-1">
                <div>Élève : <strong className="text-blue-950">{selectedStudentForReminder.studentName}</strong></div>
                <div>Parent : <strong className="text-blue-950">{selectedStudentForReminder.parentName}</strong> ({selectedStudentForReminder.parentPhone})</div>
                <div>Reste dû : <strong className="text-rose-600 font-mono">{formatGnf(selectedStudentForReminder.balanceRemainingGnf)}</strong></div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Canal de notification *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Email', label: 'Email (Gmail / Mail)', icon: <Mail className="w-3.5 h-3.5" /> },
                    { id: 'WhatsApp', label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                    { id: 'App', label: 'Portail Parent', icon: <Users className="w-3.5 h-3.5" /> }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setReminderChannel(c.id as any)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                        reminderChannel === c.id
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
                      }`}
                    >
                      {c.icon}
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-slate-700 leading-relaxed">
                <strong>Aperçu du message envoyé ({currentSchool.name}) :</strong>
                <p className="italic text-slate-500 mt-1">
                  "{currentSchool.name} : Cher parent de {selectedStudentForReminder.studentName}, nous vous rappelons que le solde de scolarité de {formatGnf(selectedStudentForReminder.balanceRemainingGnf)} est en attente de règlement. Contact WhatsApp École : {getSchoolWhatsAppNumber(currentSchool)}."
                </p>
              </div>

              {reminderChannel === 'WhatsApp' && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col gap-2">
                  <div className="text-[11px] text-emerald-900 font-semibold">
                    Redirection WhatsApp directe ({currentSchool.name} → {selectedStudentForReminder.parentName}) :
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {buildWhatsAppUrl(selectedStudentForReminder.parentPhone) && (
                      <a
                        href={buildWhatsAppUrl(
                          selectedStudentForReminder.parentPhone,
                          `${currentSchool.name} : Cher(e) ${selectedStudentForReminder.parentName}, nous vous rappelons que le solde de scolarité de ${selectedStudentForReminder.studentName} (${formatGnf(selectedStudentForReminder.balanceRemainingGnf)}) est en attente de règlement. Merci de contacter le secrétariat ou notre WhatsApp officiel : ${getSchoolWhatsAppNumber(currentSchool)}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Ouvrir WhatsApp du Parent</span>
                      </a>
                    )}
                    {buildWhatsAppUrl(getSchoolWhatsAppNumber(currentSchool)) && (
                      <a
                        href={buildWhatsAppUrl(
                          getSchoolWhatsAppNumber(currentSchool),
                          `Relance impayé - Élève : ${selectedStudentForReminder.studentName} - Parent : ${selectedStudentForReminder.parentName} (${selectedStudentForReminder.parentPhone}) - Montant : ${formatGnf(selectedStudentForReminder.balanceRemainingGnf)}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs"
                      >
                        <span>WhatsApp Comptabilité École ({getSchoolWhatsAppNumber(currentSchool)})</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-blue-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForReminder(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-blue-950 bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                >
                  Enregistrer & Envoyer le Rappel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Email / Gmail / WhatsApp Debtor Reminder Modal */}
      {emailModalDebtor && (
        <EmailSendModal
          isOpen={Boolean(emailModalDebtor)}
          onClose={() => setEmailModalDebtor(null)}
          title="Envoyer une Relance de Scolarité par Email"
          subtitle={`${emailModalDebtor.studentName} (${emailModalDebtor.className}) · Solde : ${formatGnf(emailModalDebtor.balanceRemainingGnf)}`}
          recipientOptions={[]}
          defaultSubject={`Rappel de scolarité - ${emailModalDebtor.studentName} (${emailModalDebtor.studentMatricule})`}
          defaultBody={[
            `Bonjour ${emailModalDebtor.parentName},`,
            '',
            `L'Intendance & Comptabilité de ${currentSchool.name} vous rappelle que les frais de scolarité de votre enfant ${emailModalDebtor.studentName} (Classe : ${emailModalDebtor.className}, Matricule : ${emailModalDebtor.studentMatricule}) présentent un solde restant à régler :`,
            `- Montant total dû : ${formatGnf(emailModalDebtor.totalDueGnf)}`,
            `- Déjà réglé : ${formatGnf(emailModalDebtor.amountPaidGnf)}`,
            `- Reste à payer : ${formatGnf(emailModalDebtor.balanceRemainingGnf)} (Retard : +${emailModalDebtor.overdueDays} jours)`,
            '',
            `Merci de bien vouloir régulariser cette situation auprès de la comptabilité ou nous contacter sur WhatsApp (${getSchoolWhatsAppNumber(currentSchool)}).`,
            '',
            'Cordialement,',
            `Service Comptabilité · ${currentSchool.name}`
          ].join('\n')}
          whatsappPhone={emailModalDebtor.parentPhone}
          onDispatched={(channel) => {
            sendDebtorReminder(emailModalDebtor.studentId, channel === 'whatsapp' ? 'WhatsApp' : 'Email');
          }}
        />
      )}
    </div>
  );
};
