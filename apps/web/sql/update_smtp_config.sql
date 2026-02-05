-- Mise a jour de la configuration SMTP
-- A executer dans l'editeur SQL de Supabase

-- Mise a jour de l'utilisateur SMTP
INSERT INTO public.system_settings (key, value, description)
VALUES ('smtp_user', 'amap.togo@gmail.com', 'Adresse email pour l''envoi SMTP')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Mise a jour du mot de passe SMTP
INSERT INTO public.system_settings (key, value, description)
VALUES ('smtp_password', 'emtt ejvu wksj xvuy', 'Mot de passe d''application pour l''envoi SMTP')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
