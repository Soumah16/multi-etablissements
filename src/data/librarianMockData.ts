import { BookItem, EbookItem, LoanRecord, LibrarianProfile } from '../types/librarian';

export const initialLibrarianProfile: LibrarianProfile = {
  id: 'lib-001',
  firstName: 'Ousmane',
  lastName: 'Bangoura',
  matricule: 'BIB-GN-2026-004',
  phone: '+224 622 45 78 12',
  email: 'ousmane.bangoura@smartschool.gn',
  address: 'Dixinn Centre, Conakry, Guinée',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  hireDate: '15 Septembre 2021',
  schoolName: "Lycée d'Excellence de Conakry",
  librarySection: 'Médiathèque & Centre de Documentation (CDI)',
  pinCode: '741258',
  twoFactorEnabled: true
};

export const initialBooks: BookItem[] = [
  {
    id: 'book-001',
    title: 'Mathématiques Terminales SM & SE - Algèbre & Analyse',
    author: 'Pr. Ibrahima Kourouma',
    isbn: '978-2-84129-101-4',
    category: 'Manuel Scolaire',
    type: 'physique',
    description: 'Programme officiel MEPU-A avec 450 exercices résolus, équations différentielles et intégrales.',
    totalQuantity: 25,
    availableQuantity: 18,
    shelfLocation: 'Rayon Sciences - Étagère 2B',
    state: 'Bon état',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    qrCodeId: 'QR-BIB-2026-001',
    yearPublished: 2024,
    chapters: [
      {
        id: 'math-ch1',
        title: 'Chapitre 1 : Limites, Continuité & Dérivabilité des Fonctions Réelles',
        content: `I. DÉFINITION FORMELLE ET THÉORÈME DES VALEURS INTERMÉDIAIRES (TVI)
Soit f une fonction continue sur un intervalle fermé borné [a, b] de ℝ. Si k est un réel strictement compris entre f(a) et f(b), alors il existe au moins un réel c ∈ ]a, b[ tel que f(c) = k.

COROLLAIRE (Unicité de la solution) :
Si de plus la fonction f est strictement monotone sur [a, b], le réel c est unique. Ce théorème est la clé de voûte de la résolution des équations f(x) = 0 pour les épreuves de Baccalauréat MEPU-A.

II. CROISSANCES COMPARÉES & LIMITES FONDAMENTALES
Au voisinage de +∞ :
• lim (e^x / x^n) = +∞ pour tout entier naturel n ≥ 1.
• lim (ln(x) / x^n) = 0 pour tout entier naturel n ≥ 1.
• lim x·ln(x) = 0 quand x tend vers 0 par valeurs positives.

III. EXERCICE TYPE BAC AVEC DÉMONSTRATION COMPLÈTE
Étudier les variations de la fonction g définie sur ]0, +∞[ par g(x) = 2x - 1 - ln(x).
1. Calcul des dérivées : g'(x) = 2 - (1/x) = (2x - 1) / x.
2. Signe de g'(x) : pour x > 1/2, g'(x) > 0, g est strictement croissante. Pour x ∈ ]0, 1/2[, g'(x) < 0.
3. Minimum absolu : g(1/2) = 1 - 1 - ln(1/2) = ln(2) > 0.
Conclusion : Pour tout x > 0, g(x) > 0.`
      },
      {
        id: 'math-ch2',
        title: 'Chapitre 2 : Nombres Complexes & Transformations Géométriques du Plan',
        content: `I. FORME ALGÉBRIQUE, TRIGONOMÉTRIQUE ET EXPONENTIELLE
Tout nombre complexe z s'écrit de manière unique z = x + iy avec (x, y) ∈ ℝ².
• Module : |z| = √(x² + y²).
• Argument : θ ≡ arg(z) [2π] tel que cos(θ) = x/|z| et sin(θ) = y/|z|.
• Formule d'Euler : e^(iθ) = cos(θ) + i·sin(θ).
• Formule de Moivre : (cos θ + i sin θ)^n = cos(nθ) + i sin(nθ).

II. INTERPRÉTATION GÉOMÉTRIQUE DES NOMBRES COMPLEXES
Soient A, B, C trois points distincts d'affixes respectives zA, zB, zC.
• Le rapport (zC - zA) / (zB - zA) = (AC / AB) · e^(i·(AB, AC)).
• Triangle équilatéral direct : (zC - zA) / (zB - zA) = e^(iπ/3).
• Triangle rectangle isocèle en A : (zC - zA) / (zB - zA) = ±i.

III. SIMILITUDES DIRECTES DU PLAN
Toute similitude directe S non constante est de la forme complexe z' = a·z + b (a ∈ ℂ*, b ∈ ℂ).
• Si a = 1 : Translation de vecteur d'affixe b.
• Si |a| = 1 (a ≠ 1) : Rotation d'angle arg(a) et de centre Ω d'affixe ω = b / (1 - a).
• Si a ∈ ℝ*+ \\ {1} : Homothétie de rapport a et de centre Ω.`
      }
    ]
  },
  {
    id: 'book-002',
    title: 'Physique Moderne : Ondes, Optique & Électromagnétisme',
    author: 'Dr. Sékou Traoré',
    isbn: '978-2-84129-204-8',
    category: 'Sciences',
    type: 'physique',
    description: 'Manuel fondamental pour les séries scientifiques, avec travaux pratiques détaillés.',
    totalQuantity: 20,
    availableQuantity: 14,
    shelfLocation: 'Rayon Sciences - Étagère 3A',
    state: 'Neuf',
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=400&q=80',
    qrCodeId: 'QR-BIB-2026-002',
    yearPublished: 2025
  },
  {
    id: 'book-003',
    title: "L'Enfant Noir",
    author: 'Camara Laye',
    isbn: '978-2-26615-538-3',
    category: 'Roman',
    type: 'physique',
    description: 'Chef-d’œuvre de la littérature guinéenne et africaine, œuvre au programme officiel du MEPU-A.',
    totalQuantity: 35,
    availableQuantity: 27,
    shelfLocation: 'Rayon Littérature Africaine - Étagère 1A',
    state: 'Bon état',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    qrCodeId: 'QR-BIB-2026-003',
    yearPublished: 1953,
    chapters: [
      {
        id: 'ch-1',
        title: "Chapitre I : L'atelier de forge et le petit serpent noir",
        content: `J'étais enfant et je jouais près de la case de mon père. Quel âge avais-je en ce temps-là ? Je ne me rappelle pas exactement. Je devais être très jeune encore : cinq ans, six ans peut-être. Ma mère était dans l'atelier, près de mon père, et leurs voix me parvenaient, rassurantes, mêlées aux bruits de l'enclume et des soufflets.

Soudain, j'interrompis mon jeu : un serpent rampait autour de la case. C'était un petit serpent noir, dont le corps luisait doucement sous la lumière du jour. Je m'approchai sans crainte. J'avais trouvé un roseau taillé et je le tendis vers la bête. Le serpent ne fuyait pas ; il dardait sa langue fourchue avec lenteur.

À cet instant, un apprenti cria mon nom et bondit pour m'arracher au danger. Mais mon père, alerté par le cri, sortit de la forge et posa calmement sa main sur l'épaule de l'ouvrier. « Laisse-le, dit-il d'une voix grave. Ce serpent n'est pas un ennemi. C'est le génie de notre race, le protecteur de notre atelier. »

Ce soir-là, assis sous la véranda devant un bol de riz chaud, mon père me prit sur ses genoux et m'expliqua le mystère de l'or : « Vois-tu, mon fils, le travail de l'or exige plus que de la force et des pinces ; il demande la pureté du cœur et la bénédiction de nos ancêtres. Tant que ce serpent veillera sur nous, notre marteau ne faillira point. »`
      },
      {
        id: 'ch-2',
        title: "Chapitre II : Les moissons et les vacances à Tindican",
        content: `Chaque année, à la saison des récoltes, je quittais Kouroussa pour rejoindre Tindican, le village maternel. Dès que le sentier de terre ocre serpentait entre les hautes herbes, je sentais battre mon cœur. Là-bas vivait ma grand-mère, une femme au port altier dont les yeux s'illuminaient dès qu'elle m'apercevait au bout de l'allée.

« Te voilà enfin, mon petit mari ! » s'écriait-elle en me serrant contre sa robe aux senteurs d'écorce et de karité.

La moisson du riz était une fête sacrée pour toute la communauté. Dès l'aube, les moissonneurs s'élançaient en ligne dans les rizières dorées, au son régulier des tambours et des chants des griots. Les faucilles tranchaient les tiges d'un geste uniforme et gracieux. Nul ne ressentait la fatigue, car le chant commun portait les corps et unissait les cœurs dans une immense reconnaissance envers la terre nourricière.`
      },
      {
        id: 'ch-3',
        title: "Chapitre III : L'épreuve de Kondén Diara et la nuit sacrée",
        content: `L'année de mes douze ans fut celle des grandes initiations. Une nuit sans lune, les anciens nous rassemblèrent sur la place du village. Nous étions une vingtaine d'adolescents, tremblants sous nos pagnes de coton blanc.

Au loin résonna le rugissement terrifiant de Kondén Diara, le fauve légendaire de la brousse. Les femmes s'étaient enfermées dans les cases, fenêtres closes. Nous devions marcher en silence jusqu'au bosquet sacré, bravant la peur de l'inconnu.

Lorsque nous traversâmes les flammes rituelles, nous comprîmes que cette peur était le premier voile de l'enfance qui tombait. Les anciens nous enseignèrent le respect de la parole donnée, le courage face aux épreuves de la vie et le devoir d'assistance mutuelle envers chaque être humain.`
      },
      {
        id: 'ch-4',
        title: "Chapitre IV : L'adieu à la terre natale et le départ pour Conakry",
        content: `Le train pour Conakry siffla longuement sur le quai de la gare de Kouroussa. Ma mère tenait contre sa poitrine une calebasse remplie de griottes sauvages pour mon voyage. Ses larmes coulaient en silence sur ses joues burinées.

« Va, mon fils, dit-elle en me tendant un talisman béni par les marabouts. Va poursuivre tes études vers la mer, mais n'oublie jamais d'où tu viens, ni le chant de notre fleuve Niger. »

Le convoi s'ébranla dans un grondement métallique. Par la fenêtre, je regardai s'éloigner les toits de chaume de mon village natal, emportant dans ma mémoire d'enfant le trésor inaltérable de mon Afrique originelle.`
      }
    ]
  },
  {
    id: 'book-004',
    title: 'Histoire de la Guinée et des Grands Empires d’Afrique de l’Ouest',
    author: 'Dr. Djibril Tamsir Niane',
    isbn: '978-2-70870-112-9',
    category: 'Histoire-Géo',
    type: 'physique',
    description: "Étude historique exhaustive des royaumes mandingues, du Fouta-Djallon et de l'ère coloniale.",
    totalQuantity: 15,
    availableQuantity: 9,
    shelfLocation: 'Rayon Sciences Humaines - Étagère 4C',
    state: 'Bon état',
    coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80',
    qrCodeId: 'QR-BIB-2026-004',
    yearPublished: 2020,
    chapters: [
      {
        id: 'hist-ch1',
        title: "Chapitre I : L'Épopée de Soundiata Keïta et la Bataille de Kirina (1235)",
        content: `« Écoutez la parole des griots, dépositaires de la mémoire des rois et des peuples ! » ainsi commence le récit immortel consigné par Djibril Tamsir Niane.
Soundiata, fils de Naré Maghann Konaté et de Sogolon Kédjou, naquit infirme et passa les sept premières années de sa vie sans pouvoir se tenir sur ses jambes. Rejeté par la première épouse de son père, il connut l'exil avec sa mère et ses frères.

Mais le jour où sa mère fut insultée pour une simple poignée de feuilles de baobab, Soundiata commanda à l'atelier des forgerons une barre de fer monumentale. S'appuyant sur cette tige d'acier pur, il se dressa d'un bond prodigieux, tordit la barre en arc sous la force de ses cuisses, et arracha des deux mains un jeune baobab qu'il déposa devant la case de sa mère.

En 1235, dans les plaines de Kirina, Soundiata affronta le sorcier Soumaoro Kanté, roi du Sosso. Armé d'une flèche terminée par un ergot de coq blanc, secret magique arraché par sa sœur, Soundiata toucha le tyran qui s'évanouit dans les cavités de la montagne de Koulikoro. L'Empire du Mandé était né, rayonnant sur toute la boucle du fleuve Niger.`
      },
      {
        id: 'hist-ch2',
        title: "Chapitre II : La Charte de Kurukan Fuga (1236) : Première Déclaration des Droits de l'Homme",
        content: `À Kurukan Fuga, en 1236, les douze rois alliés et les chefs de clans proclamèrent solennellement la Grande Charte du Mandé :

Article 1 : La société mandingue est divisée en seize clans de porteurs de carquois, cinq clans de marabouts et quatre classes de gens de métier. Tous ont droit au respect et à la protection.
Article 5 : Chacun a droit à la vie et à la préservation de son intégrité physique. Nul ne portera atteinte à la vie de son semblable sans jugement équitable.
Article 14 : Ne jamais offenser les femmes, nos mères. Elles sont la sève vive de la société.
Article 20 : Ne maltraitez pas l'esclave de case ; accordez-lui un jour de repos par semaine et veillez à son habillement.
Article 24 : La paix est le bien suprême ; que les litiges soient toujours résolus par la palabre sous l'arbre à palabres avant de recourir au glaive.

Cette charte ancestrale, reconnue aujourd'hui par l'UNESCO, illustre le génie juridique et humaniste de la civilisation mandingue bien avant les déclarations européennes des XVIIIe siècles.`
      }
    ]
  },
  {
    id: 'book-005',
    title: 'Traité de Philosophie : La Morale et la Connaissance',
    author: 'Pr. Lansana Conté',
    isbn: '978-2-90112-887-1',
    category: 'Philosophie',
    type: 'physique',
    description: 'Dissertations rédigées, notions clés et commentaires de texte pour la Terminale.',
    totalQuantity: 18,
    availableQuantity: 12,
    shelfLocation: 'Rayon Philosophie - Étagère 2A',
    state: 'Usé',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
    qrCodeId: 'QR-BIB-2026-005',
    yearPublished: 2022
  },
  {
    id: 'book-006',
    title: 'Revue Scientifique Guinéenne de la Recherche Pédagogique - N° 14',
    author: 'Comité Scientifique MEPU-A',
    isbn: 'ISSN-2415-8890',
    category: 'Revue',
    type: 'revue',
    description: 'Dernières parutions sur les méthodes didactiques et l’intégration du numérique dans les lycées.',
    totalQuantity: 8,
    availableQuantity: 6,
    shelfLocation: 'Kiosque Périodiques - Rayon R',
    state: 'Neuf',
    coverUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80',
    qrCodeId: 'QR-BIB-2026-006',
    yearPublished: 2026
  }
];

