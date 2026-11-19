import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Download,
  Info,
  PencilLine,
  PlusCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { AuditOperationType, School, SecurityAuditLog } from '../../types';
import { isSchoolAdminAuditLog, resolveAuditOperation } from '../../utils/auditLogger';

interface ActivityJournalPanelProps {
  auditLogs: SecurityAuditLog[];
  schools: School[];
  onOpenFullSecurityLogs: () => void;
}

type ActorScopeFilter = 'school_admins' | 'all';
type OperationFilter = 'crud' | 'create' | 'update' | 'delete' | 'all';

const OPERATION_LABELS: Record<AuditOperationType, string> = {
  create: 'Création',
  update: 'Modification',
  delete: 'Suppression',
  security: 'Sécurité',
  other: 'Système'
};

export const ActivityJournalPanel: React.FC<ActivityJournalPanelProps> = ({
  auditLogs,
  schools,
  onOpenFullSecurityLogs
}) => {
  const hasSchoolAdminLogs = useMemo(
    () => auditLogs.some(log => isSchoolAdminAuditLog(log)),
    [auditLogs]
  );

  const [actorScope, setActorScope] = useState<ActorScopeFilter>(
    hasSchoolAdminLogs ? 'school_admins' : 'all'
  );
  const [operationFilter, setOperationFilter] = useState<OperationFilter>('crud');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleLimit, setVisibleLimit] = useState<number>(12);

  const enrichedLogs = useMemo(() => {
    return auditLogs.map(log => {
      const operation = resolveAuditOperation(log);
      const isSchoolAdmin = isSchoolAdminAuditLog(log);
      return { log, operation, isSchoolAdmin };
    });
  }, [auditLogs]);

  const counts = useMemo(() => {
    const scopeList =
      actorScope === 'school_admins'
        ? enrichedLogs.filter(item => item.isSchoolAdmin)
        : enrichedLogs;

    return {
      schoolAdminTotal: enrichedLogs.filter(
        item =>
          item.isSchoolAdmin &&
          (item.operation === 'create' || item.operation === 'update' || item.operation === 'delete')
      ).length,
      allTotal: enrichedLogs.length,
      creates: scopeList.filter(i => i.operation === 'create').length,
      updates: scopeList.filter(i => i.operation === 'update').length,
      deletes: scopeList.filter(i => i.operation === 'delete').length
    };
  }, [enrichedLogs, actorScope]);

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrichedLogs.filter(({ log, operation, isSchoolAdmin }) => {
      if (actorScope === 'school_admins' && !isSchoolAdmin) {
        return false;
      }

      if (operationFilter === 'crud') {
        if (operation !== 'create' && operation !== 'update' && operation !== 'delete') {
          return false;
        }
      } else if (operationFilter !== 'all' && operation !== operationFilter) {
        return false;
      }

      if (schoolFilter !== 'all') {
        const needle = schoolFilter.toLowerCase();
        const schoolMatches =
          (log.schoolName || '').toLowerCase().includes(needle) ||
          log.target.toLowerCase().includes(needle) ||
          log.action.toLowerCase().includes(needle) ||
          log.actor.toLowerCase().includes(needle);
        if (!schoolMatches) return false;
      }

      if (q) {
        const hay = `${log.action} ${log.actor} ${log.target} ${log.schoolName || ''} ${log.ip}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [enrichedLogs, actorScope, operationFilter, schoolFilter, searchQuery]);

  const displayedLogs = filteredLogs.slice(0, visibleLimit);

  const handleExportCsv = () => {
    const headers = ['Horodatage', 'Opération', 'Action', 'Acteur', 'Cible / Établissement', 'Adresse IP', 'Gravité'];
    const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    const rows = filteredLogs.map(({ log, operation }) => [
      escapeCsv(log.timestamp),
      escapeCsv(OPERATION_LABELS[operation]),
      escapeCsv(log.action),
      escapeCsv(log.actor),
      escapeCsv(log.schoolName ? `${log.target} (${log.schoolName})` : log.target),
      escapeCsv(log.ip),
      escapeCsv(log.severity.toUpperCase())
    ]);
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-activites-smartschool-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderOperationCell = (operation: AuditOperationType) => {
    switch (operation) {
      case 'create':
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold whitespace-nowrap">
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Création</span>
          </span>
        );
      case 'update':
        return (
          <span className="inline-flex items-center gap-1.5 text-blue-700 font-semibold whitespace-nowrap">
            <PencilLine className="w-3.5 h-3.5 shrink-0" />
            <span>Modification</span>
          </span>
        );
      case 'delete':
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold whitespace-nowrap">
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>Suppression</span>
          </span>
        );
      case 'security':
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Sécurité</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium whitespace-nowrap">
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>Système</span>
          </span>
        );
    }
  };

  const renderSeverityCell = (severity: SecurityAuditLog['severity']) => {
    if (severity === 'critical') {
      return (
        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold whitespace-nowrap">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Critique</span>
        </span>
      );
    }
    if (severity === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Attention</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-slate-600 font-medium whitespace-nowrap">
        <Info className="w-3.5 h-3.5 shrink-0 text-blue-600" />
        <span>Info</span>
      </span>
    );
  };

  return (
    <section
      aria-label="Journal des Activités des Administrateurs"
      className="rounded-xl bg-white border border-slate-200 overflow-hidden"
    >
      {/* Top Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 shrink-0" />
            <h2 className="text-base font-bold text-blue-950 tracking-tight">
              Journal des Activités (Audit Logs)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Traçabilité en temps réel des créations, modifications et suppressions effectuées par les administrateurs d'écoles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Exporter CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenFullSecurityLogs}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Console Sécurité</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary & Scope Strip */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
          <span>
            Affichées : <strong className="font-mono tabular-nums text-blue-950">{filteredLogs.length}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-300">|</span>
          <span>
            Créations : <strong className="font-mono tabular-nums text-emerald-700">{counts.creates}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-300">|</span>
          <span>
            Modifications : <strong className="font-mono tabular-nums text-blue-700">{counts.updates}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-300">|</span>
          <span>
            Suppressions : <strong className="font-mono tabular-nums text-rose-700">{counts.deletes}</strong>
          </span>
        </div>

        {/* Actor Scope Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setActorScope('school_admins');
              setVisibleLimit(12);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              actorScope === 'school_admins'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admins d'École ({counts.schoolAdminTotal})
          </button>
          <button
            type="button"
            onClick={() => {
              setActorScope('all');
              setVisibleLimit(12);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              actorScope === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toute la plateforme ({counts.allTotal})
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 sm:px-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Operation Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {(
            [
              { id: 'crud', label: 'Créations / Modif. / Suppr.' },
              { id: 'create', label: 'Créations' },
              { id: 'update', label: 'Modifications' },
              { id: 'delete', label: 'Suppressions' },
              { id: 'all', label: 'Tout' }
            ] as { id: OperationFilter; label: string }[]
          ).map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setOperationFilter(tab.id);
                setVisibleLimit(12);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                operationFilter === tab.id
                  ? 'bg-white text-blue-950 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* School Filter + Live Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 lg:max-w-lg">
          <select
            value={schoolFilter}
            onChange={e => {
              setSchoolFilter(e.target.value);
              setVisibleLimit(12);
            }}
            aria-label="Filtrer par établissement"
            className="px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les établissements</option>
            {schools.map(s => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setVisibleLimit(12);
              }}
              placeholder="Rechercher administrateur, action, cible..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* High-Density Audit Log Table */}
      {displayedLogs.length === 0 ? (
        <div className="p-8 text-center space-y-3">
          <div className="text-sm font-semibold text-slate-800">
            Aucune activité trouvée pour ces critères
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {actorScope === 'school_admins'
              ? "Aucune création, modification ou suppression d'administrateur d'école ne correspond actuellement au filtre sélectionné."
              : "Aucune entrée du journal d'audit ne correspond à votre recherche."}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            {actorScope === 'school_admins' && (
              <button
                type="button"
                onClick={() => {
                  setActorScope('all');
                  setOperationFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                Afficher toute la plateforme
              </button>
            )}
            {(searchQuery || schoolFilter !== 'all' || operationFilter !== 'crud') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSchoolFilter('all');
                  setOperationFilter('crud');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold text-[11px]">
                  <th className="py-2.5 px-4 whitespace-nowrap">Horodatage</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Opération</th>
                  <th className="py-2.5 px-3">Action & Cible</th>
                  <th className="py-2.5 px-3">Administrateur / Acteur</th>
                  <th className="py-2.5 px-4 text-right whitespace-nowrap">Gravité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {displayedLogs.map(({ log, operation }) => (
                  <tr key={log.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 text-[11px]">
                      {renderOperationCell(operation)}
                    </td>
                    <td className="py-2.5 px-3 min-w-[240px]">
                      <div className="font-medium text-slate-900">{log.action}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span>{log.target}</span>
                        {log.schoolName && !log.target.toLowerCase().includes(log.schoolName.toLowerCase()) && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{log.schoolName}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-700">
                      <div className="font-medium text-blue-950">{log.actor}</div>
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums mt-0.5">
                        {log.ip}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right text-[11px]">
                      {renderSeverityCell(log.severity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredLogs.length > visibleLimit && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono tabular-nums">
                Affichage {displayedLogs.length} sur {filteredLogs.length} activités
              </span>
              <button
                type="button"
                onClick={() => setVisibleLimit(prev => prev + 20)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-blue-700 transition-colors cursor-pointer"
              >
                Afficher plus d'activités
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
