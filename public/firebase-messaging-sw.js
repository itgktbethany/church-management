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

// Firebase's built-in SDK automatically handles incoming push events 
// and displays the notification if the payload contains a "notification" object.
// Custom handlers (onBackgroundMessage or manual 'push' listeners) will cause
// duplicate notifications to appear.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});