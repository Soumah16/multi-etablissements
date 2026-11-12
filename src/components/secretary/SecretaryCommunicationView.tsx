import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { SecretaryMessage } from '../../types/secretary';
import { 
  Megaphone, 
  Send, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  Bell, 
  Search, 
  CheckCircle2, 
  Users, 
  User, 
  X, 
  Check 
} from 'lucide-react';

export const SecretaryCommunicationView: React.FC = () => {
  const { messages, sendMessage } = useSecretary();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<SecretaryMessage['target']>('all_parents');
  const [targetDetail, setTargetDetail] = useState('');
  const [channels, setChannels] = useState<('app' | 'email' | 'sms' | 'whatsapp')[]>(['app', 'sms']);

  const toggleChannel = (ch: 'app' | 'email' | 'sms' | 'whatsapp') => {
    if (channels.includes(ch)) {
      if (channels.length > 1) {
        setChannels(channels.filter(c => c !== ch));
      }
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    sendMessage({
      title,
      content,
      target,
      targetDetail: targetDetail.trim() || undefined,
      channels
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  const filteredMessages = messages.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Information & Convocations Administratives
            </span>
            <span className="text-xs text-slate-400">Diffusion Multi-Canaux Instantanée</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-teal-400" />
            <span>Communication & Rappels aux Familles</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Envoi de rappels de dossiers incomplets, convocations pour retrait de cartes et notes administratives.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/30 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Nouveau Message / Relance</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher parmi les messages diffusés..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map(msg => (
            <div 
              key={msg.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20 uppercase tracking-wider">
                    {msg.target === 'all_parents' ? 'Tous les Parents' :
                     msg.target === 'class_parents' ? 'Parents d\'une classe' :
                     msg.target === 'all_students' ? 'Tous les élèves' : 'Parent individuel'}
                  </span>
                  {msg.targetDetail && (
                    <span className="text-xs font-semibold text-slate-300">
                      ({msg.targetDetail})
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-400">{msg.date}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{msg.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{msg.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span>Canaux utilisés :</span>
                  {msg.channels.map(ch => (
                    <span key={ch} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {ch === 'app' ? 'In-App' : ch === 'sms' ? 'SMS Guinée' : ch === 'whatsapp' ? 'WhatsApp' : 'Email'}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Diffusé avec succès</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Rédiger un Message Administratif</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre / Objet du message *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Rappel impératif pour retrait des cartes scolaires au secrétariat"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cible des destinataires *</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="all_parents">Tous les parents d'élèves</option>
                  <option value="class_parents">Parents d'une classe spécifique</option>
                  <option value="all_students">Tous les élèves</option>
                  <option value="single_parent">Un parent en particulier</option>
                </select>
              </div>

              {(target === 'class_parents' || target === 'single_parent') && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Préciser le nom de la classe ou du parent
                  </label>
                  <input
                    type="text"
                    value={targetDetail}
                    onChange={(e) => setTargetDetail(e.target.value)}
                    placeholder="Ex: Terminale SM 1 ou Elhadj Amadou Diallo"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              )}

              {/* Channels Selector */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Canaux de distribution simultanée :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'app', label: 'In-App', icon: <Bell className="w-3.5 h-3.5" /> },
                    { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
                    { id: 'sms', label: 'SMS', icon: <Smartphone className="w-3.5 h-3.5" /> },
                    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" /> }
                  ].map(ch => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleChannel(ch.id as any)}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        channels.includes(ch.id as any)
                          ? 'bg-teal-600/20 border-teal-500 text-teal-300 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ch.icon}
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Corps du message *</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Rédigez ici le texte de votre communiqué administratif..."
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-600/30"
                >
                  <Send className="w-4 h-4" />
                  <span>Diffuser aux Familles</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
