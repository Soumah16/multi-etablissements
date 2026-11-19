import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { getAccountByRole, normalizeSchoolId } from '../../data/accountsData';
import { AdministrativeDocumentTemplate } from '../../types';
import { StudentEnrollment } from '../../types/secretary';
import { initialStudents } from '../../data/secretaryMockData';
import { loadLocalStorage, usePersistedState } from '../../utils/storage';
import { recordGlobalAuditLog } from '../../utils/auditLogger';
import { 
  FileText, 
  Printer, 
  Check, 
  UserCheck
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface SpecimenStudentInfo {
  studentName: string;
  studentMatricule: string;
  studentClass: string;
  academicYear: string;
}

export const AdministrativeDocumentsView: React.FC = () => {
  const { admins } = useApp();
  const { documentTemplates, updateDocumentTemplate, currentSchool } = useSchoolAdmin();
  const assignedAdmin = admins.find(
    a => normalizeSchoolId(a.schoolId) === normalizeSchoolId(currentSchool.id)
  );

  const [selectedDocId, setSelectedDocId] = useState(documentTemplates[0]?.id || '');
  const activeTemplate = documentTemplates.find(d => d.id === selectedDocId) || documentTemplates[0];

  const [headerText, setHeaderText] = useState(activeTemplate.headerText);
  const [footerText, setFooterText] = useState(activeTemplate.footerText);
  const [signatoryTitle, setSignatoryTitle] = useState(activeTemplate.signatoryTitle);
  const [signatoryName, setSignatoryName] = useState(activeTemplate.signatoryName);
  const [includeStamp, setIncludeStamp] = useState(activeTemplate.includeStamp);
  const [themeColor, setThemeColor] = useState(activeTemplate.themeColor);

  const [specimenMap, setSpecimenMap] = usePersistedState<Record<string, SpecimenStudentInfo>>(
    'smartschool_admin_doc_specimen_v1',
    {}
  );

  const defaultSpecimen: SpecimenStudentInfo = useMemo(() => ({
    studentName: 'CAMARA Mohamed Sékou',
    studentMatricule: `${currentSchool.code || 'LEC-CKY'}-2026-9042`,
    studentClass: 'Terminale Sciences Mathématiques 1',
    academicYear: '2026-2027'
  }), [currentSchool.code]);

  const savedSpecimen = specimenMap[currentSchool.id] || defaultSpecimen;

  const [studentName, setStudentName] = useState(savedSpecimen.studentName);
  const [studentMatricule, setStudentMatricule] = useState(savedSpecimen.studentMatricule);
  const [studentClass, setStudentClass] = useState(savedSpecimen.studentClass);
  const [academicYear, setAcademicYear] = useState(savedSpecimen.academicYear);
  const [selectedPresetStudentId, setSelectedPresetStudentId] = useState('custom');

  useEffect(() => {
    const next = specimenMap[currentSchool.id] || defaultSpecimen;
    setStudentName(next.studentName);
    setStudentMatricule(next.studentMatricule);
    setStudentClass(next.studentClass);
    setAcademicYear(next.academicYear);
  }, [currentSchool.id, specimenMap, defaultSpecimen]);

  const enrolledStudents = useMemo(() => {
    const stored = loadLocalStorage<StudentEnrollment[]>('smartschool_secretary_students_v1', initialStudents);
    return Array.isArray(stored) && stored.length > 0 ? stored : initialStudents;
  }, []);

  const handleSelectDoc = (doc: AdministrativeDocumentTemplate) => {
    setSelectedDocId(doc.id);
    setHeaderText(doc.headerText);
    setFooterText(doc.footerText);
    setSignatoryTitle(doc.signatoryTitle);
    setSignatoryName(doc.signatoryName);
    setIncludeStamp(doc.includeStamp);
    setThemeColor(doc.themeColor);
  };

  const handleSelectEnrolledStudent = (studentId: string) => {
    setSelectedPresetStudentId(studentId);
    if (studentId === 'custom') return;
    const match = enrolledStudents.find(s => s.id === studentId);
    if (match) {
      setStudentName(`${match.firstName} ${match.lastName}`);
      setStudentMatricule(match.matricule);
      setStudentClass(match.className);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = studentName.trim() || defaultSpecimen.studentName;
    const cleanMatricule = studentMatricule.trim() || defaultSpecimen.studentMatricule;
    const cleanClass = studentClass.trim() || defaultSpecimen.studentClass;
    const cleanYear = academicYear.trim() || defaultSpecimen.academicYear;

    updateDocumentTemplate(activeTemplate.id, {
      headerText,
      footerText,
      signatoryTitle,
      signatoryName,
      includeStamp,
      themeColor
    });

    setSpecimenMap(prev => ({
      ...prev,
      [currentSchool.id]: {
        studentName: cleanName,
        studentMatricule: cleanMatricule,
        studentClass: cleanClass,
        academicYear: cleanYear
      }
    }));

    const adminAccount = getAccountByRole('school_admin', currentSchool.id);
    recordGlobalAuditLog({
      action: `Personnalisation certificat « ${activeTemplate.title} » (Élève : ${cleanName})`,
      target: `${currentSchool.name} (${cleanMatricule})`,
      actorName: assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : (adminAccount?.name || 'Admin École'),
      actorRole: 'school_admin',
      actorMatricule: adminAccount?.matricule,
      schoolName: currentSchool.name,
      type: 'admin',
      severity: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            Documents Administratifs & Certificats Officiels
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Modifiez librement l'élève titulaire, le matricule, la classe et les mentions officielles avant impression ou export PDF
          </p>
        </div>

        <button
          onClick={() => triggerPrint('admin-specimen-printable', `Certificat_${(studentName || 'Eleve').replace(/\s+/g, '_')}`)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4 text-white" />
          <span>Imprimer / Export PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Select & Form */}
        <div className="lg:col-span-5 space-y-4">
          {/* Doc Type Selector */}
          <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Modèle de Document à Personnaliser
            </span>
            <div className="space-y-1.5">
              {documentTemplates.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelectDoc(doc)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                    selectedDocId === doc.id
                      ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold'
                      : 'bg-blue-50/60 border-slate-200 text-slate-700 hover:text-blue-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{doc.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Prêt</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-5 rounded-xl bg-white border border-blue-100 space-y-3.5 text-xs">
            {/* Editable Student Identity Section */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Identité de l'Élève sur le Certificat</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Pré-remplir depuis le registre des élèves</label>
                <select
                  value={selectedPresetStudentId}
                  onChange={e => handleSelectEnrolledStudent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
                >
                  <option value="custom">-- Saisie manuelle personnalisée --</option>
                  {enrolledStudents.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.matricule} · {st.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Nom & Prénom de l'élève *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => {
                    setSelectedPresetStudentId('custom');
                    setStudentName(e.target.value);
                  }}
                  placeholder="Ex: CAMARA Mohamed Sékou"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Matricule *</label>
                  <input
                    type="text"
                    required
                    value={studentMatricule}
                    onChange={e => setStudentMatricule(e.target.value)}
                    placeholder="Ex: LEC-CKY-2026-9042"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Année scolaire *</label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    placeholder="2026-2027"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Classe fréquentée *</label>
                <input
                  type="text"
                  required
                  value={studentClass}
                  onChange={e => setStudentClass(e.target.value)}
                  placeholder="Ex: Terminale Sciences Mathématiques 1"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">En-tête officiel / République *</label>
              <textarea
                rows={2}
                required
                value={headerText}
                onChange={e => setHeaderText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Titre du signataire</label>
                <input
                  type="text"
                  value={signatoryTitle}
                  onChange={e => setSignatoryTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Nom du signataire</label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={e => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Mentions de bas de page (Pied de document)</label>
              <textarea
                rows={2}
                value={footerText}
                onChange={e => setFooterText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-700 font-medium">Apposer le tampon rond officiel</span>
              <input
                type="checkbox"
                checked={includeStamp}
                onChange={e => setIncludeStamp(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-50 border-slate-200"
              />
            </div>

            <div className="pt-3 border-t border-blue-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-xs shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer les Modifications</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Printable Specimen View */}
        <div className="lg:col-span-7 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Aperçu Direct du Document Certifié Conforme
          </div>

          <div id="admin-specimen-printable" className="p-8 rounded-xl bg-white text-slate-900 shadow-2xl border border-slate-300 min-h-[500px] flex flex-col justify-between relative select-none">
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <div className="w-72 h-72 rounded-full border-8 border-slate-900 flex items-center justify-center font-extrabold text-2xl text-center p-4">
                SMARTSCHOOL GUINÉE
              </div>
            </div>

            {/* Document Header */}
            <div>
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <div className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">
                  {headerText}
                </div>
                <div className="mt-1 text-sm font-extrabold uppercase text-slate-900">
                  {currentSchool.name}
                </div>
                <div className="text-[10px] text-slate-600">
                  {currentSchool.address} · Tel : {currentSchool.phone} · {currentSchool.city || 'Conakry'}, Guinée
                </div>
              </div>

              {/* Document Title Banner */}
              <div className="my-6 text-center">
                <span className="inline-block px-6 py-1.5 border-2 border-slate-900 font-extrabold text-sm uppercase tracking-wider bg-slate-50">
                  {activeTemplate.title}
                </span>
                <div className="text-[11px] text-slate-500 font-mono mt-2">
                  Réf : {currentSchool.code}-2026-DOC-0849
                </div>
              </div>

              {/* Body prose specimen */}
              <div className="text-xs text-slate-800 leading-relaxed space-y-3 px-4">
                <p>
                  Le Directeur des Études de l'établissement soussigné certifie par la présente que l'élève :
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 space-y-1 font-mono text-[11px]">
                  <div>Nom & Prénom : <strong>{studentName || '—'}</strong></div>
                  <div>Matricule Établissement : <strong>{studentMatricule || '—'}</strong></div>
                  <div>Inscrit en classe de : <strong>{studentClass || '—'}</strong></div>
                  <div>Année Scolaire : <strong>{academicYear || '2026-2027'}</strong></div>
                </div>
                <p>
                  Est régulièrement inscrit sur les registres scolaires de notre établissement pour l'année en cours et s'acquitte scrupuleusement de ses obligations académiques.
                </p>
              </div>
            </div>

            {/* Document Footer: Stamp & Signature */}
            <div className="mt-8 pt-4 border-t border-slate-300 flex items-end justify-between px-4 text-xs">
              <div className="text-[10px] text-slate-500 max-w-xs">
                {footerText}
              </div>

              <div className="text-center relative">
                {includeStamp && (
                  <div className="absolute -top-10 -left-6 w-24 h-24 rounded-full border-2 border-red-700/60 text-red-700 flex flex-col items-center justify-center rotate-[-12deg] pointer-events-none text-[8px] font-bold p-1 uppercase opacity-85">
                    <span>* SMARTSCHOOL *</span>
                    <span>TAMPON OFFICIEL</span>
                    <span>{currentSchool.code}</span>
                  </div>
                )}
                <div className="text-[11px] font-bold text-slate-900">
                  {signatoryTitle}
                </div>
                <div className="h-10 flex items-center justify-center font-serif text-sm italic text-blue-900">
                  {signatoryName}
                </div>
                <div className="text-[9px] text-slate-500">
                  Cachet et signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
