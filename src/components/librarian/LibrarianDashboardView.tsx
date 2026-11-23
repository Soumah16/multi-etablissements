import React, { useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import {
  BookOpen,
  FileText,
  Clock,
  Users,
  Download,
  QrCode,
  Plus,
  ArrowRight,
  AlertTriangle,
  Library,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { LibraryQrScannerModal } from './LibraryQrScannerModal';
import { BookReaderModal } from './BookReaderModal';
import { BookItem } from '../../types/librarian';

export const LibrarianDashboardView: React.FC = () => {
  const {
    books,
    ebooks,
    loans,
    setActiveLibrarianTab,
    returnBook,
    canManageLibrary,
    libraryUser
  } = useLibrarian();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);

  const visibleLoans = canManageLibrary
    ? loans
    : loans.filter(
        l =>
          l.borrowerMatricule === libraryUser?.matricule ||
          l.borrowerName.toLowerCase() === libraryUser?.name.toLowerCase()
      );

  // KPIs
  const totalBooksCount = books.reduce((acc, b) => acc + b.totalQuantity, 0);
  const totalEbooksCount = ebooks.length;
  const activeLoans = visibleLoans.filter(l => l.status === 'en_cours');
  const overdueLoans = visibleLoans.filter(l => l.status === 'en_retard');
  const totalAvailable = books.reduce((acc, b) => acc + b.availableQuantity, 0);
  const totalDownloads = ebooks.reduce((acc, eb) => acc + eb.downloadCount, 0);

  // Unique active borrowers
  const uniqueBorrowers = new Set(loans.map(l => l.borrowerMatricule)).size;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50/40 to-blue-50/80 border border-indigo-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Médiathèque &amp; Bibliothèque
            </span>
            <span className="text-xs text-slate-500">Année Scolaire 2026-2027</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950 mt-1">
            Tableau de Bord Bibliothèque &amp; E-Learning
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {canManageLibrary
              ? 'Administration complète des fonds documentaires, e-books et flux d’emprunts.'
              : 'Consultation du catalogue physique, liseuse numérique et suivi de vos emprunts personnels.'}
          </p>
        </div>

        {canManageLibrary ? (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setScannerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Scanner QR Code</span>
            </button>
            <button
              onClick={() => setActiveLibrarianTab('books')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-900 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Nouveau Livre</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveLibrarianTab('books')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Consulter les Livres</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Livres</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-950">{totalBooksCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{books.length} titres physiques</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total E-books</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-purple-600">{totalEbooksCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">PDF, Vidéos &amp; Audios</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">
              {canManageLibrary ? 'Empruntés' : 'Mes Emprunts'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-700">{activeLoans.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">En cours</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Disponibles</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-600">{totalAvailable}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">En rayons</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Retards</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-rose-600">{overdueLoans.length}</div>
            <div className="text-[10px] text-rose-400/80 mt-0.5">À retourner</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Lecteurs Actifs</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-cyan-600">{uniqueBorrowers}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Élèves &amp; Profs</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Téléchargements</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Download className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-indigo-600">{totalDownloads}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Ressources web</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Loans & Popular Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loans Table (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-blue-950">
                {canManageLibrary ? 'Derniers Emprunts & Suivi des Retours' : 'Mes Emprunts en Bibliothèque'}
              </h2>
            </div>
            <button
              onClick={() => setActiveLibrarianTab('loans')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Voir tous ({visibleLoans.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-blue-100 text-[11px] text-slate-500 uppercase font-semibold">
                  <th className="py-2.5 px-3">Ouvrage</th>
                  <th className="py-2.5 px-3">Emprunteur</th>
                  <th className="py-2.5 px-3">Date Prêt</th>
                  <th className="py-2.5 px-3">Date Limite</th>
                  <th className="py-2.5 px-3">Statut</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {visibleLoans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-slate-500">
                      Aucun emprunt enregistré à votre nom.
                    </td>
                  </tr>
                ) : (
                  visibleLoans.slice(0, 5).map(loan => {
                    const isOverdue = loan.status === 'en_retard';
                    return (
                      <tr key={loan.id} className="hover:bg-blue-50 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-blue-950 truncate max-w-[190px]">
                            {loan.bookTitle}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="text-slate-900 font-medium">{loan.borrowerName}</div>
                          <div className="text-[10px] text-slate-500">
                            {loan.borrowerRole} {loan.borrowerClass ? `· ${loan.borrowerClass}` : ''}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{loan.borrowDate}</td>
                        <td className="py-2.5 px-3">
                          <span className={`font-mono ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                            {loan.dueDate}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {loan.status === 'en_cours' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              En cours
                            </span>
                          )}
                          {loan.status === 'en_retard' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                              En retard
                            </span>
                          )}
                          {loan.status === 'retourne' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Retourné
                            </span>
                          )}
                          {loan.status === 'perdu' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-900/40 text-red-700 border border-red-200">
                              Perdu
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {canManageLibrary ? (
                            loan.status === 'en_cours' || loan.status === 'en_retard' ? (
                              <button
                                onClick={() => returnBook(loan.id)}
                                className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-[11px] font-medium transition-all cursor-pointer"
                              >
                                Retourner
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500">Clôturé</span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                              <Lock className="w-3 h-3" />
                              <span>Lecture seule</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Digital Quick Access & Strict Boundaries */}
        <div className="space-y-6">
          {/* E-books Highlights */}
          <div className="rounded-2xl bg-white border border-blue-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-blue-950">E-Books les Plus Consultés</h3>
              </div>
              <button
                onClick={() => setActiveLibrarianTab('ebooks')}
                className="text-xs text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
              >
                Tout voir →
              </button>
            </div>

            <div className="space-y-2.5">
              {ebooks.slice(0, 3).map(eb => (
                <div key={eb.id} className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-blue-950 truncate">{eb.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {eb.targetClass} · {eb.subject} · {eb.format}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-purple-700 px-2 py-0.5 rounded bg-purple-50">
                      {eb.downloadCount} DL
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strict Role Governance */}
          <div className="rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <Library className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Gouvernance Bibliothèque</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Seul l'<strong>Admin de la Bibliothèque de l'école</strong> est habilité à ajouter, modifier ou supprimer des livres, e-books et prêts.
            </p>
            <div className="pt-2 border-t border-blue-100 space-y-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <span>✔️</span>
                <span>Connexion individuelle obligatoire par compte</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-600">
                <span>🔒</span>
                <span>Aucune modification autorisée pour les autres rôles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Camera & Code QR Scanner Modal */}
      {canManageLibrary && (
        <LibraryQrScannerModal
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onOpenReader={(book) => {
            setScannerOpen(false);
            setReadingBook(book);
          }}
        />
      )}

      {readingBook && (
        <BookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}
    </div>
  );
};
