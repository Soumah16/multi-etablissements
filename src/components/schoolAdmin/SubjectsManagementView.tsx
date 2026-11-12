import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { SchoolSubject } from '../../types';
import { BookOpen, Plus, Search, Edit3, PauseCircle, PlayCircle, X } from 'lucide-react';

export const SubjectsManagementView: React.FC = () => {
  const { subjects, createSubject, updateSubject, toggleSubjectActive, currentSchool } = useSchoolAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SchoolSubject | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [coefficient, setCoefficient] = useState(4);
  const [department, setDepartment] = useState('Sciences Exactes');

  const departments = Array.from(new Set(subjects.map(s => s.department)));

  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'all' || s.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  const handleOpenCreate = () => {
    setSubjectToEdit(null);
    setName('');
    setCode('');
    setCoefficient(4);
    setDepartment('Sciences Exactes');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: SchoolSubject) => {
    setSubjectToEdit(sub);
    setName(sub.name);
    setCode(sub.code);
    setCoefficient(sub.coefficient);
    setDepartment(sub.department);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (subjectToEdit) {
      updateSubject(subjectToEdit.id, {
        name,
        code: code || name.substring(0, 4).toUpperCase(),
        coefficient,
        department
      });
    } else {
      createSubject({
        schoolId: currentSchool.id,
        name,
        code: code || name.substring(0, 4).toUpperCase(),
        coefficient,
        department,
        active: true
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Gestion des Matières & Coefficients ({subjects.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configuration du barème officiel d'évaluation, codes matières et départements disciplinaires
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une Matière</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par matière, code ou département..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tous les départements ({departments.length})</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Intitulé de la Matière</th>
              <th className="py-3 px-4">Département Disciplinaire</th>
              <th className="py-3 px-4">Coefficient Officiel</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            {filteredSubjects.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-400">
                  {sub.code}
                </td>
                <td className="py-3 px-4 font-semibold text-white">
                  {sub.name}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {sub.department}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                  Coef. {sub.coefficient}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                    sub.active ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sub.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {sub.active ? 'Active' : 'Désactivée'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleSubjectActive(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 rounded bg-slate-800 transition-colors"
                      title={sub.active ? "Désactiver" : "Activer"}
                    >
                      {sub.active ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                {subjectToEdit ? "Modifier la Matière" : "Créer une Nouvelle Matière"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nom de la matière *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mathématiques, Histoire..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Code abrégé</label>
                  <input
                    type="text"
                    placeholder="MATH-SM"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white uppercase font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Coefficient d'examen *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={15}
                    value={coefficient}
                    onChange={e => setCoefficient(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Département</label>
                <input
                  type="text"
                  placeholder="Sciences Exactes, Lettres..."
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  {subjectToEdit ? "Enregistrer" : "Créer la matière"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
