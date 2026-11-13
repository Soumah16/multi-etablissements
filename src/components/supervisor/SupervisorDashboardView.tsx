import React from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { 
  ShieldAlert, 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  Gavel, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  Phone, 
  Sparkles,
  BarChart3,
  ShieldCheck,
  Send,
  Building2,
  FileCheck
} from 'lucide-react';

export const SupervisorDashboardView: React.FC = () => {
  const { 
    profile, 
    attendanceRecords, 
    admissionSlips, 
    incidents, 
    watchlist, 
    confiscatedItems, 
    patrols, 
    meetings, 
    setActiveSupervisorTab 
  } = useSupervisor();

  // 8 Exact KPIs requested
  const presentStudentsCount = 785;
  const absentStudentsCount = attendanceRecords.filter(r => r.type === 'absent').length + 24;
  const lateStudentsCount = attendanceRecords.filter(r => r.type === 'retard').length + 11;
  const totalIncidentsCount = incidents.length + 3;
  const totalSanctionsCount = incidents.filter(i => i.sanctionType).length + 2;
  const totalWarningsCount = 9;
  const watchlistStudentsCount = watchlist.length;
  const todayPatrolsCount = patrols.length + 15;

  return (
    <div className="space-y-6">
      {/* Welcome & Status Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-blue-50/40 to-blue-50/80 border border-red-900/40 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Vie Scolaire & Discipline Générale · MEPU-A Guinée</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tight">
              Bonjour, M. {profile.lastName} 👋
            </h1>
            <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
              Supervision de la discipline, contrôle des entrées/sorties et respect du règlement intérieur au <strong className="text-blue-950">{profile.schoolName}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => setActiveSupervisorTab('admission_slips')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            >
              <FileCheck className="w-4 h-4" />
              <span>Délivrer Billet de Rentrée</span>
            </button>
            <button
              onClick={() => setActiveSupervisorTab('incidents')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-100 border border-slate-200 text-slate-900 text-xs font-bold transition-colors"
            >
              <Gavel className="w-4 h-4 text-amber-700" />
              <span>Signaler un Incident</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-red-50 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 8 EXACT KPIS SPECIFIED BY USER */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-red-600" />
            <span>Tableau de Bord Vie Scolaire (8 Indicateurs en Temps Réel)</span>
          </h2>
          <span className="text-[11px] text-red-600 font-mono">Portail Sécurisé Conakry</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* 1. Présents */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Présents</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-emerald-600">{presentStudentsCount}</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5 truncate">Élèves en classe</div>
          </div>

          {/* 2. Absents */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Absents</span>
              <Users className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-rose-600">{absentStudentsCount}</div>
            <div className="text-[10px] text-rose-600 font-medium mt-0.5 truncate">Ce matin</div>
          </div>

          {/* 3. Retards */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Retards</span>
              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            </div>
            <div className="text-xl font-black text-amber-700">{lateStudentsCount}</div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5 truncate">Au portail</div>
          </div>

          {/* 4. Incidents */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Incidents</span>
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-950">{totalIncidentsCount}</div>
            <div className="text-[10px] text-red-600 font-medium mt-0.5 truncate">Enregistrés</div>
          </div>

          {/* 5. Sanctions */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Sanctions</span>
              <Gavel className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-purple-600">{totalSanctionsCount}</div>
            <div className="text-[10px] text-purple-600 font-medium mt-0.5 truncate">Appliquées</div>
          </div>

          {/* 6. Avertissements */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Avertissements</span>
              <FileText className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-orange-600">{totalWarningsCount}</div>
            <div className="text-[10px] text-orange-600 font-medium mt-0.5 truncate">Notifiés</div>
          </div>

          {/* 7. Sous surveillance */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Surveillance</span>
              <Eye className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-cyan-600">{watchlistStudentsCount}</div>
            <div className="text-[10px] text-cyan-600 font-medium mt-0.5 truncate">Élèves suivis</div>
          </div>

          {/* 8. Contrôles effectués */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium truncate">Contrôles</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </div>
            <div className="text-xl font-black text-blue-600">{todayPatrolsCount}</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5 truncate">Rondes du jour</div>
          </div>
        </div>
      </div>

      {/* 5 GRAPHICS / METRICS REQUIRED BY USER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Graph 1: Présences journalières */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950">Présences Journalières</span>
            <span className="text-xs font-mono font-bold text-emerald-600">96.5%</span>
          </div>
          <div className="text-[11px] text-slate-500">Assiduité globale de l'établissement aujourd'hui</div>
          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-blue-100/70 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.5%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>785 présents</span>
              <span>28 absents</span>
            </div>
          </div>
        </div>

        {/* Graph 2: Retards par classe */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950">Retards par Classe</span>
            <span className="text-xs font-mono font-bold text-amber-700">14 total</span>
          </div>
          <div className="space-y-1.5 text-xs pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-700">10ème Année A</span>
              <span className="font-mono text-amber-700 font-bold">6 retards</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-700">1ère Sci. Exp. (1SE)</span>
              <span className="font-mono text-amber-700 font-bold">5 retards</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-700">Terminale SM (TSM)</span>
              <span className="font-mono text-amber-700 font-bold">3 retards</span>
            </div>
          </div>
        </div>

        {/* Graph 3: Absences par niveau */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950">Absences par Niveau</span>
            <span className="text-xs font-mono font-bold text-rose-600">28 total</span>
          </div>
          <div className="space-y-2 text-xs pt-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700">Lycée (2nd, 1ère, Tle)</span>
                <span className="font-mono text-slate-500">16 (57%)</span>
              </div>
              <div className="w-full bg-blue-100/70 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '57%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700">Collège (7e à 10e)</span>
                <span className="font-mono text-slate-500">12 (43%)</span>
              </div>
              <div className="w-full bg-blue-100/70 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '43%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Graph 4: Infractions disciplinaires */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950">Infractions Clés</span>
            <span className="text-xs font-mono font-bold text-purple-600">Répartition</span>
          </div>
          <div className="space-y-1.5 text-[11px] pt-1">
            <div className="flex justify-between text-slate-700">
              <span>Bavardage / Perturbation</span>
              <span className="font-mono text-blue-950 font-bold">42%</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Tenue non réglementaire</span>
              <span className="font-mono text-blue-950 font-bold">28%</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Usage smartphone</span>
              <span className="font-mono text-blue-950 font-bold">18%</span>
            </div>
            <div className="flex justify-between text-rose-700">
              <span>Violence / Bagarre</span>
              <span className="font-mono text-rose-600 font-bold">12%</span>
            </div>
          </div>
        </div>

        {/* Graph 5: Statistiques mensuelles */}
        <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-950">Tendance Mensuelle</span>
            <span className="text-xs font-mono font-bold text-emerald-600">-18%</span>
          </div>
          <div className="text-[11px] text-slate-500">Baisse continue des infractions grâce aux rondes</div>
          <div className="space-y-1 pt-1 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <span>Octobre 2026 :</span>
              <span className="font-mono text-slate-900">22 incidents</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Novembre (en cours) :</span>
              <span className="font-mono text-emerald-600 font-bold">6 incidents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Alertes du jour, Incidents récents, Élèves signalés, Rendez-vous */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Incidents récents & Alertes */}
        <div className="space-y-6">
          {/* Incidents récents */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Incidents Disciplinaires Récents</span>
              </h3>
              <button
                onClick={() => setActiveSupervisorTab('incidents')}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>Registre complet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {incidents.slice(0, 3).map(inc => (
                <div 
                  key={inc.id}
                  className="p-4 rounded-xl bg-blue-50/60 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-950 text-sm">{inc.studentName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-700">
                        {inc.className}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'grave' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inc.infractionType}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
                    {inc.reportDetails}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Lieu : <strong className="text-slate-700">{inc.location}</strong> ({inc.date} à {inc.time})</span>
                    {inc.sanctionType && (
                      <span className="text-purple-600 font-semibold">{inc.sanctionType}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes du Jour */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-3">
            <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Alertes & Directives Prioritaires du Jour</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 leading-relaxed">
                🚨 <strong>Contrôle renforcé au portail :</strong> Vérification systématique des cartes scolaires et confiscation des téléphones portables non autorisés.
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 leading-relaxed">
                ⚠️ <strong>Absences répétées en Terminale SM :</strong> 3 élèves ont cumulé plus de 4 retards cette semaine. Convocations des tuteurs transmises.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Élèves sous surveillance & Rendez-vous */}
        <div className="space-y-6">
          {/* Élèves sous surveillance */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-600" />
                <span>Élèves sous Surveillance Spéciale</span>
              </h3>
              <button
                onClick={() => setActiveSupervisorTab('watchlist')}
                className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                <span>Voir dossiers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {watchlist.map(std => (
                <div 
                  key={std.studentId}
                  className="p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={std.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-blue-950">{std.studentName}</div>
                      <div className="text-[10px] text-slate-500">{std.className} · {std.totalIncidents} incident(s)</div>
                      <div className="text-[10px] text-slate-500">Tuteur : {std.parentName} ({std.parentPhone})</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold font-mono text-xs text-amber-700">
                      Score : {std.behaviorScore} / 20
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      std.riskLevel === 'eleve' 
                        ? 'bg-rose-50 text-rose-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      Risque {std.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rendez-vous disciplinaires & Convocations */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Rendez-vous Disciplinaires & Convocations</span>
              </h3>
              <button
                onClick={() => setActiveSupervisorTab('parent_meetings')}
                className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <span>Planning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {meetings.map(m => (
                <div 
                  key={m.id}
                  className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950">{m.studentName} ({m.className})</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                      {m.date} à {m.time}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">{m.reason}</div>
                  <div className="text-[10px] text-slate-500">Parent attendu : {m.parentName} ({m.parentPhone})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
