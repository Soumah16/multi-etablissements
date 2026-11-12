import React, { useState } from 'react';
import { useParent } from '../../context/ParentContext';
import { 
  Megaphone, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Mail, 
  User, 
  AlertCircle
} from 'lucide-react';

export const ParentCommunicationView: React.FC = () => {
  const { sentMessages, sendMessageToStaff, notifications, markNotificationRead, selectedChild } = useParent();
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [recipient, setRecipient] = useState('M. Mamadou Lamarana Diallo (Prof. Principal TSM)');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToStaff(recipient, subject, messageText);
    setComposeModalOpen(false);
    setSubject('');
    setMessageText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Communication & Échanges avec l'École</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dialogue direct avec les professeurs principaux, la vie scolaire et la direction générale.
          </p>
        </div>

        <button
          onClick={() => setComposeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Écrire à un Enseignant / Direction</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sent Messages History */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Vos Échanges Récents</h2>
          </div>

          <div className="space-y-3">
            {sentMessages.map(msg => (
              <div key={msg.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-300">{msg.recipient}</span>
                  <span className="text-slate-500 text-[10px]">{msg.date}</span>
                </div>
                <div className="text-xs font-semibold text-white">{msg.subject}</div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {msg.message}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Transmis et notifié par email & SMS au destinataire</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Administrative Broadcasts */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Circulaires & Notifications École</h2>
          </div>

          <div className="space-y-3">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer space-y-1.5 ${
                  notif.read ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-blue-500/30 text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    notif.category === 'Note' ? 'bg-emerald-500/20 text-emerald-300' :
                    notif.category === 'Absence' ? 'bg-rose-500/20 text-rose-300' :
                    notif.category === 'Paiement' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {notif.category}
                  </span>
                  <span className="text-slate-500">{notif.date} · De : {notif.sender}</span>
                </div>
                <div className="text-xs font-bold text-white">{notif.title}</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      {composeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Nouveau Message aux Équipes Pédagogiques</h3>

            <form onSubmit={handleSend} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Destinataire</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="M. Mamadou Lamarana Diallo (Prof. Principal TSM)">M. Mamadou Lamarana Diallo (Prof. Principal TSM)</option>
                  <option value="Dr. Ibrahima Sory Bangoura (Directeur des Études)">Dr. Ibrahima Sory Bangoura (Directeur des Études)</option>
                  <option value="M. Ibrahima Kalil Keïta (Surveillant Général)">M. Ibrahima Kalil Keïta (Surveillant Général)</option>
                  <option value="M. Ibrahima Kalil Camara (Chef Comptable)">M. Ibrahima Kalil Camara (Chef Comptable)</option>
                  <option value="Mme Kadiatou Diallo (Secrétariat & Inscriptions)">Mme Kadiatou Diallo (Secrétariat & Inscriptions)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Objet du message *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="ex: Demande de rendez-vous d'orientation ou bulletin"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Votre message *</label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Rédigez votre demande de façon détaillée..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setComposeModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                >
                  Envoyer le message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
