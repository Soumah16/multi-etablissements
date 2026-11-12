import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { SecretaryAppointment } from '../../types/secretary';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  X, 
  Check, 
  CalendarDays,
  Filter
} from 'lucide-react';

export const AppointmentsView: React.FC = () => {
  const { appointments, createAppointment, updateAppointmentStatus } = useSecretary();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorRole, setVisitorRole] = useState<SecretaryAppointment['visitorRole']>('Parent d\'élève');
  const [visitorPhone, setVisitorPhone] = useState('+224 62');
  const [type, setType] = useState<SecretaryAppointment['type']>('Rencontre parent');
  const [date, setDate] = useState('2026-11-04');
  const [time, setTime] = useState('10:00');
  const [location, setLocation] = useState('Guichet 1 · Secrétariat Général');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !visitorName.trim()) return;

    createAppointment({
      title,
      visitorName,
      visitorRole,
      visitorPhone,
      type,
      date,
      time,
      location,
      notes
    });

    setTitle('');
    setVisitorName('');
    setNotes('');
    setIsModalOpen(false);
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = 
      a.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.visitorPhone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Accueil du Public & Permanences
            </span>
            <span className="text-xs text-slate-400">Guichet & Secrétariat Administratif</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
            <span>Rendez-vous & Accueil des Familles</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Gestion du planning d'accueil des parents, demandes d'audience, retraits de documents scolaires et réclamations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Planifier un Rendez-vous</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par visiteur, téléphone ou objet..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
        >
          <option value="all">Tous les rendez-vous</option>
          <option value="programme">Programmés (À venir)</option>
          <option value="termine">Terminés / Reçus</option>
          <option value="annule">Annulés</option>
        </select>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAppointments.map(app => (
          <div 
            key={app.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {app.type}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  app.status === 'programme' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                  app.status === 'termine' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {app.status === 'programme' ? 'Programmé' : app.status === 'termine' ? 'Reçu & Traité' : 'Annulé'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">{app.title}</h3>
                <div className="text-xs text-slate-300 mt-1 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>{app.visitorName}</span>
                  <span className="text-slate-500 font-normal">({app.visitorRole})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                  <span>{app.date} à {app.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{app.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{app.visitorPhone}</span>
              </div>

              {app.notes && (
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 italic">
                  "{app.notes}"
                </div>
              )}
            </div>

            {/* Actions */}
            {app.status === 'programme' && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => updateAppointmentStatus(app.id, 'annule')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => updateAppointmentStatus(app.id, 'termine')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Marquer comme Reçu</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Programmer un Rendez-vous</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Objet / Motif de la visite *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Demande de relevé de notes certifié et entretien"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nom du Visiteur *</label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Ex: M. Mamadou Saliou Barry"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Qualité du Visiteur</label>
                  <select
                    value={visitorRole}
                    onChange={(e) => setVisitorRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Parent d'élève">Parent d'élève</option>
                    <option value="Élève">Élève</option>
                    <option value="Tuteur">Tuteur Légal</option>
                    <option value="Partenaire / Visiteur">Partenaire / Visiteur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Téléphone de contact *</label>
                  <input
                    type="text"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+224 622 00 00 00"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Type de rendez-vous</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Rencontre parent">Rencontre parent</option>
                    <option value="Rencontre direction">Rencontre direction</option>
                    <option value="Retrait documents">Retrait documents</option>
                    <option value="Réclamations">Réclamations</option>
                    <option value="Inscription">Inscription</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Heure *</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Lieu</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Guichet 1"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Consignes / Remarques</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Précisions pour le guichet d'accueil..."
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
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
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer au Planning</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
