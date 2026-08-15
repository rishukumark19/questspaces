-- Phase 2 Columns
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS developer_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS developer_experience TEXT,
  ADD COLUMN IF NOT EXISTS developer_projects_count TEXT,
  ADD COLUMN IF NOT EXISTS developer_description TEXT,
  ADD COLUMN IF NOT EXISTS rera_portal_url TEXT,
  ADD COLUMN IF NOT EXISTS brochure_url TEXT,
  ADD COLUMN IF NOT EXISTS master_plan_image_url TEXT,
  ADD COLUMN IF NOT EXISTS walkthrough_video_url TEXT;

-- Phase 3 Columns
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS recent_updates JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS price_insights JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS buyer_personas JSONB DEFAULT '[]'::jsonb;
