import { useEffect } from 'react';

/**
 * Adds light client-side deterrents against casual copying:
 * - Disables right-click context menu
 * - Blocks text selection (CSS class on body)
 * - Intercepts copy/cut/print/save keyboard shortcuts
 *
 * NOTE: This is a deterrent, not real protection. Determined users can
 * always bypass via devtools. The real protection is per-user watermarking
 * (see <Watermark /> overlay and PDF watermarks) which discourages sharing.
 */
export function useProtection(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const blockContext = (e: MouseEvent) => {
      e.preventDefault();
    };

    const blockKeys = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      // Block: copy, cut, save, print, select-all, view source
      if (mod && ['c', 'x', 's', 'p', 'a', 'u'].includes(k)) {
        // Allow copy/select-all on input and textarea elements
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        const isEditable =
          tag === 'input' ||
          tag === 'textarea' ||
          target?.isContentEditable === true;
        if (!isEditable) {
          e.preventDefault();
        }
      }
    };

    const blockCopyEvent = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        target?.isContentEditable === true;
      if (!isEditable) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', blockContext);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('copy', blockCopyEvent);
    document.addEventListener('cut', blockCopyEvent);

    document.body.classList.add('cfa-protected');

    return () => {
      document.removeEventListener('contextmenu', blockContext);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('copy', blockCopyEvent);
      document.removeEventListener('cut', blockCopyEvent);
      document.body.classList.remove('cfa-protected');
    };
  }, [enabled]);
}
