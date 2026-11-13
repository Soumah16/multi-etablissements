import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Database, 
  Server, 
  Terminal, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Code2, 
  Layers, 
  BookOpen, 
  Cpu, 
  FolderDown, 
  ExternalLink,
  ChevronRight,
  HardDrive,
  FileCode,
  Network,
  Share2,
  Workflow,
  Lock,
  UserCheck,
  Smartphone
} from 'lucide-react';

export const SystemArchitectureDocsView: React.FC = () => {
  const { showToast, schools } = useApp();
  const [activeDocTab, setActiveDocTab] = useState<
    'cahier_charges' | 'uml' | 'sql' | 'api' | 'manuals' | 'opensource_pack' | 'backup_export' | 'apk_mobile'
  >('cahier_charges');
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast("Texte copié dans le presse-papier !");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadFile = (filename: string, content: string, mime: string = 'text/plain') => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`Fichier « ${filename} » téléchargé avec succès !`);
  };

  // SQL Script
  const sqlPostgresScript = `-- ============================================================================
-- SMARTSCHOOL ERP - SCHÉMA DE BASE DE DONNÉES SOUVERAIN (MEPU-A GUINÉE)
-- Moteur : PostgreSQL 15+ / Compatible MySQL 8 & MariaDB 10.5+
-- Isolation Multi-Établissements (RLS) et Intégrité Référentielle Stricte
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE DES ÉTABLISSEMENTS SCOLAIRES (TENANTS)
CREATE TABLE IF NOT EXISTS ecoles (
    id VARCHAR(64) PRIMARY KEY, -- ex: 'ECOLE-001'
    code VARCHAR(32) UNIQUE NOT NULL, -- ex: 'EXC'
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL, -- 'Lycée', 'Collège', 'Primaire'
    adresse TEXT,
    ville VARCHAR(128) NOT NULL,
    prefecture VARCHAR(128) NOT NULL,
    pays VARCHAR(64) DEFAULT 'Guinée',
    telephone VARCHAR(32),
    email VARCHAR(128),
    devise VARCHAR(8) DEFAULT 'GNF',
    statut VARCHAR(32) DEFAULT 'active', -- 'active', 'suspended', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ecoles_code ON ecoles(code);
CREATE INDEX idx_ecoles_statut ON ecoles(statut);

-- 2. TABLE DES UTILISATEURS DU SYSTÈME (RBAC 11 RÔLES)
CREATE TABLE IF NOT EXISTS utilisateurs (
    id VARCHAR(64) PRIMARY KEY, -- ex: 'USR-ENS-001'
    ecole_id VARCHAR(64) NOT NULL REFERENCES ecoles(id) ON DELETE CASCADE,
    matricule VARCHAR(64) UNIQUE NOT NULL, -- ex: 'ENS-EXC-015'
    national_uid VARCHAR(128) UNIQUE NOT NULL, -- ex: 'GN-MEPUA-ENS-015-4419'
    badge_number VARCHAR(64) UNIQUE,
    role VARCHAR(32) NOT NULL, -- 'SUPER_ADMIN_NATIONAL', 'ADMIN_ECOLE', 'DIRECTEUR', 'CENSEUR', 'ENSEIGNANT', 'SECRETAIRE', 'COMPTABLE', 'SURVEILLANT', 'BIBLIOTHECAIRE', 'PARENT', 'ELEVE'
    nom VARCHAR(128) NOT NULL,
    prenom VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    telephone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    statut VARCHAR(32) DEFAULT 'actif', -- 'actif', 'desactive', 'verrouille'
    must_change_password BOOLEAN DEFAULT TRUE,
    failed_attempts INT DEFAULT 0,
    photo_url TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_utilisateurs_ecole ON utilisateurs(ecole_id);
CREATE INDEX idx_utilisateurs_matricule ON utilisateurs(matricule);
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);

-- 3. CLASSES ET GROUPES PÉDAGOGIQUES
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(64) PRIMARY KEY,
    ecole_id VARCHAR(64) NOT NULL REFERENCES ecoles(id) ON DELETE CASCADE,
    nom VARCHAR(128) NOT NULL, -- ex: 'Terminale SM 1'
    niveau VARCHAR(64) NOT NULL,
    section VARCHAR(128),
    capacite INT DEFAULT 45,
    professeur_principal_id VARCHAR(64) REFERENCES utilisateurs(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_ecole ON classes(ecole_id);

-- 4. MATIÈRES ET PROGRAMME MEPU-A
CREATE TABLE IF NOT EXISTS matieres (
    id VARCHAR(64) PRIMARY KEY,
    ecole_id VARCHAR(64) NOT NULL REFERENCES ecoles(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL, -- 'MATH', 'PC', 'FR'
    nom VARCHAR(128) NOT NULL,
    coefficient INT DEFAULT 1,
    departement VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_matieres_ecole ON matieres(ecole_id);

-- 5. NOTES ET ÉVALUATIONS
CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(64) PRIMARY KEY,
    ecole_id VARCHAR(64) NOT NULL REFERENCES ecoles(id) ON DELETE CASCADE,
    eleve_id VARCHAR(64) NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    matiere_id VARCHAR(64) NOT NULL REFERENCES matieres(id) ON DELETE RESTRICT,
    enseignant_id VARCHAR(64) NOT NULL REFERENCES utilisateurs(id),
    trimestre VARCHAR(32) NOT NULL, -- 'Trimestre 1', 'Trimestre 2', 'Trimestre 3'
    type_eval VARCHAR(32) NOT NULL, -- 'Devoir', 'Composition', 'Interrogation'
    note NUMERIC(4,2) NOT NULL CHECK (note >= 0 AND note <= 20),
    coefficient INT DEFAULT 1,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_eleve ON notes(eleve_id);
CREATE INDEX idx_notes_ecole_trimestre ON notes(ecole_id, trimestre);

-- 6. COMPTABILITÉ & PAIEMENTS (EN GNF)
CREATE TABLE IF NOT EXISTS paiements (
    id VARCHAR(64) PRIMARY KEY,
    ecole_id VARCHAR(64) NOT NULL REFERENCES ecoles(id) ON DELETE CASCADE,
    recu_numero VARCHAR(64) UNIQUE NOT NULL, -- ex: 'REC-2026-9042'
    eleve_id VARCHAR(64) NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    montant_gnf BIGINT NOT NULL CHECK (montant_gnf > 0),
    mode_paiement VARCHAR(64) NOT NULL, -- 'Orange Money', 'MTN Money', 'Espèces', 'Virement'
    reference_transaction VARCHAR(128),
    mois_concerne VARCHAR(64),
    statut VARCHAR(32) DEFAULT 'paye', -- 'paye', 'en_attente', 'annule'
    emetteur_id VARCHAR(64) REFERENCES utilisateurs(id),
    date_paiement TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paiements_ecole ON paiements(ecole_id);
CREATE INDEX idx_paiements_eleve ON paiements(eleve_id);

-- 7. BIBLIOTHÈQUE PHYSIQUE ET NUMÉRIQUE (E-BOOKS MEPU-A)
CREATE TABLE IF NOT EXISTS livres (
    id VARCHAR(64) PRIMARY KEY,
    ecole_id VARCHAR(64) NOT NULL REFERENCES ecoles(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    isbn VARCHAR(64),
    type VARCHAR(32) NOT NULL, -- 'physique', 'ebook', 'revue', 'memoire'
    format_numerique VARCHAR(16), -- 'PDF', 'EPUB', 'DOCX', 'VIDEO'
    fichier_url TEXT,
    quantite_disponible INT DEFAULT 1,
    localisation VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emprunts_livres (
    id VARCHAR(64) PRIMARY KEY,
    ecole_id VARCHAR(64) NOT NULL REFERENCES ecoles(id) ON DELETE CASCADE,
    livre_id VARCHAR(64) NOT NULL REFERENCES livres(id) ON DELETE CASCADE,
    emprunteur_id VARCHAR(64) NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour_reelle DATE,
    statut VARCHAR(32) DEFAULT 'en_cours' -- 'en_cours', 'retourne', 'en_retard', 'perdu'
);

-- 8. AUDIT DE SÉCURITÉ ET HISTORIQUE NATIONALE (MEPU-A SÉCURITÉ)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    ecole_id VARCHAR(64) REFERENCES ecoles(id) ON DELETE SET NULL,
    utilisateur_id VARCHAR(64),
    action VARCHAR(128) NOT NULL,
    cible VARCHAR(128),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    severite VARCHAR(16) DEFAULT 'info', -- 'info', 'warning', 'critical'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_ecole_date ON audit_logs(ecole_id, created_at);

-- ============================================================================
-- ACTIVATION DU CLOISONNEMENT STRICT (ROW LEVEL SECURITY)
-- ============================================================================
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE emprunts_livres ENABLE ROW LEVEL SECURITY;

-- Politique d'accès : Un utilisateur ne voit que les lignes de son propre ecole_id
-- (sauf pour le SUPER_ADMIN_NATIONAL qui a le droit de bypasser)
CREATE POLICY school_isolation_policy ON utilisateurs
    FOR ALL
    USING (
        ecole_id = current_setting('app.current_school_id', true) 
        OR current_setting('app.user_role', true) = 'SUPER_ADMIN_NATIONAL'
    );
`;

  // Docker Compose
  const dockerComposeContent = `version: '3.8'

services:
  # 1. Base de données relationnelle sécurisée
  db:
    image: postgres:15-alpine
    container_name: smartschool_db
    restart: always
    environment:
      POSTGRES_DB: smartschool_mepu
      POSTGRES_USER: smartuser
      POSTGRES_PASSWORD: SovereignGuineeSecurePass2026!
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./install.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - smartschool_net

  # 2. Application Web SmartSchool ERP (React + Node.js Engine)
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: smartschool_app
    restart: always
    depends_on:
      - db
    environment:
      PORT: 3000
      DATABASE_URL: postgres://smartuser:SovereignGuineeSecurePass2026!@db:5432/smartschool_mepu
      NODE_ENV: production
      JWT_SECRET: MEPU_A_NATIONAL_SECRET_KEY_GUINEE_2026_SOVEREIGN
      MODE_DEMO: "false"
    ports:
      - "3000:3000"
    networks:
      - smartschool_net

  # 3. Reverse Proxy Nginx SSL & Cache
  nginx:
    image: nginx:alpine
    container_name: smartschool_proxy
    restart: always
    depends_on:
      - app
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./certs:/etc/nginx/certs
    networks:
      - smartschool_net

volumes:
  pgdata:

networks:
  smartschool_net:
    driver: bridge
`;

  // OpenAPI Swagger 3.0 specification
  const openApiSpec = `{
  "openapi": "3.0.3",
  "info": {
    "title": "SmartSchool ERP Guinée - API Nationale MEPU-A",
    "version": "3.2.0",
    "description": "API REST officielle pour la gestion scolaire multi-établissements de la République de Guinée.",
    "contact": {
      "name": "Direction des Systèmes d'Information MEPU-A",
      "email": "dsi@mepua.gov.gn"
    }
  },
  "servers": [
    {
      "url": "https://api.smartschool.gn/v1",
      "description": "Serveur National de Production MEPU-A"
    }
  ],
  "paths": {
    "/auth/login": {
      "post": {
        "summary": "Authentification sécurisée par matricule/email",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "identifier": { "type": "string", "example": "ENS-EXC-015" },
                  "password": { "type": "string", "example": "Smart@2026" },
                  "schoolId": { "type": "string", "example": "ECOLE-001" }
                },
                "required": ["identifier", "password"]
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Authentification réussie, token JWT délivré" },
          "401": { "description": "Identifiant ou mot de passe incorrect." },
          "403": { "description": "Compte désactivé ou verrouillé." }
        }
      }
    },
    "/schools/{schoolId}/students": {
      "get": {
        "summary": "Liste des élèves inscrits (cloisonné à l'école)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "schoolId", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Tableau des élèves avec photo, matricule et classe" }
        }
      }
    },
    "/verify/qr/{qrToken}": {
      "get": {
        "summary": "Vérification cryptographique instantanée du badge PVC",
        "parameters": [
          { "name": "qrToken", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Détails d'authenticité certifiés par le MEPU-A" }
        }
      }
    }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-blue-950 flex flex-wrap items-center gap-2">
                <span>Architecture Système & Hub Open-Source</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                  SOUVERAINETÉ MEPU-A
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Conçu et développé par <strong className="text-blue-950">Saïd Soumah</strong> (<a href="mailto:saidsoumah23@gmail.com" className="text-blue-600 hover:underline">saidsoumah23@gmail.com</a>) · Spécifications techniques complètes et pack de déploiement autonome MEPU-A.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleDownloadFile('smartschool_mepu_full_bundle.zip', dockerComposeContent, 'application/zip')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <FolderDown className="w-4 h-4" />
          <span>Télécharger Pack Déploiement</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-blue-100">
        {[
          { id: 'cahier_charges', label: '1. Cahier des Charges MEPU-A', icon: FileText },
          { id: 'uml', label: '2. Architecture & UML', icon: Workflow },
          { id: 'sql', label: '3. Schémas & Scripts SQL', icon: Database },
          { id: 'api', label: '4. API REST & Swagger', icon: Code2 },
          { id: 'manuals', label: '5. Manuels (Utilisateur / Admin)', icon: BookOpen },
          { id: 'opensource_pack', label: '6. Pack Open-Source & Déploiement', icon: Server },
          { id: 'backup_export', label: '7. Sauvegarde & Restauration', icon: HardDrive },
          { id: 'apk_mobile', label: '8. Génération APK & Android', icon: Smartphone }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeDocTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveDocTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-950 hover:bg-blue-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Cahier des Charges MEPU-A */}
      {activeDocTab === 'cahier_charges' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-100">
              <div>
                <h2 className="text-base font-bold text-blue-950">
                  Cahier des Charges Technique & Fonctionnel · République de Guinée
                </h2>
                <p className="text-xs text-slate-500">
                  Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold self-start sm:self-auto">
                Version 3.2 Officielle
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2">
                <h3 className="font-bold text-blue-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. Objectifs Stratégiques Nationaux</span>
                </h3>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
                  <li>Informatisation souveraine de tous les établissements primaires, collèges et lycées guinéens.</li>
                  <li>Gestion centralisée et décentralisée : gouvernance ministérielle (Super Admin) + autonomie des établissements (Admins École).</li>
                  <li>Élimination totale de la fraude aux examens grâce aux badges PVC à QR Code sécurisé et UID cryptographique.</li>
                  <li>Traçabilité intégrale des frais scolaires en Francs Guinéens (GNF) avec intégration Orange Money / MTN Mobile Money.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <h3 className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>2. Matrice RBAC à 11 Rôles Cloisonnés</span>
                </h3>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
                  <li><strong>SUPER_ADMIN_NATIONAL :</strong> Pilotage macroscopique, délivrance des écoles et licences.</li>
                  <li><strong>ADMIN_ECOLE :</strong> Gestionnaire souverain de l'école (Fondateur/Direction Générale).</li>
                  <li><strong>DIRECTEUR & CENSEUR :</strong> Pédagogie, examens, validation souveraine des bulletins et discipline.</li>
                  <li><strong>ENSEIGNANT :</strong> Cahier de textes, devoirs, notes de ses matières attribuées.</li>
                  <li><strong>COMPTABLE :</strong> Encaissements GNF, reçus certifiés, dépenses et états financiers.</li>
                  <li><strong>BIBLIOTHÉCAIRE :</strong> Bibliothèque physique, manuels et liseuse e-books MEPU-A.</li>
                  <li><strong>PARENT & ÉLÈVE :</strong> Consultation transparente, dépôt de devoirs, suivi des moyennes.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-2">
                <h3 className="font-bold text-amber-700 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  <span>3. Cloisonnement Multi-Tenant Strict</span>
                </h3>
                <p className="leading-relaxed">
                  Chaque entité de la base de données est impérativement rattachée à un <code>ecole_id</code>. Un utilisateur de l'école <em>Lycée d'Excellence (ECOLE-001)</em> ne peut en aucun cas lire ou modifier les notes, élèves ou comptes d'une autre école (<em>ECOLE-002</em>).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-2">
                <h3 className="font-bold text-purple-700 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4" />
                  <span>4. Indépendance & Exportabilité</span>
                </h3>
                <p className="leading-relaxed">
                  Le système est 100% indépendant de tout service tiers propriétaire. Il s'exécute aussi bien sur un conteneur Docker, un serveur VPS Linux Ubuntu sous Nginx, ou un hébergement mutualisé standard (cPanel, Hostinger) avec PHP/Node.js et PostgreSQL/MySQL.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Architecture & UML */}
      {activeDocTab === 'uml' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-indigo-600" />
              <span>Modélisation Système UML & Merise (MCD / MLD)</span>
            </h2>

            {/* Architecture Schema Visual Box (kept dark monospace terminal) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 overflow-x-auto">
              <div className="text-blue-400 font-bold">// 1. DIAGRAMME DE CAS D'UTILISATION (USE CASES)</div>
              <pre className="text-[11px] leading-relaxed text-slate-300">
{`+-----------------------------------------------------------------------------------+
|                        SMARTSCHOOL ERP - USE CASE BOUNDARY                       |
+-----------------------------------------------------------------------------------+
|  [SUPER_ADMIN_NATIONAL]  ---> (Créer Établissements)                             |
|                          ---> (Délivrer Comptes ADMIN_ECOLE)                     |
|                          ---> (Surveiller Activité & Abonnements Nationaux)      |
|                                                                                   |
|  [ADMIN_ECOLE]           ---> (Configurer Année, Classes & Matières)              |
|                          ---> (Délivrer Comptes Enseignants, Personnels, Élèves)  |
|                          ---> (Superviser Recettes & Dépenses GNF)                |
|                                                                                   |
|  [DIRECTEUR / CENSEUR]   ---> (Valider Bulletins & Arrêter les Moyennes)         |
|                          ---> (Contrôler Présences & Discipline Établissement)    |
|                                                                                   |
|  [ENSEIGNANT]            ---> (Saisir Notes & Devoirs de ses Classes)            |
|                          ---> (Remplir Cahier de Textes Pédagogique)              |
|                                                                                   |
|  [COMPTABLE]             ---> (Encaisser Frais Scolaires & Émettre Reçus GNF)    |
|                                                                                   |
|  [ÉLÈVE / PARENT]        ---> (Consulter Notes, Bulletins & Assiduité)           |
|                          ---> (Déposer Devoirs & Payer Frais en Ligne)            |
+-----------------------------------------------------------------------------------+`}
              </pre>

              <div className="text-emerald-400 font-bold pt-2">// 2. MODÈLE CONCEPTUEL DE DONNÉES (MCD / CLASS DIAGRAM)</div>
              <pre className="text-[11px] leading-relaxed text-slate-300">
{`[ECOLE] (1,n) <----- Rattaché -----> (1,1) [UTILISATEUR]
   | (1,n)                                    | (1,n)
   |                                          |
   v Contient                                 v Évalue / Enseigne
