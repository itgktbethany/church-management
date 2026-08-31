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

// Firebase's handler — fires on Android/Chrome in the background for data-only payloads
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message (Firebase)",
    payload
  );
  // Do NOT call showNotification here if the payload contains 'notification'
  // because FCM SDK automatically displays it.
});

// Native push event handler — required for iOS Safari Web Push.
// Apple's WebKit requires showNotification to be called synchronously within
// the push event handler. Firebase SDK does not do this reliably.
self.addEventListener("push", function (event) {
  // Only manually handle the push event on Apple devices where FCM's built-in 
  // background display is unreliable. On Android/Windows/Chrome, FCM handles it automatically.
  const isApple = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  if (!isApple) return;

  if (!event.data) return;

  let title = "CHMS";
  let body = "";

  try {
    const data = event.data.json();
    title = data.notification?.title ?? data.data?.title ?? "CHMS";
    body = data.notification?.body ?? data.data?.body ?? "";
  } catch (e) {
    body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/gkt-logo.png",
      badge: "/gkt-logo.png",
    })
  );
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});