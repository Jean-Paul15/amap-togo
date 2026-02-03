
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env
const envPath = path.join(__dirname, '../../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
        env[key.trim()] = value.join('=').trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupStorage() {
    console.log('Checking storage buckets...');

    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        return;
    }

    let imagesBucket = buckets.find(b => b.name === 'images');

    if (!imagesBucket) {
        console.log('Creating "images" bucket...');
        const { data, error } = await supabase.storage.createBucket('images', {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*'],
            fileSizeLimit: 52428800 // 50MB
        });
        if (error) {
            console.error('Error creating bucket:', error);
        } else {
            console.log('Bucket "images" created.');
        }
    } else {
        console.log('Bucket "images" already exists.');
        // Ensure it is public
        if (!imagesBucket.public) {
            console.log('Updating "images" bucket to be public...');
            await supabase.storage.updateBucket('images', { public: true });
        }
    }

    console.log('Done.');
}

setupStorage();
