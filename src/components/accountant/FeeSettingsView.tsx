import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { FeeConfiguration, FeeCategory } from '../../types/accountant';
import { 
  Sliders, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Calendar, 
  Search,
  Printer,
  Sparkles
} from 'lucide-react';

export const FeeSettingsView: React.FC = () => {
  const { fees, addFee, updateFee, toggleFeeStatus, formatGnf } = useAccountant();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeConfiguration | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FeeCategory>('scolarite');
  const [amountGnf, setAmountGnf] = useState<number>(2400000);
  const [level, setLevel] = useState('Lycée');
  const [dueDate, setDueDate] = useState('2026-11-30');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingFee(null);
    setName('');
    setCategory('scolarite');
    setAmountGnf(2400000);
    setLevel('Lycée');
    setDueDate('2026-11-30');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (fee: FeeConfiguration) => {
    setEditingFee(fee);
    setName(fee.name);
    setCategory(fee.category);
    setAmountGnf(fee.amountGnf);
    setLevel(fee.level);
    setDueDate(fee.dueDate);
    setDescription(fee.description);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingFee) {
      updateFee(editingFee.id, {
        name,
        category,
        amountGnf,
        level,
        dueDate,
        description
      });
    } else {
      addFee({
        name,
        category,
        amountGnf,
        level,
        dueDate,
        description,
        status: 'actif'
      });
    }

    setModalOpen(false);
  };

  const filteredFees = fees.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-emerald-600" />
            <span>Configuration de la Grille des Frais Scolaires</span>
          </h1>
          <p className="text-xs text-slate-500">
            Paramétrage des droits d'inscription, scolarité, cantine, transport et examens en Francs Guinéens (GNF)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Configurer un Nouveau Frais</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher un frais scolaire..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-blue-100 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="text-xs text-slate-500">
          {filteredFees.length} rubriques configurées
        </div>
      </div>

      {/* Fees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFees.map(fee => (
          <div 
            key={fee.id}
            className={`rounded-2xl bg-white border p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-lg space-y-4 ${
              fee.status === 'actif' ? 'border-blue-100' : 'border-blue-100 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {fee.category}
                </span>
                <button
                  onClick={() => toggleFeeStatus(fee.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    fee.status === 'actif'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-slate-50 text-slate-500'
                  }`}
                >
                  {fee.status === 'actif' ? 'Actif ✓' : 'Inactif'}
                </button>
              </div>

              <h2 className="text-base font-bold text-blue-950 tracking-tight leading-snug">{fee.name}</h2>
              <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                {fee.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Niveau : <strong className="text-slate-700">{fee.level}</strong></span>
                <span className="font-mono text-amber-700">Échéance : {fee.dueDate}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Tarif Réglementaire</div>
                <div className="text-lg font-black font-mono text-emerald-600">
                  {formatGnf(fee.amountGnf)}
                </div>
              </div>

              <button
                onClick={() => openEditModal(fee)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add or Edit Fee */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white border border-blue-100 shadow-2xl overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="px-5 py-3.5 border-b border-blue-100 flex items-center justify-between shrink-0 bg-white">
              <h3 className="font-bold text-sm text-blue-950">
                {editingFee ? 'Modifier le tarif du frais' : 'Configurer un nouveau frais'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-blue-950 p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 text-xs">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nom du frais *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Frais de Scolarité Annuelle - Terminale"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Catégorie *</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-hidden"
                    >
                      <option value="scolarite">Frais de scolarité</option>
                      <option value="inscription">Frais d'inscription</option>
                      <option value="examen">Frais d'examen national</option>
                      <option value="transport">Transport scolaire (Bus)</option>
                      <option value="cantine">Cantine scolaire</option>
                      <option value="uniforme">Uniforme & Tenue</option>
                      <option value="bibliotheque">Bibliothèque & Labo</option>
                      <option value="special">Frais spéciaux</option>
                      <option value="autre">Autre frais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Montant en GNF *</label>
                    <input 
                      type="number" 
                      required
                      min="1000"
                      step="10000"
                      value={amountGnf}
                      onChange={e => setAmountGnf(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Niveau concerné *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Lycée, Collège, Tous..."
                      value={level}
                      onChange={e => setLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Date d'échéance *</label>
                    <input 
                      type="date" 
                      required
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Description & Modalités</label>
                  <textarea 
                    rows={3}
                    placeholder="Précisez les tranches acceptées, les conditions de règlement..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="px-5 py-3 border-t border-blue-100 bg-white flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-blue-950 bg-slate-50 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  {editingFee ? 'Enregistrer Modifications' : 'Créer le Frais'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
