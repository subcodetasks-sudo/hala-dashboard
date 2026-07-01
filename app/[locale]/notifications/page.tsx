"use client";

import { useFcm } from "@/features/notifications/hooks/use-fcm";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { useEffect, useState } from "react";
import { onForegroundMessage } from "@/features/notifications/services/firebase-client";
import { Button } from "@/components/ui/button";

export default function NotificationsTestPage() {
  // VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
  const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

  const { token, notificationPermission, requestPermission, isLoading } =
    useFcm(VAPID_KEY);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      console.log("Foreground message received in Test Page:", payload);
      setUnreadCount((prev) => prev + 1);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8 bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Firebase Notification Test
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Use this page to verify your Firebase configuration and test device
          token generation.
        </p>
      </div>

      <div className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Preview Component:
        </span>
        <NotificationBell unreadCount={unreadCount} />
      </div>

      <div className="w-full max-w-2xl grid gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Status Checklist
          </h2>

          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <span>Permission Status</span>
              <span
                className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  notificationPermission === "granted"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {notificationPermission}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
              <span className="shrink-0 mr-4">FCM Token</span>
              <code className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[300px]">
                {token || "Not generated yet"}
              </code>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={requestPermission}
              disabled={isLoading || notificationPermission === "granted"}
              className="flex-1"
            >
              {isLoading ? "Requesting..." : "Enable Notifications"}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                if (token) {
                  navigator.clipboard.writeText(token);
                  alert("Token copied to clipboard!");
                }
              }}
              disabled={!token}
            >
              Copy Token
            </Button>
          </div>
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <h3 className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
            How to test:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-400">
            <li>Ensure `.env` contains your Firebase credentials.</li>
            <li>Enable as an authorized domain in Firebase Console.</li>
            <li>
              Click <strong>Enable Notifications</strong> and allow the browser
              prompt.
            </li>
            <li>
              Copy the <strong>FCM Token</strong>.
            </li>
            <li>
              Go to{" "}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                className="underline font-bold"
              >
                Firebase Console
              </a>{" "}
              {">"} Messaging.
            </li>
            <li>Create a new campaign {">"} Notifications.</li>
            <li>
              In paste your token and click <strong>Test</strong>.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
