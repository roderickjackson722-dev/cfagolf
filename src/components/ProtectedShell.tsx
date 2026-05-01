import { useAuth } from '@/hooks/useAuth';
import { useProtection } from '@/hooks/useProtection';
import { Watermark } from './Watermark';

/**
 * Global protection layer. Active whenever a user is signed in.
 * - Disables right-click, copy, and print shortcuts (deterrent only)
 * - Renders a fixed diagonal watermark with the user's name + email
 *
 * Mounted once in App.tsx — applies to every authenticated page.
 */
export function ProtectedShell() {
  const { user } = useAuth();
  useProtection(!!user);
  if (!user) return null;
  return <Watermark />;
}
