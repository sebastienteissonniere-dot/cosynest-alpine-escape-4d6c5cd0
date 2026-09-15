-- Script de création et mise à jour de la Base de Données Supabase (PostgreSQL)
-- Pour le Chalet Cosynest (Backoffice & Guest Portal PWA)

-- 1. Table principale des Réservations
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT UNIQUE NOT NULL,
    property_id TEXT NOT NULL DEFAULT 'cosynest-chalet-vars',
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    number_of_guests INTEGER NOT NULL DEFAULT 2,
    total_amount NUMERIC(10,2) DEFAULT 0.00,
    source TEXT NOT NULL DEFAULT 'Direct', -- 'Direct', 'Airbnb', 'Booking.com', 'VRBO'
    status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'checked_in', 'checked_out'
    requires_contract BOOLEAN DEFAULT true,
    contract_signed BOOLEAN DEFAULT false,
    contract_signed_at TIMESTAMPTZ,
    identity_verified BOOLEAN DEFAULT false,
    deposit_status TEXT DEFAULT 'pending', -- 'pending', 'authorized', 'released', 'claimed'
    deposit_amount NUMERIC(10,2) DEFAULT 1500.00,
    igloohome_pin_code TEXT,
    igloohome_keybox_code TEXT,
    check_in_inventory_done BOOLEAN DEFAULT false,
    check_out_inventory_done BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table des Signatures électroniques de Contrat
CREATE TABLE IF NOT EXISTS public.guest_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.reservations(booking_id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    signature_data_url TEXT NOT NULL,
    ip_address TEXT,
    signed_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table des Rapports de Vérification d'Identité IA Gemini
CREATE TABLE IF NOT EXISTS public.identity_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.reservations(booking_id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    extracted_name TEXT,
    verification_passed BOOLEAN NOT NULL DEFAULT false,
    confidence_score INTEGER DEFAULT 0,
    face_matches BOOLEAN DEFAULT false,
    name_matches BOOLEAN DEFAULT false,
    is_live_person BOOLEAN DEFAULT true,
    summary_reason TEXT,
    verified_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Table des États des Lieux (Check-in / Check-out)
CREATE TABLE IF NOT EXISTS public.inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.reservations(booking_id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'check_in' ou 'check_out'
    inspector_name TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    general_remarks TEXT,
    signed_at TIMESTAMPTZ DEFAULT now()
);

-- Activer Row Level Security (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture et écriture publiques / anon pour la PWA
CREATE POLICY "Permettre la lecture des réservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Permettre l'insertion/mise à jour des réservations" ON public.reservations FOR ALL USING (true);

CREATE POLICY "Permettre l'insertion des signatures" ON public.guest_signatures FOR ALL USING (true);
CREATE POLICY "Permettre l'insertion des vérifications IA" ON public.identity_verifications FOR ALL USING (true);
CREATE POLICY "Permettre l'insertion/lecture des états des lieux" ON public.inventories FOR ALL USING (true);
