const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
    // 1. Charger env
    const envPath = path.resolve(__dirname, '../.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const idx = line.indexOf('=');
        if (idx !== -1) {
            env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^["'](.*)["']$/, '$1');
        }
    });

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('Test accès table "mailing_contacts"...');
    const { data, error } = await supabase.from('mailing_contacts').select('*').limit(1);

    if (error) {
        console.error('Erreur:', error);
        if (error.code === '42P01') {
            console.log('--> La table n\'existe pas (42P01). Le script SQL n\'a pas été exécuté.');
        }
    } else {
        console.log('Succès! La table existe.');
        console.log('Données:', data);
    }
}

main();
