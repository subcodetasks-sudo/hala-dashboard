// Service worker template for handling background notifications
// Copy this file to your app's public/ folder as firebase-messaging-sw.js
// and replace the placeholder values with your actual Firebase config.

/* global self */
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "FIREBASE_AUTH_DOMAIN",
  projectId: "FIREBASE_PROJECT_ID",
  storageBucket: "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
  appId: "FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle messaging in the background
onBackgroundMessage(messaging, (payload) => {
  console.log("[Service Worker] Received background message:", payload);

  const notificationTitle =
    payload.data?.title || payload.notification?.title || "New Message";
  const notificationOptions = {
    body:
      payload.data?.body ||
      payload.notification?.body ||
      "Check your notifications.",
    icon: payload.data?.icon || "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
