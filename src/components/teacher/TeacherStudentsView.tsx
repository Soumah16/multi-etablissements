import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  HeartPulse
} from 'lucide-react';

export const TeacherStudentsView: React.FC = () => {
  const { classes, evaluations } = useTeacher();
  const [selectedClassId, setSelectedClassId] = useState('cls-tsm');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample student list with grades and parent contacts
  const students = [
    {
      id: 'std-001',
      matricule: 'LEC-2026-001',
      fullName: 'Mamadou Alpha Diallo',
      classId: 'cls-tsm',
      average: 18.4,
      attendance: '98%',
      parentName: 'M. Thierno Diallo',
      parentPhone: '+224 621 11 22 33',
      bloodGroup: 'O+',
      medicalNote: 'Aucune contre-indication',
      observation: 'Élève brillant, candidat sérieux pour la mention Très Bien au Bac.'
    },
    {
      id: 'std-002',
      matricule: 'LEC-2026-002',
      fullName: 'Fatoumata Binta Bah',
      classId: 'cls-tsm',
      average: 17.1,
      attendance: '96%',
      parentName: 'Mme Aissatou Bah',
      parentPhone: '+224 622 44 55 66',
      bloodGroup: 'A+',
      medicalNote: 'Asthme modéré (Ventoline en trousse)',
      observation: 'Très rigoureuse et proactive en cours.'
    },
    {
      id: 'std-003',
      matricule: 'LEC-2026-003',
      fullName: 'Ibrahima Sory Bangoura',
      classId: 'cls-tsm',
      average: 15.1,
      attendance: '94%',
      parentName: 'M. Sékou Bangoura',
      parentPhone: '+224 628 77 88 99',
      bloodGroup: 'B+',
      medicalNote: 'RAS',
      observation: 'Bon potentiel, quelques retards signalés à régulariser.'
    },
    {
      id: 'std-004',
      matricule: 'LEC-2026-004',
      fullName: 'Mariama Camara',
      classId: 'cls-tsm',
      average: 13.4,
      attendance: '91%',
      parentName: 'Dr. Lansana Camara',
      parentPhone: '+224 620 99 00 11',
      bloodGroup: 'O-',
      medicalNote: 'Allergie pénicilline',
      observation: 'En nette progression sur la géométrie dans l\'espace.'
    },
    {
      id: 'std-005',
      matricule: 'LEC-2026-005',
      fullName: 'Ousmane Barry',
      classId: 'cls-tsm',
      average: 10.4,
      attendance: '89%',
      parentName: 'M. Amadou Barry',
      parentPhone: '+224 624 33 22 11',
      bloodGroup: 'AB+',
      medicalNote: 'RAS',
      observation: 'Soutien pédagogique recommandé en analyse numérique.'
    }
  ];

  const filteredStudents = students.filter(s => {
    const matchesClass = s.classId === selectedClassId;
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Fiches & Suivi Individuel des Élèves</span>
          </h1>
          <p className="text-xs text-slate-500">
            Dossier académique, assiduité, observations pédagogiques et contact d'urgence
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher par nom ou matricule..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-blue-100 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Class filter tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
        {classes.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClassId(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedClassId === c.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-500 border border-blue-100 hover:text-blue-950'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <div 
            key={student.id}
            className="rounded-2xl bg-white border border-blue-100 p-5 shadow-lg hover:border-slate-200 transition-all space-y-4"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-base shadow-md">
                  {student.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-blue-950 leading-tight">{student.fullName}</h2>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{student.matricule}</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200 font-mono">
                {student.bloodGroup}
              </span>
            </div>

            {/* Academic stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <div className="text-[10px] text-slate-500">Moyenne Matière</div>
                <div className="text-base font-black text-emerald-600 mt-0.5">{student.average} / 20</div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <div className="text-[10px] text-slate-500">Taux Présence</div>
                <div className="text-base font-black text-indigo-600 mt-0.5">{student.attendance}</div>
              </div>
            </div>

            {/* Medical Alert if any */}
            {student.medicalNote !== 'RAS' && student.medicalNote !== 'Aucune contre-indication' && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[11px]">
                <HeartPulse className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{student.medicalNote}</span>
              </div>
            )}

            {/* Pedagogical observation */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500">Observation de l'enseignant :</div>
              <p className="text-slate-700 italic">"{student.observation}"</p>
            </div>

            {/* Parent contact */}
            <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-slate-500">
              <div className="truncate">
                <div className="text-[10px] text-slate-500">Contact Parent</div>
                <div className="font-semibold text-slate-700 truncate">{student.parentName}</div>
              </div>
              <a 
                href={`tel:${student.parentPhone}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold shrink-0"
              >
                <Phone className="w-3 h-3" />
                <span>Appeler</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
