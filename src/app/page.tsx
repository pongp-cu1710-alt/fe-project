import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; 

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
          Find and Book <br />
          <span className="text-blue-600">Your Perfect Rental Car</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600">
          Fast, easy, and secure rental car bookings from top providers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {session ? (
            <>
              <Link href="/providers" className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                Explore Providers
              </Link>
              <Link href="/bookings" className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-xl font-medium hover:bg-blue-50 transition shadow-sm">
                {session.user.role==='admin'?'All Bookings':'My Bookings'}
              </Link>
            </>
          ) : (
            <>
              <Link href="/providers" className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                Browse Cars
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition shadow-sm">
                Sign In to Book
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}