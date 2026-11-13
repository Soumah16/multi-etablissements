import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { School, SchoolType } from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit3, 
  PauseCircle, 
  PlayCircle, 
  Archive, 
  Trash2, 
  MapPin, 
  GraduationCap, 
  HardDrive, 
  Lock, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { SchoolFormModal } from './SchoolFormModal';
import { SchoolDetailModal } from './SchoolDetailModal';

interface SchoolsManagementViewProps {
  onSwitchToSchoolAdmin?: (schoolId: string) => void;
}

export const SchoolsManagementView: React.FC<SchoolsManagementViewProps> = ({ onSwitchToSchoolAdmin }) => {
  const { 
    schools, 
    suspendSchool, 
    reactivateSchool, 
    archiveSchool, 
    deleteSchool, 
    plans,
    t 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [schoolToEdit, setSchoolToEdit] = useState<School | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Filtered schools
  const filteredSchools = schools.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.prefecture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || s.type === filterType;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenCreate = () => {
    setSchoolToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (school: School) => {
    setSchoolToEdit(school);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (school: School) => {
    setSelectedSchool(school);
  };

  const getStatusBadge = (status: School['status']) => {
    switch (status) {
      case 'active':
        return <span className="text-[11px] font-medium text-emerald-600">Actif</span>;
      case 'suspended':
        return <span className="text-[11px] font-medium text-rose-600">Suspendu</span>;
      case 'archived':
        return <span className="text-[11px] font-medium text-slate-500">Archivé</span>;
      default:
        return null;
    }
  };

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' GNF';
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            {t.schools.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.schools.subtitle}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.schools.createSchool}</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.schools.searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-blue-50/60 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-blue-50/60 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les types ({schools.length})</option>
            <option value="Primaire">Primaire</option>
            <option value="Collège">Collège</option>
            <option value="Lycée">Lycée</option>
            <option value="Université">Université</option>
            <option value="Institut professionnel">Institut professionnel</option>
            <option value="Centre de formation">Centre de formation</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-blue-50/60 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives uniquement</option>
            <option value="suspended">Suspendues uniquement</option>
            <option value="archived">Archivées uniquement</option>
          </select>
        </div>
      </div>

      {/* Schools Table */}
      <div className="rounded-xl border border-slate-200 bg-blue-50/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-blue-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Type & Localisation</th>
                <th className="py-3 px-4">Effectif & Quotas</th>
                <th className="py-3 px-4">Formule SaaS</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions de Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    Aucun établissement ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => {
                  const plan = plans.find(p => p.id === school.subscriptionTier);
                  return (
                    <tr 
                      key={school.id} 
                      className="hover:bg-blue-100 transition-colors group"
                    >
                      {/* Name & Logo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden">
                            {school.logo ? (
                              <img src={school.logo} alt={school.name} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => handleOpenDetail(school)}
                              className="font-bold text-blue-950 hover:text-blue-600 text-left transition-colors text-xs flex items-center gap-1.5"
                            >
                              <span>{school.name}</span>
                            </button>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                              <span>{school.code}</span>
                              <span>·</span>
                              <span className="text-slate-500 truncate max-w-[140px]">{school.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{school.type}</div>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{school.city}, {school.prefecture}</span>
                        </div>
                      </td>

                      {/* Students & Storage */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-900">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold">{school.stats.studentsCount.toLocaleString('fr-FR')}</span> élèves
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500 font-mono">
                          <HardDrive className="w-3 h-3 text-slate-500" />
                          <span>{(school.stats.storageUsedMb / 1024).toFixed(1)} Go utilisés</span>
                        </div>
                      </td>

                      {/* Subscription */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">
                          {plan?.name.split('(')[0] || school.subscriptionTier.toUpperCase()}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-mono tabular-nums mt-0.5">
                          {formatGnf(school.stats.monthlyRevenueGnf)} / mois
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            school.status === 'active' ? 'bg-emerald-400' : school.status === 'suspended' ? 'bg-rose-400' : 'bg-slate-400'
                          }`} />
                          {getStatusBadge(school.status)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onSwitchToSchoolAdmin && school.status === 'active' && (
                            <button
                              onClick={() => onSwitchToSchoolAdmin(school.id)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-md transition-colors"
                              title="Accéder au portail Admin École"
                            >
                              <LogIn className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenDetail(school)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            title="Consulter la fiche complète"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(school)}
                            className="p-1.5 text-slate-500 hover:text-blue-950 hover:bg-blue-100 rounded-md transition-colors"
                            title="Modifier les informations"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {school.status === 'active' ? (
                            <button
                              onClick={() => suspendSchool(school.id)}
                              className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-blue-100 rounded-md transition-colors"
                              title="Suspendre l'établissement"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => reactivateSchool(school.id)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-blue-100 rounded-md transition-colors"
                              title="Réactiver l'établissement"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => archiveSchool(school.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-blue-100 rounded-md transition-colors"
                            title="Archiver"
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Confirmez-vous la suppression irréversible de "${school.name}" ?`)) {
                                deleteSchool(school.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-blue-100 rounded-md transition-colors"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <SchoolFormModal
          schoolToEdit={schoolToEdit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Detail & Multi-Tenant Audit Modal */}
      {selectedSchool && (
        <SchoolDetailModal
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
          onEdit={(s: School) => {
            setSelectedSchool(null);
            handleOpenEdit(s);
          }}
          onOpenSchoolAdmin={onSwitchToSchoolAdmin ? (s: School) => {
            setSelectedSchool(null);
            onSwitchToSchoolAdmin(s.id);
          } : undefined}
        />
      )}
    </div>
  );
};
