import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { ParentRecord } from '../../types/secretary';
import { ImageUploadField } from '../common/ImageUploadField';
import { EmailSendModal } from '../common/EmailSendModal';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Edit3, 
  PauseCircle, 
  PlayCircle, 
  Send, 
  Phone, 
  Mail, 
  Briefcase, 
  MapPin, 
  Link as LinkIcon, 
  X, 
  Check, 
  Eye,
  KeyRound,
  Copy,
  CheckCircle2
} from 'lucide-react';

export const ParentManagementView: React.FC = () => {
  const { 
    parents, 
    students, 
    createParent, 
    updateParent, 
    toggleParentStatus, 
    sendParentCredentials, 
    linkChildToParent 
  } = useSecretary();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentRecord | null>(null);
  const [createdCredentialsParent, setCreatedCredentialsParent] = useState<ParentRecord | null>(null);
  const [emailModalParent, setEmailModalParent] = useState<ParentRecord | null>(null);
  const [copiedPwd, setCopiedPwd] = useState(false);

  // Link children modal
  const [linkingParent, setLinkingParent] = useState<ParentRecord | null>(null);
  const [selectedStudentToLink, setSelectedStudentToLink] = useState('');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+224 62');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Conakry');
  const [profession, setProfession] = useState('Cadre d\'Administration');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80');
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  const handleOpenAdd = () => {
    setEditingParent(null);
    setFirstName('');
    setLastName('');
    setPhone('+224 62');
    setEmail('');
    setAddress('Conakry');
    setProfession('Commerçant / Opérateur Économique');
    setPhoto('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80');
    setSelectedChildIds([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ParentRecord) => {
    setEditingParent(p);
    setFirstName(p.firstName);
    setLastName(p.lastName);
    setPhone(p.phone);
    setEmail(p.email);
    setAddress(p.address);
    setProfession(p.profession);
    setPhoto(p.photo);
    setSelectedChildIds(p.childrenIds);
    setIsModalOpen(true);
  };

  const handleSaveParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    if (editingParent) {
      updateParent(editingParent.id, {
        firstName,
        lastName,
        phone,
        email,
        address,
        profession,
        photo
      });
    } else {
      const created = createParent({
        firstName,
        lastName,
        phone,
        email: email.trim() || `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}@parent.gn`,
        address,
        profession,
        photo,
        childrenIds: selectedChildIds
      });
      setCopiedPwd(false);
      setCreatedCredentialsParent(created);
    }

    setIsModalOpen(false);
  };

  const handleConfirmLink = () => {
    if (linkingParent && selectedStudentToLink) {
      linkChildToParent(linkingParent.id, selectedStudentToLink);
      setLinkingParent(null);
      setSelectedStudentToLink('');
    }
  };

  const filteredParents = parents.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.childrenNames.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Relations Familles & Tuteurs Légaux
            </span>
            <span className="text-xs text-slate-500">Portail Parental SmartSchool</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>Gestion des Parents & Tuteurs d'Élèves</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Création des comptes d'accès aux notes, présences, reçus et messagerie de l'établissement.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Ajouter un Parent</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-blue-100 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom de parent, nom d'enfant, téléphone ou profession..."
          className="w-full bg-transparent text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden"
        />
      </div>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParents.map(parent => (
          <div 
            key={parent.id}
            className="p-5 rounded-2xl bg-white border border-blue-100 hover:border-slate-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={parent.photo} 
                    alt="" 
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-md shrink-0" 
                  />
                  <div>
                    <h3 className="text-sm font-bold text-blue-950 leading-tight">
                      {parent.firstName} {parent.lastName}
                    </h3>
                    <div className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3" />
                      <span>{parent.profession}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  parent.status === 'actif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                  'bg-rose-50 text-rose-600 border border-rose-200'
                }`}>
                  {parent.status}
                </span>
              </div>

              {/* Contacts */}
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-mono text-slate-900">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{parent.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{parent.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{parent.address}</span>
                </div>
              </div>

              {/* Children Linked */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Enfants inscrits ({Math.max(parent.childrenIds.length, parent.childrenNames.length)})</span>
                  <button
                    onClick={() => {
                      setLinkingParent(parent);
                      setSelectedStudentToLink('');
                    }}
                    className="text-blue-600 hover:underline flex items-center gap-1 normal-case font-medium"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Lier un enfant</span>
                  </button>
                </div>

                {parent.childrenIds.length === 0 && parent.childrenNames.length === 0 ? (
                  <div className="text-[11px] text-slate-500 italic">Aucun élève lié pour l'instant</div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {parent.childrenIds.length > 0 ? (
                      parent.childrenIds.map((cid, idx) => {
                        const child = students.find(s => s.id === cid);
                        const fallbackName = parent.childrenNames[idx] || 'Élève';
                        return (
                          <span
                            key={cid}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                          >
                            {child
                              ? `${child.firstName} ${child.lastName} · ${child.matricule} · ${child.className}`
                              : fallbackName}
                          </span>
                        );
                      })
                    ) : (
                      parent.childrenNames.map((name, idx) => {
                        const child = students.find(
                          s => `${s.firstName} ${s.lastName}`.toLowerCase() === name.toLowerCase()
                        );
                        return (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                          >
                            {child
                              ? `${child.firstName} ${child.lastName} · ${child.matricule} · ${child.className}`
                              : name}
                          </span>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Credentials Box */}
              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>User: <strong className="text-blue-950">{parent.credentials.username}</strong></span>
                <span className="text-[10px] text-emerald-600">Accès notes & présences</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
              <button
                onClick={() => setEmailModalParent(parent)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                title="Envoyer l'identifiant et le mot de passe par Email (Gmail / Mail) ou WhatsApp"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Envoyer Email</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(parent)}
                  className="p-1.5 text-slate-500 hover:text-blue-950 hover:bg-blue-50 rounded transition-colors"
                  title="Modifier"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleParentStatus(parent.id)}
                  className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-blue-50 rounded transition-colors"
                  title={parent.status === 'actif' ? 'Désactiver le compte' : 'Réactiver le compte'}
                >
                  {parent.status === 'actif' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Parent Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-blue-950">
                  {editingParent ? 'Modifier le Parent / Tuteur' : 'Créer un Compte Parent d\'Élève'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParent} className="space-y-4 text-xs">
              <ImageUploadField
                label="Photo du Parent"
                value={photo}
                onChange={setPhoto}
                aspectRatio="circle"
                helperText="Importez depuis votre PC ou saisissez une URL directe."
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Elhadj Amadou"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Diallo"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Téléphone Mobile *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+224 622 11 22 33"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@gmail.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Profession</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Ex: Médecin, Enseignant, Commerçant..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Kipé, Ratoma"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
                <span className="font-semibold block mb-0.5">Génération Automatique du Compte Parent :</span>
                Un identifiant unique et un mot de passe temporaire seront instantanément générés et notifiés par Email / WhatsApp pour donner accès aux bulletins, présences et reçus de scolarité.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer le Parent</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Child Modal */}
      {linkingParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-blue-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-blue-950">Lier un Enfant au Parent</h3>
              </div>
              <button onClick={() => setLinkingParent(null)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-700">
              Parent responsable : <strong className="text-blue-950">{linkingParent.firstName} {linkingParent.lastName}</strong>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sélectionnez l'élève à rattacher :
              </label>
              <select
                value={selectedStudentToLink}
                onChange={(e) => setSelectedStudentToLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 text-xs"
              >
                <option value="">-- Choisir un élève dans la liste --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.matricule} - {s.className})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-blue-100">
              <button
                type="button"
                onClick={() => setLinkingParent(null)}
                className="px-3.5 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmLink}
                disabled={!selectedStudentToLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Rattacher l'Enfant</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Created Parent Credentials Modal */}
      {createdCredentialsParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="bg-white border border-emerald-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-sm font-bold text-blue-950">Compte Parent Créé avec Succès</h3>
              </div>
              <button
                type="button"
                onClick={() => setCreatedCredentialsParent(null)}
                className="text-slate-500 hover:text-blue-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-slate-500">Parent / Tuteur :</span>{' '}
                <strong className="text-blue-950">{createdCredentialsParent.firstName} {createdCredentialsParent.lastName}</strong>
              </div>
              <div>
                <span className="text-slate-500">Email :</span>{' '}
                <strong className="font-mono text-blue-950">{createdCredentialsParent.email}</strong>
              </div>
              <div>
                <span className="text-slate-500">Identifiant :</span>{' '}
                <strong className="font-mono text-blue-950">{createdCredentialsParent.credentials.username}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500 block">Mot de passe initial :</span>
                  <strong className="font-mono text-sm text-emerald-700">{createdCredentialsParent.credentials.tempPassword}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(createdCredentialsParent.credentials.tempPassword || '');
                    setCopiedPwd(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPwd ? 'Copié ✓' : 'Copier'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = createdCredentialsParent;
                  setCreatedCredentialsParent(null);
                  setEmailModalParent(target);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Envoyer par Email</span>
              </button>
              <button
                type="button"
                onClick={() => setCreatedCredentialsParent(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email / Gmail / WhatsApp Parent Credentials Dispatch Modal */}
      {emailModalParent && (
        <EmailSendModal
          isOpen={Boolean(emailModalParent)}
          onClose={() => setEmailModalParent(null)}
          title="Envoyer les Identifiants Parent par Email"
          subtitle={`${emailModalParent.firstName} ${emailModalParent.lastName}`}
          recipientOptions={[
            { label: 'Parent / Tuteur', email: emailModalParent.email }
          ]}
          defaultSubject={`Identifiants Portail Parent SmartSchool - ${emailModalParent.firstName} ${emailModalParent.lastName}`}
          defaultBody={[
            `Bonjour ${emailModalParent.firstName} ${emailModalParent.lastName},`,
            '',
            'Voici vos identifiants personnels pour accéder au Portail Parent SmartSchool :',
            `- Identifiant : ${emailModalParent.credentials.username}`,
            `- Email de connexion : ${emailModalParent.email}`,
            `- Mot de passe initial : ${emailModalParent.credentials.tempPassword}`,
            '',
            `Lien de l'application : ${typeof window !== 'undefined' ? window.location.origin : ''}`,
            '',
            'Cordialement,',
            'Le Secrétariat Général'
          ].join('\n')}
          whatsappPhone={emailModalParent.phone}
          onDispatched={(channel, recipient) => {
            sendParentCredentials(emailModalParent.id, channel, recipient);
          }}
        />
      )}
    </div>
  );
};
