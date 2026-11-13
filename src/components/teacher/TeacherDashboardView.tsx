import React from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  TrendingUp, 
  ArrowRight, 
  Send,
  Sparkles,
  ClipboardCheck,
  DoorOpen,
  Award,
  Layers,
  BarChart3,
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

export const TeacherDashboardView: React.FC = () => {
  const { 
    profile, 
    classes, 
    subjects,
    courses,
    evaluations, 
    logbookEntries, 
    attendanceSession, 
    homeworkList, 
    schedule,
    calendarEvents,
    studentProfiles,
    setActiveTeacherTab 
  } = useTeacher();

  // 8 KPIs
  const totalClassesCount = classes.length;
  const totalStudentsCount = classes.reduce((acc, c) => acc + c.studentsCount, 0);
  const totalSubjectsCount = subjects.length;
  const totalCoursesPublished = courses.filter(c => c.isPublished).length;
  const totalHomeworkPublished = homeworkList.length;
  const totalHomeworkGraded = homeworkList.reduce((acc, h) => acc + h.evaluatedCount, 0);
  const totalAbsencesRecorded = attendanceSession.records.filter(r => r.status === 'absent').length;
  const totalEvaluationsCount = evaluations.length;

  // Additional counts
  const pendingGradesCount = evaluations.filter(e => e.status === 'en_cours').length;
  const difficultyStudentsCount = studentProfiles.filter(s => s.isDifficulty).length;
  const todaySlots = schedule.filter(s => s.day === 'Lundi');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-50/80 border border-blue-800/40 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Année Scolaire 2026-2027 · MEPU-A Guinée · Trimestre 1</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tight">
              Bonjour, M. {profile.lastName} 👋
            </h1>
            <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
              Bienvenue sur votre portail enseignant. Vous êtes professeur titulaire de <strong className="text-blue-950">{profile.mainSubject}</strong> et professeur principal de la <strong className="text-blue-950">{profile.isMainTeacherOf}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => setActiveTeacherTab('attendance')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Faire l'appel</span>
            </button>
            <button
              onClick={() => setActiveTeacherTab('courses')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Publier un cours</span>
            </button>
            <button
              onClick={() => setActiveTeacherTab('gradebook')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100 border border-slate-200 text-slate-900 text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Carnet de notes</span>
            </button>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 8 EXACT KPIs SPECIFIED BY USER */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Indicateurs Clés d'Activité Pédagogique (8 KPIs Officiels)</span>
          </h2>
          <span className="text-[11px] text-blue-600 font-mono">Synchronisé en temps réel</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Classes attribuées */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Classes</span>
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalClassesCount}</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5 truncate">Attribuées</div>
          </div>

          {/* 2. Élèves */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Élèves</span>
              <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalStudentsCount}</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5 truncate">Total encadrés</div>
          </div>

          {/* 3. Matières */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Matières</span>
              <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalSubjectsCount}</div>
            <div className="text-[10px] text-purple-600 font-medium mt-0.5 truncate">Modules</div>
          </div>

          {/* 4. Cours publiés */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Cours</span>
              <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalCoursesPublished}</div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5 truncate">En ligne</div>
          </div>

          {/* 5. Devoirs publiés */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Devoirs</span>
              <FileText className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalHomeworkPublished}</div>
            <div className="text-[10px] text-cyan-600 font-medium mt-0.5 truncate">Publiés</div>
          </div>

          {/* 6. Devoirs corrigés */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Corrigés</span>
              <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalHomeworkGraded}</div>
            <div className="text-[10px] text-teal-600 font-medium mt-0.5 truncate">Copies notées</div>
          </div>

          {/* 7. Absences enregistrées */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Absences</span>
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalAbsencesRecorded}</div>
            <div className="text-[10px] text-rose-600 font-medium mt-0.5 truncate">Feuille d'appel</div>
          </div>

          {/* 8. Évaluations réalisées */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Évaluations</span>
              <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalEvaluationsCount}</div>
            <div className="text-[10px] text-indigo-600 font-medium mt-0.5 truncate">Sessions créées</div>
          </div>
        </div>
      </div>

      {/* 4 GRAPH CARDS / VISUAL MONITORS SPECIFIED BY USER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Graph 1: Présences des élèves */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              <span>Présences des Élèves</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600">95.6%</span>
          </div>
          <div className="text-[11px] text-slate-500">Assiduité moyenne sur vos 3 classes attribuées</div>
          <div className="space-y-2 pt-1 text-xs">
            {classes.map(c => (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 truncate">{c.name.split('(')[0]}</span>
                  <span className="font-mono text-emerald-600 font-semibold">{c.attendanceRate}%</span>
                </div>
                <div className="w-full bg-blue-100/70 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: `${c.attendanceRate}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 2: Performance des élèves */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Performance Scolaire</span>
            </span>
            <span className="text-xs font-mono font-bold text-blue-600">14.1 / 20</span>
          </div>
          <div className="text-[11px] text-slate-500">Moyenne générale et taux d'admissibilité (≥ 10)</div>
          <div className="space-y-2 pt-1 text-xs">
            {classes.map(c => (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 truncate">{c.name.split('(')[0]}</span>
                  <span className="font-mono text-blue-600 font-bold">{c.averageGrade}/20</span>
                </div>
                <div className="w-full bg-blue-100/70 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full" 
                    style={{ width: `${(c.averageGrade / 20) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 3: Progression pédagogique */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Progression Pédagogique</span>
            </span>
            <span className="text-xs font-mono font-bold text-purple-600">65.5%</span>
          </div>
          <div className="text-[11px] text-slate-500">Avancement des programmes MEPU-A & CIAM</div>
          <div className="space-y-2 pt-1 text-xs">
            {subjects.slice(0, 3).map(s => (
              <div key={s.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 truncate">{s.name} ({s.level})</span>
                  <span className="font-mono text-purple-600 font-semibold">{s.progressionPercent}%</span>
                </div>
                <div className="w-full bg-blue-100/70 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full" 
                    style={{ width: `${s.progressionPercent}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph 4: Remise des devoirs */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Remise des Devoirs</span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-700">86.4%</span>
          </div>
          <div className="text-[11px] text-slate-500">Taux global de rendu des travaux de maison</div>
          <div className="space-y-2 pt-1 text-xs">
            {homeworkList.map(h => {
              const pct = Math.round((h.totalSubmissions / h.totalStudents) * 100);
              return (
                <div key={h.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-700 truncate">{h.title.split(':')[0]}</span>
                    <span className="font-mono text-amber-700 font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full bg-blue-100/70 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Prochains Cours, Devoirs à corriger, Examens programmés, Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prochains Cours & Devoirs à corriger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prochains Cours */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Prochains Cours (Séances du Jour - Lundi)</span>
                </h3>
                <p className="text-xs text-slate-500">Emploi du temps officiel validé par la Direction</p>
              </div>
              <button
                onClick={() => setActiveTeacherTab('schedule')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Planning complet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todaySlots.map(slot => (
                <div 
                  key={slot.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-blue-50/60 border border-slate-200 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold text-center shrink-0">
                      <div>{slot.startTime}</div>
                      <div className="text-[10px] text-slate-500">à {slot.endTime}</div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-blue-950 flex items-center gap-2">
                        <span>{slot.className}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {slot.subject}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>{slot.room}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTeacherTab('attendance')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Appel</span>
                    </button>
                    <button
                      onClick={() => setActiveTeacherTab('logbook')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-900 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Cahier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devoirs à corriger */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>Devoirs à Corriger & Copies Reçues</span>
                </h3>
                <p className="text-xs text-slate-500">Copies soumises par les élèves en attente d'évaluation</p>
              </div>
              <button
                onClick={() => setActiveTeacherTab('homework')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-700 flex items-center gap-1"
              >
                <span>Espace correction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {homeworkList.map(hw => {
                const remaining = hw.totalSubmissions - hw.evaluatedCount;
                return (
                  <div 
                    key={hw.id}
                    className="p-4 rounded-xl bg-blue-50/60 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-blue-950">{hw.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {hw.className}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Date limite : <strong className="text-slate-700">{hw.dueDate}</strong> · Copies reçues : <strong className="text-emerald-600">{hw.totalSubmissions}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-700">{remaining} à corriger</div>
                        <div className="text-[10px] text-slate-500">{hw.evaluatedCount} déjà notées</div>
                      </div>
                      <button
                        onClick={() => setActiveTeacherTab('homework')}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold transition-colors"
                      >
                        Noter les copies
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Examens Programmés & Notifications Importantes */}
        <div className="space-y-6">
          {/* Examens & Événements Programmés */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Examens & Conseils Programmés</span>
              </h3>
              <button
                onClick={() => setActiveTeacherTab('events')}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                Tout voir →
              </button>
            </div>

            <div className="space-y-2.5">
              {calendarEvents.map(evt => (
                <div key={evt.id} className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-950 truncate">{evt.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 shrink-0">
                      {evt.date}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">{evt.time} · {evt.location}</div>
                  <div className="text-[10px] text-slate-500 italic">Rôle : {evt.teacherRole}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Élèves en Difficulté (Alerte Pédagogique) */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Élèves en Difficulté Détectés</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                {difficultyStudentsCount} signalement(s)
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Le système filtre automatiquement les élèves ayant une moyenne &lt; 10, retards fréquents ou assiduité &lt; 85%.
            </p>

            <div className="space-y-2">
              {studentProfiles.filter(s => s.isDifficulty).map(std => (
                <div key={std.studentId} className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-700">{std.studentName}</span>
                    <span className="font-mono text-blue-950 bg-white px-1.5 py-0.5 rounded text-[10px]">
                      Moy: {std.average}/20
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">{std.difficultyReason}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTeacherTab('monitoring')}
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-xs font-bold text-amber-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Suivi & Plan de Remédiation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notifications Importantes Direction */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-3">
            <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span>Notifications Récentes</span>
            </h3>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-blue-700">Dr. Ibrahima Sory Bangoura (Directeur des Études)</div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                "Validation du sujet d'évaluation Trimestre 1 Terminale SM effectuée. Pensez à déposer les barèmes avant vendredi 18h."
              </p>
            </div>
            <button
              onClick={() => setActiveTeacherTab('communication')}
              className="w-full py-1.5 text-center text-xs font-semibold text-slate-500 hover:text-blue-950 transition-colors"
            >
              Ouvrir la messagerie →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
