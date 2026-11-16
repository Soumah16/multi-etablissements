import React, { useState, useEffect } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { DeliveredCertificate, DocumentCertificateType } from '../../types/secretary';
import { 
  FileCheck, 
  Plus, 
  Search, 
  Printer, 
  ShieldCheck, 
  Eye, 
  X, 
  Check, 
  FileText,
  Edit3,
  Building2,
  Award
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
import { RealQrCode } from '../common/RealQrCode';

interface SchoolCertTheme {
  frameClass: string;
  paperBgClass: string;
  headerBgClass: string;
  titleColorClass: string;
  accentBadgeClass: string;
  sealBorderClass: string;
  ministryLabel: string;
  academicLabel: string;
  templateLabel: string;
}

function getSchoolCertificateTheme(schoolType?: string, schoolId?: string): SchoolCertTheme {
  const normalizedType = (schoolType || '').toLowerCase();
  if (normalizedType.includes('université') || schoolId === 'sch-gn-kk-002') {
    return {
      frameClass: 'border-4 border-double border-rose-800',
      paperBgClass: 'bg-[#FFFDF9]',
      headerBgClass: 'bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 text-white rounded-xl p-5',
      titleColorClass: 'text-rose-900 decoration-rose-400',
      accentBadgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
      sealBorderClass: 'border-rose-800 text-rose-900',
      ministryLabel: 'Ministère de l\'Enseignement Supérieur, de la Recherche Scientifique et de l\'Innovation (MESRSI)',
      academicLabel: 'Année Universitaire 2026 - 2027 · Régime LMD',
      templateLabel: 'Modèle Académique Supérieur (Sceau Universitaire)'
    };
  }
  if (normalizedType.includes('collège') || schoolId === 'sch-gn-kd-003') {
    return {
      frameClass: 'border-4 border-emerald-700',
      paperBgClass: 'bg-[#F8FCFA]',
      headerBgClass: 'bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900 text-white rounded-xl p-5',
      titleColorClass: 'text-emerald-800 decoration-emerald-400',
      accentBadgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      sealBorderClass: 'border-emerald-700 text-emerald-800',
      ministryLabel: 'Ministère de l\'Enseignement Pré-Universitaire et de l\'Alphabétisation (MEPU-A)',
      academicLabel: 'Année Scolaire 2026 - 2027 · Enseignement Secondaire I',
      templateLabel: 'Modèle Officiel Collège (Cadre Émeraude)'
    };
  }
  if (normalizedType.includes('institut') || schoolId === 'sch-gn-lb-004') {
    return {
      frameClass: 'border-4 border-indigo-800',
      paperBgClass: 'bg-[#F8F9FF]',
      headerBgClass: 'bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-xl p-5',
      titleColorClass: 'text-indigo-900 decoration-indigo-400',
      accentBadgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      sealBorderClass: 'border-indigo-700 text-indigo-900',
      ministryLabel: 'Ministère de l\'Enseignement Technique, de la Formation Professionnelle et de l\'Emploi',
      academicLabel: 'Année de Formation 2026 - 2027 · Filière Professionnelle',
      templateLabel: 'Modèle Technique & Professionnel (Cadre Indigo)'
    };
  }
  if (normalizedType.includes('primaire') || schoolId === 'sch-gn-ck-005') {
    return {
      frameClass: 'border-4 border-sky-600',
      paperBgClass: 'bg-[#F7FBFF]',
      headerBgClass: 'bg-gradient-to-r from-sky-800 via-blue-700 to-sky-800 text-white rounded-xl p-5',
      titleColorClass: 'text-sky-800 decoration-sky-400',
      accentBadgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
      sealBorderClass: 'border-sky-700 text-sky-900',
      ministryLabel: 'Ministère de l\'Enseignement Pré-Universitaire et de l\'Alphabétisation (MEPU-A)',
      academicLabel: 'Année Scolaire 2026 - 2027 · Cycle Élémentaire',
      templateLabel: 'Modèle École Primaire (Cadre Azur)'
    };
  }
  // Default: Lycée
  return {
    frameClass: 'border-4 border-double border-amber-600',
    paperBgClass: 'bg-[#FFFDF7]',
    headerBgClass: 'bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-xl p-5',
    titleColorClass: 'text-amber-800 decoration-amber-500/60',
    accentBadgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    sealBorderClass: 'border-amber-700 text-amber-900',
    ministryLabel: 'Ministère de l\'Enseignement Pré-Universitaire et de l\'Alphabétisation (MEPU-A)',
    academicLabel: 'Année Scolaire 2026 - 2027 · Enseignement Secondaire Général',
    templateLabel: 'Modèle Lycée d\'Excellence (Sceau Or & Bleu Nuit)'
  };
}

export const CertificatesView: React.FC = () => {
  const { certificates, students, generateCertificate, updateCertificate, profile } = useSecretary();
  const { currentSchool } = useSchoolAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<DeliveredCertificate | null>(null);
  const [selectedCertificateForView, setSelectedCertificateForView] = useState<DeliveredCertificate | null>(null);

  // Create Form Fields (with editable Student Name, Matricule & Class)
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'custom');
  const [studentNameInput, setStudentNameInput] = useState<string>(
    students[0] ? `${students[0].firstName} ${students[0].lastName}` : ''
  );
  const [matriculeInput, setMatriculeInput] = useState<string>(students[0]?.matricule || '');
  const [classNameInput, setClassNameInput] = useState<string>(students[0]?.className || '');
  const [certificateType, setCertificateType] = useState<DocumentCertificateType>('certificat_scolarite');
  const [purpose, setPurpose] = useState('Dossier administratif et social');
  const [issueDateInput, setIssueDateInput] = useState<string>(new Date().toISOString().split('T')[0]);

  // Edit existing certificate form states
  const [editStudentName, setEditStudentName] = useState('');
  const [editMatricule, setEditMatricule] = useState('');
  const [editClassName, setEditClassName] = useState('');
  const [editType, setEditType] = useState<DocumentCertificateType>('certificat_scolarite');
  const [editPurpose, setEditPurpose] = useState('');
  const [editIssueDate, setEditIssueDate] = useState('');

  // Auto-fill editable student inputs when selecting a student from dropdown
  useEffect(() => {
    if (selectedStudentId === 'custom') return;
    const st = students.find(s => s.id === selectedStudentId);
    if (st) {
      setStudentNameInput(`${st.firstName} ${st.lastName}`);
      setMatriculeInput(st.matricule);
      setClassNameInput(st.className);
    }
  }, [selectedStudentId, students]);

  const getDocTypeLabel = (type: DocumentCertificateType) => {
    switch (type) {
      case 'certificat_scolarite': return 'Certificat de Scolarité';
      case 'attestation_inscription': return 'Attestation d\'Inscription';
      case 'attestation_frequentation': return 'Attestation de Fréquentation';
      case 'attestation_reussite': return 'Attestation de Réussite';
      case 'attestation_transfert': return 'Attestation de Transfert';
      default: return 'Document Officiel';
    }
  };

  const handleOpenGenerateModal = () => {
    const first = students[0];
    if (first) {
      setSelectedStudentId(first.id);
      setStudentNameInput(`${first.firstName} ${first.lastName}`);
      setMatriculeInput(first.matricule);
      setClassNameInput(first.className);
    } else {
      setSelectedStudentId('custom');
      setStudentNameInput('');
      setMatriculeInput('');
      setClassNameInput('');
    }
    setIssueDateInput(new Date().toISOString().split('T')[0]);
    setPurpose('Dossier administratif et social');
    setIsGenerateModalOpen(true);
  };

  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNameInput.trim() || !matriculeInput.trim()) return;

    const newDoc = generateCertificate(selectedStudentId || 'custom', certificateType, purpose, {
      studentName: studentNameInput.trim(),
      matricule: matriculeInput.trim(),
      className: classNameInput.trim(),
      issueDate: issueDateInput
    });
    setIsGenerateModalOpen(false);
    setSelectedCertificateForView(newDoc);
  };

  const handleOpenEditModal = (doc: DeliveredCertificate) => {
    setEditingCert(doc);
    setEditStudentName(doc.studentName);
    setEditMatricule(doc.matricule);
    setEditClassName(doc.className);
    setEditType(doc.type);
    setEditPurpose(doc.purpose);
    setEditIssueDate(doc.issueDate);
  };

  const handleSaveEditCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editStudentName.trim() || !editMatricule.trim()) return;

    const updates: Partial<DeliveredCertificate> = {
      studentName: editStudentName.trim(),
      matricule: editMatricule.trim(),
      className: editClassName.trim(),
      type: editType,
      purpose: editPurpose.trim(),
      issueDate: editIssueDate
    };
    updateCertificate(editingCert.id, updates);

    if (selectedCertificateForView?.id === editingCert.id) {
      setSelectedCertificateForView({ ...selectedCertificateForView, ...updates });
    }
    setEditingCert(null);
  };

  const handlePrint = () => {
    if (selectedCertificateForView) {
      triggerPrint('certificate-printable-paper', `Certificat_${selectedCertificateForView.certificateNumber}`);
    } else {
      triggerPrint();
    }
  };

  const filteredCertificates = certificates.filter(c => {
    const matchesSearch = 
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.schoolName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const activeSchoolTheme = getSchoolCertificateTheme(currentSchool?.type, currentSchool?.id);

  // Resolve school branding on a certificate specimen
  const getCertBranding = (doc: DeliveredCertificate) => {
    const schoolName = doc.schoolName || currentSchool?.name || "Lycée d'Excellence de Conakry";
    const schoolCode = doc.schoolCode || currentSchool?.code || 'LEC-CKY';
    const schoolType = doc.schoolType || currentSchool?.type || 'Lycée';
    const schoolId = doc.schoolId || currentSchool?.id;
    const schoolCity = doc.schoolCity || currentSchool?.city || 'Conakry';
    const schoolAddress = doc.schoolAddress || currentSchool?.address || 'Boulevard Diallo Telli, Kaloum';
    const schoolPhone = doc.schoolPhone || currentSchool?.phone || '+224 621 34 56 78';
    const schoolLogo = doc.schoolLogo || currentSchool?.logo;
    const theme = getSchoolCertificateTheme(schoolType, schoolId);
    return { schoolName, schoolCode, schoolType, schoolId, schoolCity, schoolAddress, schoolPhone, schoolLogo, theme };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Actes Administratifs Légaux
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${activeSchoolTheme.accentBadgeClass}`}>
              {currentSchool?.name} ({currentSchool?.code}) · {activeSchoolTheme.templateLabel}
            </span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-amber-700" />
            <span>Certificats & Attestations Administratives</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Modèle officiel propre à <strong className="text-blue-950">{currentSchool?.name}</strong> — Nom de l'élève, matricule et classe entièrement modifiables avant et après émission.
          </p>
        </div>

        <button
          onClick={handleOpenGenerateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/30 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Délivrer un Document</span>
        </button>
      </div>

      {/* Active School Model Banner */}
      <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {currentSchool?.logo && (
            <img
              src={currentSchool.logo}
              alt={currentSchool.name}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
            />
          )}
          <div className="text-xs">
            <div className="font-bold text-blue-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Gabari Actif : {currentSchool?.name} ({currentSchool?.type})</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Préfixe numérotation : <strong className="font-mono text-blue-700">{(currentSchool?.code || 'LEC').split('-')[0]}</strong> · Lieu : <strong>{currentSchool?.city}</strong> · Modèle : {activeSchoolTheme.templateLabel}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
          ✓ En-tête, sceau & QR Code dédiés à cet établissement
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-white border border-blue-100">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par élève, matricule, école ou numéro de document..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
        >
          <option value="all">Tous les types de documents</option>
          <option value="certificat_scolarite">Certificat de Scolarité</option>
          <option value="attestation_inscription">Attestation d'Inscription</option>
          <option value="attestation_frequentation">Attestation de Fréquentation</option>
          <option value="attestation_reussite">Attestation de Réussite</option>
          <option value="attestation_transfert">Attestation de Transfert</option>
        </select>
      </div>

      {/* Certificates Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Numéro Certificat</th>
                <th className="py-3 px-3">Établissement</th>
                <th className="py-3 px-3">Type de Document</th>
                <th className="py-3 px-3">Élève Titulaire & Matricule</th>
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3">Date d'Émission</th>
                <th className="py-3 px-3">Motif / Usage</th>
                <th className="py-3 px-4 text-right">Actions & PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredCertificates.map(doc => {
                const branding = getCertBranding(doc);
                return (
                  <tr key={doc.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700 whitespace-nowrap">
                      {doc.certificateNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${branding.theme.accentBadgeClass}`}>
                        {branding.schoolCode}
                      </span>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5">
                        {branding.schoolName}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {getDocTypeLabel(doc.type)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-blue-950">{doc.studentName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{doc.matricule}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {doc.className}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {doc.issueDate}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px] truncate max-w-[160px]">
                      {doc.purpose}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(doc)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 inline-flex items-center gap-1 cursor-pointer"
                          title="Modifier le nom, le matricule ou la classe"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => setSelectedCertificateForView(doc)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Consulter</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Document Modal (Editable Student Name, Matricule, Class) */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-amber-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-700" />
                <div>
                  <h3 className="text-base font-bold text-blue-950">Émettre un Document Officiel</h3>
                  <p className="text-[11px] text-slate-500">Modèle : {currentSchool?.name} ({currentSchool?.code})</p>
                </div>
              </div>
              <button onClick={() => setIsGenerateModalOpen(false)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pré-remplir depuis le registre élève (optionnel)
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedStudentId(val);
                    if (val === 'custom') {
                      setStudentNameInput('');
                      setMatriculeInput('');
                      setClassNameInput('');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                >
                  <option value="custom">-- Saisie manuelle libre (autre élève) --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.matricule} - {s.className})
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable Nom, Matricule, Classe */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                  Identité de l'Élève sur le Certificat (Modifiable)
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nom & Prénom de l'élève *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentNameInput}
                    onChange={(e) => setStudentNameInput(e.target.value)}
                    placeholder="Ex: Mamadou Bhoye Diallo"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-semibold focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Matricule *
                    </label>
                    <input
                      type="text"
                      required
                      value={matriculeInput}
                      onChange={(e) => setMatriculeInput(e.target.value)}
                      placeholder="Ex: LEC-2026-045"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-mono focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Classe fréquentée *
                    </label>
                    <input
                      type="text"
                      required
                      value={classNameInput}
                      onChange={(e) => setClassNameInput(e.target.value)}
                      placeholder="Ex: Terminale SM 1"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Type d'Acte Administratif *
                  </label>
                  <select
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value as DocumentCertificateType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  >
                    <option value="certificat_scolarite">Certificat de Scolarité</option>
                    <option value="attestation_inscription">Attestation d'Inscription</option>
                    <option value="attestation_frequentation">Attestation de Fréquentation</option>
                    <option value="attestation_reussite">Attestation de Réussite</option>
                    <option value="attestation_transfert">Attestation de Transfert</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date d'émission *
                  </label>
                  <input
                    type="date"
                    required
                    value={issueDateInput}
                    onChange={(e) => setIssueDateInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Motif / Destinataire du Document *
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Ex: Candidature Bourse d'État, Caisse Nationale de Sécurité Sociale..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                <span className="font-semibold block mb-0.5">Modèle Propre à {currentSchool?.name} :</span>
                Ce certificat portera le logo, l'adresse ({currentSchool?.city}), le cachet et le QR code propres à cet établissement.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/30"
                >
                  <Check className="w-4 h-4" />
                  <span>Délivrer & Générer le PDF</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Certificate Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-blue-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-bold text-blue-950">Modifier le Certificat</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{editingCert.certificateNumber}</p>
                </div>
              </div>
              <button onClick={() => setEditingCert(null)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom & Prénom de l'élève *</label>
                <input
                  type="text"
                  required
                  value={editStudentName}
                  onChange={e => setEditStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Matricule *</label>
                  <input
                    type="text"
                    required
                    value={editMatricule}
                    onChange={e => setEditMatricule(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Classe *</label>
                  <input
                    type="text"
                    required
                    value={editClassName}
                    onChange={e => setEditClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type d'Acte</label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value as DocumentCertificateType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  >
                    <option value="certificat_scolarite">Certificat de Scolarité</option>
                    <option value="attestation_inscription">Attestation d'Inscription</option>
                    <option value="attestation_frequentation">Attestation de Fréquentation</option>
                    <option value="attestation_reussite">Attestation de Réussite</option>
                    <option value="attestation_transfert">Attestation de Transfert</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date d'Émission</label>
                  <input
                    type="date"
                    required
                    value={editIssueDate}
                    onChange={e => setEditIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif / Usage *</label>
                <input
                  type="text"
                  required
                  value={editPurpose}
                  onChange={e => setEditPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer les Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate Paper Specimen Modal (Distinct Per School) */}
      {selectedCertificateForView && (() => {
        const branding = getCertBranding(selectedCertificateForView);
        const { theme } = branding;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Top Modal Controls */}
              <div className="p-4 bg-blue-50/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-700" />
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      Spécimen Officiel · {selectedCertificateForView.certificateNumber}
                    </h3>
                    <div className="text-[10px] text-slate-500">{branding.schoolName} ({branding.schoolCode})</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(selectedCertificateForView)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Éditer élève / matricule</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimer / PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedCertificateForView(null)}
                    className="p-1.5 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Document Paper (Distinct per School) */}
              <div id="certificate-printable-paper" className={`flex-1 overflow-y-auto p-6 sm:p-8 ${theme.paperBgClass} text-slate-900 font-serif print:bg-white print:text-black`}>
                <div className={`p-6 rounded-2xl ${theme.frameClass} space-y-6 bg-white/90`}>
                  {/* Distinct Per-School Header Banner */}
                  <div className={theme.headerBgClass}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div className="flex items-center gap-3">
                        {branding.schoolLogo ? (
                          <img
                            src={branding.schoolLogo}
                            alt={branding.schoolName}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-white/40 bg-white shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
                            <Award className="w-7 h-7 text-amber-300" />
                          </div>
                        )}
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 font-sans">
                            RÉPUBLIQUE DE GUINÉE · Travail - Justice - Solidarité
                          </div>
                          <div className="text-[10px] text-white/80 font-sans">
                            {theme.ministryLabel}
                          </div>
                          <div className="text-base sm:text-lg font-black uppercase tracking-tight text-white font-sans pt-0.5">
                            {branding.schoolName}
                          </div>
                          <div className="text-[10px] text-white/75 font-sans">
                            {branding.schoolAddress}, {branding.schoolCity} · Tél : {branding.schoolPhone}
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/25 text-center shrink-0 font-sans">
                        <div className="text-[9px] uppercase text-white/70">Code Établissement</div>
                        <div className="text-xs font-black font-mono text-amber-300">{branding.schoolCode}</div>
                        <div className="text-[9px] text-white/80 font-mono mt-0.5">Réf: {selectedCertificateForView.certificateNumber}</div>
                      </div>
                    </div>
                  </div>

                  {/* Title of Act */}
                  <div className="text-center py-2">
                    <h2 className={`text-xl font-black uppercase tracking-wider font-sans underline underline-offset-8 ${theme.titleColorClass}`}>
                      {getDocTypeLabel(selectedCertificateForView.type)}
                    </h2>
                    <div className="text-xs font-sans text-slate-500 mt-2 font-mono">
                      {theme.academicLabel}
                    </div>
                  </div>

                  {/* Attestation Text Body */}
                  <div className="text-sm text-slate-900 space-y-4 leading-relaxed font-sans">
                    <p>
                      Je soussigné(e), <strong>{profile.name}</strong>, {profile.title} de l'établissement <strong className="text-blue-950">{branding.schoolName}</strong> ({branding.schoolCity}), certifie par la présente que l'élève :
                    </p>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-sans">
                      <div>Nom & Prénom : <strong className="text-blue-950 text-base">{selectedCertificateForView.studentName}</strong></div>
                      <div>Matricule National / Scolaire : <strong className="font-mono text-teal-700">{selectedCertificateForView.matricule}</strong></div>
                      <div>Classe Fréquentée : <strong className="text-slate-900">{selectedCertificateForView.className}</strong></div>
                      <div>Établissement : <strong>{branding.schoolName} ({branding.schoolCode})</strong></div>
                    </div>

                    <p>
                      Est régulièrement inscrit(e) sur les registres officiels de notre établissement pour l'année scolaire <strong>2026 - 2027</strong> et poursuit sa scolarité avec assiduité.
                    </p>

                    <p className="text-xs text-slate-500 italic">
                      En foi de quoi, le présent document lui est délivré pour servir et valoir ce que de droit, notamment pour : <span className="text-slate-900 font-medium">{selectedCertificateForView.purpose}</span>.
                    </p>
                  </div>

                  {/* Footer Signatures and Verification QR */}
                  <div className="pt-6 border-t border-slate-200 flex items-end justify-between gap-4 font-sans">
                    <div className="space-y-1">
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-black shrink-0 w-24 h-24 flex flex-col items-center justify-center shadow-md">
                        <RealQrCode
                          value={selectedCertificateForView.qrVerificationUrl || `CERT|${selectedCertificateForView.certificateNumber}|${selectedCertificateForView.matricule}|${branding.schoolCode}`}
                          size={64}
                          fgColor="#0f172a"
                        />
                        <span className="text-[7px] font-mono font-bold mt-0.5">{branding.schoolCode}</span>
                      </div>
                      <div className="text-[8px] text-slate-500 font-mono">Scan d'authenticité officiel</div>
                    </div>

                    <div className="text-right space-y-1.5 text-xs">
                      <div className="text-slate-600">Fait à {branding.schoolCity}, le {selectedCertificateForView.issueDate}</div>
                      <div className="font-bold text-blue-950 uppercase text-xs pt-1">Pour la Direction de {branding.schoolName},</div>
                      <div className="text-amber-700 font-bold">{selectedCertificateForView.signedBy}</div>
                      <div className={`inline-block mt-1 px-3 py-1 rounded-full border-2 border-dashed text-[10px] font-black uppercase tracking-wider ${theme.sealBorderClass}`}>
                        Cachet Officiel · {branding.schoolCode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
