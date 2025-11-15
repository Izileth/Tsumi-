-- Migration to seed initial neutral territories into the public.territories table.

-- Get existing district IDs to link territories.
-- We'll use a subquery to get the IDs dynamically.

INSERT INTO public.territories (name, description, district_id, clan_id)
SELECT 'Shinjuku Central', 'O coração vibrante de Shinjuku, com arranha-céus e vida noturna intensa.', id, NULL FROM public.districts WHERE name = 'Shinjuku'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.territories (name, description, district_id, clan_id)
SELECT 'Shinjuku Gyoen', 'Um oásis de tranquilidade no meio da agitação urbana de Shinjuku.', id, NULL FROM public.districts WHERE name = 'Shinjuku'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.territories (name, description, district_id, clan_id)
SELECT 'Shibuya Crossing', 'O famoso cruzamento de Shibuya, um ponto de encontro icônico.', id, NULL FROM public.districts WHERE name = 'Shibuya'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.territories (name, description, district_id, clan_id)
SELECT 'Harajuku Takeshita Street', 'A rua da moda jovem e cultura pop em Shibuya.', id, NULL FROM public.districts WHERE name = 'Shibuya'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.territories (name, description, district_id, clan_id)
SELECT 'Roppongi Hills', 'Um complexo de luxo com lojas, restaurantes e arte em Roppongi.', id, NULL FROM public.districts WHERE name = 'Roppongi'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.territories (name, description, district_id, clan_id)
SELECT 'Akihabara Electric Town', 'O centro da cultura otaku e eletrônicos em Akihabara.', id, NULL FROM public.districts WHERE name = 'Akihabara'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.territories (name, description, district_id, clan_id)
SELECT 'Ginza Chuo-dori', 'A principal rua comercial de Ginza, com lojas de grife e galerias.', id, NULL FROM public.districts WHERE name = 'Ginza'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.territories (name, description, district_id, clan_id)
SELECT 'Senso-ji Temple', 'O templo mais antigo de Tóquio, um marco cultural em Asakusa.', id, NULL FROM public.districts WHERE name = 'Asakusa'
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.territories IS 'Initial neutral territories for the game map.';
