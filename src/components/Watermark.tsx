import { useAuth } from '@/hooks/useAuth';
import cfaLogo from '@/assets/cfa-logo-transparent.png';

/**
 * Repeating CFA logo watermark for signed-in pages.
 * Renders fixed across the viewport without displaying personal contact details.
 */
export function Watermark() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundImage: `url(${cfaLogo})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '320px auto',
        backgroundPosition: '24px 24px',
        opacity: 0.04,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
