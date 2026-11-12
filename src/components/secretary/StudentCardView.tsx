import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { StudentEnrollment } from '../../types/secretary';
import { 
  CreditCard, 
  QrCode, 
  Printer, 
  Download, 
  Search, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  User, 
  Sparkles,
  Eye
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const StudentCardView: React.FC = () => {
  const { students, profile } = useSecretary();
  const [selectedStudent, setSelectedStudent] = useState<StudentEnrollment>(students[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [simulatedScanResult, setSimulatedScanResult] = useState<string | null>(null);

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    triggerPrint(
      'student-card-printable-area', 
      `Carte_Scolaire_${selectedStudent.firstName}_${selectedStudent.lastName}`
    );
  };

  const handleTestScan = (usageType: string) => {
    setSimulatedScanResult(`Scan réussi pour ${usageType} ! Élève : ${selectedStudent.firstName} ${selectedStudent.lastName} (Matricule: ${selectedStudent.matricule}) · Autorisation accordée.`);
    setTimeout(() => {
      setSimulatedScanResult(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Cartes d'Identité Scolaires Numériques
            </span>
            <span className="text-xs text-slate-400">Puce Sécurisée & QR Code Unique</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-teal-400" />
            <span>Cartes Scolaires & QR Code de Contrôle</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Identification des élèves, contrôle des présences, accès à la bibliothèque et aux salles d'examens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer la Carte</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Student Selector */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-400" />
            <span>Sélectionner un Élève</span>
          </h3>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher élève ou matricule..."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
          />

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`w-full p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                  selectedStudent.id === student.id 
                    ? 'bg-teal-600/20 border-teal-500 text-white' 
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img 
                    src={student.photo} 
                    alt="" 
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" 
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {student.matricule} · {student.className}
                    </div>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Card Preview (Front & Back) + Scan Simulator */}
        <div className="lg:col-span-2 space-y-6">
          <div id="student-card-printable-area" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Front of Student Card */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recto · Carte Scolaire Officielle
              </span>
              <div className="w-full aspect-[85.6/53.98] rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-2 border-teal-500/50 p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white print:border-black">
                {/* Guinea Flag Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-teal-500/10 pointer-events-none blur-xl" />

                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 font-black text-sm flex items-center justify-center shadow-xs">
                      S
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-tight text-white leading-none">
                        Lycée d'Excellence de Conakry
                      </div>
                      <div className="text-[8px] text-teal-300 font-mono">République de Guinée · MEPU-A</div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase font-mono">
                    ÉLÈVE
                  </span>
                </div>

                {/* Card Middle Photo & Info */}
                <div className="flex items-center gap-3.5 my-auto">
                  <img 
                    src={selectedStudent.photo} 
                    alt="" 
                    className="w-16 h-20 rounded-xl object-cover border-2 border-teal-400/80 shadow-md shrink-0" 
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-black text-white leading-tight truncate">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </div>
                    <div className="text-[10px] font-semibold text-teal-300">
                      {selectedStudent.className}
                    </div>
                    <div className="text-[9px] text-slate-300 font-mono pt-1">
                      Matricule : <span className="font-bold text-white">{selectedStudent.matricule}</span>
                    </div>
                    <div className="text-[8px] text-slate-400">
                      Né(e) le {selectedStudent.dateOfBirth} · Grp: <strong className="text-rose-400">{selectedStudent.bloodGroup}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[8px] text-slate-400">
                  <div className="font-mono">Année Scolaire : 2026 - 2027</div>
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Matricule Vérifié</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back of Student Card */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verso · QR Code & Contrôle d'Accès
              </span>
              <div className="w-full aspect-[85.6/53.98] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-slate-700 p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white">
                <div className="absolute top-3 left-0 right-0 h-6 bg-slate-950 border-y border-slate-800" />

                <div className="pt-8 flex items-center justify-between gap-3">
                  <div className="space-y-1 text-[8px] text-slate-300">
                    <div className="font-bold text-white uppercase text-[9px]">Usage de la carte :</div>
                    <p className="text-slate-400 leading-tight">
                      Cette carte est strictement personnelle. Elle doit être présentée à l'entrée du lycée, aux compositions trimestrielles et à la bibliothèque scolaire.
                    </p>
                    <div className="text-[8px] text-slate-400 font-mono pt-1">
                      Tuteur : {selectedStudent.parentName} ({selectedStudent.parentPhone})
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="p-2 rounded-xl bg-white text-black shrink-0 shadow-lg text-center flex flex-col items-center">
                    <QrCode className="w-14 h-14" />
                    <span className="text-[7px] font-mono font-bold mt-0.5">QR-ELV-2026</span>
                  </div>
                </div>

                <div className="text-[7px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>SmartSchool ERP · Secrétariat Général</span>
                  <span>ID: {selectedStudent.matricule}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive QR Code Simulator */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  Simulateur de Scan du QR Code Élève
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Token : {selectedStudent.qrToken.substring(0, 18)}...
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Testez l'utilisation du QR Code de {selectedStudent.firstName} {selectedStudent.lastName} sur les différents terminaux scolaires :
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Pointage Présence', type: 'Contrôle Présence en Classe' },
                { label: 'Prêt Bibliothèque', type: 'Emprunt Ouvrage Bibliothèque' },
                { label: 'Accès Examen', type: 'Vérification Salle de Composition' },
                { label: 'Identification Guichet', type: 'Retrait de Dossier Administratif' }
              ].map(b => (
                <button
                  key={b.label}
                  onClick={() => handleTestScan(b.type)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors text-center"
                >
                  {b.label}
                </button>
              ))}
            </div>

            {simulatedScanResult && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{simulatedScanResult}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
