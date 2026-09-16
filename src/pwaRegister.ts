export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
          registration.update();
        })
        .catch((error) => {
          console.error('[PWA] ServiceWorker registration failed:', error);
        });
    });
  }
}
