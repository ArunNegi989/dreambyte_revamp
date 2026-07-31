import type { ReactNode } from "react";
import AdminShell from "@/app/components/admin/AdminShell";

export const metadata = {
  title: "Admin Panel | Dream Byte Solutions",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}