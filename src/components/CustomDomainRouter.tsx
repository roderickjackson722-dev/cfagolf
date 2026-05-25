import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hosts that should render the normal CFA app (no rewrite)
const APP_HOSTS = new Set(['cfa.golf', 'www.cfa.golf', 'localhost', '127.0.0.1']);

function isAppHost(host: string) {
  if (APP_HOSTS.has(host)) return true;
  if (host.endsWith('.lovable.app') || host.endsWith('.lovable.dev')) return true;
  if (host.endsWith('.cfa.golf')) return true; // reserved for future subdomain support
  return false;
}

/**
 * On a player's custom domain (e.g. johnsmithgolf.com), looks up the player
 * by hostname and rewrites the URL to /p/<slug> before React Router mounts.
 * Returns true once resolution is complete (or immediately on the main app).
 */
export function useCustomDomainRewrite() {
  const host = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isApp = isAppHost(host);
  const [ready, setReady] = useState(isApp);

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
      if (cancelled) return;
      if (data?.slug) {
        const target = `/p/${data.slug}`;
        if (window.location.pathname === '/' || window.location.pathname === '') {
          window.history.replaceState({}, '', target);
        }
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [host, isApp]);

  return ready;
}
