import React, { createContext, useContext, useState } from 'react';
import { 
  LibrarianNavTab, 
  BookItem, 
  EbookItem, 
  LoanRecord, 
  LibrarianProfile 
} from '../types/librarian';
import { 
  initialLibrarianProfile, 
  initialBooks, 
  initialEbooks, 
  initialLoanRecords 
} from '../data/librarianMockData';

interface LibrarianContextType {
  activeLibrarianTab: LibrarianNavTab;
  setActiveLibrarianTab: (tab: LibrarianNavTab) => void;
  profile: LibrarianProfile;
  updateProfile: (updated: Partial<LibrarianProfile>) => void;
  books: BookItem[];
  addBook: (book: Omit<BookItem, 'id' | 'qrCodeId'>) => void;
  updateBook: (id: string, updated: Partial<BookItem>) => void;
  deleteBook: (id: string) => void;
  ebooks: EbookItem[];
  addEbook: (ebook: Omit<EbookItem, 'id' | 'downloadCount'>) => void;
  loans: LoanRecord[];
  registerLoan: (loan: Omit<LoanRecord, 'id' | 'renewCount' | 'fineGnf'>) => void;
  returnBook: (loanId: string) => void;
  renewLoan: (loanId: string) => void;
  declareLost: (loanId: string, fineGnf?: number) => void;
  declareDamaged: (loanId: string, fineGnf?: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  formatGnf: (amount: number) => string;
}

const LibrarianContext = createContext<LibrarianContextType | undefined>(undefined);

export const LibrarianProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLibrarianTab, setActiveLibrarianTab] = useState<LibrarianNavTab>('dashboard');
  const [profile, setProfile] = useState<LibrarianProfile>(initialLibrarianProfile);
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [ebooks, setEbooks] = useState<EbookItem[]>(initialEbooks);
  const [loans, setLoans] = useState<LoanRecord[]>(initialLoanRecords);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(amount) + ' GNF';
  };

  const updateProfile = (updated: Partial<LibrarianProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    showToast('Profil bibliothécaire mis à jour avec succès.');
  };

  const addBook = (newBookData: Omit<BookItem, 'id' | 'qrCodeId'>) => {
    const id = `book-${Date.now()}`;
    const qrCodeId = `QR-BIB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBook: BookItem = { ...newBookData, id, qrCodeId };
    setBooks(prev => [newBook, ...prev]);
    showToast(`Ouvrage « ${newBook.title} » ajouté à la bibliothèque.`);
  };

  const updateBook = (id: string, updated: Partial<BookItem>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
    showToast('Fiche du livre mise à jour.');
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    showToast('Livre retiré du catalogue.');
  };

  const addEbook = (ebookData: Omit<EbookItem, 'id' | 'downloadCount'>) => {
    const newEbook: EbookItem = {
      ...ebookData,
      id: `eb-${Date.now()}`,
      downloadCount: 0
    };
    setEbooks(prev => [newEbook, ...prev]);
    showToast(`Ressource numérique « ${newEbook.title} » téléversée.`);
  };

  const registerLoan = (loanData: Omit<LoanRecord, 'id' | 'renewCount' | 'fineGnf'>) => {
    const newLoan: LoanRecord = {
      ...loanData,
      id: `loan-${Date.now()}`,
      renewCount: 0,
      fineGnf: 0
    };
    setLoans(prev => [newLoan, ...prev]);
    // Decrease book availableQuantity
    setBooks(prev => prev.map(b => b.id === loanData.bookId ? { ...b, availableQuantity: Math.max(0, b.availableQuantity - 1) } : b));
    showToast(`Prêt enregistré pour ${loanData.borrowerName}.`);
  };

  const returnBook = (loanId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const targetLoan = loans.find(l => l.id === loanId);
    if (!targetLoan) return;

    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'retourne', returnDate: today } : l));
    // Re-increase book available quantity
    setBooks(prev => prev.map(b => b.id === targetLoan.bookId ? { ...b, availableQuantity: Math.min(b.totalQuantity, b.availableQuantity + 1) } : b));
    showToast(`Retour validé pour le livre « ${targetLoan.bookTitle} ».`);
  };

  const renewLoan = (loanId: string) => {
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        const currentDueDate = new Date(l.dueDate);
        currentDueDate.setDate(currentDueDate.getDate() + 14);
        return {
          ...l,
          dueDate: currentDueDate.toISOString().split('T')[0],
          renewCount: l.renewCount + 1,
          status: 'en_cours'
        };
      }
      return l;
    }));
    showToast('Prêt prolongé de 14 jours avec succès.');
  };

  const declareLost = (loanId: string, fineGnf = 50000) => {
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'perdu', fineGnf } : l));
    showToast(`Livre déclaré perdu. Pénalité de ${formatGnf(fineGnf)} enregistrée.`);
  };

  const declareDamaged = (loanId: string, fineGnf = 25000) => {
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'degrade', fineGnf } : l));
    showToast(`Dégradation déclarée. Frais de reliure : ${formatGnf(fineGnf)}.`);
  };

  return (
    <LibrarianContext.Provider value={{
      activeLibrarianTab,
      setActiveLibrarianTab,
      profile,
      updateProfile,
      books,
      addBook,
      updateBook,
      deleteBook,
      ebooks,
      addEbook,
      loans,
      registerLoan,
      returnBook,
      renewLoan,
      declareLost,
      declareDamaged,
      toastMessage,
      showToast,
      formatGnf
    }}>
      {children}
    </LibrarianContext.Provider>
  );
};

export const useLibrarian = () => {
  const context = useContext(LibrarianContext);
  if (!context) {
    throw new Error('useLibrarian must be used within a LibrarianProvider');
  }
  return context;
};
