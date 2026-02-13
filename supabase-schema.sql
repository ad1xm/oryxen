-- Supabase Schema for ORYXEN Admin Panel
-- Run this in Supabase SQL Editor to set up the database

-- Site Content Table
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultation Slots Table
CREATE TABLE IF NOT EXISTS consultation_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  booked_by_name TEXT,
  booked_by_email TEXT,
  phone TEXT,
  booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, time)
);

-- Form Submissions Table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for public read access to visible content
CREATE POLICY "Public read visible testimonials" ON testimonials
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read all slots" ON consultation_slots
  FOR SELECT USING (true);

CREATE POLICY "Public can insert slots" ON consultation_slots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update slots" ON consultation_slots
  FOR UPDATE USING (true);

CREATE POLICY "Public read content" ON site_content
  FOR SELECT USING (true);

-- Service role has full access (for admin operations)
-- Note: Service role bypasses RLS by default

-- Sample testimonials (optional - run to seed data)
-- INSERT INTO testimonials (quote, name, role, location, "order") VALUES
-- ('Clear communication and realistic timelines. The handover was smooth.', 'Sneha Kulkarni', 'Product Manager', 'Pune', 1),
-- ('Code quality was strong. We didn''t need to refactor after delivery.', 'Saurabh Mehta', 'Tech Lead', 'Ahmedabad', 2),
-- ('Planning was done keeping future scaling in mind. That helped us avoid rework.', 'Arjun Patel', 'SaaS Co-founder', 'Surat', 3);

-- Sample consultation slots (optional)
-- INSERT INTO consultation_slots (date, time) VALUES
-- ('2025-02-05', '10:00'),
-- ('2025-02-05', '14:00'),
-- ('2025-02-06', '11:00');
