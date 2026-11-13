import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { 
  Megaphone, 
  Send, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Users, 
  Bell, 
  CheckCircle2, 
  Filter, 
  Search,
  Sparkles,
  Share2
} from 'lucide-react';

export const DirectorCommunicationView: React.FC = () => {
  const { announcements, createAnnouncement, profile } = useDirector();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'teachers' | 'parents' | 'students' | 'specific_class'>('parents');
  const [targetClassName, setTargetClassName] = useState('Terminale Sciences Mathématiques 1');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'officiel'>('officiel');
  const [isOfficialCommunique, setIsOfficialCommunique] = useState(true);
  const [channels, setChannels] = useState<('in_app' | 'email' | 'sms' | 'whatsapp')[]>(['in_app', 'email', 'sms']);

  const toggleChannel = (ch: 'in_app' | 'email' | 'sms' | 'whatsapp') => {
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

    createAnnouncement({
      title,
      content,
      targetAudience,
      targetClassName: targetAudience === 'specific_class' ? targetClassName : undefined,
      priority,
      isOfficialCommunique,
      channels
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Diffusion Institutionnelle & Pastorale
            </span>
            <span className="text-xs text-slate-500">Diffusion Multi-Canaux Instantanée</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-600" />
            <span>Communication Omnicanale du Directeur</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Émission d'avis de service, notes de rentrée, alertes parents et communiqués officiels sur In-App, Email, SMS et WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Rédiger un Communiqué</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white border border-blue-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher parmi les messages diffusés..."
            className="w-full bg-transparent text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAnnouncements.map(ann => (
            <div 
              key={ann.id}
              className="p-5 rounded-2xl bg-white border border-blue-100 hover:border-slate-200 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    ann.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    ann.priority === 'officiel' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {ann.priority === 'officiel' ? 'Communiqué Officiel' : ann.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">Destinataires : </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {ann.targetAudience === 'teachers' ? 'Enseignants' :
                     ann.targetAudience === 'parents' ? 'Parents d\'élèves' :
                     ann.targetAudience === 'students' ? 'Élèves' :
                     ann.targetAudience === 'specific_class' ? ann.targetClassName : 'Toute la communauté'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">{ann.createdAt}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-blue-950">{ann.title}</h3>
                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{ann.content}</p>
              </div>

              <div className="pt-3 border-t border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span>Diffusé via :</span>
                  <div className="flex items-center gap-1.5">
                    {ann.channels.map(ch => (
                      <span key={ch} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
                        {ch === 'in_app' ? 'In-App' : ch === 'sms' ? 'SMS Guinée' : ch === 'whatsapp' ? 'WhatsApp' : 'Email'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>Signataire : <strong className="text-blue-950">{ann.author}</strong></span>
                  <span>·</span>
                  <span className="text-emerald-600 font-medium">{ann.readsCount} réceptions confirmées</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-blue-950">Nouveau Message du Directeur</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-blue-950">
                ✕
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre / Objet du message
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Note de cadrage des épreuves de composition..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cible
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  >
                    <option value="parents">Parents d'élèves</option>
                    <option value="teachers">Corps Professoral</option>
                    <option value="students">Élèves</option>
                    <option value="all">Toute l'école</option>
                    <option value="specific_class">Classe spécifique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Niveau d'Urgence
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  >
                    <option value="officiel">Communiqué Officiel</option>
                    <option value="urgent">Urgent</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              {targetAudience === 'specific_class' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Classe Destinataire
                  </label>
                  <input
                    type="text"
                    value={targetClassName}
                    onChange={(e) => setTargetClassName(e.target.value)}
                    placeholder="Ex: Terminale SM 1"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  />
                </div>
              )}

              {/* Channels checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Canaux de distribution simultanée :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'in_app', label: 'In-App', icon: <Bell className="w-3.5 h-3.5" /> },
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
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-950'
                      }`}
                    >
                      {ch.icon}
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenu du message
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Rédigez ici le corps de votre message ou communiqué officiel..."
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30"
                >
                  <Send className="w-4 h-4" />
                  <span>Diffuser Immédiatement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
