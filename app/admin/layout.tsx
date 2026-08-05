"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AdminShell from "@/app/components/admin/AdminShell";

const PUBLIC_PATHS = ["/admin/login", "/admin/register"];

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (isPublicPath) {
    return <>{children}</>;
  }

  return <ProtectedShell>{children}</ProtectedShell>;
}

function ProtectedShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "#999",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!user) return null;

  return <AdminShell>{children}</AdminShell>;
}