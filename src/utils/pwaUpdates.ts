import { registerSW } from 'virtual:pwa-register';

export const PWA_UPDATE_READY_EVENT = 'smartschool-pwa-update-ready';

let initialized = false;
let isReloading = false;

export function applyPendingPWAUpdate(): void {
  if (typeof window === 'undefined' || isReloading) return;
  isReloading = true;
  window.location.reload();
}

export function initPWAUpdates(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const hasServiceWorker = 'serviceWorker' in navigator;
  const hadController = hasServiceWorker && Boolean(navigator.serviceWorker.controller);
  const bootTime = Date.now();
  let lastCheckAt = 0;

  const notifyUpdateReady = () => {
    window.dispatchEvent(new CustomEvent(PWA_UPDATE_READY_EVENT));
  };

  if (hasServiceWorker) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || isReloading || import.meta.env.DEV) return;

      // If the app was just launched (within 6 seconds), reload immediately into the new version.
      // Otherwise, show a prompt so any unsaved form input is never lost unexpectedly.
      if (Date.now() - bootTime < 6000) {
        applyPendingPWAUpdate();
      } else {
        notifyUpdateReady();
      }
    });
  }

  registerSW({
    immediate: true,
    onNeedRefresh() {
      notifyUpdateReady();
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      const checkForUpdate = (force = false) => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) return;
        const now = Date.now();
        if (!force && now - lastCheckAt < 60_000) return;
        lastCheckAt = now;
        registration.update().catch(() => {
          // Ignore transient network errors while offline or switching networks
        });
      };

      // Check shortly after launch (especially helpful for iOS/Android standalone PWAs)
      window.setTimeout(() => checkForUpdate(true), 3_000);

      // Periodic background check every 10 minutes while the app stays open
      window.setInterval(() => checkForUpdate(false), 10 * 60 * 1000);

      // Check when returning to the app on mobile or desktop
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkForUpdate(false);
        }
      });

      window.addEventListener('focus', () => checkForUpdate(false));
      window.addEventListener('online', () => checkForUpdate(true));
    },
    onRegisterError() {
      // Service worker registration failure is non-fatal in unsupported contexts
    },
  });
}