export const initialEbooks: EbookItem[] = [
  {
    id: 'eb-001',
    title: 'Annales Officielles du Baccalauréat Unique Guinéen (2018-2025)',
    author: 'Inspection Générale de l’Éducation - MEPU-A',
    format: 'PDF',
    level: 'Lycée',
    targetClass: 'Terminale SM, SE, SS',
    subject: 'Multi-matières',
    fileSize: '24.8 Mo',
    downloadCount: 412,
    url: '#',
    description: 'Sujets complets avec corrigés officiels types pour toutes les épreuves du Bac.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    chapters: [
      {
        id: 'ann-1',
        title: 'Sujet Officiel : Mathématiques Baccalauréat SM (Session Normale)',
        content: `RÉPUBLIQUE DE GUINÉE - MEPU-A
BACCALAURÉAT UNIQUE - SESSION 2025 - SÉRIE SCIENCES MATHÉMATIQUES
ÉPREUVE DE MATHÉMATIQUES (Durée : 4 heures - Coef : 5)

EXERCICE 1 (4 points) : Nombres Complexes & Géométrie du Plan
Dans le plan complexe rapporté à un repère orthonormé direct (O, u, v), on considère les points A, B et C d'affixes respectives :
z_A = 2 + 2i√3,  z_B = -1 + i√3,  z_C = 4.
1. Écrire z_A et z_B sous forme trigonométrique et exponentielle.
2. Déterminer l'affixe du centre de gravité G du triangle ABC.
3. Démontrer que le triangle ABC est un triangle rectangle en B. En déduire l'aire exacte de ce triangle.

EXERCICE 2 (4 points) : Équations Différentielles & Probabilités
On considère l'équation différentielle (E) : y' + 2y = 4e^(-2x).
1. Résoudre l'équation homogène (E_0) : y' + 2y = 0.
2. Déterminer une solution particulière de (E) sous la forme y_p(x) = (ax + b)e^(-2x).
3. Donner la solution générale de (E), puis celle vérifiant la condition initiale y(0) = 1.

PROBLÈME DE SYNTHÈSE (12 points) : Étude d'une fonction logarithmique et calcul intégral
Partie A : Soit g la fonction définie sur ]0, +∞[ par g(x) = 1 - x² - ln(x).
1. Étudier les variations de g et dresser son tableau de variations.
2. Montrer que l'équation g(x) = 0 admet une unique solution α sur [0.5, 1].
Partie B : Étude de f(x) = (ln(x) + 1) / (x + 1). Calcul de l'intégrale I = ∫[1 à e] f(x)dx.`
      },
      {
        id: 'ann-2',
        title: 'Corrigé Type Officiel & Grille d’Évaluation des Correcteurs',
        content: `RÉPUBLIQUE DE GUINÉE - DIRECTION NATIONALE DES EXAMENS
CORRIGÉ OFFICIEL DU BACCALAURÉAT SM - MATHÉMATIQUES

Corrigé de l'Exercice 1 :
1. Calcul du module : |z_A| = √(2² + (2√3)²) = √(4 + 12) = √16 = 4.
   Argument : cos(θ) = 2/4 = 1/2 et sin(θ) = 2√3/4 = √3/2, d'où θ = π/3 [2π].
   Forme exponentielle : z_A = 4 * e^(iπ/3).
   De même, |z_B| = √((-1)² + (√3)²) = 2.
   cos(θ') = -1/2 et sin(θ') = √3/2, d'où θ' = 2π/3 [2π].
   Forme exponentielle : z_B = 2 * e^(i2π/3).

2. Centre de gravité G :
   z_G = (z_A + z_B + z_C) / 3 = ((2 + 2i√3) + (-1 + i√3) + 4) / 3 = (5 + 3i√3) / 3 = 5/3 + i√3.

3. Nature du triangle ABC :
   Calcul du rapport (z_C - z_B) / (z_A - z_B) :
   z_C - z_B = 4 - (-1 + i√3) = 5 - i√3.
   z_A - z_B = (2 + 2i√3) - (-1 + i√3) = 3 + i√3.
   Après multiplication par le conjugué, le quotient est imaginaire pur de partie réelle nulle.
   Conclusion : L'angle (BA, BC) = π/2 [π]. Le triangle ABC est donc rectangle en B.
   Barème complet : 4 points attribués avec bonus de clarté rédactionnelle.`
      }
    ]
  },
  {
    id: 'eb-002',
    title: 'Guide Interactif de Chimie Organique : Mécanismes Réactionnels',
    author: 'Dr. Mariama Sow',
    format: 'EPUB',
    level: 'Lycée',
    targetClass: 'Terminale SE & SM',
    subject: 'Physique-Chimie',
    fileSize: '12.4 Mo',
    downloadCount: 289,
    url: '#',
    description: 'E-book enrichi de schémas interactifs 3D des molécules et réactions d’estérification.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'eb-003',
    title: 'Vidéo-Masterclass : Résolution des Équations Différentielles du 2nd Degré',
    author: 'M. Mamadou Lamarana Diallo',
    format: 'Vidéo',
    level: 'Lycée',
    targetClass: 'Terminale SM',
    subject: 'Mathématiques',
    fileSize: '185 Mo',
    downloadCount: 356,
    url: '#',
    description: 'Cours vidéo HD de 45 minutes avec méthodologie pas à pas et astuces pour le Bac.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'eb-004',
    title: 'Support de Synthèse : La Guerre Froide et la Décolonisation en Afrique',
    author: 'Mme Aïssatou Bah',
    format: 'PPTX',
    level: 'Lycée',
    targetClass: 'Terminale SS & SM',
    subject: 'Histoire-Géo',
    fileSize: '18.2 Mo',
    downloadCount: 198,
    url: '#',
    description: 'Diaporama complet avec cartes géopolitiques haute résolution et chronologies clés.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'eb-005',
    title: 'Podcast Audio : Analyse Littéraire de Soundiata ou l’Épopée Mandingue',
    author: 'Département de Français',
    format: 'Audio',
    level: 'Tous niveaux',
    targetClass: '10ème Année & Lycée',
    subject: 'Français',
    fileSize: '42 Mo',
    downloadCount: 230,
    url: '#',
    description: 'Audio narratif de 32 minutes commentant les thèmes de l’honneur, du destin et de la parole.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80'
  }
];

