import React, { useState, useRef } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import { BookItem } from '../../types/librarian';
import { BookReaderModal } from './BookReaderModal';
import { triggerPrint, exportPrintableDocument } from '../../utils/printHelper';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  QrCode, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  BookCopy,
  Printer,
  Upload,
  FileText,
  Eye
} from 'lucide-react';

export const BooksCatalogView: React.FC = () => {
  const { books, addBook, updateBook, deleteBook, registerLoan } = useLibrarian();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [loanModalBook, setLoanModalBook] = useState<BookItem | null>(null);
  const [qrModalBook, setQrModalBook] = useState<BookItem | null>(null);
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<BookItem, 'id' | 'qrCodeId'>>({
    title: '',
    author: '',
    isbn: '',
    category: 'Manuel Scolaire',
    type: 'physique',
    description: '',
    totalQuantity: 10,
    availableQuantity: 10,
    shelfLocation: 'Rayon A - Étagère 1',
    state: 'Neuf',
    yearPublished: 2024,
    content: ''
  });

  // Quick Loan Form state
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerMatricule, setBorrowerMatricule] = useState('');
  const [borrowerRole, setBorrowerRole] = useState<'Élève' | 'Enseignant'>('Élève');
  const [borrowerClass, setBorrowerClass] = useState('Terminale SM');
  const [loanDueDate, setLoanDueDate] = useState('2026-11-20');

  const categories = ['all', 'Manuel Scolaire', 'Sciences', 'Roman', 'Histoire-Géo', 'Philosophie', 'Revue', 'Mémoire'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase()) ||
      b.shelfLocation.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: `978-2-${Math.floor(100000 + Math.random() * 900000)}`,
      category: 'Manuel Scolaire',
      type: 'physique',
      description: '',
      totalQuantity: 15,
      availableQuantity: 15,
      shelfLocation: 'Rayon B - Étagère 2',
      state: 'Neuf',
      yearPublished: 2025
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (b: BookItem) => {
    setEditingBook(b);
    setFormData({
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      category: b.category,
      type: b.type,
      description: b.description,
      totalQuantity: b.totalQuantity,
      availableQuantity: b.availableQuantity,
      shelfLocation: b.shelfLocation,
      state: b.state,
      yearPublished: b.yearPublished
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook.id, formData);
    } else {
      addBook(formData);
    }
    setModalOpen(false);
  };

  const handleQuickLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanModalBook) return;
    registerLoan({
      bookId: loanModalBook.id,
      bookTitle: loanModalBook.title,
      borrowerName,
      borrowerMatricule,
      borrowerRole,
      borrowerClass: borrowerRole === 'Élève' ? borrowerClass : undefined,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: loanDueDate,
      status: 'en_cours'
    });
    setLoanModalBook(null);
    setBorrowerName('');
    setBorrowerMatricule('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">Catalogue des Ouvrages Physiques</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventaire des manuels scolaires, romans, revues, rayonnage et génération des étiquettes QR Code.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Ouvrage</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, auteur, ISBN ou emplacement de rayon..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-blue-100 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white hover:bg-blue-50 text-slate-500 border border-blue-100'
              }`}
            >
              {cat === 'all' ? 'Tous les rayons' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Table Grid */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-blue-100 text-[11px] text-slate-500 uppercase font-semibold bg-blue-50/60">
                <th className="py-3 px-4">Titre & Auteur</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">ISBN & QR Code</th>
                <th className="py-3 px-4">Localisation Rayon</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4">État</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredBooks.map(book => {
                const isOutOfStock = book.availableQuantity === 0;
                return (
                  <tr key={book.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-blue-950 text-xs">{book.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{book.author} · {book.yearPublished}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-slate-700">{book.isbn}</div>
                      <button
                        onClick={() => setQrModalBook(book)}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-mono flex items-center gap-1 mt-0.5 cursor-pointer"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>{book.qrCodeId}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        <span>{book.shelfLocation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isOutOfStock 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {book.availableQuantity} / {book.totalQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        book.state === 'Neuf' ? 'text-emerald-600 bg-emerald-50' :
                        book.state === 'Bon état' ? 'text-blue-600 bg-blue-50' :
                        book.state === 'Usé' ? 'text-amber-700 bg-amber-50' : 'text-rose-600 bg-rose-50'
                      }`}>
                        {book.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setReadingBook(book)}
                          className="px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Lire le livre ou consulter les chapitres"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Lire</span>
                        </button>
                        <button
                          onClick={() => {
                            setLoanModalBook(book);
                            setBorrowerName('');
                            setBorrowerMatricule('');
                          }}
                          disabled={isOutOfStock}
                          title="Enregistrer un emprunt"
                          className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-[11px] font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          Prêter
                        </button>
                        <button
                          onClick={() => handleOpenEdit(book)}
                          className="p-1.5 rounded text-slate-500 hover:text-blue-950 hover:bg-blue-50 transition-colors"
                          title="Modifier la fiche"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="p-1.5 rounded text-slate-500 hover:text-rose-600 hover:bg-blue-50 transition-colors"
                          title="Supprimer du catalogue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="px-5 py-3.5 border-b border-blue-100 flex items-center justify-between shrink-0 bg-white">
              <h3 className="text-sm font-bold text-blue-950">
                {editingBook ? 'Modifier l’ouvrage' : 'Enregistrer un nouvel ouvrage physique'}
              </h3>
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-blue-950 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Titre de l'ouvrage *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Auteur(s) *</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">ISBN</label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                    >
                      <option value="Manuel Scolaire">Manuel Scolaire</option>
                      <option value="Sciences">Sciences</option>
                      <option value="Roman">Roman</option>
                      <option value="Histoire-Géo">Histoire-Géo</option>
                      <option value="Philosophie">Philosophie</option>
                      <option value="Revue">Revue</option>
                      <option value="Mémoire">Mémoire</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Année d'édition</label>
                    <input
                      type="number"
                      value={formData.yearPublished}
                      onChange={(e) => setFormData({ ...formData, yearPublished: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Quantité totale</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.totalQuantity}
                      onChange={(e) => {
                        const total = Number(e.target.value);
                        setFormData({ ...formData, totalQuantity: total, availableQuantity: total });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Localisation Rayon</label>
                    <input
                      type="text"
                      value={formData.shelfLocation}
                      onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                      placeholder="Rayon A - Étagère 3"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">État du livre</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                    >
                      <option value="Neuf">Neuf</option>
                      <option value="Bon état">Bon état</option>
                      <option value="Usé">Usé</option>
                      <option value="Dégradé">Dégradé</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Description / Résumé</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                    placeholder="Résumé de l'œuvre ou chapitres couverts..."
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700">
                      Contenu ou texte intégral à lire dans la bibliothèque (Optionnel)
                    </label>
                    <label className="text-[10px] text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Charger un fichier texte</span>
                      <input
                        type="file"
                        accept=".txt,.md,.pdf,.epub"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setFormData(prev => ({
                                  ...prev,
                                  content: reader.result as string,
                                  description: prev.description || `Ouvrage importé : ${file.name}`
                                }));
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-serif leading-relaxed"
                    placeholder="Collez ici le texte des chapitres, le cours ou les extraits pour lecture immédiate par les élèves et enseignants..."
                  />
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="px-5 py-3 border-t border-blue-100 bg-white flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-600/30"
                >
                  {editingBook ? 'Mettre à jour' : 'Ajouter au catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Loan Modal */}
      {loanModalBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-blue-950">
              Enregistrer un prêt : « {loanModalBook.title} »
            </h3>
            <p className="text-xs text-slate-500">
              Associez ce livre à un élève ou enseignant via son matricule ou sa carte scolaire.
            </p>

            <form onSubmit={handleQuickLoanSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Nom & Prénom de l'emprunteur *</label>
                <input
                  type="text"
                  required
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="ex: Fatoumata Binta Diallo"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Rôle</label>
                  <select
                    value={borrowerRole}
                    onChange={(e) => setBorrowerRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  >
                    <option value="Élève">Élève</option>
                    <option value="Enseignant">Enseignant</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Matricule</label>
                  <input
                    type="text"
                    required
                    value={borrowerMatricule}
                    onChange={(e) => setBorrowerMatricule(e.target.value)}
                    placeholder="MAT-2026-..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono"
                  />
                </div>
              </div>

              {borrowerRole === 'Élève' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Classe</label>
                  <input
                    type="text"
                    value={borrowerClass}
                    onChange={(e) => setBorrowerClass(e.target.value)}
                    placeholder="Terminale SM"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Date limite de retour</label>
                <input
                  type="date"
                  required
                  value={loanDueDate}
                  onChange={(e) => setLoanDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setLoanModalBook(null)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                >
                  Valider le Prêt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Tag Modal */}
      {qrModalBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-center space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-blue-950">Étiquette QR Code Bibliothèque</h3>
            <p className="text-xs text-slate-500">
              Imprimable pour collage sur la 1ère de couverture ou la tranche de l'ouvrage.
            </p>

            <div className="p-4 rounded-xl bg-white text-slate-950 inline-block mx-auto border-2 border-slate-200 shadow-md">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                BIBLIOTHÈQUE LYCÉE D'EXCELLENCE
              </div>
              <div className="w-36 h-36 mx-auto bg-slate-100 p-2 flex items-center justify-center border border-slate-300 my-2">
                <div className="w-full h-full border-2 border-dashed border-blue-100 flex flex-col items-center justify-center text-[11px] font-mono">
                  <QrCode className="w-12 h-12 text-slate-800 mb-1" />
                  <span className="font-bold">{qrModalBook.qrCodeId}</span>
                </div>
              </div>
              <div className="text-xs font-bold truncate max-w-[200px] mx-auto">{qrModalBook.title}</div>
              <div className="text-[10px] text-slate-600 font-mono mt-0.5">{qrModalBook.shelfLocation}</div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setQrModalBook(null)}
                className="px-4 py-2 rounded-lg bg-slate-50 hover:bg-blue-100 text-slate-700 text-xs font-semibold"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  triggerPrint('printable-qr-tag');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer l'étiquette</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Book Interactive Reader Modal */}
      {readingBook && (
        <BookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}
    </div>
  );
};
