import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { ScholarshipRecord } from '../../types/accountant';
import { 
  Award, 
  Plus, 
  Search, 
  CheckCircle2, 
  Calendar, 
  Percent, 
  HeartHandshake, 
  Sparkles,
  Users
} from 'lucide-react';

export const ScholarshipsView: React.FC = () => {
  const { scholarships, addScholarship, formatGnf } = useAccountant();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [studentName, setStudentName] = useState('');
  const [studentMatricule, setStudentMatricule] = useState('');
  const [className, setClassName] = useState('Terminale Sciences Mathématiques (TSM)');
  const [type, setType] = useState<ScholarshipRecord['type']>('bourse_excellence');
  const [title, setTitle] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(50);
  const [reason, setReason] = useState('');
  const [grantedBy, setGrantedBy] = useState('Direction Générale & Trésorerie');
  const [validUntil, setValidUntil] = useState('2027-06-30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !title.trim()) return;

    addScholarship({
      studentId: `std-${Date.now()}`,
      studentName,
      studentMatricule: studentMatricule || `LEC-2026-${Math.floor(100 + Math.random() * 900)}`,
      className,
      type,
      title,
      discountPercentage,
      reason,
      grantedBy,
      validUntil
    });

    setModalOpen(false);
    setStudentName('');
    setTitle('');
    setReason('');
  };

  const filtered = scholarships.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentMatricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Bourses d'Études, Réductions & Remises Exceptionnelles</span>
          </h1>
          <p className="text-xs text-slate-400">
            Attribution des bourses d'excellence, remises fratrie et aides sociales certifiées
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Accorder une Bourse / Réduction</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher par élève ou motif..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {filtered.length} bourses actives
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div 
            key={item.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.type.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  Valide jusqu'au {item.validUntil}
                </span>
              </div>

              <h2 className="text-base font-bold text-white tracking-tight">{item.title}</h2>
              <div className="text-xs text-slate-300">
                Bénéficiaire : <strong className="text-white">{item.studentName}</strong> ({item.studentMatricule})
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Classe : {item.className}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">Motif d'attribution :</div>
                <p className="text-slate-300 italic">"{item.reason}"</p>
                <div className="text-[10px] text-slate-500 pt-1">Accordé par : {item.grantedBy}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">Taux de déduction :</div>
              <div className="text-xl font-black font-mono text-amber-400 flex items-center gap-1">
                <span>-{item.discountPercentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Grant Scholarship */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Accorder une réduction / bourse d'études</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 text-xs">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nom de l'élève *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Fatoumata Zahra Bah"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Matricule</label>
                  <input 
                    type="text" 
                    placeholder="Ex: LEC-2026-006"
                    value={studentMatricule}
                    onChange={e => setStudentMatricule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Classe *</label>
                  <input 
                    type="text" 
                    required
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type de remise *</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="bourse_excellence">Bourse d'Excellence</option>
                    <option value="reduction_fratrie">Réduction Fratrie (Plusieurs enfants)</option>
                    <option value="aide_sociale">Aide Sociale & Solidarité</option>
                    <option value="enfant_personnel">Enfant du Personnel</option>
                    <option value="remise_speciale">Remise Spéciale Direction</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Titre de la bourse *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Bourse d'Excellence Scientifique"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pourcentage de réduction (%) *</label>
                  <input 
                    type="number" 
                    min="5"
                    max="100"
                    required
                    value={discountPercentage}
                    onChange={e => setDiscountPercentage(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motif d'attribution & Justification *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Justification (Moyenne supérieure à 16/20, situation familiale, recommandation APEE)..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Accordé par *</label>
                  <input 
                    type="text" 
                    required
                    value={grantedBy}
                    onChange={e => setGrantedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date d'expiration *</label>
                  <input 
                    type="date" 
                    required
                    value={validUntil}
                    onChange={e => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/30"
                >
                  Valider l'Attribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
