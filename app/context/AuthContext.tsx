"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  checkAuthStatus: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");

    fetch("/api/v1/protected", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((response) => {
        setIsLoggedIn(response.ok);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("/api/v1/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key: string, value: string) {
      const event = new StorageEvent("storage", {
        key: key,
        newValue: value,
        oldValue: localStorage.getItem(key),
        storageArea: localStorage,
      });
      originalSetItem.apply(this, [key, value]);
      window.dispatchEvent(event);
    };

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
