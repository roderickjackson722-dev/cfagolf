
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_players_custom_domain ON public.players(custom_domain) WHERE custom_domain IS NOT NULL;
