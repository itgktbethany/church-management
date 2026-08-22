import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // Skip the "waiting" phase so a newly deployed SW activates immediately
  // instead of waiting for all browser tabs to close.
  // clientsClaim makes the new SW take over all open tabs right away.
  // Both together enable true background auto-update on Android and iOS.
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    importScripts: ['/firebase-messaging-sw.js'],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default process.env.NODE_ENV === "development" ? nextConfig : withPWA(nextConfig);
