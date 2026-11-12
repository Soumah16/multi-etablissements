import React from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  Building2, 
  BookOpen, 
  Briefcase, 
  DoorOpen, 
  Calendar, 
  Activity, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Layers
} from 'lucide-react';

export const SchoolAdminDashboard: React.FC = () => {
  const { currentSchool, staff, classes, subjects, rooms, academicYears, events, setActiveSchoolTab } = useSchoolAdmin();

  const activeYear = academicYears.find(y => y.status === 'active') || academicYears[0];
  const totalStudents = currentSchool.stats.studentsCount;
  const totalTeachers = staff.filter(s => s.role === 'Enseignant').length;
  const totalParents = currentSchool.stats.parentsCount;
  const totalClassesCount = classes.length;
  const totalSubjectsCount = subjects.length;
  const totalEmployees = staff.length;
  const totalRoomsCount = rooms.length;

  // Chart data: Distribution by level
  const levelsDistribution = [
    { level: "Terminale", count: 420, pct: 45, color: "bg-blue-500" },
    { level: "1ère Année Lycée", count: 310, pct: 33, color: "bg-indigo-500" },
    { level: "10ème Année (Brevet)", count: 200, pct: 22, color: "bg-purple-500" }
  ];

  // Teachers by department
  const teachersByDept = [
    { dept: "Sciences Exactes (Maths/Physique)", count: 4, pct: 40 },
    { dept: "Lettres & Langues", count: 3, pct: 30 },
    { dept: "Sciences Naturelles (SVT/Chimie)", count: 2, pct: 20 },
    { dept: "Technologies & Info", count: 1, pct: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Golden Rule Banner for School Admin */}
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3 text-xs text-slate-200">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">
              Périmètre de Responsabilité de l'Admin École
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600/30 text-blue-300">
              Gouvernance Administrative & Technique
            </span>
          </div>
          <p className="text-slate-300 mt-1 leading-relaxed">
            L'Admin École prépare et configure intégralement l'établissement (personnel, classes, matières, salles, affectations, sécurité). Il ne participe pas directement à la pédagogie et <strong>ne modifie jamais les notes ni les résultats académiques</strong> des élèves.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip (8 essential counts) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
        {/* Élèves */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Élèves</span>
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1 font-mono tabular-nums">
            {totalStudents.toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">+100% inscrits</div>
        </div>

        {/* Enseignants */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Enseignants</span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1 font-mono tabular-nums">
            {totalTeachers}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Affectés</div>
        </div>

        {/* Parents */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Parents</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1 font-mono tabular-nums">
            {totalParents.toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Portail SMS actif</div>
        </div>

        {/* Classes */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Classes</span>
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1 font-mono tabular-nums">
            {totalClassesCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Ouvertes</div>
        </div>

        {/* Matières */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Matières</span>
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1 font-mono tabular-nums">
            {totalSubjectsCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Coefficients OK</div>
        </div>

        {/* Employés */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Employés</span>
            <Briefcase className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1 font-mono tabular-nums">
            {totalEmployees}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total staff</div>
        </div>

        {/* Salles */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Salles</span>
            <DoorOpen className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1 font-mono tabular-nums">
            {totalRoomsCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Labos & cours</div>
        </div>

        {/* Année Scolaire */}
        <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/40">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px]">Année Active</span>
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xs font-bold text-blue-300 mt-1 font-mono">
            {activeYear.yearLabel}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">1er Trimestre</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Répartition élèves par niveau */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                Répartition des Élèves par Niveau
              </h3>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              {levelsDistribution.map((lvl) => (
                <div key={lvl.level} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{lvl.level}</span>
                    <span className="font-mono text-white font-bold">{lvl.count} ({lvl.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${lvl.color} rounded-full`} style={{ width: `${lvl.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4 text-[11px] text-slate-400 font-mono flex justify-between">
            <span>Effectif total contrôlé :</span>
            <span className="text-white font-bold">{totalStudents} élèves</span>
          </div>
        </div>

        {/* Chart 2: Répartition enseignants par département */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                Départements & Corps Enseignant
              </h3>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              {teachersByDept.map((dept) => (
                <div key={dept.dept} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 truncate max-w-[190px]">{dept.dept}</span>
                    <span className="font-mono text-emerald-400 font-bold">{dept.count} profs</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dept.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4 text-[11px] text-slate-400 font-mono flex justify-between">
            <span>Taux de couverture des matières :</span>
            <span className="text-emerald-400 font-bold">100% assurée</span>
          </div>
        </div>

        {/* Card 3: Taux de présence & Utilisation */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                Présences & Connexions Directes
              </h3>
              <span className="text-emerald-400 text-xs font-mono">En direct</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[11px]">Taux Global de Présence Élèves</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">96.4%</div>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <div>Pointage QR Code</div>
                  <div className="text-slate-300">Surveillant Général</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[11px]">Utilisateurs Connectés en ce moment</div>
                  <div className="text-xl font-bold text-white font-mono mt-0.5">48</div>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <div>Profs & Admin</div>
                  <div className="text-emerald-400 font-mono">Sessions actives</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4 text-[11px] text-slate-400 flex justify-between">
            <span>Passerelle SMS :</span>
            <span className="text-blue-400 font-mono">Orange Guinée Connectée</span>
          </div>
        </div>
      </div>

      {/* Row 3: Events & Administrative Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Événements à venir & Notes de service */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                Événements & Notes de Service Publiées
              </h3>
            </div>
            <button 
              onClick={() => setActiveSchoolTab('events')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              Gérer <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {events.map((ev) => (
              <div key={ev.id} className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-white">{ev.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                    {ev.type}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{ev.content}</p>
                <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                  <span>Date : {ev.date} ({ev.time})</span>
                  <span>Lieu : {ev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nouveaux Enseignants & Alertes Administratives */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Alertes Administratives & Derniers Enregistrements
                </h3>
              </div>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">Affectation Professeur Principal requise</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    La classe « Terminale Sciences Sociales » n'a pas encore de professeur principal désigné.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">Badges QR Code Générés</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    L'ensemble des {staff.length} membres du personnel possèdent désormais leur carte d'identification avec QR code d'accès.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">Année Scolaire 2026-2027 Ouverte</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    1er Trimestre en cours d'évaluation. Les emplois du temps sont distribués aux enseignants.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Fuseau Horaire : <strong className="text-white">Africa/Conakry</strong></span>
            <span className="text-slate-400">Devise : <strong className="text-emerald-400">GNF</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
