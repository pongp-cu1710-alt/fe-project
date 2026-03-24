"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import BookingCard from "../../components/BookingCard";
import { BookingItem } from "../../interface";

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "name_asc" | "name_desc">("date_desc");

  const fetchBookings = async () => {
    if (!session?.user?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      const data = await res.json();
      setBookings(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchBookings();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.user?.token}` },
    });
    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b._id !== id));
    }
  };

  const isAdmin = session?.user?.role === "admin";

  const processedBookings = useMemo(() => {
    let filtered = bookings.filter((b: any) => {
      const name = b?.user?.name || b?.user?.email || "";
      const ref = b?._id || "";
      const keyword = search.toLowerCase();
      return (
        name.toLowerCase().includes(keyword) ||
        ref.toLowerCase().includes(keyword)
      );
    });

    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.bookingDate || a.createdAt).getTime();
      const dateB = new Date(b.bookingDate || b.createdAt).getTime();
      const nameA = (a?.user?.name || "").toLowerCase();
      const nameB = (b?.user?.name || "").toLowerCase();

      switch (sortBy) {
        case "date_asc":
          return dateA - dateB;
        case "date_desc":
          return dateB - dateA;
        case "name_asc":
          return nameA.localeCompare(nameB);
        case "name_desc":
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookings, search, sortBy]);

  if (!session) return null;

  return (
    <div className="mt-8 px-4 max-w-4xl mx-auto font-sans">
      <div className="flex flex-col gap-4 mb-8 border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">
            {isAdmin ? "Dashboard (All Bookings)" : "My Reservations"}
          </h1>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full border border-brand-200">
              {processedBookings.length} Bookings
            </span>

            <button
              onClick={fetchBookings}
              className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl text-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-xl text-sm"
          >
            <option value="date_desc">Newest</option>
            <option value="date_asc">Oldest</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading bookings...</div>
      ) : processedBookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-lg text-slate-500">No bookings found.</p>
          {!isAdmin && (
            <Link href="/providers">
              <button className="mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-xl">
                Explore Cars
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {processedBookings.map((booking: any) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}