import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { StudentEnrollment } from '../../types/secretary';
import { ImageUploadField } from '../common/ImageUploadField';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Archive, 
  RotateCcw, 
  CreditCard, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ArrowRightLeft, 
  Eye, 
  X, 
  Check, 
  HeartPulse,
  QrCode
} from 'lucide-react';

export const StudentEnrollmentView: React.FC = () => {
  const { 
    students, 
    parents, 
    createStudent, 
    updateStudent, 
    archiveStudent, 
    restoreStudent, 
    transferStudent, 
    sendStudentCredentials,
    setActiveSecretaryTab 
  } = useSecretary();

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [dossierFilter, setDossierFilter] = useState<'all' | 'complet' | 'incomplet'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'archive' | 'transfere'>('actif');

  // Modal registration / edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentEnrollment | null>(null);

  // Transfer modal
  const [transferModalStudent, setTransferModalStudent] = useState<StudentEnrollment | null>(null);
  const [targetSchoolName, setTargetSchoolName] = useState('Lycée 2 Octobre (Kaloum)');
  const [transferReason, setTransferReason] = useState('Déménagement familial');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2009-06-15');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80');
  const [nationality, setNationality] = useState('Guinéenne');
  const [address, setAddress] = useState('Kipé, Ratoma, Conakry');
  const [phone, setPhone] = useState('+224 622 00 11 22');
  const [email, setEmail] = useState('');
  const [className, setClassName] = useState('Terminale Sciences Mathématiques 1');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalNotes, setMedicalNotes] = useState('Aucune allergie connue. Apte au sport.');
  const [parentName, setParentName] = useState('Elhadj Amadou Diallo');
  const [parentPhone, setParentPhone] = useState('+224 622 11 22 33');
  const [parentEmail, setParentEmail] = useState('parent@gmail.com');
  const [dossierStatus, setDossierStatus] = useState<'complet' | 'incomplet'>('complet');
  const [missingDocsText, setMissingDocsText] = useState('');

  const classList = [
    'Terminale Sciences Mathématiques 1',
    'Terminale Sciences Expérimentales',
    'Terminale Sciences Sociales',
    '1ère Sciences Mathématiques',
    '1ère Sciences Expérimentales',
    '10ème Année A',
    '10ème Année B',
    '9ème Année A',
    '8ème Année A',
    '7ème Année A'
  ];

  const handleOpenRegister = () => {
    setEditingStudent(null);
    setFirstName('');
    setLastName('');
    setDateOfBirth('2009-06-15');
    setGender('M');
    setPhoto('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80');
    setNationality('Guinéenne');
    setAddress('Conakry');
    setPhone('+224 622 ');
    setEmail('');
    setClassName(classList[0]);
    setBloodGroup('O+');
    setMedicalNotes('R.A.S.');
    setParentName('');
    setParentPhone('+224 62');
    setParentEmail('');
    setDossierStatus('complet');
    setMissingDocsText('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st: StudentEnrollment) => {
    setEditingStudent(st);
    setFirstName(st.firstName);
    setLastName(st.lastName);
    setDateOfBirth(st.dateOfBirth);
    setGender(st.gender);
    setPhoto(st.photo);
    setNationality(st.nationality);
    setAddress(st.address);
    setPhone(st.phone);
    setEmail(st.email);
    setClassName(st.className);
    setBloodGroup(st.bloodGroup);
    setMedicalNotes(st.medicalNotes);
    setParentName(st.parentName);
    setParentPhone(st.parentPhone);
    setParentEmail(st.parentEmail);
    setDossierStatus(st.dossierStatus);
    setMissingDocsText(st.missingDocuments.join(', '));
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const missingDocsArray = missingDocsText.trim()
      ? missingDocsText.split(',').map(d => d.trim()).filter(Boolean)
      : [];

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        photo,
        nationality,
        address,
        phone,
        email,
        className,
        bloodGroup,
        medicalNotes,
        parentName,
        parentPhone,
        parentEmail,
        dossierStatus: missingDocsArray.length > 0 ? 'incomplet' : dossierStatus,
        missingDocuments: missingDocsArray
      });
    } else {
      createStudent({
        firstName,
        lastName,
        dateOfBirth,
        gender,
        photo,
        nationality,
        address,
        phone,
        email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@eleve.lycee-excellence.gn`,
        classId: 'cls-001',
        className,
        bloodGroup,
        medicalNotes,
        parentId: '',
        parentName,
        parentPhone,
        parentEmail,
        dossierStatus: missingDocsArray.length > 0 ? 'incomplet' : dossierStatus,
        missingDocuments: missingDocsArray
      });
    }

    setIsModalOpen(false);
  };

  const handleExecuteTransfer = () => {
    if (transferModalStudent) {
      transferStudent(transferModalStudent.id, targetSchoolName, transferReason);
      setTransferModalStudent(null);
    }
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch = 
      `${st.firstName} ${st.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || st.className === classFilter;
    const matchesDossier = dossierFilter === 'all' || st.dossierStatus === dossierFilter;
    const matchesStatus = statusFilter === 'all' || st.status === statusFilter;
    return matchesSearch && matchesClass && matchesDossier && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Registres d'Inscription & Matricules
            </span>
            <span className="text-xs text-slate-400">Année Scolaire 2026-2027</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            <span>Gestion des Élèves & Inscriptions</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Immatriculation, génération des identifiants et cartes scolaires numériques avec QR Code infalsifiable.
          </p>
        </div>

        <button
          onClick={handleOpenRegister}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/30 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Inscrire un Élève</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par élève ou matricule..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
        >
          <option value="all">Toutes les classes</option>
          {classList.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={dossierFilter}
          onChange={(e) => setDossierFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
        >
          <option value="all">Tous dossiers (Complets & Incomplets)</option>
          <option value="complet">Dossiers complets uniquement</option>
          <option value="incomplet">Dossiers incomplets uniquement</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-teal-500"
        >
          <option value="all">Tous statuts</option>
          <option value="actif">Élèves Actifs</option>
          <option value="transfere">Élèves Transférés</option>
          <option value="archive">Élèves Archivés</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Élève & Photo</th>
                <th className="py-3 px-3">Matricule & Identifiant</th>
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3">Médical & Groupe</th>
                <th className="py-3 px-3">Tuteur Légal</th>
                <th className="py-3 px-3">Dossier</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-4 text-right">Actions Secrétariat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    Aucun élève ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.photo} 
                          alt="" 
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0 shadow-xs" 
                        />
                        <div>
                          <div className="font-bold text-white leading-tight">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Né(e) le {student.dateOfBirth} · Sexe : {student.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-teal-400">{student.matricule}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        User: <strong className="text-white">{student.credentials.username}</strong>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {student.className}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        {student.bloodGroup}
                      </span>
                      <div className="text-[10px] text-slate-400 truncate max-w-[130px] mt-0.5">
                        {student.medicalNotes}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-medium">{student.parentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" />
                        <span>{student.parentPhone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {student.dossierStatus === 'complet' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Complet
                        </span>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <AlertCircle className="w-3 h-3" /> Incomplet
                          </span>
                          <div className="text-[9px] text-rose-300 mt-0.5 truncate max-w-[120px]">
                            {student.missingDocuments.join(', ')}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        student.status === 'actif' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        student.status === 'transfere' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => sendStudentCredentials(student.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                          title="Renvoyer identifiants et mot de passe par SMS & Email"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setActiveSecretaryTab('cards')}
                          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded transition-colors"
                          title="Générer & Imprimer Carte Scolaire"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          title="Modifier les informations"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {student.status === 'actif' ? (
                          <>
                            <button
                              onClick={() => {
                                setTransferModalStudent(student);
                                setTargetSchoolName('Lycée 2 Octobre (Kaloum)');
                                setTransferReason('Déménagement familial');
                              }}
                              className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded transition-colors"
                              title="Transférer l'élève vers un autre établissement"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => archiveStudent(student.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                              title="Archiver"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => restoreStudent(student.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                            title="Réactiver l'élève"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration & Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingStudent ? `Modifier l'Élève : ${editingStudent.firstName} ${editingStudent.lastName}` : 'Dossier d\'Inscription Scolaire & Création Compte'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Image Upload with dual PC file upload & direct URL support */}
              <ImageUploadField
                label="Photo d'Identité de l'Élève (pour Carte Scolaire & Trombinoscope)"
                value={photo}
                onChange={setPhoto}
                aspectRatio="circle"
                helperText="Glissez une photo depuis votre PC ou entrez une URL web directe."
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Mamadou Bhoye"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nom de famille *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Diallo"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date de Naissance *</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Sexe *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nationalité</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Classe d'Affectation *</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    {classList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Groupe Sanguin</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Adresse de Résidence</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Kipé Centre, Commune de Ratoma"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Informations Médicales & Allergies</label>
                <input
                  type="text"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="Ex: Asthme d'effort, allergie aux arachides, port de lunettes..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Legal Guardian Info */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <span className="font-bold text-slate-200 block text-xs">
                  Informations du Tuteur Légal / Parent Responsable
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nom complet du tuteur *</label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Ex: Elhadj Amadou Diallo"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Téléphone mobile tuteur *</label>
                    <input
                      type="text"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+224 622 11 22 33"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Email tuteur</label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@gmail.com"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dossier status & Missing docs */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700 space-y-2">
                <span className="font-bold text-slate-200 block text-xs">
                  Vérification des Pièces Administratives Fournies
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dossierStatus"
                      checked={dossierStatus === 'complet'}
                      onChange={() => {
                        setDossierStatus('complet');
                        setMissingDocsText('');
                      }}
                      className="text-teal-600"
                    />
                    <span className="text-emerald-400 font-semibold">Dossier Complet (Toutes pièces validées)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dossierStatus"
                      checked={dossierStatus === 'incomplet'}
                      onChange={() => setDossierStatus('incomplet')}
                      className="text-rose-600"
                    />
                    <span className="text-rose-400 font-semibold">Dossier Incomplet (Pièces en attente)</span>
                  </label>
                </div>

                {dossierStatus === 'incomplet' && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Pièces manquantes (séparées par une virgule) :
                    </label>
                    <input
                      type="text"
                      value={missingDocsText}
                      onChange={(e) => setMissingDocsText(e.target.value)}
                      placeholder="Ex: Extrait de naissance légalisé, Certificat médical, 2 photos d'identité"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-600/30"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingStudent ? 'Enregistrer les Modifications' : 'Valider Inscription & Générer Carte'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Transfert Sortant d'Élève</h3>
              </div>
              <button onClick={() => setTransferModalStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Élève : <strong className="text-white">{transferModalStudent.firstName} {transferModalStudent.lastName}</strong> ({transferModalStudent.className})
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Établissement d'accueil (Nouvelle École) :
                </label>
                <input
                  type="text"
                  value={targetSchoolName}
                  onChange={(e) => setTargetSchoolName(e.target.value)}
                  placeholder="Ex: Lycée 2 Octobre (Kaloum)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Motif officiel du transfert :
                </label>
                <textarea
                  rows={2}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Ex: Déménagement de la famille, mutation professionnelle..."
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTransferModalStudent(null)}
                className="px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleExecuteTransfer}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Valider le Transfert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
