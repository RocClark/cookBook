"use client";

import { useAuth } from "../../context/AuthContext";

export default function AuthHeader() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <div>
        Login Status:{" "}
        <span className="font-bold">{isLoggedIn ? "yes" : "no"}</span>
      </div>
      {isLoggedIn && (
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </header>
  );
}
