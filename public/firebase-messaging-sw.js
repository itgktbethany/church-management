importScripts(
  "https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyA9l5legLwHYDVuzTd_vSid3Mvk6LCENWs",
  authDomain: "church-management-core.firebaseapp.com",
  projectId: "church-management-core",
  storageBucket: "church-management-core.firebasestorage.app",
  messagingSenderId: "134071054781",
  appId: "1:134071054781:web:7735c3370e7247053622d4",
});

const messaging = firebase.messaging();

// Explicit background message handler — required for iOS Safari PWA.
//
// iOS aggressively terminates service workers. Firebase compat's automatic
// notification display (triggered when the payload contains a "notification"
// object) is NOT guaranteed to survive iOS's strict SW lifecycle cutoff.
//
// Using onBackgroundMessage() ensures the notification is shown via
// event.waitUntil() internally by the Firebase compat library, which keeps
// the service worker alive long enough for iOS to render the notification.
//
// NOTE: Defining onBackgroundMessage disables the automatic display — we are
// fully responsible for calling self.registration.showNotification() here.
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const notification = payload.notification ?? {};
  const title = notification.title || "GKT Bethany CHMS";
  const options = {
    body: notification.body || "",
    icon: "/gkt-logo.png",
    badge: "/gkt-logo.png",
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});