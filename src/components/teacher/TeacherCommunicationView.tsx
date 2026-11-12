import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
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
  Bell
} from 'lucide-react';

export const TeacherCommunicationView: React.FC = () => {
  const { messages, sendMessage, profile, classes } = useTeacher();
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [formRecipientRole, setFormRecipientRole] = useState<'Direction' | 'Parents' | 'Élèves' | 'Collègues'>('Parents');
  const [formRecipient, setFormRecipient] = useState('Parents d\'élèves - Terminale SM');
  const [formChannel, setFormChannel] = useState<'Application' | 'Email' | 'SMS' | 'WhatsApp'>('Application');
  const [formSubject, setFormSubject] = useState('');
  const [formContent, setFormContent] = useState('');

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
    { title: 'Devoir Maison N°2 publié', target: 'Élèves & Parents TSM', channel: 'Application + SMS', date: '01 Nov 2026' },
    { title: 'Notes Évaluation N°1 Complexes disponibles', target: 'Élèves TSM (Accès provisoire)', channel: 'Application', date: '28 Oct 2026' },
    { title: 'Alerte Absence : Ousmane Barry', target: 'M. Amadou Barry (Parent)', channel: 'SMS automatique', date: '24 Oct 2026' },
    { title: 'Convocation Réunion Pédagogique Département', target: 'Enseignants Sciences', channel: 'Email + Application', date: '02 Nov 2026' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-blue-400" />
            <span>Communication Pédagogique Multi-Canal</span>
          </h1>
          <p className="text-xs text-slate-400">
            Diffusion directe vers les élèves, parents, classe entière et Direction (Application, Email, SMS, WhatsApp)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Nouveau Message</span>
        </button>
      </div>

      {/* Automated Notifications Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Flux des Notifications Automatiques Déclenchées par le Système</span>
          </h3>
          <span className="text-[10px] text-emerald-400 font-mono">Temps Réel</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {automatedNotifications.map((notif, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1 text-xs">
              <div className="font-bold text-white truncate">{notif.title}</div>
              <div className="text-[11px] text-slate-400">Cible : {notif.target}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                <span className="text-blue-400 font-medium">{notif.channel}</span>
                <span>{notif.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-white">Historique des Échanges & Communications</h3>
        {messages.map(msg => (
          <div 
            key={msg.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-3 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  msg.recipientRole === 'Direction' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : msg.recipientRole === 'Parents'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {msg.recipientRole}
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {msg.channel || 'Application'}
                </span>

                <span className="text-xs font-bold text-white">{msg.subject}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{msg.sentAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div>
                De : <strong className="text-slate-300">{msg.sender}</strong> → À : <strong className="text-slate-300">{msg.recipient}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              {msg.content}
            </p>
          </div>
        ))}
      </div>

      {/* Modal: New Message */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Rédiger un Message Pédagogique</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Destinataire cible *</label>
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Parents">Parents d'un élève ou classe</option>
                    <option value="Direction">Direction des Études</option>
                    <option value="Élèves">Classe entière ou élève</option>
                    <option value="Collègues">Département pédagogique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Canal de transmission *</label>
                  <select 
                    value={formChannel}
                    onChange={e => setFormChannel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Application">Application SmartSchool (Interne)</option>
                    <option value="SMS">SMS Téléphone</option>
                    <option value="WhatsApp">Notification WhatsApp</option>
                    <option value="Email">Email officiel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nom / Groupe précis *</label>
                <input 
                  type="text" 
                  required
                  value={formRecipient}
                  onChange={e => setFormRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Objet *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Rappel Devoir Maison N°2 ou Réunion de concertation..."
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Saisissez votre communication pédagogique..."
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Envoyer via {formChannel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
