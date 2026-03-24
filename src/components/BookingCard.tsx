"use client";
import Link from "next/link";
import { Button } from "@mui/material";
import { BookingItem } from "../interface";

interface BookingCardProps {
  booking: BookingItem;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export default function BookingCard({ booking, isAdmin, onDelete }: BookingCardProps) {
  const dateString = booking.bookingDate || booking.date || booking.createdAt || "";
  const formattedDate = dateString
    ? new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Unknown Date";

  const shortId = booking._id.slice(-8).toUpperCase();
  const username =
    (booking as any)?.user?.name ||
    (booking as any)?.user?.email ||
    "Unknown User";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-shadow p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {booking.provider?.name || "Unknown Provider"}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          User: <span className="font-medium text-slate-800">{username}</span>
        </p>

        <p className="text-sm text-slate-500 mt-1">
          📅 Pick-up Date:{" "}
          <span className="font-medium text-slate-800">{formattedDate}</span>
        </p>

        <p className="text-xs text-slate-400 mt-2">
          Ref: <span className="font-mono font-semibold">#{shortId}</span>
        </p>
      </div>

      <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
        <Link href={`/bookings/${booking._id}/edit`} className="flex-1 sm:flex-none">
          <Button
            variant="outlined"
            className="w-full border-brand-600 text-brand-600 rounded-xl font-semibold py-2"
          >
            Reschedule
          </Button>
        </Link>

        <Button 
          variant="contained" 
          color="error"
          disableElevation
          className="flex-1 sm:flex-none rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-sans font-bold shadow-none py-2"
          onClick={() => onDelete(booking._id)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
