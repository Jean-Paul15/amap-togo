#!/usr/bin/env node
/**
 * Script pour synchroniser le .env racine vers toutes les apps
 * Usage: node scripts/sync-env.js
 */

const fs = require('fs')
const path = require('path')

const rootEnv = path.join(__dirname, '..', '.env')
const apps = ['apps/web', 'apps/admin']

if (!fs.existsSync(rootEnv)) {
  console.error('Erreur: .env introuvable a la racine')
  process.exit(1)
}

const envContent = fs.readFileSync(rootEnv, 'utf8')

apps.forEach((app) => {
  const appDir = path.join(__dirname, '..', app)
  if (fs.existsSync(appDir)) {
    const appEnvPath = path.join(appDir, '.env')
    fs.writeFileSync(appEnvPath, envContent)
    console.log(`✓ Synchronise ${app}/.env`)
  } else {
    console.warn(`! Dossier ${app} introuvable, ignoré`)
  }
})

console.log('\nTous les fichiers .env ont ete synchronises depuis la racine')
