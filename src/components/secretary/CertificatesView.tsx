import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { DeliveredCertificate, DocumentCertificateType } from '../../types/secretary';
import { 
  FileCheck, 
  Plus, 
  Search, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Download, 
  Eye, 
  X, 
  Check, 
  FileText,
  Calendar,
  Building2
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const CertificatesView: React.FC = () => {
  const { certificates, students, generateCertificate, profile } = useSecretary();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedCertificateForView, setSelectedCertificateForView] = useState<DeliveredCertificate | null>(null);

  // Form Fields
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [certificateType, setCertificateType] = useState<DocumentCertificateType>('certificat_scolarite');
  const [purpose, setPurpose] = useState('Dossier administratif et social');

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

  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const newDoc = generateCertificate(selectedStudentId, certificateType, purpose);
    setIsGenerateModalOpen(false);
    setSelectedCertificateForView(newDoc);
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
      c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Actes Administratifs Légaux
            </span>
            <span className="text-xs text-slate-400">Signature Électronique & QR Code</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-amber-400" />
            <span>Certificats & Attestations Administratives</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Émission instantanée des certificats de scolarité, attestations d'inscription, fréquentation et réussite.
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Délivrer un Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par élève, matricule ou numéro de document..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
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
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Numéro Certificat</th>
                <th className="py-3 px-3">Type de Document</th>
                <th className="py-3 px-3">Élève Titulaire</th>
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3">Date d'Émission</th>
                <th className="py-3 px-3">Motif / Usage</th>
                <th className="py-3 px-3">Signature</th>
                <th className="py-3 px-4 text-right">Spécimen PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCertificates.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    {doc.certificateNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {getDocTypeLabel(doc.type)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{doc.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{doc.matricule}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">
                    {doc.className}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">
                    {doc.issueDate}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 text-[11px] truncate max-w-[180px]">
                    {doc.purpose}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Certifié</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCertificateForView(doc)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Consulter</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Document Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Émettre un Document Officiel</h3>
              </div>
              <button onClick={() => setIsGenerateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Élève Bénéficiaire *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.matricule} - {s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Type d'Acte Administratif *
                </label>
                <select
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="certificat_scolarite">Certificat de Scolarité</option>
                  <option value="attestation_inscription">Attestation d'Inscription</option>
                  <option value="attestation_frequentation">Attestation de Fréquentation</option>
                  <option value="attestation_reussite">Attestation de Réussite</option>
                  <option value="attestation_transfert">Attestation de Transfert</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Motif / Destinataire du Document *
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Ex: Candidature Bourse d'État, Caisse Nationale de Sécurité Sociale..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <span className="font-semibold block mb-0.5">Sceau & Authentification Cryptographique :</span>
                Le document sera généré avec un numéro d'ordre officiel, le sceau du Secrétariat Général et un QR Code de vérification inviolable.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
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

      {/* Official Certificate Paper Specimen Modal */}
      {selectedCertificateForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Top Modal Controls */}
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Spécimen Officiel Imprimable · {selectedCertificateForView.certificateNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedCertificateForView(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Paper */}
            <div id="certificate-printable-paper" className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950 text-slate-100 font-serif print:bg-white print:text-black">
              {/* Republic Letterhead */}
              <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
                <div className="text-xs font-black uppercase tracking-widest text-slate-200">
                  RÉPUBLIQUE DE GUINÉE
                </div>
                <div className="text-[10px] text-amber-400 font-sans tracking-wide">
                  Travail - Justice - Solidarité
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A)
                </div>
                <div className="text-sm font-black uppercase tracking-tight text-white font-sans pt-1">
                  LYCÉE D'EXCELLENCE DE CONAKRY
                </div>
                <div className="text-[10px] text-slate-400 font-mono font-sans">
                  Secrétariat Général & Direction des Admissions · N° Réf : {selectedCertificateForView.certificateNumber}
                </div>
              </div>

              {/* Title of Act */}
              <div className="text-center py-2">
                <h2 className="text-xl font-black uppercase tracking-wider text-amber-400 font-sans underline decoration-amber-500/50 underline-offset-8">
                  {getDocTypeLabel(selectedCertificateForView.type)}
                </h2>
                <div className="text-xs font-sans text-slate-400 mt-2 font-mono">
                  Année Scolaire 2026 - 2027
                </div>
              </div>

              {/* Attestation Text Body */}
              <div className="text-sm text-slate-200 space-y-4 leading-relaxed font-sans">
                <p>
                  Je soussignée, <strong>{profile.name}</strong>, {profile.title} du Lycée d'Excellence de Conakry, certifie par la présente que l'élève :
                </p>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-sans">
                  <div>Nom & Prénom : <strong className="text-white text-base">{selectedCertificateForView.studentName}</strong></div>
                  <div>Matricule National : <strong className="font-mono text-teal-400">{selectedCertificateForView.matricule}</strong></div>
                  <div>Classe Fréquentée : <strong className="text-slate-100">{selectedCertificateForView.className}</strong></div>
                  <div>Régime : <strong>Externe</strong> · Statut : <strong>Régulier</strong></div>
                </div>

                <p>
                  Est régulièrement inscrit(e) sur les registres matricules de notre établissement pour l'année scolaire <strong>2026 - 2027</strong> et poursuit ses études avec assiduité.
                </p>

                <p className="text-xs text-slate-400 italic">
                  En foi de quoi, ce document lui est délivré pour servir et valoir ce que de droit, notamment pour : <span className="text-slate-200 font-medium">{selectedCertificateForView.purpose}</span>.
                </p>
              </div>

              {/* Footer Signatures and Verification QR */}
              <div className="pt-6 border-t border-slate-800 flex items-end justify-between font-sans">
                <div className="space-y-1">
                  <div className="p-2 rounded-xl bg-white text-black shrink-0 w-24 h-24 flex flex-col items-center justify-center shadow-lg">
                    <QrCode className="w-16 h-16" />
                    <span className="text-[7px] font-mono font-bold mt-0.5">VÉRIFIÉ SEC-GEN</span>
                  </div>
                  <div className="text-[8px] text-slate-500 font-mono">Scan authentification MEPU-A</div>
                </div>

                <div className="text-right space-y-1 text-xs">
                  <div className="text-slate-400">Fait à Conakry, le {selectedCertificateForView.issueDate}</div>
                  <div className="font-bold text-white uppercase text-xs pt-2">Pour l'Administration Scolaire,</div>
                  <div className="text-amber-300 font-bold">{selectedCertificateForView.signedBy}</div>
                  <div className="text-[10px] text-slate-500 font-mono italic">Sceau & Cachet Officiel Apposés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
