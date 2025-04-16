"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const UserDetailPage = () => {
  const { id } = useParams() as { id: string }; // Access dynamic route parameter
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check for the token in localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          // Redirect to login if unauthorized
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch user details.");
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/v1/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Get the current token before removal
        const oldToken = localStorage.getItem("token");

        // Remove the token
        localStorage.removeItem("token");

        // Manually dispatch storage event for same-tab updates
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "token",
            oldValue: oldToken,
            newValue: null,
            storageArea: localStorage,
          })
        );

        // Then redirect to login page
        router.push("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">User Details</h1>
      <div className="text-gray-700 space-y-2">
        <p>
          <span className="font-semibold">Name:</span> {user.first_name}{" "}
          {user.last_name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
      </div>
      <div className="mt-6 flex space-x-4">
        <a
          href={`/users/${id}/edit`}
          className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700"
        >
          Edit User
        </a>
        <a
          href="/users"
          className="inline-block px-4 py-2 bg-gray-600 text-white font-medium rounded shadow hover:bg-gray-700"
        >
          Back to Users
        </a>
        <button
          onClick={handleLogout}
          className="inline-block px-4 py-2 bg-red-600 text-white font-medium rounded shadow hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDetailPage;
