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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50/80 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={profile.photo}
            alt={profile.firstName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Espace Apprenant
              </span>
              <span className="text-xs text-slate-500">Année 2026-2027</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-blue-950 mt-1">
              Bonjour, {profile.firstName} {profile.lastName} 👋
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Classe de <strong className="text-blue-950">{profile.className}</strong> · Matricule : <span className="font-mono text-blue-600">{profile.matricule}</span>
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
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-700 border border-slate-200 transition-colors"
            title="Voir mon badge scolaire"
          >
            <QrCode className="w-4 h-4 text-cyan-600" />
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Moyenne Générale</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-600">
              {profile.generalAverage} <span className="text-sm font-normal text-slate-500">/ 20</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Rang : <strong className="text-blue-950">{profile.classRank}ère</strong> sur {profile.totalStudentsInClass} élèves
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Devoirs à Rendre</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-700">{pendingHomework.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {submittedHomework.length} devoirs déjà remis
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Cours Numériques</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-purple-600">{courses.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">PDF, vidéos & supports TSM</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Assiduité</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-950">98%</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Ponctualité exemplaire</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Work & Next Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next courses & homeworks (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Courses Highlight */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-blue-950">Prochains Cours Aujourd'hui</h2>
              </div>
              <button
                onClick={() => setActiveStudentTab('schedule')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                Emploi du temps complet →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                    08:00 - 10:00
                  </span>
                  <span className="text-[10px] text-slate-500">Salle 12</span>
                </div>
                <div className="font-bold text-sm text-blue-950">Mathématiques (Analyse)</div>
                <div className="text-xs text-slate-500">Professeur : M. Mamadou Lamarana Diallo</div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                    10:15 - 12:15
                  </span>
                  <span className="text-[10px] text-slate-500">Laboratoire 2</span>
                </div>
                <div className="font-bold text-sm text-blue-950">Physique-Chimie (Électronique)</div>
                <div className="text-xs text-slate-500">Professeur : M. Ousmane Traoré</div>
              </div>
            </div>
          </div>

          {/* Pending Homework */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-700" />
                <h2 className="text-sm font-bold text-blue-950">Devoirs Urgents à Soumettre</h2>
              </div>
              <button
                onClick={() => setActiveStudentTab('homework')}
                className="text-xs text-amber-700 hover:text-amber-700 font-semibold"
              >
                Portail de soumission →
              </button>
            </div>

            <div className="space-y-3">
              {pendingHomework.map(hw => (
                <div key={hw.id} className="p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900">
                        {hw.subject}
                      </span>
                      <span className="text-[10px] text-amber-700 font-mono font-bold">
                        Échéance : {hw.dueDate}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-blue-950 truncate mt-1">{hw.title}</div>
                    <div className="text-[11px] text-slate-500">{hw.teacherName}</div>
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
        <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-950">Notifications Récentes</h3>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map(notif => (
              <div key={notif.id} className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-blue-700">{notif.type}</span>
                  <span className="text-slate-500">{notif.time}</span>
                </div>
                <div className="text-xs font-bold text-blue-950">{notif.title}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{notif.text}</div>
              </div>
            ))}
          </div>

          {/* Quick Access to Card */}
          <div className="pt-3 border-t border-blue-100">
            <button
              onClick={() => setActiveStudentTab('profile')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-100 text-xs font-bold text-blue-950 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-cyan-600" />
              <span>Afficher ma Carte d'Élève & QR Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
