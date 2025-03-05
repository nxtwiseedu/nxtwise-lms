// contexts/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Separate effect for navigation after auth state is determined
  useEffect(() => {
    if (loading) return; // Don't redirect while still loading

    // Skip redirect for root path - let the server-side redirect handle it
    if (pathname === "/") return;

    // Get token from localStorage
    let token;
    try {
      token = localStorage.getItem("auth-token");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Handle case where localStorage is not available
      token = null;
    }

    const isAuthRoute = pathname === "/login" || pathname === "/signup";
    const isAuthenticated = user !== null || token !== null;

    // Only redirect if not already on the correct route
    if (!isAuthenticated && !isAuthRoute) {
      router.push("/login");
    } else if (isAuthenticated && isAuthRoute) {
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 rounded-full border-2 border-[#004aad] border-t-transparent animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
