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
          <h1 className="text-xl md:text-2xl font-black text-blue-950">Communication & Échanges avec l'École</h1>
          <p className="text-xs text-slate-500 mt-0.5">
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
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-blue-950">Vos Échanges Récents</h2>
          </div>

          <div className="space-y-3">
            {sentMessages.map(msg => (
              <div key={msg.id} className="p-4 rounded-xl bg-blue-50/60 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-700">{msg.recipient}</span>
                  <span className="text-slate-500 text-[10px]">{msg.date}</span>
                </div>
                <div className="text-xs font-semibold text-blue-950">{msg.subject}</div>
                <p className="text-xs text-slate-700 leading-relaxed bg-white/90 p-2.5 rounded-lg border border-blue-100">
                  {msg.message}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Transmis et notifié par email & SMS au destinataire</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Administrative Broadcasts */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-700" />
            <h2 className="text-sm font-bold text-blue-950">Circulaires & Notifications École</h2>
          </div>

          <div className="space-y-3">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer space-y-1.5 ${
                  notif.read ? 'bg-blue-50/60 border-blue-100 text-slate-500' : 'bg-blue-50/60 border-blue-200 text-blue-950'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    notif.category === 'Note' ? 'bg-emerald-50 text-emerald-700' :
                    notif.category === 'Absence' ? 'bg-rose-50 text-rose-700' :
                    notif.category === 'Paiement' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {notif.category}
                  </span>
                  <span className="text-slate-500">{notif.date} · De : {notif.sender}</span>
                </div>
                <div className="text-xs font-bold text-blue-950">{notif.title}</div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      {composeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-blue-950">Nouveau Message aux Équipes Pédagogiques</h3>

            <form onSubmit={handleSend} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Destinataire</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                >
                  <option value="M. Mamadou Lamarana Diallo (Prof. Principal TSM)">M. Mamadou Lamarana Diallo (Prof. Principal TSM)</option>
                  <option value="Dr. Ibrahima Sory Bangoura (Directeur des Études)">Dr. Ibrahima Sory Bangoura (Directeur des Études)</option>
                  <option value="M. Ibrahima Kalil Keïta (Surveillant Général)">M. Ibrahima Kalil Keïta (Surveillant Général)</option>
                  <option value="M. Ibrahima Kalil Camara (Chef Comptable)">M. Ibrahima Kalil Camara (Chef Comptable)</option>
                  <option value="Mme Kadiatou Diallo (Secrétariat & Inscriptions)">Mme Kadiatou Diallo (Secrétariat & Inscriptions)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Objet du message *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="ex: Demande de rendez-vous d'orientation ou bulletin"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Votre message *</label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Rédigez votre demande de façon détaillée..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setComposeModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
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
