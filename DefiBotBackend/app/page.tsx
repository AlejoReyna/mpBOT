"use client";

import LandingComponent from "@/components/Landing";

export default function Home() {
  // Check if window.TelegramGameProxy is available
  if (typeof window !== "undefined" && window.TelegramGameProxy) {
    // Your logic here
  } else {
    console.warn("TelegramGameProxy is not available.");
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <LandingComponent />
    </div>
  );
}
