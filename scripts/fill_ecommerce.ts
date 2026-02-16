import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually to avoid dependencies
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env file");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ecommerceDetails = {
    headline: "Modern Digital Commerce",
    capabilities: ["Headless commerce architecture", "One click checkout", "Inventory synchronization", "Customer behavior analytics"],
    benefits: ["Increase conversion rates", "Seamless omnichannel experience", "Scale to millions of users"],
    stack: ["Next.js", "Stripe", "Prisma", "Vercel"]
};

async function updateEcommerceProject() {
    console.log("Searching for E-Commerce project...");

    // Find the project first (handle variations in title)
    const { data: projects, error: searchError } = await supabase
        .from('showcase_projects')
        .select('id, title')
        .ilike('title', '%commerce%');

    if (searchError) {
        console.error("Error searching for project:", searchError);
        return;
    }

    if (!projects || projects.length === 0) {
        console.error("No E-Commerce project found in database.");
        return;
    }

    console.log(`Found ${projects.length} matching project(s):`, projects.map(p => p.title));

    for (const project of projects) {
        console.log(`Updating project: ${project.title} (${project.id})...`);
        const { error: updateError } = await supabase
            .from('showcase_projects')
            .update({ details: ecommerceDetails })
            .eq('id', project.id);

        if (updateError) {
            console.error(`Error updating project ${project.title}:`, updateError);
        } else {
            console.log(`Successfully updated details for ${project.title}`);
        }
    }
}

updateEcommerceProject();
