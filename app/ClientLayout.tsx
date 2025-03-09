// We need to create a client component to use the usePathname hook
"use client";

import NavBar from "@/components/dashboard/nav-bar";
import { usePathname } from "next/navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // If it's the login page, don't wrap with NavBar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Otherwise, include the NavBar
  return <NavBar>{children}</NavBar>;
}
