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

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message",
    payload
  );

  self.registration.showNotification(
    payload.notification?.title ?? "CHMS",
    {
      body: payload.notification?.body ?? "",
    }
  );
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});