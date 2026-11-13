import React from 'react';
import { useDirector } from '../../context/DirectorContext';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Clock, 
  UserX, 
  FileCheck2, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  Check, 
  X,
  FileSignature
} from 'lucide-react';

export const DirectorDashboardView: React.FC = () => {
  const { 
    reportCards, 
    exams, 
    teacherProfiles, 
    studentRecords, 
    calendarEvents,
    setActiveDirectorTab,
    approveReportCard,
    requestCorrectionReportCard
  } = useDirector();

  const pendingBulletins = reportCards.filter(b => b.directorStatus === 'en_attente');
  const pendingExams = exams.filter(e => e.status === 'en_attente');
  const atRiskStudents = studentRecords.filter(s => s.riskCategory === 'a_risque' || s.riskCategory === 'absenteisme_critique');
  const honorRollStudents = studentRecords.filter(s => s.riskCategory === 'excellent');

  // Stats
  const totalStudents = 864;
  const totalTeachers = teacherProfiles.length + 38; // 42 total
  const totalClasses = 22;
  const totalSubjects = 16;
  const todayAbsences = 14;
  const todayDelays = 6;
  const ongoingExamsCount = exams.filter(e => e.status === 'en_attente' || e.status === 'brouillon').length;
  const publishedHomeworks = 48;
  const globalSchoolAverage = 13.15;
  const globalSuccessRate = 84.8;
  const globalFailRate = 15.2;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-blue-50/40 to-indigo-50 border border-blue-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Supervision Pédagogique Officielle
            </span>
            <span className="text-xs text-slate-500">Année Scolaire 2026-2027 · Trimestre 1</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight">
            Tableau de Bord du Directeur des Études
          </h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Surveillance académique globale, validation officielle des bulletins & examens, assiduité et réussite.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveDirectorTab('bulletins')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
          >
            <FileSignature className="w-4 h-4" />
            <span>Valider Bulletins ({pendingBulletins.length})</span>
          </button>
          <button
            onClick={() => setActiveDirectorTab('exams')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-50 border border-amber-200 transition-all"
          >
            <FileCheck2 className="w-4 h-4 text-amber-700" />
            <span>Examens ({pendingExams.length})</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Indicator Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Élèves Inscrits</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-950">{totalStudents}</div>
          <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12 ce mois</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Enseignants</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-blue-950">{totalTeachers}</div>
          <div className="text-[10px] text-slate-500 mt-1">100% qualifiés d'État</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Classes Pédagogiques</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-blue-950">{totalClasses}</div>
          <div className="text-[10px] text-slate-500 mt-1">Lycée & Collège</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Matières Enseignées</span>
            <BookOpen className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl font-bold text-blue-950">{totalSubjects}</div>
          <div className="text-[10px] text-slate-500 mt-1">Programmes officiels</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-rose-200 bg-rose-50">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-medium">Absences du Jour</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-600">{todayAbsences}</div>
          <div className="text-[10px] text-rose-700 mt-1">{todayDelays} retards enregistrés</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-amber-200 bg-amber-50">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-medium">Bulletins en Attente</span>
            <FileSignature className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl font-bold text-amber-700">{pendingBulletins.length}</div>
          <div className="text-[10px] text-amber-700 mt-1">À viser par le Directeur</div>
        </div>
      </div>

      {/* Row 2: Secondary Academic KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Moyenne Générale */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-white to-blue-50 border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-700">Moyenne Générale École</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-950">{globalSchoolAverage.toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-500">/ 20</span>
          </div>
          <div className="w-full bg-blue-100/70 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-blue-500 h-full rounded-full" 
              style={{ width: `${(globalSchoolAverage / 20) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            +0.42 pt par rapport à l'année précédente
          </p>
        </div>

        {/* Taux de Réussite */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-white to-emerald-50 border border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-700">Taux Global de Réussite</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{globalSuccessRate}%</span>
            <span className="text-[11px] text-rose-600">Échec : {globalFailRate}%</span>
          </div>
          <div className="w-full bg-blue-100/70 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-emerald-500 h-full rounded-full" 
              style={{ width: `${globalSuccessRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Moyenne &gt;= 10/20 sur 840 compositions analysées
          </p>
        </div>

        {/* Devoirs & Cahiers de Texte */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-white to-purple-50 border border-purple-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-700">Cahiers de Texte & Devoirs</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-950">{publishedHomeworks}</span>
            <span className="text-xs text-slate-500">devoirs ce mois</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-purple-700 mt-3 pt-2 border-t border-purple-200">
            <span>Remplissage cahiers :</span>
            <span className="font-bold text-blue-950">93.8%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Progression des programmes à jour</p>
        </div>

        {/* Examens en Cours */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-white to-amber-50 border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-700">Sessions d'Examens</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-950">{ongoingExamsCount}</span>
            <span className="text-xs text-slate-500">sessions actives</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-700 mt-3 pt-2 border-t border-amber-200">
            <span>En attente de signature :</span>
            <span className="font-bold text-amber-700">{pendingExams.length}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Bac Blanc & Évaluations d'Automne</p>
        </div>
      </div>

      {/* Row 3: Main Performance Overview & Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance by Level & Class */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Performances Académiques par Classe & Niveau</span>
              </h3>
              <p className="text-xs text-slate-500">Moyennes de classe et taux de réussite comparés</p>
            </div>
            <button
              onClick={() => setActiveDirectorTab('reports')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Rapport complet →
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Terminale Sciences Mathématiques 1', average: 14.15, passRate: 92, students: 42, color: 'bg-blue-500' },
              { name: 'Terminale Sciences Expérimentales', average: 13.80, passRate: 88, students: 38, color: 'bg-emerald-500' },
              { name: '10ème Année A (Collège)', average: 12.90, passRate: 85, students: 48, color: 'bg-indigo-500' },
              { name: '1ère Sciences Mathématiques', average: 12.45, passRate: 81, students: 44, color: 'bg-purple-500' },
              { name: 'Terminale Sciences Sociales', average: 11.80, passRate: 78, students: 40, color: 'bg-amber-500' },
              { name: '9ème Année B (Collège)', average: 10.95, passRate: 72, students: 45, color: 'bg-rose-500' }
            ].map(cls => (
              <div key={cls.name} className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-900">{cls.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{cls.students} élèves</span>
                    <span className="font-mono font-bold text-blue-950">{cls.average.toFixed(2)}/20</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {cls.passRate}% admis
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`${cls.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(cls.average / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Subject Success Rate Breakdown */}
          <div className="pt-3 border-t border-blue-100">
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Taux de Maîtrise par Matière Clé</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { subj: 'Mathématiques', rate: 79.5, prof: 'M. Alpha Camara' },
                { subj: 'Physique-Chimie', rate: 82.0, prof: 'Dr. Mariama Bah' },
                { subj: 'Français-Philo', rate: 86.4, prof: 'M. Ousmane Barry' },
                { subj: 'Anglais', rate: 91.2, prof: 'Mme Fatoumata Sylla' }
              ].map(s => (
                <div key={s.subj} className="p-2.5 rounded-lg bg-blue-50/60 border border-slate-200 text-center">
                  <div className="text-[11px] font-semibold text-slate-700 truncate">{s.subj}</div>
                  <div className="text-base font-black text-blue-600 mt-0.5">{s.rate}%</div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">{s.prof}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pedagogical Alerts & Upcoming Events */}
        <div className="space-y-6">
          {/* Pedagogical Alerts / Élèves à risque */}
          <div className="p-5 rounded-2xl bg-white border border-rose-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Alertes Pédagogiques ({atRiskStudents.length})</span>
              </h3>
              <button
                onClick={() => setActiveDirectorTab('students')}
                className="text-[11px] text-rose-600 hover:text-rose-700 underline font-medium"
              >
                Gérer
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Élèves détectés automatiquement en situation de décrochage ou d'absentéisme critique :
            </p>

            <div className="space-y-2">
              {atRiskStudents.map(st => (
                <div key={st.id} className="p-2.5 rounded-xl bg-blue-50/60 border border-rose-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={st.photo} 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {st.firstName} {st.lastName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {st.className} · Moy: <span className="font-bold text-rose-600">{st.generalAverage.toFixed(2)}</span> · {st.absencesHours}h abs.
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                    {st.riskCategory === 'absenteisme_critique' ? 'Absentéisme' : 'À risque'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-blue-100 text-[11px] text-slate-500">
              <span className="text-emerald-600 font-bold">{honorRollStudents.length} élèves</span> inscrits au Tableau d'Honneur (Moy &gt; 15/20).
            </div>
          </div>

          {/* Upcoming Academic Events */}
          <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Événements & Réunions</span>
              </h3>
              <button
                onClick={() => setActiveDirectorTab('calendar')}
                className="text-[11px] text-purple-600 hover:text-purple-700 underline font-medium"
              >
                Calendrier
              </button>
            </div>

            <div className="space-y-2">
              {calendarEvents.slice(0, 3).map(ev => (
                <div key={ev.id} className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-[190px]">
                      {ev.title}
                    </span>
                    <span className="text-[10px] font-mono text-purple-700 px-1.5 py-0.5 rounded bg-purple-50">
                      {ev.startDate}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>{ev.location}</span>
                    <span>{ev.startTime} - {ev.endTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Action Queues - Pending Bulletins to Validate */}
      <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-amber-700" />
              <span>File d'Attente : Bulletins à Valider par le Directeur</span>
            </h3>
            <p className="text-xs text-slate-500">
              Vérifiez les notes, appréciations et appliquez votre signature électronique sécurisée (PIN 6 chiffres + 2FA requis).
            </p>
          </div>
          <button
            onClick={() => setActiveDirectorTab('bulletins')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 shrink-0"
          >
            Voir tous les {reportCards.length} bulletins →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Élève</th>
                <th className="py-2.5 px-3">Classe</th>
                <th className="py-2.5 px-3">Trimestre</th>
                <th className="py-2.5 px-3 text-center">Moyenne</th>
                <th className="py-2.5 px-3 text-center">Rang</th>
                <th className="py-2.5 px-3">Décision Conseil</th>
                <th className="py-2.5 px-3">Statut</th>
                <th className="py-2.5 px-3 text-right">Action Directeur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {reportCards.slice(0, 4).map(card => (
                <tr key={card.id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={card.studentPhoto} 
                        alt="" 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{card.studentName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{card.studentMatricule}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{card.className}</td>
                  <td className="py-3 px-3 text-slate-500">{card.termName}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-mono font-bold ${
                      card.generalAverage >= 14 ? 'text-emerald-600' :
                      card.generalAverage >= 10 ? 'text-blue-600' : 'text-rose-600'
                    }`}>
                      {card.generalAverage.toFixed(2)}/20
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-700">
                    {card.classRank}e / {card.totalStudentsInClass}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
                      {card.councilDecision}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {card.directorStatus === 'approuve' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3" /> Approuvé & Signé
                      </span>
                    ) : card.directorStatus === 'correction_demandee' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Correction demandée
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        En attente visa
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {card.directorStatus === 'en_attente' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => approveReportCard(card.id)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs flex items-center gap-1"
                          title="Valider avec signature numérique (PIN/2FA)"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approuver</span>
                        </button>
                        <button
                          onClick={() => requestCorrectionReportCard(card.id, 'Vérification requise')}
                          className="px-2 py-1 rounded-md text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-50 border border-amber-200"
                          title="Demander correction"
                        >
                          Révision
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveDirectorTab('bulletins')}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        Consulter spécimen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
