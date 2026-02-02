const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Config
const EMAIL = 'amap.togo@gmail.com';
const PASSWORD = 'amaptogo2017';
const ROLE = 'admin';

async function main() {
    console.log('--- Création Admin User ---');

    // 1. Charger les env vars
    const envPath = path.resolve(__dirname, '../.env');
    console.log(`Lecture de ${envPath}...`);

    if (!fs.existsSync(envPath)) {
        console.error('ERREUR: .env introuvable dans apps/web');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;

        const idx = line.indexOf('=');
        if (idx !== -1) {
            const key = line.substring(0, idx).trim();
            let value = line.substring(idx + 1).trim();
            value = value.replace(/^["'](.*)["']$/, '$1');
            env[key] = value;
        }
    });

    console.log('Clés trouvées:', Object.keys(env));

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        console.error('ERREUR: Variables Env manquantes (NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY)');
        process.exit(1);
    }

    console.log(`Supabase URL: ${supabaseUrl}`);

    // 2. Init Client
    const supabase = createClient(supabaseUrl, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    // 3. Créer User (ou update pwd si existe)
    console.log(`Tentative de création/update pour ${EMAIL}...`);

    // Check if exists by trying to create (Supabase returns error or data)
    // Actually simpler to just use admin.createUser, it fails if exists? autoConfirm=true

    // Try to delete first? No, risky if data exists.
    // Just createUser. If error "User already registered", then updateUser.

    let userId;

    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: EMAIL,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { nom: 'AMAP', prenom: 'Admin' }
    });

    if (createError) {
        console.log(`Info création: ${createError.message}`);
        if (createError.message.includes('already registered') || createError.status === 422) {
            // Find user ID to update password
            // listUsers is paginated but we can assume small DB or search?
            // Unfortunately listUsers doesn't filter by email easily in all versions.
            // But we can just "updateUserById" if we knew ID.
            // Or... we can try signIn to verify? No need.
            // We can use listUsers to find the ID.

            const { data: listData } = await supabase.auth.admin.listUsers();
            const existingUser = listData.users.find(u => u.email === EMAIL);

            if (existingUser) {
                userId = existingUser.id;
                console.log(`Utilisateur existant trouvé (ID: ${userId}). Mise à jour mot de passe...`);
                const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
                    password: PASSWORD,
                    user_metadata: { nom: 'AMAP', prenom: 'Admin' }
                });
                if (updateError) {
                    console.error('Erreur update:', updateError);
                    process.exit(1);
                }
            } else {
                console.error('Utilisateur existe selon erreur, mais introuvable dans la liste ?');
                process.exit(1);
            }
        } else {
            console.error('Erreur fatale création:', createError);
            process.exit(1);
        }
    } else {
        userId = createData.user.id;
        console.log(`Utilisateur créé avec succès (ID: ${userId})`);
    }

    // 4. Récupérer l'ID du rôle admin
    console.log('Recherche du rôle admin...');
    const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('id')
        .ilike('nom', 'admin') // 'nom' ou 'name' ? Essayons 'nom' d'après le contexte francophone
        .single();

    let adminRoleId;
    if (rolesData) {
        adminRoleId = rolesData.id;
        console.log(`Rôle admin trouvé: ${adminRoleId}`);
    } else {
        console.log('Rôle admin non trouvé avec "nom". Essai avec "name"...');
        const { data: rolesData2 } = await supabase
            .from('roles')
            .select('id')
            .ilike('name', 'admin')
            .single();

        if (rolesData2) {
            adminRoleId = rolesData2.id;
            console.log(`Rôle admin trouvé: ${adminRoleId}`);
        } else {
            console.error('ERREUR: Impossible de trouver le rôle admin dans la table "roles".');
            // On continue sans role_id ou on s'arrête ? Mieux vaut s'arrêter.
            process.exit(1);
        }
    }

    // 5. Créer/Update Profil
    console.log('Mise à jour du profil...');

    const { error: profileError } = await supabase
        .from('profils')
        .upsert({
            id: userId,
            email: EMAIL,
            nom: 'AMAP',
            prenom: 'Admin',
            role_id: adminRoleId
        });

    if (profileError) {
        console.error('Erreur profil:', profileError);
    } else {
        console.log('Profil mis à jour avec succès.');
    }

    console.log('--- TERMINÉ ---');
}

main();
