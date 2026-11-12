import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  FileText, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Download, 
  QrCode,
  Bell,
  Sparkles
} from 'lucide-react';

export const StudentDashboardView: React.FC = () => {
  const { profile, courses, homeworks, grades, attendances, notifications, setActiveStudentTab } = useStudent();

  const pendingHomework = homeworks.filter(h => h.status === 'en_attente');
  const submittedHomework = homeworks.filter(h => h.status === 'soumis' || h.status === 'corrige');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/50 via-indigo-950/40 to-slate-900 border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={profile.photo}
            alt={profile.firstName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Espace Apprenant
              </span>
              <span className="text-xs text-slate-400">Année 2026-2027</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1">
              Bonjour, {profile.firstName} {profile.lastName} 👋
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Classe de <strong className="text-white">{profile.className}</strong> · Matricule : <span className="font-mono text-blue-400">{profile.matricule}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveStudentTab('homework')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Rendre un Devoir ({pendingHomework.length})</span>
          </button>
          <button
            onClick={() => setActiveStudentTab('profile')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Voir mon badge scolaire"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Moyenne Générale</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-400">
              {profile.generalAverage} <span className="text-sm font-normal text-slate-400">/ 20</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Rang : <strong className="text-white">{profile.classRank}ère</strong> sur {profile.totalStudentsInClass} élèves
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Devoirs à Rendre</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-400">{pendingHomework.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {submittedHomework.length} devoirs déjà remis
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Cours Numériques</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-purple-400">{courses.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">PDF, vidéos & supports TSM</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Assiduité</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">98%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Ponctualité exemplaire</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Work & Next Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next courses & homeworks (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Courses Highlight */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Prochains Cours Aujourd'hui</h2>
              </div>
              <button
                onClick={() => setActiveStudentTab('schedule')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                Emploi du temps complet →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                    08:00 - 10:00
                  </span>
                  <span className="text-[10px] text-slate-400">Salle 12</span>
                </div>
                <div className="font-bold text-sm text-white">Mathématiques (Analyse)</div>
                <div className="text-xs text-slate-400">Professeur : M. Mamadou Lamarana Diallo</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    10:15 - 12:15
                  </span>
                  <span className="text-[10px] text-slate-400">Laboratoire 2</span>
                </div>
                <div className="font-bold text-sm text-white">Physique-Chimie (Électronique)</div>
                <div className="text-xs text-slate-400">Professeur : M. Ousmane Traoré</div>
              </div>
            </div>
          </div>

          {/* Pending Homework */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Devoirs Urgents à Soumettre</h2>
              </div>
              <button
                onClick={() => setActiveStudentTab('homework')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                Portail de soumission →
              </button>
            </div>

            <div className="space-y-3">
              {pendingHomework.map(hw => (
                <div key={hw.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-200">
                        {hw.subject}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                        Échéance : {hw.dueDate}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-white truncate mt-1">{hw.title}</div>
                    <div className="text-[11px] text-slate-400">{hw.teacherName}</div>
                  </div>

                  <button
                    onClick={() => setActiveStudentTab('homework')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Déposer ma copie
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Notification Feed */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Notifications Récentes</h3>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map(notif => (
              <div key={notif.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-blue-300">{notif.type}</span>
                  <span className="text-slate-500">{notif.time}</span>
                </div>
                <div className="text-xs font-bold text-white">{notif.title}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">{notif.text}</div>
              </div>
            ))}
          </div>

          {/* Quick Access to Card */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => setActiveStudentTab('profile')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Afficher ma Carte d'Élève & QR Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
