# GUIDE COMPLET DE DÉPLOIEMENT & HÉBERGEMENT
## SmartSchool ERP · Système National MEPU-A

Votre application est prête pour la production avec son dossier de distribution compilé `dist/` et son archive prête à l'emploi `smartschool-dist-hebergement.zip`.

---

## EMPLACEMENT DES FICHIERS SUR VOTRE ORDINATEUR

- **Dossier de production compilé :**  
  `C:\Users\HP\antigravity\SmartSchool-ERP----Multi-Établissements\dist\`
- **Archive ZIP prête à téléverser :**  
  `C:\Users\HP\antigravity\SmartSchool-ERP----Multi-Établissements\smartschool-dist-hebergement.zip`

Le dossier `dist/` contient :
- `index.html` : Point d'entrée de l'application
- `assets/` : Tous les styles CSS minifiés, scripts JS et polices
- `.htaccess` : Configuration Apache/cPanel pour la réécriture d'URL et la sécurité

---

## OPTION 1 : Hébergement cPanel / Hostinger / O2Switch / Apache (Le plus simple)

1. Connectez-vous à votre panneau **cPanel** ou **Hostinger**.
2. Ouvrez le **Gestionnaire de fichiers** (*File Manager*).
3. Rendez-vous dans le dossier racine de votre site web : `public_html/`.
4. Téléversez le fichier `smartschool-dist-hebergement.zip`.
5. Faites un clic droit sur l'archive et choisissez **Extraire** (*Extract*).
6. Vérifiez que `index.html` et `.htaccess` se trouvent directement à la racine de `public_html/`.
7. **C'est tout !** Ouvrez votre nom de domaine dans votre navigateur : l'ERP est immédiatement en ligne et fonctionnel.

---

## OPTION 2 : Hébergement Gratuit Netlify ou Vercel (En 1 minute)

### Sur Netlify (Glisser-déposer) :
1. Créez un compte gratuit sur [netlify.com](https://www.netlify.com).
2. Rendez-vous dans la section **Sites** > **Deploy manually**.
3. Glissez-déposez simplement le dossier `dist` de votre ordinateur dans la zone de dépôt.
4. En 10 secondes, votre site est en ligne avec HTTPS gratuit.

### Sur Vercel :
1. Installez Vercel CLI : `npm i -g vercel`
2. Lancez la commande dans le dossier du projet : `vercel --prod`
3. Ou connectez votre dépôt GitHub sur [vercel.com](https://vercel.com).

---

## OPTION 3 : Serveur Dédié / VPS Linux (Ubuntu / Debian avec Nginx)

1. Connectez-vous à votre VPS en SSH :
   ```bash
   ssh root@ip_du_serveur
   ```
2. Installez Nginx :
   ```bash
   apt update && apt install -y nginx certbot python3-certbot-nginx
   ```
3. Créez le dossier pour l'application :
   ```bash
   mkdir -p /var/www/smartschool
   ```
4. Transférez le contenu du dossier `dist/` vers `/var/www/smartschool/dist/`.
5. Copiez le fichier `nginx.conf` fourni dans le projet vers `/etc/nginx/sites-available/smartschool` :
   ```bash
   ln -s /etc/nginx/sites-available/smartschool /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```
6. Activez le certificat SSL gratuit Let's Encrypt :
   ```bash
   certbot --nginx -d votredomaine.gn
   ```

---

## OPTION 4 : Déploiement avec Docker & Docker Compose

Un fichier `Dockerfile` et un `docker-compose.yml` sont inclus dans le projet.

Pour lancer l'application en un conteneur isolé :
```bash
docker compose up -d --build
```
L'application sera accessible immédiatement sur le port 80 / 443.

---

## OPTION 5 : Hébergement Node.js / Express (Render, Railway, Heroku)

Un fichier `server.js` prêt pour la production est inclus.

1. Installez les dépendances :
   ```bash
   npm install --legacy-peer-deps
   ```
2. Lancez le serveur de production :
   ```bash
   node server.js
   ```
3. L'application écoute sur le port défini par la variable d'environnement `PORT` (par défaut 3000).

---

## SÉCURITÉ MULTI-ÉTABLISSEMENTS & BADGES PVC

- **Cloisonnement strict :** Chaque administrateur d'école est désormais 100% verrouillé sur son établissement attribué. Aucun administrateur ne peut visualiser ni basculer sur l'école d'un autre administrateur.
- **Impression des badges :** Les cartes PVC respectent la norme CR-80 ISO/IEC 7810 (85.6 × 54 mm, 300 DPI). Le design (couleurs, dégradés, armoiries nationales, QR code) est fidèlement restitué à l'impression et lors du téléchargement.
