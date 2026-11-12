import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { SchoolTransfer } from '../../types/secretary';
import { 
  ArrowRightLeft, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Building2, 
  FileText, 
  Calendar, 
  User, 
  X, 
  Check, 
  ArrowDownLeft, 
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const TransfersView: React.FC = () => {
  const { transfers, createTransfer, updateTransferStatus } = useSecretary();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'entrant' | 'sortant'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [transferType, setTransferType] = useState<'entrant' | 'sortant'>('entrant');
  const [studentName, setStudentName] = useState('');
  const [matricule, setMatricule] = useState('');
  const [className, setClassName] = useState('Terminale Sciences Mathématiques 1');
  const [previousSchool, setPreviousSchool] = useState('');
  const [targetSchool, setTargetSchool] = useState('');
  const [reason, setReason] = useState('Déménagement de la famille');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    createTransfer({
      type: transferType,
      studentName,
      matricule: matricule || `LEC-TRANS-${Math.floor(100 + Math.random() * 900)}`,
      className,
      previousSchool: transferType === 'sortant' ? 'Lycée d\'Excellence de Conakry' : previousSchool,
      targetSchool: transferType === 'entrant' ? 'Lycée d\'Excellence de Conakry' : targetSchool,
      reason
    });

    setStudentName('');
    setMatricule('');
    setPreviousSchool('');
    setTargetSchool('');
    setIsModalOpen(false);
  };

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = 
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.previousSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.targetSchool.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Mobilité Scolaire & Mutations
            </span>
            <span className="text-xs text-slate-400">Régulation Académique Inter-Établissements</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-purple-400" />
            <span>Gestion des Transferts Entrants & Sortants</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Enregistrement des élèves accueillis en cours d'année et émission des attestations officielles de départ.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un Transfert</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par élève, matricule, école d'origine ou d'accueil..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
        >
          <option value="all">Tous les flux (Entrants & Sortants)</option>
          <option value="entrant">Transferts Entrants (Nouvelles Arrivées)</option>
          <option value="sortant">Transferts Sortants (Départs)</option>
        </select>
      </div>

      {/* Transfers Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Flux & Type</th>
                <th className="py-3 px-3">Élève Transféré</th>
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3">École d'Origine</th>
                <th className="py-3 px-3">École de Destination</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Motif du Transfert</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTransfers.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    {t.type === 'entrant' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ArrowDownLeft className="w-3 h-3" /> Entrant (Arrivée)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        <ArrowUpRight className="w-3 h-3" /> Sortant (Départ)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{t.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{t.matricule}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">
                    {t.className}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 truncate max-w-[140px]">
                    {t.previousSchool}
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 font-medium truncate max-w-[140px]">
                    {t.targetSchool}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 whitespace-nowrap">
                    {t.transferDate}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 text-[11px] truncate max-w-[160px]">
                    {t.reason}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      t.status === 'approuve' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      t.status === 'en_cours' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.status === 'approuve' ? 'Validé' : t.status === 'en_cours' ? 'En instruction' : 'Rejeté'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {t.status === 'en_cours' ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => updateTransferStatus(t.id, 'approuve')}
                          className="p-1 rounded text-emerald-400 hover:bg-emerald-500/20"
                          title="Approuver le transfert"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateTransferStatus(t.id, 'rejete')}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                          title="Rejeter le transfert"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">{t.certificateNumber || 'Archivé'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Nouveau Dossier de Transfert</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Sens du Transfert *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferType('entrant')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-2 ${
                      transferType === 'entrant'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Transfert Entrant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType('sortant')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-2 ${
                      transferType === 'sortant'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Transfert Sortant</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nom complet de l'élève *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Abdoulaye Condé"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Matricule</label>
                  <input
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    placeholder="Ex: LEC-2026-410"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Classe concernée</label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Ex: 1ère Sciences Mathématiques"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {transferType === 'entrant' ? (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Établissement d'Origine (Ancienne École) *</label>
                  <input
                    type="text"
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    placeholder="Ex: Lycée 2 Octobre (Kaloum)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Établissement d'Accueil (Nouvelle École) *</label>
                  <input
                    type="text"
                    value={targetSchool}
                    onChange={(e) => setTargetSchool(e.target.value)}
                    placeholder="Ex: Groupe Scolaire Saint-Georges"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Motif du transfert</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Rapprochement du domicile familial, mutation..."
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
                  <span>Enregistrer le Dossier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
