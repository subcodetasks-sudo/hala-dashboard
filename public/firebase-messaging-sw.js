/* global self */
// Firebase Messaging Service Worker
// Handles background push notifications

import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "AIzaSyAFsOu-MlO2a9cmsQUS6li9PSMZnIcvLLs",
  authDomain: "base-3c8d1.firebaseapp.com",
  projectId: "base-3c8d1",
  storageBucket: "base-3c8d1.firebasestorage.app",
  messagingSenderId: "688944977102",
  appId: "1:688944977102:web:d8fc2e39ac88f4eee5ec9f",
  measurementId: "G-6XZ6MTCSV2",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

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
