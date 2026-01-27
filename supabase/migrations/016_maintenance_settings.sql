-- Global app settings for maintenance and config
CREATE TABLE IF NOT EXISTS public.app_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins have full access to app_settings"
ON public.app_settings
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Everyone can read settings
CREATE POLICY "Public can read app_settings"
ON public.app_settings
FOR SELECT
USING (true);

-- Insert default maintenance mode setting
INSERT INTO public.app_settings (key, value)
VALUES ('maintenance_mode', '{"enabled": false, "message": "The system is currently undergoing maintenance. Please check back later."}')
ON CONFLICT (key) DO NOTHING;
