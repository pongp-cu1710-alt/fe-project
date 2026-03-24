import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; 

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-400/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl space-y-8 z-10 flex flex-col items-center">
        
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm text-sm font-medium">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Project #7 : Rental Car Booking
          </span>
          <span className="hidden sm:block text-slate-300">|</span>
          <span className="text-slate-900 font-semibold">Group : CvMy</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
          Find and Book <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
            Your Rental Car
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full max-w-md sm:max-w-none">
          {session ? (
            <>
              <Link href="/providers" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200">
                Explore Providers
              </Link>
              <Link href="/bookings" className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-800 border border-slate-200 rounded-full font-medium hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                {session.user.role === 'admin' ? 'All Bookings' : 'My Bookings'}
              </Link>
            </>
          ) : (
            <>
              <Link href="/providers" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200">
                Explore Providers
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-800 border border-slate-200 rounded-full font-medium hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                Sign In to Book
              </Link>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}