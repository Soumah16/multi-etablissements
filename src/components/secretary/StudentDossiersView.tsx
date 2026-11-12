import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { StudentEnrollment } from '../../types/secretary';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  FileCheck, 
  FileText, 
  Download, 
  Eye, 
  X, 
  Check, 
  Phone
} from 'lucide-react';

export const StudentDossiersView: React.FC = () => {
  const { students, updateStudent, showToast } = useSecretary();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'incomplet' | 'complet'>('all');
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<StudentEnrollment | null>(null);

  const standardDocuments = [
    { key: 'fiche_inscription', label: 'Fiche d\'inscription signée par le tuteur' },
    { key: 'extrait_naissance', label: 'Extrait de naissance légalisé' },
    { key: 'photos_identite', label: 'Photos d\'identité récentes (2 exemplaires)' },
    { key: 'carnet_vaccination', label: 'Carnet de vaccination à jour & groupe sanguin' },
    { key: 'bulletins_anterieurs', label: 'Bulletins scolaires de l\'année précédente' },
    { key: 'certificat_visite', label: 'Certificat médical d\'aptitude physique' }
  ];

  const handleValidateDocument = (studentId: string, docLabel: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const remainingMissing = student.missingDocuments.filter(d => d !== docLabel);
    updateStudent(studentId, {
      missingDocuments: remainingMissing,
      dossierStatus: remainingMissing.length === 0 ? 'complet' : 'incomplet'
    });

    if (selectedStudentForDossier && selectedStudentForDossier.id === studentId) {
      setSelectedStudentForDossier({
        ...selectedStudentForDossier,
        missingDocuments: remainingMissing,
        dossierStatus: remainingMissing.length === 0 ? 'complet' : 'incomplet'
      });
    }

    showToast(`Pièce "${docLabel}" enregistrée et validée au dossier !`);
  };

  const handleRelanceParent = (student: StudentEnrollment) => {
    showToast(`SMS de relance envoyé au parent de ${student.firstName} (${student.parentPhone})`);
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch = 
      `${st.firstName} ${st.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || st.dossierStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Archivage Numérique Sécurisé
            </span>
            <span className="text-xs text-slate-400">Suivi de Conformité des Pièces</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-teal-400" />
            <span>Dossiers Administratifs des Élèves</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Contrôle des extraits de naissance, certificats médicaux, bulletins antérieurs et relances des pièces manquantes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] uppercase font-semibold text-emerald-400 block">Dossiers Complets</span>
            <span className="text-lg font-bold text-white font-mono">
              {students.filter(s => s.dossierStatus === 'complet').length}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="text-[10px] uppercase font-semibold text-rose-300 block">Dossiers Incomplets</span>
            <span className="text-lg font-bold text-rose-400 font-mono">
              {students.filter(s => s.dossierStatus === 'incomplet').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par élève ou classe..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
        >
          <option value="all">Tous les dossiers</option>
          <option value="incomplet">Dossiers incomplets (avec pièces à réclamer)</option>
          <option value="complet">Dossiers conformes et complets</option>
        </select>
      </div>

      {/* Grid of Dossiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => {
          const isIncomplete = student.dossierStatus === 'incomplet';

          return (
            <div 
              key={student.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between space-y-4 ${
                isIncomplete ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={student.photo} 
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 shadow-md" 
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="text-[10px] text-teal-400 font-mono mt-0.5">
                        {student.matricule} · {student.className}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isIncomplete 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isIncomplete ? 'Incomplet' : 'Complet'}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Tuteur : </span>
                  <span className="font-semibold text-slate-200">{student.parentName}</span> ({student.parentPhone})
                </div>

                {/* Missing docs alert box */}
                {isIncomplete ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                    <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Pièces administratives manquantes :</span>
                    </div>
                    <ul className="text-[10px] text-rose-200 list-disc list-inside space-y-0.5">
                      {student.missingDocuments.map((doc, idx) => (
                        <li key={idx} className="truncate">{doc}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Toutes les pièces obligatoires sont archivées et conformes.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedStudentForDossier(student)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-400" />
                  <span>Inspecter Dossier</span>
                </button>

                {isIncomplete && (
                  <button
                    onClick={() => handleRelanceParent(student)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-xs transition-colors"
                    title="Envoyer un rappel par SMS pour dépôt des pièces"
                  >
                    <Send className="w-3 h-3" />
                    <span>Relancer Parent</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dossier Detail Inspection Modal */}
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
                    Dossier Numérique de {selectedStudentForDossier.firstName} {selectedStudentForDossier.lastName}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Matricule : {selectedStudentForDossier.matricule} · {selectedStudentForDossier.className}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedStudentForDossier(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checklist of documents */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">
                État des Pièces Reçues & Enregistrées au Secrétariat :
              </span>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pt-1">
                {standardDocuments.map(doc => {
                  const isMissing = selectedStudentForDossier.missingDocuments.includes(doc.label);

                  return (
                    <div 
                      key={doc.key}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isMissing 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-200' 
                          : 'bg-slate-800/60 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {isMissing ? (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span className="truncate">{doc.label}</span>
                      </div>

                      {isMissing ? (
                        <button
                          onClick={() => handleValidateDocument(selectedStudentForDossier.id, doc.label)}
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white bg-teal-600 hover:bg-teal-500 shrink-0"
                        >
                          Valider réception
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                          Archivé ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Responsable légal : <strong className="text-white">{selectedStudentForDossier.parentName}</strong></span>
              <a 
                href={`tel:${selectedStudentForDossier.parentPhone}`} 
                className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <Phone className="w-3 h-3" />
                <span>{selectedStudentForDossier.parentPhone}</span>
              </a>
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
