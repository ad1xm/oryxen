-- Run this in your Supabase SQL Editor to fix the missing efficient details

-- 1. Add the missing 'details' column (JSONB) to store rich content
ALTER TABLE showcase_projects 
ADD COLUMN IF NOT EXISTS details JSONB;

-- 2. Populate E-Commerce Storefront details
UPDATE showcase_projects 
SET details = '{
    "headline": "Modern Digital Commerce",
    "capabilities": ["Headless commerce architecture", "One click checkout", "Inventory synchronization", "Customer behavior analytics"],
    "benefits": ["Increase conversion rates", "Seamless omnichannel experience", "Scale to millions of users"],
    "stack": ["Next.js", "Stripe", "Prisma", "Vercel"]
}'::jsonb 
WHERE title ILIKE '%commerce%';

-- 3. Populate Fintech Dashboard details (if needed)
UPDATE showcase_projects 
SET details = '{
    "headline": "Institutional Grade Trading Platform",
    "capabilities": ["Real time WebSocket data streaming", "Advanced chart visualization", "Instant order execution", "Portfolio risk management"],
    "benefits": ["Identify market trends faster", "Execute complex strategies", "Secure and compliant infrastructure"],
    "stack": ["Next.js", "TypeScript", "Go", "PostgreSQL"]
}'::jsonb 
WHERE title ILIKE '%fintech%';

-- Verify the update
SELECT title, details FROM showcase_projects WHERE details IS NOT NULL;
