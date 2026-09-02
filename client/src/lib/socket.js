import { io } from "socket.io-client";

let socket = null;

export function getUserId() {
  if (typeof window === "undefined") return "user-ssr";
  let id = localStorage.getItem("snaptix_user_id");
  if (!id) {
    // Generate readable random user ID: e.g. User-7X49
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    id = `User-${randomSuffix}`;
    localStorage.setItem("snaptix_user_id", id);
  }
  return id;
}

export function getUserColor(userId) {
  const colors = [
    "#38BDF8", // sky
    "#A855F7", // purple
    "#EC4899", // pink
    "#F59E0B", // amber
    "#10B981", // emerald
    "#6366F1", // indigo
    "#14B8A6", // teal
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function getSocket() {
  if (socket) return socket;

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

  socket = io(serverUrl, {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  return socket;
}
