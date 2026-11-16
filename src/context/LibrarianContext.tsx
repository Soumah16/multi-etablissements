import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
import { AuthenticatedUser } from '../components/auth/AuthPortal';
import { authenticateUser } from '../data/accountsData';

export interface LibraryAccessLog {
  id: string;
  timestamp: string;
  userName: string;
  userMatricule: string;
  userRole: string;
  action: string;
  status: 'autorise' | 'refuse';
}

interface LibrarianContextType {
  activeLibrarianTab: LibrarianNavTab;
  setActiveLibrarianTab: (tab: LibrarianNavTab) => void;
  profile: LibrarianProfile;
  updateProfile: (updated: Partial<LibrarianProfile>) => void;

  // Library Personal Auth & Strict School Admin RBAC
  libraryUser: AuthenticatedUser | null;
  activeSchoolId: string;
  setActiveSchoolId: (schoolId: string) => void;
  canManageLibrary: boolean;
  libraryAuditLogs: LibraryAccessLog[];
  loginToLibrary: (
    identifier: string,
    password: string
  ) => { success: boolean; errorMessage?: string };
  logoutFromLibrary: () => void;
  authorizeLibrarianSession: (user: AuthenticatedUser) => void;

  // Catalog CRUD (Write strictly restricted to school librarian admin)
  books: BookItem[];
  addBook: (book: Omit<BookItem, 'id' | 'qrCodeId'>) => void;
  updateBook: (id: string, updated: Partial<BookItem>) => void;
  deleteBook: (id: string) => void;

  // Ebooks CRUD (Write strictly restricted to school librarian admin)
  ebooks: EbookItem[];
  addEbook: (ebook: Omit<EbookItem, 'id' | 'downloadCount'>) => void;
  updateEbook: (id: string, updated: Partial<EbookItem>) => void;
  deleteEbook: (id: string) => void;
  incrementEbookDownload: (id: string) => void;

  // Loans CRUD (Write strictly restricted to school librarian admin)
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

const safeLoadJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // ignore storage errors
  }
  return fallback;
};

