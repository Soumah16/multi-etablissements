import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { buildWhatsAppUrl, getSchoolWhatsAppNumber } from '../../utils/whatsapp';
import { CrossRoleHubPanel } from '../common/CrossRoleHubPanel';
import { EmailSendModal } from '../common/EmailSendModal';
import { 
  Megaphone, 
  Send, 
  Mail, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Search,
  MessageSquare,
  Sparkles,
  Smartphone,
  Share2,
  Bell,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

export const TeacherCommunicationView: React.FC = () => {
  const { messages, sendMessage, profile, classes } = useTeacher();
  const { currentSchool } = useSchoolAdmin();
  const schoolWaPhone = getSchoolWhatsAppNumber(currentSchool);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [formRecipientRole, setFormRecipientRole] = useState<'Direction' | 'Parents' | 'Élèves' | 'Collègues'>('Parents');
  const [formRecipient, setFormRecipient] = useState('Parents d\'élèves - Terminale SM');
  const [formChannel, setFormChannel] = useState<'Application' | 'Email' | 'SMS' | 'WhatsApp'>('Application');
  const [formSubject, setFormSubject] = useState('');
  const [formContent, setFormContent] = useState('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formContent.trim()) return;

    sendMessage({
      sender: `M. ${profile.firstName} ${profile.lastName}`,
      recipient: formRecipient,
      recipientRole: formRecipientRole,
      subject: formSubject,
      content: formContent,
      channel: formChannel
    });

    setModalOpen(false);
    setFormSubject('');
    setFormContent('');
  };

  const automatedNotifications = [
    { title: 'Devoir Maison N°2 publié', target: 'Élèves & Parents TSM', channel: 'Application + Email', date: '01 Nov 2026' },
    { title: 'Notes Évaluation N°1 Complexes disponibles', target: 'Élèves TSM (Accès provisoire)', channel: 'Application', date: '28 Oct 2026' },
    { title: 'Alerte Absence : Ousmane Barry', target: 'M. Amadou Barry (Parent)', channel: 'Email automatique', date: '24 Oct 2026' },
    { title: 'Convocation Réunion Pédagogique Département', target: 'Enseignants Sciences', channel: 'Email + Application', date: '02 Nov 2026' }
  ];

  const headerWaUrl = buildWhatsAppUrl(
    schoolWaPhone,
    `Bonjour, message de l'enseignant ${profile.firstName} ${profile.lastName} (${currentSchool.name}).`
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-blue-600" />
            <span>Communication Pédagogique Multi-Canal</span>
          </h1>
          <p className="text-xs text-slate-500">
            Diffusion directe vers les élèves, parents, classe entière et Direction · WhatsApp de l'école : {schoolWaPhone || 'Non configuré'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {headerWaUrl && (
            <a
              href={headerWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {currentSchool.code || 'École'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          )}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Nouveau Message</span>
          </button>
        </div>
      </div>

      {/* Synchronized Cross-Role Messages & Requests Hub */}
      <CrossRoleHubPanel
        role="teacher"
        userName={`${profile.firstName} ${profile.lastName}`}
        schoolId={currentSchool.id}
        schoolName={currentSchool.name}
        defaultRecipientRoles={['director', 'parent', 'student']}
      />

      {/* Automated Notifications Banner */}
      <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-700" />
            <span>Flux des Notifications Automatiques Déclenchées par le Système</span>
          </h3>
          <span className="text-[10px] text-emerald-600 font-mono">Temps Réel</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {automatedNotifications.map((notif, i) => (
            <div key={i} className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 space-y-1 text-xs">
              <div className="font-bold text-blue-950 truncate">{notif.title}</div>
              <div className="text-[11px] text-slate-500">Cible : {notif.target}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-blue-100">
                <span className="text-blue-600 font-medium">{notif.channel}</span>
                <span>{notif.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-blue-950">Historique des Échanges & Communications</h3>
        {messages.map(msg => {
          const msgWaUrl = msg.channel === 'WhatsApp'
            ? buildWhatsAppUrl(schoolWaPhone, `[${currentSchool.name}] ${msg.subject}\n\n${msg.content}`)
            : '';
          return (
            <div 
              key={msg.id}
              className="rounded-2xl bg-white border border-blue-100 p-5 shadow-lg space-y-3 hover:border-slate-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-blue-100">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    msg.recipientRole === 'Direction' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : msg.recipientRole === 'Parents'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {msg.recipientRole}
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200">
                    {msg.channel || 'Application'}
                  </span>

                  <span className="text-xs font-bold text-blue-950">{msg.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{msg.sentAt}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div>
                  De : <strong className="text-slate-700">{msg.sender}</strong> → À : <strong className="text-slate-700">{msg.recipient}</strong>
                </div>
                {msgWaUrl && (
                  <a
                    href={msgWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ouvrir sur WhatsApp ({schoolWaPhone})</span>
                  </a>
                )}
              </div>

              <p className="text-xs text-slate-900 leading-relaxed bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
                {msg.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Modal: New Message */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-blue-100 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-base text-blue-950">Rédiger un Message Pédagogique</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-blue-950">✕</button>
            </div>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Destinataire cible *</label>
                  <select 
                    value={formRecipientRole}
                    onChange={e => {
                      const val = e.target.value as any;
                      setFormRecipientRole(val);
                      if (val === 'Direction') setFormRecipient('Dr. Ibrahima Sory Bangoura (Directeur des Études)');
                      else if (val === 'Parents') setFormRecipient('Parents d\'élèves - Terminale SM');
                      else if (val === 'Élèves') setFormRecipient('Classe entière Terminale SM');
                      else setFormRecipient('Département Mathématiques');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  >
                    <option value="Parents">Parents d'un élève ou classe</option>
                    <option value="Direction">Direction des Études</option>
                    <option value="Élèves">Classe entière ou élève</option>
                    <option value="Collègues">Département pédagogique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Canal de transmission *</label>
                  <select 
                    value={formChannel}
                    onChange={e => setFormChannel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  >
                    <option value="Application">Application SmartSchool (Interne)</option>
                    <option value="Email">Email officiel (Sortant)</option>
                    <option value="WhatsApp">Notification WhatsApp</option>
                  </select>
                </div>
              </div>

              {formChannel === 'WhatsApp' && schoolWaPhone && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-emerald-900">
                    WhatsApp de <strong>{currentSchool.name}</strong> : <strong className="font-mono">{schoolWaPhone}</strong>
                  </span>
                  <a
                    href={buildWhatsAppUrl(schoolWaPhone, `[${currentSchool.name}] ${formSubject || 'Message pédagogique'}\n\n${formContent}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ouvrir WhatsApp</span>
                  </a>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nom / Groupe précis *</label>
                <input 
                  type="text" 
                  required
                  value={formRecipient}
                  onChange={e => setFormRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Objet *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Rappel Devoir Maison N°2 ou Réunion de concertation..."
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Message *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Saisissez votre communication pédagogique..."
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Ouvrir dans Gmail / Mail</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-blue-950 bg-slate-50 text-xs font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Envoyer via {formChannel}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <EmailSendModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Envoyer le Message Pédagogique par Email"
        subtitle={`${formRecipient} · ${currentSchool.name}`}
        recipientOptions={[]}
        defaultSubject={formSubject || `[${currentSchool.name}] Message Pédagogique`}
        defaultBody={[
          formContent || 'Saisissez votre message...',
          '',
          `— ${profile.firstName} ${profile.lastName} (${currentSchool.name})`
        ].join('\n')}
        whatsappPhone={schoolWaPhone}
      />
    </div>
  );
};
