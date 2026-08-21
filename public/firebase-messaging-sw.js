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

// Firebase's handler — fires on Android/Chrome in the background
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message (Firebase)",
    payload
  );

  self.registration.showNotification(
    payload.notification?.title ?? "CHMS",
    {
      body: payload.notification?.body ?? "",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
    }
  );
});

// Native push event handler — required for iOS Safari Web Push.
// Apple's WebKit fires the standard 'push' event and does NOT reliably
// trigger Firebase's onBackgroundMessage wrapper, so we must handle it here.
self.addEventListener("push", function (event) {
  // If Firebase already handled this (Android/Chrome), skip
  if (!event.data) return;

  let title = "CHMS";
  let body = "";

  try {
    const data = event.data.json();
    // FCM wraps the payload under notification or data keys
    title = data.notification?.title ?? data.data?.title ?? "CHMS";
    body = data.notification?.body ?? data.data?.body ?? "";
  } catch (e) {
    // Fallback for plain-text payloads
    body = event.data.text();
  }

  // event.waitUntil is MANDATORY on iOS — Safari requires showNotification
  // to be called synchronously within the push event handler
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
    })
  );
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});