export const LibrarianProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSchoolId, setActiveSchoolId] = useState<string>('ECOLE-001');
  const schoolKey = activeSchoolId && activeSchoolId !== 'NATIONAL' ? activeSchoolId : 'ECOLE-001';

  const [activeLibrarianTab, setActiveLibrarianTab] = useState<LibrarianNavTab>('dashboard');
  const [profile, setProfile] = useState<LibrarianProfile>(() =>
    safeLoadJson(`smartschool_lib_profile_${schoolKey}`, initialLibrarianProfile)
  );
  const [books, setBooks] = useState<BookItem[]>(() =>
    safeLoadJson(`smartschool_lib_books_${schoolKey}`, initialBooks)
  );
  const [ebooks, setEbooks] = useState<EbookItem[]>(() =>
    safeLoadJson(`smartschool_lib_ebooks_${schoolKey}`, initialEbooks)
  );
  const [loans, setLoans] = useState<LoanRecord[]>(() =>
    safeLoadJson(`smartschool_lib_loans_${schoolKey}`, initialLoanRecords)
  );
  const [libraryAuditLogs, setLibraryAuditLogs] = useState<LibraryAccessLog[]>(() =>
    safeLoadJson(`smartschool_lib_logs_${schoolKey}`, [])
  );

  // Every visitor entering the library MUST sign in with their own personal account
  const [libraryUser, setLibraryUser] = useState<AuthenticatedUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reload school-scoped library data when school changes
  useEffect(() => {
    setProfile(safeLoadJson(`smartschool_lib_profile_${schoolKey}`, initialLibrarianProfile));
    setBooks(safeLoadJson(`smartschool_lib_books_${schoolKey}`, initialBooks));
    setEbooks(safeLoadJson(`smartschool_lib_ebooks_${schoolKey}`, initialEbooks));
    setLoans(safeLoadJson(`smartschool_lib_loans_${schoolKey}`, initialLoanRecords));
    setLibraryAuditLogs(safeLoadJson(`smartschool_lib_logs_${schoolKey}`, []));
  }, [schoolKey]);

  // Persist school-scoped library data
  useEffect(() => {
    try {
      localStorage.setItem(`smartschool_lib_profile_${schoolKey}`, JSON.stringify(profile));
      localStorage.setItem(`smartschool_lib_books_${schoolKey}`, JSON.stringify(books));
      localStorage.setItem(`smartschool_lib_ebooks_${schoolKey}`, JSON.stringify(ebooks));
      localStorage.setItem(`smartschool_lib_loans_${schoolKey}`, JSON.stringify(loans));
      localStorage.setItem(`smartschool_lib_logs_${schoolKey}`, JSON.stringify(libraryAuditLogs));
    } catch {
      // ignore storage quota errors
    }
  }, [schoolKey, profile, books, ebooks, loans, libraryAuditLogs]);

  // STRICT RULE: ONLY the Librarian Admin belonging to THIS school can modify anything in the library.
  // Nobody else (neither Student, Teacher, Parent, Director, Accountant, Supervisor, School Admin, nor Super Admin) can modify library data!
  const canManageLibrary = useMemo(() => {
    if (!libraryUser) return false;
    if (libraryUser.role !== 'librarian') return false;
    if (
      activeSchoolId &&
      activeSchoolId !== 'NATIONAL' &&
      libraryUser.ecoleId &&
      libraryUser.ecoleId !== activeSchoolId
    ) {
      return false;
    }
    return true;
  }, [libraryUser, activeSchoolId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const recordLibraryLog = (
    action: string,
    status: 'autorise' | 'refuse',
    actor?: AuthenticatedUser | null
  ) => {
    const targetActor = actor ?? libraryUser;
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 8)}`;
    const entry: LibraryAccessLog = {
      id: `liblog-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      userName: targetActor?.name || 'Visiteur non authentifié',
      userMatricule: targetActor?.matricule || 'N/A',
      userRole: targetActor?.role || 'inconnu',
      action,
      status
    };
    setLibraryAuditLogs(prev => [entry, ...prev].slice(0, 50));
  };

  const guardWriteAccess = (actionName: string): boolean => {
    if (!canManageLibrary) {
      recordLibraryLog(`Tentative bloquée : ${actionName}`, 'refuse');
      showToast(
        "Accès refusé : Seul l'Admin de la Bibliothèque de l'école peut effectuer des modifications."
      );
      return false;
    }
    return true;
  };

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(amount) + ' GNF';
  };

  const loginToLibrary = (
    identifier: string,
    password: string
  ): { success: boolean; errorMessage?: string } => {
    const targetSchoolFilter =
      activeSchoolId && activeSchoolId !== 'NATIONAL' ? activeSchoolId : 'ALL';
    const result = authenticateUser(identifier, password, targetSchoolFilter);

    if (!result.success || !result.user) {
      recordLibraryLog(`Échec de connexion Bibliothèque (${identifier})`, 'refuse', null);
      return {
        success: false,
        errorMessage: result.errorMessage || 'Identifiant ou mot de passe incorrect.'
      };
    }

    const authenticated: AuthenticatedUser = {
      role: result.user.role,
      name: result.user.name,
      email: result.user.email,
      matricule: result.user.matricule,
      schoolName: result.user.schoolName,
      photo: result.user.photo,
      ecoleId: result.user.ecoleId,
      nationalUid: result.user.nationalUid,
      badgeNumber: result.user.badgeNumber,
      status: result.user.status,
      mustChangePassword: result.user.mustChangePassword
    };

    setLibraryUser(authenticated);
    setActiveLibrarianTab('dashboard');
    recordLibraryLog(
      authenticated.role === 'librarian'
        ? 'Connexion Admin Bibliothèque (Gestion complète autorisée)'
        : 'Connexion personnelle Bibliothèque (Mode Lecture seule)',
      'autorise',
      authenticated
    );
    showToast(
      authenticated.role === 'librarian'
        ? `Bienvenue ${authenticated.name} · Admin Bibliothèque connecté`
        : `Bienvenue ${authenticated.name} · Accès personnel (Lecture seule)`
    );

    return { success: true };
  };

  const logoutFromLibrary = () => {
    if (libraryUser) {
      recordLibraryLog('Déconnexion du terminal Bibliothèque', 'autorise', libraryUser);
    }
    setLibraryUser(null);
    setActiveLibrarianTab('dashboard');
    showToast('Compte déconnecté de la bibliothèque. Veuillez vous identifier pour continuer.');
  };

  const authorizeLibrarianSession = (user: AuthenticatedUser) => {
    if (user.role === 'librarian') {
      setLibraryUser(user);
      if (user.ecoleId && user.ecoleId !== 'NATIONAL') {
        setActiveSchoolId(user.ecoleId);
      }
      recordLibraryLog('Ouverture directe session Admin Bibliothèque', 'autorise', user);
    }
  };

  const updateProfile = (updated: Partial<LibrarianProfile>) => {
    if (!guardWriteAccess('Modification profil / sécurité bibliothécaire')) return;
    setProfile(prev => ({ ...prev, ...updated }));
    recordLibraryLog('Mise à jour profil / paramètres bibliothécaire', 'autorise');
    showToast('Profil bibliothécaire mis à jour avec succès.');
  };

  const addBook = (newBookData: Omit<BookItem, 'id' | 'qrCodeId'>) => {
    if (!guardWriteAccess(`Ajout livre « ${newBookData.title} »`)) return;
    const id = `book-${Date.now()}`;
    const qrCodeId = `QR-BIB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBook: BookItem = { ...newBookData, id, qrCodeId };
    setBooks(prev => [newBook, ...prev]);
    recordLibraryLog(`Ajout ouvrage : ${newBook.title}`, 'autorise');
    showToast(`Ouvrage « ${newBook.title} » ajouté à la bibliothèque.`);
  };

  const updateBook = (id: string, updated: Partial<BookItem>) => {
    if (!guardWriteAccess(`Modification ouvrage #${id}`)) return;
    setBooks(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));
    recordLibraryLog(`Modification fiche ouvrage #${id}`, 'autorise');
    showToast('Fiche du livre mise à jour.');
  };

  const deleteBook = (id: string) => {
    if (!guardWriteAccess(`Suppression ouvrage #${id}`)) return;
    const target = books.find(b => b.id === id);
    setBooks(prev => prev.filter(b => b.id !== id));
    recordLibraryLog(`Suppression ouvrage : ${target?.title || id}`, 'autorise');
    showToast('Livre retiré du catalogue.');
  };

  const addEbook = (ebookData: Omit<EbookItem, 'id' | 'downloadCount'>) => {
    if (!guardWriteAccess(`Téléversement E-Book « ${ebookData.title} »`)) return;
    const newEbook: EbookItem = {
      ...ebookData,
      id: `eb-${Date.now()}`,
      downloadCount: 0
    };
    setEbooks(prev => [newEbook, ...prev]);
    recordLibraryLog(`Ajout E-Book : ${newEbook.title}`, 'autorise');
    showToast(`Ressource numérique « ${newEbook.title} » téléversée.`);
  };

  const updateEbook = (id: string, updated: Partial<EbookItem>) => {
    if (!guardWriteAccess(`Modification E-Book #${id}`)) return;
    setEbooks(prev => prev.map(eb => (eb.id === id ? { ...eb, ...updated } : eb)));
    recordLibraryLog(`Modification E-Book #${id}`, 'autorise');
    showToast('Ressource numérique mise à jour.');
  };

  const deleteEbook = (id: string) => {
    if (!guardWriteAccess(`Suppression E-Book #${id}`)) return;
    const target = ebooks.find(eb => eb.id === id);
    setEbooks(prev => prev.filter(eb => eb.id !== id));
    recordLibraryLog(`Suppression E-Book : ${target?.title || id}`, 'autorise');
    showToast('Ressource numérique supprimée du catalogue.');
  };

  const incrementEbookDownload = (id: string) => {
    setEbooks(prev =>
      prev.map(eb => (eb.id === id ? { ...eb, downloadCount: eb.downloadCount + 1 } : eb))
    );
  };

  const registerLoan = (loanData: Omit<LoanRecord, 'id' | 'renewCount' | 'fineGnf'>) => {
    if (!guardWriteAccess(`Enregistrement emprunt « ${loanData.bookTitle} »`)) return;
    const newLoan: LoanRecord = {
      ...loanData,
      id: `loan-${Date.now()}`,
      renewCount: 0,
      fineGnf: 0
    };
    setLoans(prev => [newLoan, ...prev]);
    setBooks(prev =>
      prev.map(b =>
        b.id === loanData.bookId
          ? { ...b, availableQuantity: Math.max(0, b.availableQuantity - 1) }
          : b
      )
    );
    recordLibraryLog(`Prêt enregistré : ${loanData.bookTitle} → ${loanData.borrowerName}`, 'autorise');
    showToast(`Prêt enregistré pour ${loanData.borrowerName}.`);
  };

  const returnBook = (loanId: string) => {
    if (!guardWriteAccess(`Validation retour prêt #${loanId}`)) return;
    const today = new Date().toISOString().split('T')[0];
    const targetLoan = loans.find(l => l.id === loanId);
    if (!targetLoan) return;

    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status: 'retourne', returnDate: today } : l))
    );
    setBooks(prev =>
      prev.map(b =>
        b.id === targetLoan.bookId
          ? { ...b, availableQuantity: Math.min(b.totalQuantity, b.availableQuantity + 1) }
          : b
      )
    );
    recordLibraryLog(`Retour validé : ${targetLoan.bookTitle}`, 'autorise');
    showToast(`Retour validé pour le livre « ${targetLoan.bookTitle} ».`);
  };

  const renewLoan = (loanId: string) => {
    if (!guardWriteAccess(`Prolongation prêt #${loanId}`)) return;
    setLoans(prev =>
      prev.map(l => {
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
      })
    );
    recordLibraryLog(`Prolongation +14j du prêt #${loanId}`, 'autorise');
    showToast('Prêt prolongé de 14 jours avec succès.');
  };

  const declareLost = (loanId: string, fineGnf = 50000) => {
    if (!guardWriteAccess(`Déclaration perte prêt #${loanId}`)) return;
    setLoans(prev => prev.map(l => (l.id === loanId ? { ...l, status: 'perdu', fineGnf } : l)));
    recordLibraryLog(`Déclaration de perte prêt #${loanId} (${formatGnf(fineGnf)})`, 'autorise');
    showToast(`Livre déclaré perdu. Pénalité de ${formatGnf(fineGnf)} enregistrée.`);
  };

  const declareDamaged = (loanId: string, fineGnf = 25000) => {
    if (!guardWriteAccess(`Déclaration dégradation prêt #${loanId}`)) return;
    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status: 'degrade', fineGnf } : l))
    );
    recordLibraryLog(`Déclaration dégradation prêt #${loanId} (${formatGnf(fineGnf)})`, 'autorise');
    showToast(`Dégradation déclarée. Frais de reliure : ${formatGnf(fineGnf)}.`);
  };

  return (
    <LibrarianContext.Provider
      value={{
        activeLibrarianTab,
        setActiveLibrarianTab,
        profile,
        updateProfile,
        libraryUser,
        activeSchoolId,
        setActiveSchoolId,
        canManageLibrary,
        libraryAuditLogs,
        loginToLibrary,
        logoutFromLibrary,
        authorizeLibrarianSession,
        books,
        addBook,
        updateBook,
        deleteBook,
        ebooks,
        addEbook,
        updateEbook,
        deleteEbook,
        incrementEbookDownload,
        loans,
        registerLoan,
        returnBook,
        renewLoan,
        declareLost,
        declareDamaged,
        toastMessage,
        showToast,
        formatGnf
      }}
    >
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
