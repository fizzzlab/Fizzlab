import type { ReactNode } from "react";

import { AdminShell } from "@/modules/admin/admin-shell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}