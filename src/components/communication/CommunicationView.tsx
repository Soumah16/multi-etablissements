import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalAnnouncement } from '../../types';
import { 
  Megaphone, 
  Send, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Bell, 
  CheckCircle2, 
  Building2, 
  Users, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const CommunicationView: React.FC = () => {
  const { announcements, createAnnouncement, schools, t, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<GlobalAnnouncement['target']>('all_schools');
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([]);
  const [type, setType] = useState<GlobalAnnouncement['type']>('info');
  const [channelInApp, setChannelInApp] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(false);
  const [channelWhatsApp, setChannelWhatsApp] = useState(false);

  const handleToggleSchool = (schoolId: string) => {
    setSelectedSchoolIds(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId) 
        : [...prev, schoolId]
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const channels: ('in_app' | 'email' | 'sms' | 'whatsapp')[] = [];
    if (channelInApp) channels.push('in_app');
    if (channelEmail) channels.push('email');
    if (channelSms) channels.push('sms');
    if (channelWhatsApp) channels.push('whatsapp');

    if (channels.length === 0) {
      alert("Veuillez sélectionner au moins un canal de diffusion.");
      return;
    }

    createAnnouncement({
      title,
      content,
      target,
      targetSchoolIds: target === 'selected_schools' ? selectedSchoolIds : undefined,
      type,
      channels
    });

    setTitle('');
    setContent('');
    setSelectedSchoolIds([]);
    showToast("Diffusion envoyée à tous les établissements ciblés !");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.nav.communication}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Diffusion centralisée d'annonces, alertes par email, SMS Orange/MTN et WhatsApp
          </p>
        </div>
      </div>

      {/* Main 2-column layout: Broadcast Composer & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60">
            <Megaphone className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-white">
              Composer un Message Global
            </h2>
          </div>

          <form onSubmit={handleSendBroadcast} className="mt-4 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Titre de l'annonce *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Mise à jour majeure de la plateforme ou Maintenance"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Cibles du message *</label>
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all_schools">Toutes les écoles ({schools.length})</option>
                  <option value="selected_schools">Écoles sélectionnées spécifiquement</option>
                  <option value="all_admins">Tous les administrateurs scolaires</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nature du message</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="info">Information générale</option>
                  <option value="urgent">Notification Urgente</option>
                  <option value="maintenance">Avis de Maintenance Planifiée</option>
                  <option value="mise_a_jour">Nouvelle Fonctionnalité Plateforme</option>
                </select>
              </div>
            </div>

            {/* School selector if target === 'selected_schools' */}
            {target === 'selected_schools' && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 space-y-2">
                <div className="text-[11px] font-semibold text-slate-300">
                  Cochez les établissements destinataires :
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                  {schools.map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-[11px] text-slate-300 hover:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSchoolIds.includes(s.id)}
                        onChange={() => handleToggleSchool(s.id)}
                        className="rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-600"
                      />
                      <span>{s.name} ({s.city})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Channels Multi-Select */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Canaux de transmission activés :</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={channelInApp}
                    onChange={e => setChannelInApp(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 bg-slate-800"
                  />
                  <Bell className="w-3.5 h-3.5 text-blue-400" />
                  <span>Bannière In-App ERP</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={channelEmail}
                    onChange={e => setChannelEmail(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 bg-slate-800"
                  />
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Email Automatisé</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={channelSms}
                    onChange={e => setChannelSms(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 bg-slate-800"
                  />
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Passerelle SMS Guinée</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={channelWhatsApp}
                    onChange={e => setChannelWhatsApp(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 bg-slate-800"
                  />
                  <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                  <span>WhatsApp Business API</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Contenu du message *</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Rédigez votre annonce ici..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Diffuser le Message Maintenant</span>
              </button>
            </div>
          </form>
        </div>

        {/* History of Sent Broadcasts */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <h2 className="text-sm font-bold text-white">
                Historique des Diffusions Récentes ({announcements.length})
              </h2>
            </div>

            <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-lg bg-slate-900 border border-slate-700/70 text-xs space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-white text-xs leading-snug">
                      {ann.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                      {ann.createdAt}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {ann.content}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>Canaux :</span>
                      {ann.channels.map(c => (
                        <span key={c} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono uppercase">
                          {c}
                        </span>
                      ))}
                    </div>

                    <span className="text-emerald-400 font-mono">
                      ✓ Délivré à {ann.deliveryCount} établissements
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
