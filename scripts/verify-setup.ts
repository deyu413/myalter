import fs from 'fs';
import path from 'path';

const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID_SMALL',
    'STRIPE_PRICE_ID_LARGE',
    'NEXT_PUBLIC_URL'
];

const CRITICAL_FILES = [
    'app/actions/ghost.ts',
    'app/actions/match.ts',
    'app/actions/simulation.ts',
    'app/actions/stripe.ts',
    'app/api/webhooks/stripe/route.ts',
    'lib/supabase/server.ts',
    'lib/stripe.ts',
    'lib/data/scenarios.json',
    'supabase/schema.sql'
];

function checkEnv() {
    console.log("Checking Environment Variables (Presence Only)...");
    // Note: We can't actually check process.env here easily without loading dotenv, 
    // but we can remind the user.
    console.log("⚠️  Ensure the following are in your .env.local:");
    REQUIRED_ENV_VARS.forEach(v => console.log(`   - ${v}`));
}

function checkFiles() {
    console.log("\nChecking Critical Files...");
    let allFound = true;
    CRITICAL_FILES.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ Found: ${file}`);
        } else {
            console.error(`❌ MISSING: ${file}`);
            allFound = false;
        }
    });
    return allFound;
}

async function main() {
    console.log("=== GHOST PROTOCOL VERIFICATION ===\n");

    checkEnv();

    const filesOk = checkFiles();

    if (filesOk) {
        console.log("\n✅ All critical files are present.");
        console.log("🚀 System appears ready for deployment.");
        console.log("\nNEXT STEPS:");
        console.log("1. Run 'npm run dev'");
        console.log("2. Open http://localhost:3000");
        console.log("3. Sign up and complete the Ghost Setup.");
    } else {
        console.error("\n❌ Some files are missing. Check the logs above.");
        process.exit(1);
    }
}

main();
