#!/bin/bash
# ==============================================================================
# Script Automatique de Génération APK Android - SmartSchool ERP Guinée
# Conçu et développé par : Saïd Soumah (saidsoumah23@gmail.com)
# Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A)
# ==============================================================================

set -e

echo "🇬🇳 ======================================================"
echo "🇬🇳   GÉNÉRATION DE L'APK SMARTSCHOOL ERP GUINÉE"
echo "🇬🇳   Développeur : Saïd Soumah (saidsoumah23@gmail.com)"
echo "🇬🇳 ======================================================"

echo "\n[1/4] Compilation des assets de production..."
npm run build

echo "\n[2/4] Vérification des dépendances Capacitor..."
if [ ! -d "node_modules/@capacitor/android" ]; then
  echo "Installation de Capacitor Android..."
  npm install @capacitor/core @capacitor/android
  npm install -D @capacitor/cli
fi

echo "\n[3/4] Synchronisation des fichiers Web vers le conteneur Android..."
if [ ! -d "android" ]; then
  npx cap add android
fi
npx cap copy android
npx cap sync android

echo "\n[4/4] Compilation du package APK Android..."
if [ -d "android" ]; then
  cd android
  if [ -f "./gradlew" ]; then
    chmod +x ./gradlew
    ./gradlew assembleDebug
    echo "\n✅ SUCCÈS ! Votre fichier APK a été généré :"
    echo "📁 Chemin du fichier : android/app/build/outputs/apk/debug/app-debug.apk"
  else
    echo "Projet Android généré dans le dossier /android. Ouvrez avec Android Studio pour compiler l'APK."
  fi
  cd ..
fi

echo "\n🎉 Procédure terminée avec succès !"
