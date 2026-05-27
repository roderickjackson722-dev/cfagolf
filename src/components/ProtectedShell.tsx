import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProtection } from '@/hooks/useProtection';
import { Watermark } from './Watermark';
import { setPdfRecipient, clearPdfRecipient } from '@/lib/pdfTemplates';

/**
 * Global protection layer. Active whenever a user is signed in.
 * - Disables right-click, copy, and print shortcuts (deterrent only)
 * - Renders a fixed diagonal watermark with the user's name + email
 * - Registers the user's identity for per-user PDF watermarking
 *
 * Mounted once in App.tsx — applies to every authenticated page.
 */
export function ProtectedShell() {
  const { user, profile } = useAuth();
  // Skip watermark on public player portfolio pages
  const isPublicPlayerPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/p/');
  useProtection(!!user && !isPublicPlayerPage);

  useEffect(() => {
    if (user) {
      setPdfRecipient({
        name: profile?.full_name ?? null,
        email: profile?.email ?? user.email ?? null,
      });
    } else {
      clearPdfRecipient();
    }
  }, [user, profile?.full_name, profile?.email]);

  if (!user || isPublicPlayerPage) return null;
  return <Watermark />;
}

