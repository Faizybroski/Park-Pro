"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem("parkpro_admin");
    setIsAdmin(!!admin);
  }, []);

  if (isAdmin === null) {
    return null; // or loader
  }

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={`flex-1 ${!isAdmin ? "pt-16" : ""}`}>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
