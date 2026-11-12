export type LibrarianNavTab = 
  | 'dashboard' 
  | 'books' 
  | 'ebooks' 
  | 'loans' 
  | 'stats' 
  | 'badge' 
  | 'security';

export interface BookChapter {
  id: string;
  title: string;
  content: string;
  pageNumber?: number;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: 'Roman' | 'Manuel Scolaire' | 'Sciences' | 'Histoire-Géo' | 'Philosophie' | 'Revue' | 'Mémoire' | 'Autre';
  type: 'physique' | 'numerique' | 'revue' | 'memoire' | 'document_pedagogique';
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  shelfLocation: string; // e.g. Rayon A - Étagère 3
  state: 'Neuf' | 'Bon état' | 'Usé' | 'Dégradé';
  coverUrl?: string;
  qrCodeId: string;
  yearPublished: number;
  content?: string;
  chapters?: BookChapter[];
  fileData?: string;
  fileName?: string;
}

export interface EbookItem {
  id: string;
  title: string;
  author: string;
  format: 'PDF' | 'EPUB' | 'DOCX' | 'PPTX' | 'Vidéo' | 'Audio';
  level: 'Collège' | 'Lycée' | 'Tous niveaux';
  targetClass: string; // e.g. Terminale SM, 10ème Année
  subject: string; // e.g. Mathématiques, Physique-Chimie, Français
  fileSize: string;
  downloadCount: number;
  url: string;
  description: string;
  thumbnailUrl: string;
  content?: string;
  chapters?: BookChapter[];
  fileData?: string;
  fileName?: string;
}

export interface LoanRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  borrowerRole: 'Élève' | 'Enseignant';
  borrowerMatricule: string;
  borrowerClass?: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'en_cours' | 'retourne' | 'en_retard' | 'perdu' | 'degrade';
  renewCount: number;
  fineGnf: number;
  notes?: string;
}

export interface LibrarianProfile {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  phone: string;
  email: string;
  address: string;
  photo: string;
  hireDate: string;
  schoolName: string;
  librarySection: string;
  pinCode: string;
  twoFactorEnabled: boolean;
}
