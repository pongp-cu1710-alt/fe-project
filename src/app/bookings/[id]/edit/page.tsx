"use client";
import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TextField, Button, Alert } from "@mui/material";

export default function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  
  const [bookingDate, setBookingDate] = useState("");
  const [username, setUsername] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const shortId = resolvedParams.id.slice(-8).toUpperCase();

  useEffect(() => {
    if (session?.user?.token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings/${resolvedParams.id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            
            if (data.data.bookingDate) {
              const dateObj = new Date(data.data.bookingDate);
              setBookingDate(dateObj.toISOString().split("T")[0]);
            }

            const userField = data.data.user;

            if (typeof userField === "object" && userField !== null) {
              setUsername(userField.name || userField.email || "Unknown User");
            } else {
              setUsername(session?.user?.name || "Unknown User");
            }
          }
        });
    }
  }, [session, resolvedParams.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ bookingDate }),
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Booking updated successfully!");
        setError("");
        setTimeout(() => router.push("/bookings"), 1500);
      } else {
        setError(data.message || "Failed to update booking");
        setSuccess("");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  if (!session) return <div className="mt-10 text-center font-sans text-slate-500">Loading...</div>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans">
      <div className="bg-white p-8 w-full max-w-lg rounded-2xl shadow-sm border border-slate-100">
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Reschedule Booking
        </h1>

        <p className="text-sm text-slate-600 mb-1">
          User:{" "}
          <span className="font-semibold">
            {username || session.user?.name || "Unknown User"}
          </span>
        </p>

        <p className="text-sm text-slate-500 mb-1">
          Booking Ref: <span className="font-mono font-semibold">#{shortId}</span>
        </p>

        <p className="text-slate-600 mb-8">
          Update your pick-up date for this reservation.
        </p>

        {error && <Alert severity="error" className="mb-6 font-sans">{error}</Alert>}
        {success && <Alert severity="success" className="mb-6 font-sans">{success}</Alert>}

        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          <TextField
            label="New Pick-up Date"
            type="date"
            required
            value={bookingDate}
            InputLabelProps={{ shrink: true, className: "font-sans" }}
            InputProps={{ className: "font-sans" }}
            onChange={(e) => setBookingDate(e.target.value)}
          />
          <div className="flex gap-4 mt-2">
            <Button 
              variant="outlined" 
              size="large"
              className="flex-1 font-sans font-bold rounded-xl py-3"
              onClick={() => router.push("/bookings")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disableElevation
              size="large"
              className="flex-1 bg-brand-600 hover:bg-brand-700 font-sans font-bold rounded-xl py-3"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}