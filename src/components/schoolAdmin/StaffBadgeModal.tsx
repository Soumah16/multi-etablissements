import React, { useState } from 'react';
import { StaffMember } from '../../types';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { X, Printer, QrCode, CheckCircle2, ShieldCheck, Download, Scan } from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface StaffBadgeModalProps {
  staff: StaffMember;
  onClose: () => void;
}

export const StaffBadgeModal: React.FC<StaffBadgeModalProps> = ({ staff, onClose }) => {
  const { currentSchool } = useSchoolAdmin();
  const [scanVerified, setScanVerified] = useState(false);

  const handleTestScan = () => {
    setScanVerified(true);
    setTimeout(() => setScanVerified(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-blue-100 shadow-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-100">
          <div>
            <h3 className="text-base font-bold text-blue-950">
              Badge Professionnel & Carte d'Identification
            </h3>
            <p className="text-xs text-slate-500">
              Généré automatiquement par SmartSchool ERP pour {staff.firstName} {staff.lastName}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-blue-950 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Container */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Physical Badge ISO-7810 Specimen */}
          <div id="staff-badge-printable-card" className="w-64 h-96 rounded-xl bg-white text-slate-900 shadow-2xl border-4 border-blue-900 overflow-hidden flex flex-col justify-between relative select-none">
            {/* Header with School Branding */}
            <div className="bg-blue-950 text-white p-3 text-center">
              <div className="text-[9px] uppercase tracking-widest text-slate-300 font-semibold">
                RÉPUBLIQUE DE GUINÉE
              </div>
              <div className="text-xs font-extrabold uppercase mt-1 leading-tight text-white line-clamp-1">
                {currentSchool.name}
              </div>
              <div className="text-[9px] text-blue-300 uppercase tracking-wider mt-0.5">
                CARTE D'IDENTITÉ PROFESSIONNELLE
              </div>
            </div>

            {/* Photo & Identity */}
            <div className="p-3 flex flex-col items-center text-center">
              <div className="w-20 h-24 rounded-lg border-2 border-slate-300 overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                <img 
                  src={staff.photo} 
                  alt={staff.firstName} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="mt-2">
                <div className="font-extrabold text-sm text-slate-900 leading-tight">
                  {staff.firstName} {staff.lastName}
                </div>
                <div className="text-xs font-bold text-blue-700 mt-0.5">
                  {staff.role}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {staff.department}
                </div>
                <div className="text-[10px] text-slate-600 font-mono mt-1">
                  Matricule : <strong>{staff.matricule}</strong>
                </div>
              </div>

              {/* QR Code Specimen */}
              <div className="mt-3 flex items-center justify-center p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <svg className="w-16 h-16" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  <path d="M10,10 h30 v30 h-30 z M15,15 h20 v20 h-20 z M20,20 h10 v10 h-10 z" fill="#1e3a8a" />
                  <path d="M60,10 h30 v30 h-30 z M65,15 h20 v20 h-20 z M70,20 h10 v10 h-10 z" fill="#1e3a8a" />
                  <path d="M10,60 h30 v30 h-30 z M15,65 h20 v20 h-20 z M20,70 h10 v10 h-10 z" fill="#1e3a8a" />
                  <rect x="45" y="45" width="10" height="10" fill="#1e3a8a" />
                  <rect x="65" y="65" width="15" height="15" fill="#1e3a8a" />
                  <rect x="45" y="75" width="10" height="15" fill="#1e3a8a" />
                  <rect x="75" y="45" width="15" height="10" fill="#1e3a8a" />
                </svg>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-blue-950 text-white px-3 py-1.5 flex items-center justify-between text-[9px]">
              <span>Contrôle d'Accès Sécurisé</span>
              <span className="font-mono">SmartSchool ERP</span>
            </div>
          </div>

          {/* Right Panel: Capabilities & QR Scan Simulator */}
          <div className="space-y-4 text-xs text-slate-700 max-w-xs w-full">
            <div className="space-y-1.5">
              <span className="font-semibold text-blue-950 uppercase tracking-wider text-[11px]">
                Usages Autorisés du QR Code
              </span>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Pointage présence & émargement</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Contrôle d'accès portail & laboratoires</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Emprunt d'ouvrages à la bibliothèque</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Identification rapide en réunion</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 space-y-2">
              <div className="font-semibold text-blue-950 flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-blue-600" />
                Testeur de Scan QR Code
              </div>
              <p className="text-[11px] text-slate-600">
                Simulez la lecture optique de la borne de contrôle d'accès :
              </p>
              <button
                onClick={handleTestScan}
                className="w-full py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                Simuler le Scan du Badge
              </button>

              {scanVerified && (
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] animate-in fade-in">
                  ✓ Accès Autorisé : {staff.firstName} {staff.lastName} ({staff.role})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-blue-100 flex justify-end gap-2 text-xs">
          <button
            onClick={() => triggerPrint('staff-badge-printable-card', `Badge_${staff.firstName}_${staff.lastName}`)}
            className="flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Badge</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-600 hover:text-blue-950 rounded-lg bg-slate-100 hover:bg-blue-50 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
