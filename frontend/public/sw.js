/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
self.addEventListener('push', async (event) => {
  console.log('notifications will be displayed here');
  const message = await event.data.json();
  const { title, options } = message;
  await event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener(
  'notificationclick',
  (event) => {
    const payload = event.notification.data;
    if (event.action === 'view') {
      clients.openWindow(payload?.url);
    }
  },
  false
);
