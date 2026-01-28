import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve a unique visitor ID
const getVisitorId = (): string => {
  const storageKey = 'cfa_visitor_id';
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
};

// Check if this is a new session (visitor hasn't been tracked in this session)
const isNewSession = (): boolean => {
  const sessionKey = 'cfa_session_tracked';
  const tracked = sessionStorage.getItem(sessionKey);
  
  if (!tracked) {
    sessionStorage.setItem(sessionKey, 'true');
    return true;
  }
  
  return false;
};

export function useVisitorTracking() {
  useEffect(() => {
    // Only track once per session
    if (!isNewSession()) {
      return;
    }

    const trackVisitor = async () => {
      try {
        const visitorId = getVisitorId();
        
        // Insert visitor record - this will trigger the admin notification via database trigger
        const { error } = await supabase
          .from('site_visitors')
          .insert({
            visitor_id: visitorId,
            page_url: window.location.pathname,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
          });

        if (error) {
          console.error('Error tracking visitor:', error);
        }
      } catch (err) {
        console.error('Failed to track visitor:', err);
      }
    };

    // Small delay to not block initial render
    const timeoutId = setTimeout(trackVisitor, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);
}
