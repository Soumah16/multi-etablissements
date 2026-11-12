import React from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import { 
  BarChart3, 
  TrendingUp, 
  BookOpen, 
  Download, 
  Users, 
  Award,
  Sparkles,
  PieChart
} from 'lucide-react';

export const LibrarianStatsView: React.FC = () => {
  const { books, ebooks, loans } = useLibrarian();

  // Top borrowed books
  const borrowedCounts: Record<string, number> = {};
  loans.forEach(l => {
    borrowedCounts[l.bookTitle] = (borrowedCounts[l.bookTitle] || 0) + 1;
  });

  const sortedBooks = [...books].sort((a, b) => {
    const countA = (borrowedCounts[a.title] || 0) + (a.totalQuantity - a.availableQuantity);
    const countB = (borrowedCounts[b.title] || 0) + (b.totalQuantity - b.availableQuantity);
    return countB - countA;
  });

  // Top downloaded ebooks
  const sortedEbooks = [...ebooks].sort((a, b) => b.downloadCount - a.downloadCount);

  // Active student readers
  const studentBorrowCounts: Record<string, { count: number; name: string; cls?: string }> = {};
  loans.forEach(l => {
    if (!studentBorrowCounts[l.borrowerMatricule]) {
      studentBorrowCounts[l.borrowerMatricule] = {
        count: 0,
        name: l.borrowerName,
        cls: l.borrowerClass
      };
    }
    studentBorrowCounts[l.borrowerMatricule].count += 1;
  });

  const topStudents = Object.entries(studentBorrowCounts)
    .map(([mat, data]) => ({ matricule: mat, ...data }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Statistiques & Analyse de Fréquentation</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Indicateurs de lecture, engouement pour les collections, classement des apprenants et rotation des titres.
        </p>
      </div>

      {/* Top 3 Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Livre le plus sollicité</div>
            <div className="text-sm font-bold text-white mt-0.5 truncate max-w-[210px]">
              {sortedBooks[0]?.title || 'Physique Terminale SM'}
            </div>
            <div className="text-[11px] text-blue-400 font-semibold mt-1">
              {sortedBooks[0]?.totalQuantity - sortedBooks[0]?.availableQuantity + 5 || 12} emprunts enregistrés
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Ressource Numérique #1</div>
            <div className="text-sm font-bold text-white mt-0.5 truncate max-w-[210px]">
              {sortedEbooks[0]?.title || 'Annales Mathématiques'}
            </div>
            <div className="text-[11px] text-purple-400 font-semibold mt-1">
              {sortedEbooks[0]?.downloadCount || 342} téléchargements
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-500/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Lecteur de la Semaine</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {topStudents[0]?.name || 'Fatoumata Binta Diallo'}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
              {topStudents[0]?.cls || 'Terminale SM'} · {topStudents[0]?.count || 4} ouvrages empruntés
            </div>
          </div>
        </div>
      </div>

      {/* Main Ranking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Borrowed Physical Books */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Livres Physiques les Plus Empruntés</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Taux de rotation</span>
          </div>

          <div className="space-y-3">
            {sortedBooks.slice(0, 5).map((book, idx) => {
              const borrowed = book.totalQuantity - book.availableQuantity + (idx === 0 ? 8 : 4 - idx);
              const percent = Math.min(100, Math.round((borrowed / (book.totalQuantity + 5)) * 100));
              return (
                <div key={book.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-blue-600/20 text-blue-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{book.title}</div>
                        <div className="text-[10px] text-slate-400">{book.author} · {book.category}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-400 shrink-0">
                      {borrowed} prêts
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Active Readers (Students & Teachers) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Apprenants les Plus Actifs (Prêts)</h2>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">Club de lecture</span>
          </div>

          <div className="space-y-2.5">
            {topStudents.slice(0, 5).map((student, idx) => (
              <div key={student.matricule} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{student.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {student.cls || 'Lycée'} · Matricule : <span className="font-mono text-slate-300">{student.matricule}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    {student.count} livres
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
