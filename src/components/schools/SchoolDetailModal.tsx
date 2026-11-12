import React, { useState } from 'react';
import { School } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Building2, 
  GraduationCap, 
  Users, 
  Briefcase, 
  HardDrive, 
  Copy, 
  Check, 
  ShieldCheck, 
  Globe, 
  Phone, 
  Mail, 
  Calendar,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface SchoolDetailModalProps {
  school: School;
  onClose: () => void;
  onEdit: (school: School) => void;
  onOpenSchoolAdmin?: (school: School) => void;
}

export const SchoolDetailModal: React.FC<SchoolDetailModalProps> = ({ school, onClose, onEdit, onOpenSchoolAdmin }) => {
  const { plans, admins, suspendSchool, reactivateSchool, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'quotas' | 'tenant_isolation'>('overview');

  const currentPlan = plans.find(p => p.id === school.subscriptionTier);
  const assignedAdmin = admins.find(a => a.schoolId === school.id || a.id === school.adminId);

  const copySchoolId = () => {
    navigator.clipboard.writeText(school.id);
    setCopied(true);
    showToast(`Identifiant copié : ${school.id}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' GNF';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-8">
        {/* Banner with Logo */}
        <div className="relative h-32 w-full bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
          {school.banner && (
            <img 
              src={school.banner} 
              alt={school.name}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-6 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-slate-800 border-2 border-slate-700 shadow-md overflow-hidden flex items-center justify-center">
              {school.logo ? (
                <img src={school.logo} alt={school.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-7 h-7 text-blue-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white drop-shadow-sm">
                  {school.name}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-600/80 text-white">
                  {school.code}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                {school.type} · {school.city}, {school.prefecture} ({school.country})
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation inside modal */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/90 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'text-blue-400 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Vue d'ensemble & Stats
          </button>
          <button
            onClick={() => setActiveTab('quotas')}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === 'quotas'
                ? 'text-blue-400 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Abonnement & Quotas
          </button>
          <button
            onClick={() => setActiveTab('tenant_isolation')}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === 'tenant_isolation'
                ? 'text-blue-400 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Isolation Multi-Tenant (Audit)
          </button>
        </div>

        {/* Body content based on activeTab */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Stat grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    Élèves Inscrits
                  </div>
                  <div className="text-xl font-bold text-white mt-1 font-mono tabular-nums">
                    {school.stats.studentsCount.toLocaleString('fr-FR')}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Enseignants
                  </div>
                  <div className="text-xl font-bold text-white mt-1 font-mono tabular-nums">
                    {school.stats.teachersCount}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                    Classes
                  </div>
                  <div className="text-xl font-bold text-white mt-1 font-mono tabular-nums">
                    {school.stats.classesCount}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    Stockage Fichiers
                  </div>
                  <div className="text-xl font-bold text-white mt-1 font-mono tabular-nums">
                    {(school.stats.storageUsedMb / 1024).toFixed(1)} Go
                  </div>
                </div>
              </div>

              {/* Identity & Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-2.5">
                  <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                    Coordonnées Officielles
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{school.website || 'Aucun site enregistré'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{school.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{school.phone}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-700/50">
                    Adresse : {school.address}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-2.5">
                  <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                    Administrateur d'Établissement Désigné
                  </div>
                  {assignedAdmin ? (
                    <div className="flex items-center gap-3">
                      <img 
                        src={assignedAdmin.avatar} 
                        alt={assignedAdmin.firstName} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-600"
                      />
                      <div>
                        <div className="font-medium text-slate-200">
                          {assignedAdmin.firstName} {assignedAdmin.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{assignedAdmin.email}</div>
                        <div className="text-[11px] text-blue-400 font-mono mt-0.5">{assignedAdmin.phone}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-amber-400 text-xs italic">
                      Aucun administrateur école rattaché pour l'instant.
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                    <span>Créé le : {school.createdAt}</span>
                    <span className="font-mono text-emerald-400">Score d'activité : {school.stats.activityScore}/100</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quotas' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                  <div>
                    <div className="font-bold text-white text-sm">
                      {currentPlan?.name || school.subscriptionTier.toUpperCase()}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Tarif mensuel : <span className="text-emerald-400 font-mono font-semibold">{formatGnf(currentPlan?.priceMonthlyGnf || 0)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      school.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {school.status.toUpperCase()}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Expire le : {school.subscriptionExpiresAt}
                    </div>
                  </div>
                </div>

                {/* Quota gauges */}
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Capacité Élèves</span>
                      <span className="text-white font-mono">
                        {school.stats.studentsCount} / {currentPlan?.maxStudents || 1000} ({Math.round((school.stats.studentsCount / (currentPlan?.maxStudents || 1000)) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min(100, (school.stats.studentsCount / (currentPlan?.maxStudents || 1000)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Capacité Enseignants</span>
                      <span className="text-white font-mono">
                        {school.stats.teachersCount} / {currentPlan?.maxTeachers || 100}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${Math.min(100, (school.stats.teachersCount / (currentPlan?.maxTeachers || 100)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Stockage Alloué</span>
                      <span className="text-white font-mono">
                        {(school.stats.storageUsedMb / 1024).toFixed(1)} Go / {currentPlan?.storageGb || 50} Go
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${Math.min(100, ((school.stats.storageUsedMb / 1024) / (currentPlan?.storageGb || 50)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 text-slate-300">
                  <div className="font-semibold text-slate-200 mb-1">Modules inclus dans cette licence :</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPlan?.modules.map(m => (
                      <span key={m} className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tenant_isolation' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-300 text-sm">
                      Garantie d'Isolation Multi-Tenant Strict
                    </div>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                      Chaque table relationnelle, document et fichier de cet établissement est indexé avec la clé de partitionnement :
                    </p>
                    <div className="mt-2 flex items-center gap-2 p-2 rounded-md bg-slate-900 border border-blue-500/40 font-mono text-xs text-blue-300">
                      <code>school_id = "{school.id}"</code>
                      <button 
                        onClick={copySchoolId}
                        className="ml-auto p-1 text-slate-400 hover:text-white"
                        title="Copier l'identifiant"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="font-semibold text-slate-200">Règle de Cloisonnement Académique :</div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Conformément à la charte SmartSchool, aucune autre école ne peut requêter ou consulter les données de cet établissement. De plus, le Super Administrateur s'abstient de toute modification des notes, des absences, des bulletins ou des flux pédagogiques internes gérés exclusivement par l'Admin École.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {school.status === 'active' ? (
              <button
                onClick={() => suspendSchool(school.id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              >
                Suspendre l'accès
              </button>
            ) : (
              <button
                onClick={() => reactivateSchool(school.id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
              >
                Réactiver l'établissement
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onOpenSchoolAdmin && (
              <button
                onClick={() => onOpenSchoolAdmin(school)}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg transition-colors"
                title="Accéder à l'espace administratif de cette école"
              >
                Espace Admin École
              </button>
            )}

            <button
              onClick={() => onEdit(school)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Modifier la fiche
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