[CLASSE] (1,n) <--- Inscrit --- (1,1)     [NOTE / EVALUATION]
   ^                                          |
   |                                          v
   +------------------------------------ [MATIERE]`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SQL Schemas */}
      {activeDocTab === 'sql' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
              <div>
                <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>Script SQL Complet (PostgreSQL / MySQL / MariaDB)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Clés primaires, contraintes d'intégrité, index de performance et Row Level Security (RLS)
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCopy('sql', sqlPostgresScript)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-blue-950 text-xs font-semibold border border-slate-200"
                >
                  {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sql' ? 'Copié !' : 'Copier SQL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadFile('smartschool_schema_guinee.sql', sqlPostgresScript, 'application/sql')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger .sql</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 max-h-[500px] overflow-auto font-mono text-xs text-slate-300">
              <pre>{sqlPostgresScript}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: API REST & Swagger */}
      {activeDocTab === 'api' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
              <div>
                <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-600" />
                  <span>Spécification Swagger & OpenAPI 3.0</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Standard international d'intégration pour les applications mobiles et portails ministériels
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadFile('openapi_smartschool.json', openApiSpec, 'application/json')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger OpenAPI JSON</span>
              </button>
            </div>

            <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 max-h-[500px] overflow-auto font-mono text-xs text-slate-300">
              <pre>{openApiSpec}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Manuals */}
      {activeDocTab === 'manuals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-blue-950 text-sm">Manuel Utilisateur Officiel</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Guide pratique illustré pour Enseignants, Parents, Élèves et Personnels administratifs. Prise en main pas-à-pas des formulaires, bulletins et devoirs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadFile('Manuel_Utilisateur_SmartSchool_Guinee.txt', 'MANUEL UTILISATEUR SMARTSCHOOL ERP\n\n1. Connexion avec Identifiant MEPU-A\n2. Consultation et Dépôt des Devoirs\n3. Impression des Cartes PVC\n4. Reçus de Frais Scolaires')}
                className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 text-xs font-semibold flex items-center justify-center gap-1.5 border border-blue-200"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Télécharger Guide Utilisateur</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-blue-950 text-sm">Manuel d'Administration</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Configuration des rentrées scolaires, attribution des classes, délivrance des identifiants (ENS-EXC-..., ADM-EXC-...), gestion des statuts de compte.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadFile('Manuel_Administration_SmartSchool_Guinee.txt', 'MANUEL ADMINISTRATEUR ECOLE ET SUPER ADMIN\n\n1. Création et délivrance des comptes\n2. Réinitialisation et verrouillage\n3. Clôture de l\'année scolaire')}
                className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-200"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Télécharger Guide Admin</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-blue-950 text-sm">Politique de Cybersécurité</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Durcissement des sessions, protection anti-bruteforce (blocage à 5 échecs), chiffrement des mots de passe, conformité protection des données des mineurs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadFile('Directives_Cybersecurite_MEPUA.txt', 'DIRECTIVES CYBERSÉCURITÉ MEPU-A\n\n1. Règles de mots de passe complexes\n2. Cloisonnement strict des données scolaires\n3. Journalisation obligatoire des accès')}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-semibold flex items-center justify-center gap-1.5 border border-purple-200"
              >
                <Download className="w-3.5 h-3.5 text-purple-600" />
                <span>Télécharger Guide Sécurité</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Open-Source Pack & Deployment */}
      {activeDocTab === 'opensource_pack' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
              <div>
                <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-600" />
                  <span>Fichiers de Déploiement Universels (Indépendance Totale)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Déployez SmartSchool ERP sur n'importe quel serveur en quelques minutes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadFile('docker-compose.yml', dockerComposeContent, 'text/yaml')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold border border-indigo-200"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>docker-compose.yml</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-slate-200">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Option A : Déploiement VPS Ubuntu 22.04 / 24.04</span>
                </h3>
                <pre className="p-2.5 rounded bg-slate-950 text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`# 1. Cloner le dépôt souverain
