import { useEffect, useState } from 'react';
import { usePlayerBySlug } from '@/hooks/usePlayers';
import { supabase } from '@/integrations/supabase/client';
import PlayerSite from '@/pages/PlayerSite';

// Hosts that should render the normal CFA app
const APP_HOSTS = new Set([
  'cfa.golf',
  'www.cfa.golf',
  'localhost',
  '127.0.0.1',
]);

function isAppHost(host: string) {
  if (APP_HOSTS.has(host)) return true;
  if (host.endsWith('.lovable.app') || host.endsWith('.lovable.dev')) return true;
  if (host.endsWith('.cfa.golf')) return true; // future subdomain support
  return false;
}

interface Props { children: React.ReactNode }

export function CustomDomainRouter({ children }: Props) {
  const host = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isApp = isAppHost(host);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isApp);

  useEffect(() => {
    if (isApp) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('players')
        .select('slug')
        .eq('custom_domain', host)
        .eq('is_active', true)
        .maybeSingle();
      if (!cancelled) {
        setSlug(data?.slug || null);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [host, isApp]);

  if (isApp) return <>{children}</>;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold mb-2">Site not configured</h1>
        <p className="text-muted-foreground">This domain isn't linked to a player site yet.</p>
      </div>
    );
  }
  return <CustomDomainPlayerSite slug={slug} />;
}

function CustomDomainPlayerSite({ slug }: { slug: string }) {
  // Reuse PlayerSite by injecting slug via URL params hack — render directly using the hook
  // Simpler: navigate to /p/:slug using history.replaceState so PlayerSite reads useParams
  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState({}, '', `/p/${slug}`);
    }
  }, [slug]);
  return <PlayerSiteWrapper slug={slug} />;
}

// Avoid useParams dependency by passing slug directly
function PlayerSiteWrapper({ slug }: { slug: string }) {
  const { data: player, isLoading } = usePlayerBySlug(slug);
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!player) return null;
  // Render full PlayerSite via route — easiest path is to lazy import and render with a fake route
  return <PlayerSite />;
}
