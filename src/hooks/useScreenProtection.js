import { useEffect, useRef, useState } from 'react';

/**
 * Protección anti-captura para contenido de video.
 * Bloquea: menú contextual, ataques de impresión/captura, cambio de ventana y
 * copy de pantalla. Muestra un overlay mientras se intenta la captura y
 * devuelve controles para mostrar/ocultar el aviso.
 */
export default function useScreenProtection({ enabled = true, onAttempt = null } = {}) {
  const [blocked, setBlocked] = useState(false);
  const warnTimer = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const flash = () => {
      setBlocked(true);
      if (onAttempt) onAttempt();
      if (warnTimer.current) clearTimeout(warnTimer.current);
      warnTimer.current = setTimeout(() => setBlocked(false), 2500);
    };

    // Ocultar contenido al cambiar a otra pestaña/ventana (mitiga grabación)
    const onVisibility = () => {
      if (document.hidden) setBlocked(true);
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onKeyDown = (e) => {
      const k = e.key ? String(e.key).toLowerCase() : '';
      const combo =
        (e.ctrlKey || e.metaKey) && k === 'p' || // imprimir
        (e.ctrlKey || e.metaKey) && k === 's' || // guardar
        e.key === 'Printscreen' ||
        e.key === 'PrintScreen' ||
        (e.ctrlKey || e.metaKey) && e.shiftKey && (k === 's' || k === 'c') ||
        e.key === 'F12' ||
        e.key === 'F10';
      if (combo) {
        e.preventDefault();
        flash();
      }
    };

    const onContextMenu = (e) => {
      e.preventDefault();
      flash();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('contextmenu', onContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('contextmenu', onContextMenu);
      if (warnTimer.current) clearTimeout(warnTimer.current);
    };
  }, [enabled, onAttempt]);

  const dismissBlock = () => setBlocked(false);

  return { blocked, dismissBlock };
}
