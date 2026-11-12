import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ChevronDown, ChevronUp, Lock, CheckCircle2, XCircle } from 'lucide-react';

export const GovernanceBanner: React.FC = () => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-amber-500/30 bg-amber-950/20 rounded-xl p-4 text-slate-200 transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-amber-300">
                {t.governanceBannerTitle}
              </span>
              <span className="text-xs text-amber-400/80 font-mono">
                Isolation Multi-Tenant Strict
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 md:line-clamp-none">
              {t.governanceBannerDesc}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-colors whitespace-nowrap"
        >
          <span>{isOpen ? 'Masquer la charte' : 'Voir les règles d\'or'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200">
          <div className="space-y-2">
            <span className="font-semibold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <XCircle className="w-4 h-4 text-rose-400" />
              Ce que le Super Admin ne doit JAMAIS faire
            </span>
            <ul className="space-y-1.5 text-slate-300 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5 font-bold">✕</span>
                <span>Ajouter, modifier ou supprimer des élèves ou des parents dans une école</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5 font-bold">✕</span>
                <span>Saisir des notes, faire l'appel des présences ou corriger des devoirs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5 font-bold">✕</span>
                <span>Valider des bulletins trimestriels ou des résultats d'examens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5 font-bold">✕</span>
                <span>Encaisser directement les frais de scolarité internes des familles</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Missions légitimes du Super Admin
            </span>
            <ul className="space-y-1.5 text-slate-300 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <span>Créer et configurer les établissements avec leur identifiant unique <code>school_id</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <span>Nommer les Administrateurs d'écoles qui gèrent leur propre corps professoral</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <span>Gérer les quotas d'abonnements, facturation SaaS en Franc Guinéen (GNF)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <span>Superviser la sécurité globale, sauvegardes chiffrées et infrastructure cloud</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
