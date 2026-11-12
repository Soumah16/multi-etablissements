import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { StudentMonitoringRecord, StudentRiskCategory } from '../../types/director';
import { 
  Users, 
  Search, 
  Award, 
  AlertTriangle, 
  UserX, 
  Phone, 
  Mail, 
  Eye, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';

export const StudentMonitoringView: React.FC = () => {
  const { studentRecords } = useDirector();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<StudentRiskCategory>('tous');
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<StudentMonitoringRecord | null>(null);

  const filteredStudents = studentRecords.filter(st => {
    const matchesSearch = 
      `${st.firstName} ${st.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.className.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'tous' || st.riskCategory === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const countByCategory = (cat: StudentRiskCategory) => {
    if (cat === 'tous') return studentRecords.length;
    return studentRecords.filter(s => s.riskCategory === cat).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Détection Automatique & Prévention
            </span>
            <span className="text-xs text-slate-400">864 Élèves sous Surveillance</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>Suivi des Élèves & Alertes de Décrochage</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Identification précoce des élèves en difficulté, absentéisme critique et valorisation des élèves méritants.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'tous', label: 'Tous les élèves', count: countByCategory('tous'), color: 'text-slate-200' },
          { id: 'excellent', label: "Tableau d'Honneur", count: countByCategory('excellent'), color: 'text-amber-400' },
          { id: 'regulier', label: 'Réguliers', count: countByCategory('regulier'), color: 'text-blue-400' },
          { id: 'en_difficulte', label: 'En Difficulté', count: countByCategory('en_difficulte'), color: 'text-amber-300' },
          { id: 'a_risque', label: 'À Risque de Décrochage', count: countByCategory('a_risque'), color: 'text-rose-400' },
          { id: 'absenteisme_critique', label: 'Absentéisme Critique', count: countByCategory('absenteisme_critique'), color: 'text-red-400' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as StudentRiskCategory)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.id 
                ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold font-mono ${
              activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom d'élève, matricule ou classe..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden"
        />
      </div>

      {/* Students Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Élève & Matricule</th>
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3 text-center">Moyenne Actuelle</th>
                <th className="py-3 px-3 text-center">Évolution</th>
                <th className="py-3 px-3 text-center">Rang</th>
                <th className="py-3 px-3">Absences / Retards</th>
                <th className="py-3 px-3">Statut Risque</th>
                <th className="py-3 px-3">Contact Responsable</th>
                <th className="py-3 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    Aucun élève trouvé dans cette catégorie.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const evolution = student.generalAverage - student.previousAverage;
                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.photo} 
                            alt="" 
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" 
                          />
                          <div>
                            <div className="font-bold text-white">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{student.matricule}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-300">
                        {student.className}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-sm font-mono font-black ${
                          student.generalAverage >= 14 ? 'text-emerald-400' :
                          student.generalAverage >= 10 ? 'text-blue-400' : 'text-rose-400'
                        }`}>
                          {student.generalAverage.toFixed(2)}/20
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-bold ${
                          evolution > 0 ? 'text-emerald-400' : evolution < 0 ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {evolution > 0 ? <TrendingUp className="w-3 h-3" /> : evolution < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                          {evolution > 0 ? `+${evolution.toFixed(2)}` : evolution.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">
                        {student.rank}e
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        <span className={student.unjustifiedAbsencesHours > 10 ? 'text-rose-400 font-bold' : ''}>
                          {student.absencesHours}h abs ({student.unjustifiedAbsencesHours}h inj.)
                        </span>
                        <div className="text-[10px] text-slate-500">{student.delaysCount} retards</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          student.riskCategory === 'excellent' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          student.riskCategory === 'regulier' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                          student.riskCategory === 'en_difficulte' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          student.riskCategory === 'a_risque' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          'bg-red-600/20 text-red-300 border-red-500/40'
                        }`}>
                          {student.riskCategory === 'excellent' ? "Tableau d'Honneur" :
                           student.riskCategory === 'regulier' ? 'Régulier' :
                           student.riskCategory === 'en_difficulte' ? 'En difficulté' :
                           student.riskCategory === 'a_risque' ? 'À risque décrochage' : 'Absentéiste chronique'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-xs text-slate-300">{student.parentName}</div>
                        <a 
                          href={`tel:${student.parentPhone}`} 
                          className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{student.parentPhone}</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudentForDossier(student)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Consulter le dossier pédagogique complet"
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Modal */}
      {selectedStudentForDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedStudentForDossier.photo} 
                  alt="" 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700" 
                />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedStudentForDossier.firstName} {selectedStudentForDossier.lastName}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Matricule : <span className="font-mono text-slate-300">{selectedStudentForDossier.matricule}</span> · {selectedStudentForDossier.className}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedStudentForDossier(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic stats cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase">Moyenne</span>
                <span className="text-xl font-black text-emerald-400 font-mono block">
                  {selectedStudentForDossier.generalAverage.toFixed(2)}/20
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase">Classement</span>
                <span className="text-xl font-black text-white font-mono block">
                  {selectedStudentForDossier.rank}e
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase">Conduite</span>
                <span className="text-xl font-black text-blue-400 font-mono block">
                  {selectedStudentForDossier.conductScore}/20
                </span>
              </div>
            </div>

            {/* Note & Diagnosis */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Diagnostic Pédagogique du Directeur des Études :
              </span>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{selectedStudentForDossier.pedagogicalNotes}"
              </p>
            </div>

            {/* Parent Contact Info */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Coordonnées du Responsable Légal
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{selectedStudentForDossier.parentName}</span>
                <div className="flex items-center gap-3">
                  <a 
                    href={`tel:${selectedStudentForDossier.parentPhone}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Appeler</span>
                  </a>
                  <a 
                    href={`mailto:${selectedStudentForDossier.parentEmail}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedStudentForDossier(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
