import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { DisciplinaryParentMeeting } from '../../types/supervisor';
import { 
  Calendar, 
  Plus, 
  Search, 
  Printer, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  User,
  Send
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const SupervisorMeetingsView: React.FC = () => {
  const { meetings, scheduleMeeting, profile, triggerToast } = useSupervisor();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [printMeeting, setPrintMeeting] = useState<DisciplinaryParentMeeting | null>(null);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('1ère Sciences Expérimentales (1SE)');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+224 62');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('15:00');
  const [reason, setReason] = useState('');

  const filteredMeetings = meetings.filter(m => 
    m.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentName.trim() || !date) return;

    scheduleMeeting({
      studentName,
      className,
      parentName,
      parentPhone,
      date,
      time,
      reason,
      meetingNotes: 'Convocation officielle transmise par la Vie Scolaire'
    });

    setModalOpen(false);
    setStudentName('');
    setParentName('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-purple-400" />
            <span>Convocations des Parents & Entretiens Disciplinaires</span>
          </h1>
          <p className="text-xs text-slate-400">
            Gestion des rendez-vous avec les tuteurs légaux suite à infractions ou absentéisme
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Programmer un Entretien</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher par élève ou parent..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          {filteredMeetings.length} rendez-vous programmés
        </div>
      </div>

      {/* Meetings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMeetings.map(m => (
          <div 
            key={m.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-bold text-base text-white">{m.studentName}</span>
                <span className="text-xs text-slate-400 ml-2 font-mono">({m.className})</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {m.date} à {m.time}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-slate-500" />
                <span>Parent convoqué : <strong className="text-white">{m.parentName}</strong> ({m.parentPhone})</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-slate-300 leading-relaxed">
                Motif : {m.reason}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => triggerToast(`Convocation par SMS transmise au ${m.parentPhone}`)}
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Rappel SMS</span>
              </button>
              <button
                onClick={() => setPrintMeeting(m)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold"
              >
                <Printer className="w-3.5 h-3.5 text-purple-400" />
                <span>Lettre Officielle</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Convocation Letter Modal */}
      {printMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div id="meeting-convocation-printable-paper" className="w-full max-w-lg bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-4 font-sans">
            <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-700">
                RÉPUBLIQUE DE GUINÉE · MEPU-A
              </div>
              <div className="text-sm font-black text-slate-900 uppercase">
                {profile.schoolName}
              </div>
              <div className="text-xs font-bold text-purple-800 uppercase tracking-widest mt-1">
                LETTRE OFFICIELLE DE CONVOCATION DISCIPLINAIRE
              </div>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-slate-800">
              <p>Conakry, le {printMeeting.date}</p>
              <p>
                <strong>À l'attention de :</strong> {printMeeting.parentName}, Tuteur légal de l'élève <strong>{printMeeting.studentName}</strong> (Classe de {printMeeting.className}).
              </p>
              <p>
                Madame, Monsieur,
              </p>
              <p>
                Vous êtes instamment prié(e) de bien vouloir vous présenter au bureau de la <strong>Vie Scolaire & Discipline</strong> le :
              </p>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center font-bold text-sm text-purple-900">
                {printMeeting.date} à {printMeeting.time} précises
              </div>
              <p>
                <strong>Objet de l'entretien :</strong> {printMeeting.reason}.
              </p>
              <p>
                Votre présence est indispensable pour l'examen de la situation de votre enfant.
              </p>
            </div>

            <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end text-xs">
              <div className="text-[10px] text-slate-500">Cachet de l'Établissement</div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500">Le Surveillant Général :</div>
                <div className="font-bold text-slate-900 mt-1">{profile.firstName} {profile.lastName}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 no-print">
              <button
                onClick={() => setPrintMeeting(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => triggerPrint('meeting-convocation-printable-paper', `Convocation_${printMeeting.studentName.replace(/\s+/g, '_')}`)}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Imprimer Convocation / PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Meeting */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Programmer un Rendez-vous</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Élève concerné *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Mohamed Lamine Camara"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Classe *</label>
                <input 
                  type="text" 
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nom du parent / tuteur *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: M. Lansana Camara"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Téléphone *</label>
                  <input 
                    type="text" 
                    required
                    value={parentPhone}
                    onChange={e => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date du rendez-vous *</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Heure *</label>
                  <input 
                    type="time" 
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motif officiel *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Ex: Examen du dossier disciplinaire suite à altercation et retenues non effectuées..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Programmer et Notifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
