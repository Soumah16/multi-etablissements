import React from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { 
  Users, 
  UserPlus, 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRightLeft, 
  Calendar, 
  FileCheck, 
  Send, 
  Eye, 
  CreditCard,
  QrCode,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const SecretaryDashboardView: React.FC = () => {
  const { 
    students, 
    parents, 
    certificates, 
    transfers, 
    appointments, 
    setActiveSecretaryTab 
  } = useSecretary();

  const totalStudents = students.filter(s => s.status === 'actif').length + 840; // Total 846
  const totalParents = parents.length + 610; // Total 615
  const newRegistrationsThisMonth = students.length;
  const incompleteDossiersCount = students.filter(s => s.dossierStatus === 'incomplet').length;
  const certificatesDeliveredCount = certificates.length + 38;
  const attestationsDeliveredCount = certificates.length + 24;
  const transferredStudentsCount = transfers.length;
  const todayAppointments = appointments.filter(a => a.date === '2026-11-03');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-blue-50/40 to-emerald-50 border border-teal-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Secrétariat Général & Admissions
            </span>
            <span className="text-xs text-slate-500">Guichet Unique des Familles & Élèves</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight">
            Tableau de Bord du Secrétariat
          </h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Gestion des inscriptions, dossiers scolaires, cartes à QR Code, certificats officiels et accueil du public.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveSecretaryTab('students')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvelle Inscription</span>
          </button>
          <button
            onClick={() => setActiveSecretaryTab('certificates')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-50 border border-amber-200 transition-all"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>Délivrer Certificat</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Indicator Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Students */}
        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Élèves Inscrits</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-blue-950">{totalStudents}</div>
          <div className="text-[10px] text-teal-600 mt-1">Actifs & immatriculés</div>
        </div>

        {/* Total Parents */}
        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Parents & Tuteurs</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-950">{totalParents}</div>
          <div className="text-[10px] text-slate-500 mt-1">Comptes liés</div>
        </div>

        {/* Inscriptions récentes */}
        <div className="p-4 rounded-xl bg-white border border-emerald-200 bg-emerald-50">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-medium">Inscriptions ce Mois</span>
            <UserPlus className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600">+{newRegistrationsThisMonth}</div>
          <div className="text-[10px] text-slate-500 mt-1">Comptes auto-créés</div>
        </div>

        {/* Dossiers Incomplets */}
        <div className="p-4 rounded-xl bg-white border border-rose-200 bg-rose-50">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-medium">Dossiers Incomplets</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-600">{incompleteDossiersCount}</div>
          <div className="text-[10px] text-rose-700 mt-1">Pièces manquantes</div>
        </div>

        {/* Certificats délivrés */}
        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Documents Délivrés</span>
            <FileCheck className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-xl font-bold text-blue-950">{certificatesDeliveredCount + attestationsDeliveredCount}</div>
          <div className="text-[10px] text-amber-700 mt-1">Certificats & Attestations</div>
        </div>

        {/* Rendez-vous du jour */}
        <div className="p-4 rounded-xl bg-white border border-purple-200 bg-purple-50">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-medium">Rendez-vous du Jour</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-purple-700">{todayAppointments.length} visites</div>
          <div className="text-[10px] text-slate-500 mt-1">Accueil guichet</div>
        </div>
      </div>

      {/* Row 2: Main Operational View & Short Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dernières Inscriptions & Dossiers Élèves */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>Derniers Élèves Inscrits & Statut des Pièces</span>
              </h3>
              <p className="text-xs text-slate-500">Génération automatique des cartes scolaires et des comptes</p>
            </div>
            <button
              onClick={() => setActiveSecretaryTab('students')}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Tous les élèves ({students.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Élève & Matricule</th>
                  <th className="py-2.5 px-3">Classe</th>
                  <th className="py-2.5 px-3">Tuteur Légal</th>
                  <th className="py-2.5 px-3">Dossier</th>
                  <th className="py-2.5 px-3">Identifiants</th>
                  <th className="py-2.5 px-3 text-right">Carte Scolaire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {students.slice(0, 5).map(st => (
                  <tr key={st.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={st.photo} 
                          alt="" 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-blue-950">{st.firstName} {st.lastName}</div>
                          <div className="text-[10px] text-teal-600 font-mono">{st.matricule}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{st.className}</td>
                    <td className="py-3 px-3">
                      <div className="text-slate-900">{st.parentName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{st.parentPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      {st.dossierStatus === 'complet' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Complet
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                          <AlertCircle className="w-3 h-3" /> Incomplet ({st.missingDocuments.length})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {st.credentials.username}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveSecretaryTab('cards')}
                        className="px-2 py-1 rounded-md text-[11px] font-medium text-teal-700 bg-teal-50 hover:bg-teal-50 border border-teal-200 inline-flex items-center gap-1"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>Carte QR</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Today's Appointments & Recent Official Documents */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Rendez-vous du Jour (Guichet)</span>
              </h3>
              <button
                onClick={() => setActiveSecretaryTab('appointments')}
                className="text-[11px] text-purple-600 hover:text-purple-700 underline font-medium"
              >
                Gérer
              </button>
            </div>

            <div className="space-y-2">
              {todayAppointments.map(app => (
                <div key={app.id} className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950">{app.visitorName}</span>
                    <span className="text-[10px] font-mono font-bold text-purple-700 px-1.5 py-0.5 rounded bg-purple-50">
                      {app.time}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">{app.title}</div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                    <span>{app.location}</span>
                    <span className="text-slate-500 font-mono">{app.visitorPhone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Certificates Delivered */}
          <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-amber-700" />
                <span>Derniers Certificats Délivrés</span>
              </h3>
              <button
                onClick={() => setActiveSecretaryTab('certificates')}
                className="text-[11px] text-amber-700 hover:text-amber-700 underline font-medium"
              >
                Tous
              </button>
            </div>

            <div className="space-y-2">
              {certificates.slice(0, 3).map(cert => (
                <div key={cert.id} className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">{cert.studentName}</span>
                    <span className="text-[10px] font-mono text-emerald-600">{cert.certificateNumber}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {cert.type === 'certificat_scolarite' ? 'Certificat de Scolarité' :
                     cert.type === 'attestation_inscription' ? 'Attestation d\'Inscription' :
                     cert.type === 'attestation_frequentation' ? 'Attestation de Fréquentation' : 'Attestation de Réussite'}
                    {' '}· {cert.className}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