export const initialLoanRecords: LoanRecord[] = [
  {
    id: 'loan-001',
    bookId: 'book-001',
    bookTitle: 'Mathématiques Terminales SM & SE - Algèbre & Analyse',
    borrowerName: 'Fatoumata Binta Diallo',
    borrowerRole: 'Élève',
    borrowerMatricule: 'MAT-2026-TSM-018',
    borrowerClass: 'Terminale SM',
    borrowDate: '2026-10-25',
    dueDate: '2026-11-08',
    status: 'en_cours',
    renewCount: 0,
    fineGnf: 0,
    notes: 'Emprunt via scan QR Code Carte Élève'
  },
  {
    id: 'loan-002',
    bookId: 'book-002',
    bookTitle: 'Physique Moderne : Ondes, Optique & Électromagnétisme',
    borrowerName: 'Mamadou Lamarana Diallo',
    borrowerRole: 'Enseignant',
    borrowerMatricule: 'ENS-GN-2026-088',
    borrowDate: '2026-10-18',
    dueDate: '2026-11-15',
    status: 'en_cours',
    renewCount: 1,
    fineGnf: 0,
    notes: 'Préparation TP Trimestre 1'
  },
  {
    id: 'loan-003',
    bookId: 'book-003',
    bookTitle: "L'Enfant Noir",
    borrowerName: 'Alpha Oumar Barry',
    borrowerRole: 'Élève',
    borrowerMatricule: 'MAT-2026-10A-042',
    borrowerClass: '10ème Année A',
    borrowDate: '2026-10-10',
    dueDate: '2026-10-24',
    status: 'en_retard',
    renewCount: 0,
    fineGnf: 15000,
    notes: 'Retard de 11 jours. Relance SMS envoyée aux parents.'
  },
  {
    id: 'loan-004',
    bookId: 'book-004',
    bookTitle: 'Histoire de la Guinée et des Grands Empires d’Afrique de l’Ouest',
    borrowerName: 'Kadiatou Camara',
    borrowerRole: 'Élève',
    borrowerMatricule: 'MAT-2026-TSS-009',
    borrowerClass: 'Terminale SS',
    borrowDate: '2026-10-12',
    dueDate: '2026-10-26',
    returnDate: '2026-10-24',
    status: 'retourne',
    renewCount: 0,
    fineGnf: 0,
    notes: 'Livre rendu en parfait état.'
  },
  {
    id: 'loan-005',
    bookId: 'book-005',
    bookTitle: 'Traité de Philosophie : La Morale et la Connaissance',
    borrowerName: 'Moussa Sylla',
    borrowerRole: 'Élève',
    borrowerMatricule: 'MAT-2026-TSM-031',
    borrowerClass: 'Terminale SM',
    borrowDate: '2026-10-01',
    dueDate: '2026-10-15',
    status: 'degrade',
    renewCount: 0,
    fineGnf: 25000,
    notes: 'Couverture déchirée et pages annotées. Dégradation déclarée.'
  }
];
