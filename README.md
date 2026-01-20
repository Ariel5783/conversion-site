# Conversions & Mesures — Site pédagogique interactif

**Conversions & Mesures** est un site pédagogique statique conçu pour accompagner les élèves dans la maîtrise des **tableaux de conversion** utilisés en enseignement scientifique, technique et professionnel.

Le site met en œuvre une méthode simple et efficace, particulièrement adaptée aux publics CAP, Bac Pro et BTS.

---

## Public concerné

- CAP Électricité  
- Bac Pro CIEL  
- Bac Pro MSPC  
- BTS CIEL  

---

## Objectifs pédagogiques

- Comprendre le **sens des unités** et des changements d’échelle  
- Éviter les erreurs fréquentes de conversion (×10, ×100, ×1000, ×60, 8, 1024)  
- Automatiser une méthode fiable :  
  **écrire la valeur dans la bonne colonne, puis compléter avec des zéros**  
- Relier les conversions à des **situations professionnelles concrètes**  
  (mesures, câblage, consommation, temps d’intervention, données numériques)

---

## Contenus du site

- Convertisseur interactif par tableaux (méthode par colonnes)
- Exercices progressifs avec sauvegarde automatique
- QCM interactif (score + corrections)
- Fiche A4 imprimable / export PDF
- Mode enseignant :
  - affichage des corrigés
  - générateur d’exercices
  - exports JSON / CSV

---

## Mode enseignant

Les corrigés et outils enseignants peuvent être affichés en ajoutant le paramètre suivant à l’URL :

- `?teacher=1`

Exemples :
- `exercices.html?teacher=1`
- `qcm.html?teacher=1`

⚠️ Ce mode est volontairement simple (pas de mot de passe).  
Il est destiné à un **usage pédagogique encadré**.

---

## Fonctionnement technique

- Site **100 % statique** (HTML / CSS / JavaScript)
- Aucune donnée envoyée à un serveur
- Sauvegarde des réponses en **local (navigateur)** via `localStorage`
- Déploiement automatique via **GitHub → Netlify**

---

## Déploiement

Le site est déployé automatiquement sur Netlify à chaque `git push` sur la branche `main`.

Structure du projet :
