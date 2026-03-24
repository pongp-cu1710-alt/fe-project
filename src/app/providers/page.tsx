"use client";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import ProviderCard from "../../components/ProviderCard";
import { ProviderItem } from "../../interface";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderItem[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers`)
      .then((res) => res.json())
      .then((data) => setProviders(data.data || []));
  }, []);

  const filteredProviders = providers?.filter((provider) =>
    provider.name.toLowerCase().includes(search.toLowerCase()) ||
    provider.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-8 px-4 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Discover Rental Cars
          </h1>
          <p className="text-slate-500 mt-1">
            Find and book your perfect car today.
          </p>
        </div>
        <TextField
          label="Search by name or location"
          variant="outlined"
          size="small"
          className="w-full md:w-80 bg-white"
          InputProps={{ className: "font-sans" }}
          InputLabelProps={{ className: "font-sans" }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {
        filteredProviders? 
        filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <ProviderCard key={provider._id} provider={provider} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-lg text-slate-500 font-medium">
              No rental cars found matching your search.
            </p>
          </div>
        ):
        <div className="col-span-full py-20 text-center">
            <p className="text-lg text-slate-500 font-medium">
              Loading
            </p>
          </div>
        }
      </div>
    </div>
  );
}