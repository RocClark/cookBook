"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // To decode JWT

const EditUserPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return null;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        // Redirect if the logged-in user ID doesn't match the route ID
        if (decodedToken.userId !== parseInt(id, 10)) {
          router.push("/users");
          return null;
        }
        return token;
      } catch (err) {
        router.push("/login");
        return null;
      }
    };

    const fetchUser = async () => {
      const token = checkAuth();
      if (!token) return;

      try {
        const response = await fetch(`/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        setUser(data.data);
        setFirstName(data.data.first_name);
        setLastName(data.data.last_name);
        setEmail(data.data.email);
      } catch (error) {
        setUser(null);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ first_name, last_name, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      router.push("/users");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update password");
      }

      // Clear password fields and show success message
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      // Set a temporary success message specifically for password
      setPasswordError("Password updated successfully!");
      setTimeout(() => setPasswordError(null), 3000); // Clear after 3 seconds
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to update password"
      );
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-red-500">User not found.</p>
        <Link href="/users/create" className="text-blue-600 hover:underline">
          Go to Create User
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit User</h1>
      <nav className="mb-6 flex justify-center space-x-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <Link href="/users" className="text-blue-600 hover:underline">
          Users
        </Link>
      </nav>
      {success && (
        <p className="mb-4 text-center text-green-500">
          User updated successfully!
        </p>
      )}
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update User
          </button>
          <Link
            href={`/users/${id}`}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Go to User
          </Link>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => setIsModalOpen(true)}
          >
            Delete
          </button>
        </div>
      </form>

      {/* Password Change Form */}
      <div className="mt-8 pt-8 border-t border-gray-300">
        <h2 className="text-xl font-bold mb-6 text-center">Change Password</h2>
        {passwordError && (
          <p className="mb-4 text-center text-red-500">{passwordError}</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newPassword !== confirmPassword) {
              setPasswordError("Passwords do not match");
              return;
            }
            if (newPassword.length < 6) {
              setPasswordError("Password must be at least 6 characters long");
              return;
            }
            handlePasswordUpdate();
          }}
        >
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              minLength={6}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              minLength={6}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserPage;
