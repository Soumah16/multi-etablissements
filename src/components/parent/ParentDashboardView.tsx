import React, { useState } from 'react';
import { useParent } from '../../context/ParentContext';
import { 
  Users, 
  Award, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Smartphone,
  PhoneCall,
  UserCheck
} from 'lucide-react';

export const ParentDashboardView: React.FC = () => {
  const { 
    childrenList, 
    selectedChild, 
    setSelectedChildId, 
    payments, 
    notifications, 
    formatGnf, 
    setActiveParentTab,
    initiateMobilePayment 
  } = useParent();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payFeeType, setPayFeeType] = useState('2ème Tranche Scolarité');
  const [payAmount, setPayAmount] = useState(700000);
  const [payMethod, setPayMethod] = useState<'Orange Money' | 'MTN MoMo'>('Orange Money');
  const [payPhone, setPayPhone] = useState('622 11 22 33');

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initiateMobilePayment(selectedChild.id, payFeeType, payAmount, payMethod, payPhone);
    setPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-blue-50/40 to-blue-50/80 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Espace Parent Sécurisé (Consultation)
            </span>
            <span className="text-xs text-slate-500">Année Académique 2026-2027</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950 mt-1">
            Suivi Scolaire & Financier de vos Enfants
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consultez les notes, l'assiduité, les bulletins et réglez les scolarités via Orange Money & MTN MoMo.
          </p>
        </div>

        {/* Children Quick Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-blue-50/60 p-1.5 rounded-xl border border-slate-200">
          {childrenList.map(child => {
            const isSelected = child.id === selectedChild.id;
            return (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-700 hover:text-blue-950 hover:bg-blue-100'
                }`}
              >
                <img 
                  src={child.photo} 
                  alt="" 
                  className="w-5 h-5 rounded-full object-cover border border-white/20" 
                />
                <span>{child.firstName}</span>
                <span className="text-[10px] opacity-75 font-normal">({child.className})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary KPI Grid for Selected Child */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Moyenne Générale</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-600">
              {selectedChild.generalAverage} <span className="text-sm font-normal text-slate-500">/ 20</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Rang : <strong className="text-blue-950">{selectedChild.classRank}ème</strong> sur {selectedChild.totalStudents} élèves
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Devoirs & Travaux</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-700">{selectedChild.pendingHomeworkCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Devoirs en attente de rendu</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Assiduité (Absences)</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-950">{selectedChild.absencesCount}h</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {selectedChild.delaysCount} retards enregistrés
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Solde Scolarité Dû</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-xl font-black ${selectedChild.feesDueGnf > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {formatGnf(selectedChild.feesDueGnf)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Payé : {formatGnf(selectedChild.feesPaidGnf)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Child Detail Card & Quick Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child Full Summary (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-blue-950">
                Fiche de l'Élève : {selectedChild.firstName} {selectedChild.lastName}
              </h2>
            </div>
            <button
              onClick={() => setActiveParentTab('children')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>Dossier complet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={selectedChild.photo}
              alt={selectedChild.firstName}
              className="w-20 h-24 rounded-xl object-cover border-2 border-blue-200 shadow-md shrink-0"
            />
            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-blue-950">
                  {selectedChild.firstName} {selectedChild.lastName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedChild.className}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-700 bg-slate-100">
                  {selectedChild.matricule}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Professeur Principal : <strong className="text-slate-900">{selectedChild.mainTeacher}</strong>
              </div>
              <div className="text-xs text-slate-500">
                Groupe Sanguin : <span className="font-bold text-rose-600">{selectedChild.bloodGroup}</span> · Niveau : {selectedChild.level}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => setActiveParentTab('grades')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Voir les notes & bulletin
                </button>
                <button
                  onClick={() => setActiveParentTab('homework')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  Devoirs à rendre
                </button>
              </div>
            </div>
          </div>

          {/* Quick Pay Highlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-blue-50/80 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
                <Smartphone className="w-4 h-4" />
                <span>Paiement Direct Orange Money & MTN MoMo</span>
              </div>
              <div className="text-xs text-slate-700 mt-1">
                Réglez instantanément la scolarité en Francs Guinéens (GNF) et recevez un reçu officiel certifié.
              </div>
            </div>

            <button
              onClick={() => setPaymentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/20 whitespace-nowrap cursor-pointer"
            >
              Payer maintenant (GNF)
            </button>
          </div>
        </div>

        {/* Recent Notifications & Urgent Alerts */}
        <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-950">Notifications & Alertes</h3>
            </div>
            <button
              onClick={() => setActiveParentTab('communication')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              Messagerie →
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.slice(0, 4).map(notif => (
              <div key={notif.id} className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    notif.category === 'Note' ? 'bg-emerald-50 text-emerald-700' :
                    notif.category === 'Absence' ? 'bg-rose-50 text-rose-700' :
                    notif.category === 'Paiement' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {notif.category}
                  </span>
                  <span className="text-[10px] text-slate-500">{notif.date}</span>
                </div>
                <div className="text-xs font-bold text-blue-950">{notif.title}</div>
                <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {notif.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Money Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-orange-600">
              <Smartphone className="w-5 h-5" />
              <h3 className="text-base font-bold text-blue-950">Paiement Mobile Money (GNF)</h3>
            </div>
            <p className="text-xs text-slate-500">
              Réglez les frais scolaires pour <strong>{selectedChild.firstName} {selectedChild.lastName}</strong> ({selectedChild.className}).
            </p>

            <form onSubmit={handlePaySubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Type de Frais</label>
                <select
                  value={payFeeType}
                  onChange={(e) => setPayFeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                >
                  <option value="1ère Tranche Scolarité">1ère Tranche Scolarité</option>
                  <option value="2ème Tranche Scolarité">2ème Tranche Scolarité</option>
                  <option value="3ème Tranche Scolarité">3ème Tranche Scolarité</option>
                  <option value="Frais d'Examen Blanc & Concours">Frais d'Examen Blanc & Concours</option>
                  <option value="Cantine & Restauration (Mois)">Cantine & Restauration (Mois)</option>
                  <option value="Transport Scolaire Bus">Transport Scolaire Bus</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Montant en Francs Guinéens (GNF) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Opérateur de Paiement Mobile</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('Orange Money')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                      payMethod === 'Orange Money' 
                        ? 'bg-orange-50 border-orange-500 text-orange-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>🟠 Orange Money (*144#)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('MTN MoMo')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                      payMethod === 'MTN MoMo' 
                        ? 'bg-amber-100 border-amber-500 text-amber-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>🟡 MTN MoMo (*440#)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Numéro de Téléphone Débiteur</label>
                <input
                  type="text"
                  required
                  value={payPhone}
                  onChange={(e) => setPayPhone(e.target.value)}
                  placeholder="ex: 622 00 00 00"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono"
                />
              </div>

              <div className="p-3 rounded-lg bg-blue-50/60 border border-slate-200 text-[11px] text-slate-500">
                Une invite USSD sera envoyée sur votre téléphone. Validez avec votre code secret Mobile Money.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer"
                >
                  Confirmer le paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
