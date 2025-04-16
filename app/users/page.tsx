"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleFilterChange =
    (field: keyof typeof filters) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  const router = useRouter();

  const fetchUsers = async (page: number, isLoadMore: boolean = false) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const searchParams = new URLSearchParams();
      searchParams.append("page", page.toString());
      if (searchTerm) searchParams.append("search", searchTerm);
      if (filters.firstName)
        searchParams.append("firstName", filters.firstName);
      if (filters.lastName) searchParams.append("lastName", filters.lastName);
      if (filters.email) searchParams.append("email", filters.email);

      const response = await fetch(`/api/v1/users?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (data && Array.isArray(data.data)) {
        setUsers((prev) => (isLoadMore ? [...prev, ...data.data] : data.data));
        setHasMore(data.pagination.hasMore);
        setCurrentPage(data.pagination.page);
      } else {
        setError(
          "Expected an array of users, but got: " + JSON.stringify(data)
        );
      }
    } catch (error) {
      setError(
        "Error fetching users: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    await fetchUsers(currentPage + 1, true);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Users</h1>
      <nav className="flex justify-between mb-6">
        <Link
          href="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Home
        </Link>
        <Link
          href="/users/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create User
        </Link>
      </nav>

      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsSearching(true);
                setCurrentPage(1);
                fetchUsers(1);
              }
            }}
          />
          <button
            onClick={() => {
              setIsSearching(true);
              setCurrentPage(1);
              fetchUsers(1);
            }}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Additional Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                value={filters.firstName}
                onChange={handleFilterChange("firstName")}
                placeholder="Filter by First Name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={filters.lastName}
                onChange={handleFilterChange("lastName")}
                placeholder="Filter by Last Name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={filters.email}
                onChange={handleFilterChange("email")}
                placeholder="Filter by Email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <li
              key={user.id}
              className="p-4 bg-white rounded shadow hover:shadow-lg transition"
            >
              <Link
                href={`/users/${user.id}`}
                className="text-blue-600 hover:underline"
              >
                {user.email} - {user.first_name} {user.last_name}
              </Link>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-700">No users found</li>
        )}
      </ul>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
