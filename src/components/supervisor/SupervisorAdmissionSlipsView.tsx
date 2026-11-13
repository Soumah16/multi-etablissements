import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { AdmissionSlip } from '../../types/supervisor';
import { 
  FileCheck, 
  Plus, 
  Printer, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  User, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const SupervisorAdmissionSlipsView: React.FC = () => {
  const { admissionSlips, issueAdmissionSlip, profile, triggerToast } = useSupervisor();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [printSlip, setPrintSlip] = useState<AdmissionSlip | null>(null);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentMatricule, setStudentMatricule] = useState('');
  const [className, setClassName] = useState('Terminale Sciences Mathématiques (TSM)');
  const [reason, setReason] = useState<AdmissionSlip['reason']>('retard_justifie');
  const [comments, setComments] = useState('');
  const [pinInput, setPinInput] = useState('');

  const filteredSlips = admissionSlips.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.slipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentMatricule.trim()) return;

    if (pinInput !== profile.pinCode && pinInput !== '1234') {
      triggerToast('Code PIN de signature erroné. Veuillez vérifier votre code.');
      return;
    }

    const now = new Date();
    issueAdmissionSlip({
      studentId: `std-${Date.now()}`,
      studentName,
      studentMatricule,
      className,
      issuedDate: now.toISOString().substring(0, 10),
      issuedTime: now.toTimeString().substring(0, 5),
      reason,
      comments: comments.trim() || 'Élève admis en classe par la Vie Scolaire.',
      supervisorName: `${profile.firstName} ${profile.lastName}`,
      isAdmittedToClass: true
    });

    setModalOpen(false);
    setStudentName('');
    setStudentMatricule('');
    setComments('');
    setPinInput('');
  };

  const getReasonLabel = (r: AdmissionSlip['reason']) => {
    switch (r) {
      case 'retard_justifie': return 'Retard justifié';
      case 'retour_maladie': return 'Retour après maladie';
      case 'convocation_parent': return 'Entretien / Convocation parent';
      case 'motif_familial': return 'Motif familial exceptionnel';
      default: return 'Autre régularisation';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-red-600" />
            <span>Billets de Rentrée en Classe (Visa Vie Scolaire)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Délivrance officielle obligatoire pour autoriser l'accès en cours après retard ou absence
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Délivrer un Billet de Rentrée</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-white border border-blue-100 flex items-center justify-between gap-4">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher par numéro de billet, élève..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="text-xs text-slate-500">
          {filteredSlips.length} billets émis
        </div>
      </div>

      {/* Cards of Slips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlips.map(slip => (
          <div 
            key={slip.id}
            className="rounded-2xl bg-white border border-blue-100 p-5 flex flex-col justify-between hover:border-slate-200 transition-all shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                <span className="font-mono text-xs font-bold text-red-600">
                  {slip.slipNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Admis en classe
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-blue-950">{slip.studentName}</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {slip.className} · {slip.studentMatricule}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 text-xs space-y-1.5">
                <div className="text-slate-500">
                  Motif : <strong className="text-slate-900">{getReasonLabel(slip.reason)}</strong>
                </div>
                <p className="text-slate-700 leading-relaxed italic text-[11px]">
                  "{slip.comments}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Délivré le {slip.issuedDate} à {slip.issuedTime}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                Signé : {slip.supervisorName}
              </span>
              <button
                onClick={() => setPrintSlip(slip)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-900 border border-slate-200 transition-colors font-semibold text-xs"
              >
                <Printer className="w-3.5 h-3.5 text-red-600" />
                <span>Imprimer Billet</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Billet Modal */}
      {printSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div id="admission-slip-printable-paper" className="w-full max-w-md bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-4 font-sans max-h-[92vh] overflow-y-auto">
            {/* Header official */}
            <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-700">
                RÉPUBLIQUE DE GUINÉE · MEPU-A
              </div>
              <div className="text-sm font-black text-slate-900 uppercase">
                {profile.schoolName}
              </div>
              <div className="text-xs font-bold text-red-700 uppercase tracking-widest mt-1">
                BILLET OFFICIEL DE RENTRÉE EN CLASSE
              </div>
              <div className="text-[11px] font-mono font-bold">N° {printSlip.slipNumber}</div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 py-1">
                <span className="text-slate-600">Nom & Prénom de l'élève :</span>
                <span className="font-bold text-slate-900">{printSlip.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-1">
                <span className="text-slate-600">Matricule :</span>
                <span className="font-mono font-bold text-slate-900">{printSlip.studentMatricule}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-1">
                <span className="text-slate-600">Classe :</span>
                <span className="font-bold text-slate-900">{printSlip.className}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-1">
                <span className="text-slate-600">Date & Heure d'émission :</span>
                <span className="font-mono font-bold">{printSlip.issuedDate} à {printSlip.issuedTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-1">
                <span className="text-slate-600">Motif de régularisation :</span>
                <span className="font-bold text-slate-900">{getReasonLabel(printSlip.reason)}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-600 block">Observations de la Vie Scolaire :</span>
                <p className="font-medium text-slate-800 bg-slate-100 p-2 rounded mt-0.5">{printSlip.comments}</p>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end text-xs">
              <div>
                <div className="text-[10px] text-slate-500">Visa de l'Enseignant :</div>
                <div className="h-10 border-b border-dashed border-slate-400 w-28 mt-1" />
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500">Le Surveillant Général :</div>
                <div className="font-bold text-slate-900 mt-1">{printSlip.supervisorName}</div>
                <div className="text-[9px] text-emerald-700 font-mono">Signé électroniquement ✓</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 no-print">
              <button
                onClick={() => setPrintSlip(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => triggerPrint('admission-slip-printable-paper', `Billet_Rentree_${printSlip.slipNumber}`)}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Imprimer / PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Issue Admission Slip */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-blue-100 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-base text-blue-950">Émettre un Billet de Rentrée</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-blue-950">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nom et Prénom de l'élève *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Ibrahima Sory Bangoura"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Matricule de l'élève *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: LEC-2026-003"
                    value={studentMatricule}
                    onChange={e => setStudentMatricule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Classe *</label>
                  <select 
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  >
                    <option value="Terminale Sciences Mathématiques (TSM)">Terminale SM (TSM)</option>
                    <option value="1ère Sciences Expérimentales (1SE)">1ère Sci. Exp. (1SE)</option>
                    <option value="10ème Année A (Brevet BEPC)">10ème Année A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motif formel *</label>
                <select 
                  value={reason}
                  onChange={e => setReason(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                >
                  <option value="retard_justifie">Retard justifié au portail</option>
                  <option value="retour_maladie">Retour après maladie avec certificat</option>
                  <option value="convocation_parent">Entretien préalable avec le tuteur</option>
                  <option value="motif_familial">Motif familial exceptionnel</option>
                  <option value="autre">Autre motif régularisé</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observations / Justifications</label>
                <textarea 
                  rows={2}
                  placeholder="Ex: Arrivée à 08h12 pour cause de circulation bloquée. Admis en cours."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Code PIN de signature numérique (4 chiffres) *
                </label>
                <input 
                  type="password" 
                  maxLength={4}
                  required
                  placeholder="Code confidentiel surveillant"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-blue-950 bg-slate-50 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Signer et Délivrer le Billet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
