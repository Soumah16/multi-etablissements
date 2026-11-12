import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { 
  Archive, 
  Search, 
  RotateCcw, 
  FileText, 
  Users, 
  Eye, 
  Calendar,
  CheckCircle2,
  FolderArchive
} from 'lucide-react';

export const SecretaryArchivesView: React.FC = () => {
  const { students, parents, certificates, restoreStudent } = useSecretary();
  const [activeTab, setActiveTab] = useState<'students' | 'parents' | 'certificates'>('students');
  const [searchTerm, setSearchTerm] = useState('');

  const archivedStudents = students.filter(s => s.status === 'archive' || s.status === 'transfere');
  const archivedParents = parents.filter(p => p.status === 'archive' || p.status === 'desactive');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Registres Historiques & Archives Légales
            </span>
            <span className="text-xs text-slate-400">Conservation Numérique 10 Ans</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Archive className="w-6 h-6 text-amber-400" />
            <span>Archives Administratives de l'Établissement</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Consultation des anciens élèves, dossiers archivés, parents inactifs et historiques des actes scolaires.
          </p>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'students' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Élèves Archivés & Transférés ({archivedStudents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('parents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'parents' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>Parents Inactifs ({archivedParents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'certificates' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documents Archivés ({certificates.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Recherche avancée dans les archives..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden"
        />
      </div>

      {/* Content by active tab */}
      {activeTab === 'students' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Élève</th>
                <th className="py-3 px-3">Matricule</th>
                <th className="py-3 px-3">Dernière Classe</th>
                <th className="py-3 px-3">Date Inscription</th>
                <th className="py-3 px-3">Motif Archivage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {archivedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    Aucun élève dans les archives actuellement.
                  </td>
                </tr>
              ) : (
                archivedStudents.map(st => (
                  <tr key={st.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{st.firstName} {st.lastName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Tuteur : {st.parentName}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-amber-400">{st.matricule}</td>
                    <td className="py-3 px-3 text-slate-300">{st.className}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{st.registrationDate}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {st.status === 'transfere' ? 'Transféré vers autre école' : 'Dossier archivé'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => restoreStudent(st.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 ml-auto transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Réactiver l'Élève</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'parents' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Parent / Tuteur</th>
                <th className="py-3 px-3">Téléphone</th>
                <th className="py-3 px-3">Profession</th>
                <th className="py-3 px-3">Enfants rattachés</th>
                <th className="py-3 px-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {archivedParents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    Aucun parent inactif archivé.
                  </td>
                </tr>
              ) : (
                archivedParents.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">{p.firstName} {p.lastName}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{p.phone}</td>
                    <td className="py-3 px-3 text-slate-400">{p.profession}</td>
                    <td className="py-3 px-3 text-slate-300">{p.childrenNames.join(', ')}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        Compte Désactivé
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">N° Référence</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Élève Titulaire</th>
                <th className="py-3 px-3">Date d'Émission</th>
                <th className="py-3 px-3">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {certificates.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{c.certificateNumber}</td>
                  <td className="py-3 px-3 uppercase text-[10px] font-semibold text-slate-300">{c.type}</td>
                  <td className="py-3 px-3 font-bold text-white">{c.studentName}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{c.issueDate}</td>
                  <td className="py-3 px-3 text-slate-400">{c.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