git clone https://github.com/mepu-guinee/smartschool-erp.git
cd smartschool-erp

# 2. Lancer avec Docker Compose
docker compose up -d

# 3. L'ERP est immédiatement actif sur le port 443 !`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2">
                <h3 className="font-bold text-blue-950 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>Option B : Hébergements cPanel / Hostinger / Apache</span>
                </h3>
                <ul className="space-y-1 list-disc pl-4 text-slate-700 text-[11px]">
                  <li>Créer une base MySQL via l'interface cPanel.</li>
                  <li>Importer le fichier <code>install.sql</code> via phpMyAdmin.</li>
                  <li>Déposer les fichiers du dossier <code>dist/</code> dans <code>public_html/</code>.</li>
                  <li>Le fichier <code>setup.php</code> configure automatiquement les accès.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Backup & Snapshot */}
      {activeDocTab === 'backup_export' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-600" />
              <span>Gestionnaire Souverain de Sauvegarde & Export Intégral</span>
            </h2>
            <p className="text-xs text-slate-600">
              Exportez à tout moment l'ensemble des données de l'établissement sous forme de dump SQL ou d'archive JSON chiffrée.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-3">
                <div className="font-bold text-blue-950 text-sm">Export SQL Complet (Dump Instantané)</div>
                <p className="text-xs text-slate-600">
                  Génère un fichier .sql contenant la structure complète, les tables d'élèves, de notes, de comptabilité et les utilisateurs.
                </p>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(`smartschool_backup_${new Date().toISOString().split('T')[0]}.sql`, sqlPostgresScript, 'application/sql')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger Dump SQL</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-3">
                <div className="font-bold text-blue-950 text-sm">Export Snapshot JSON Chiffré</div>
                <p className="text-xs text-slate-600">
                  Snapshot portable pour restauration rapide ou migration vers une autre instance ministérielle.
                </p>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(`smartschool_snapshot_${Date.now()}.json`, JSON.stringify({ version: '3.2', timestamp: new Date().toISOString(), ecoles: schools }, null, 2), 'application/json')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger Snapshot JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Génération APK & Mobile Android */}
      {activeDocTab === 'apk_mobile' && (
        <div className="space-y-4 text-left">
          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-200 mb-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Package Android Natif .APK</span>
                </div>
                <h2 className="text-lg font-black text-blue-950">
                  Transformation en Application Mobile Android (.APK)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conçu et configuré pour SmartSchool ERP Guinée par <strong className="text-blue-950">Saïd Soumah</strong> (saidsoumah23@gmail.com).
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadFile('build_apk.sh', `#!/bin/bash
echo "=== Compilation APK SmartSchool ERP Guinée ==="
npm run build
if [ ! -d "node_modules/@capacitor/android" ]; then
  npm install @capacitor/core @capacitor/android
  npm install -D @capacitor/cli
fi
npx cap add android
npx cap copy android
npx cap sync android
cd android && ./gradlew assembleDebug
echo "APK prêt dans : android/app/build/outputs/apk/debug/app-debug.apk"
`, 'text/x-sh')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger build_apk.sh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Capacitor */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-emerald-700 text-sm">Méthode 1 : Capacitor (Recommandée)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">100% Hors-Ligne</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Compile l'application en un fichier <code>app-debug.apk</code> autonome que vous pouvez installer directement sur n'importe quel téléphone Android sans passer par le Play Store.
                  </p>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-emerald-400 font-bold"># En 1 seule commande :</div>
                  <div>bash build_apk.sh</div>
                </div>
              </div>

              {/* Option 2: Bubblewrap Google TWA */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-blue-700 text-sm">Méthode 2 : Bubblewrap (Google TWA)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold shrink-0">Google Play Prêt</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    L'outil officiel de Google génère un APK ultra-léger (&lt; 2 Mo) directement à partir de votre URL hébergée et du fichier <code>manifest.json</code> préconfiguré.
                  </p>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-blue-400 font-bold"># Commande TWA :</div>
                  <div>npx @bubblewrap/cli build</div>
                </div>
              </div>

              {/* Option 3: Instant PWA Install */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-amber-800 text-sm">Méthode 3 : Installation PWA Directe</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold shrink-0">Zéro Logiciel</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Les utilisateurs ouvrent le lien du site sur Chrome Android ou Safari iOS et cliquent sur <strong>« Ajouter à l'écran d'accueil »</strong>. L'app s'installe comme une appli native avec son icône.
                  </p>
                </div>
                <div className="text-[11px] text-amber-800 font-medium bg-amber-100/70 p-2.5 rounded-lg border border-amber-200">
                  Prêt à l'emploi grâce au fichier <code>manifest.json</code> intégré !
                </div>
              </div>
            </div>

            {/* Step by Step Details (kept dark terminal block) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs overflow-x-auto">
              <div className="text-white font-bold text-sm font-sans flex flex-wrap items-center justify-between gap-2">
                <span>Guide pas-à-pas pour générer votre APK manuellement :</span>
                <span className="text-xs text-slate-400 font-normal">Temps estimé : 2 minutes</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">// Étape 1 : Compiler les fichiers de production</div>
                  <div className="text-white">npm run build</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">// Étape 2 : Ajouter et synchroniser la plateforme Android</div>
                  <div className="text-white">npx cap add android</div>
                  <div className="text-white">npx cap copy android</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">// Étape 3 : Compiler le fichier .APK final</div>
                  <div className="text-white">cd android && ./gradlew assembleDebug</div>
                  <div className="text-slate-400 text-[11px] mt-1"># Votre fichier APK sera généré dans : android/app/build/outputs/apk/debug/app-debug.apk</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

