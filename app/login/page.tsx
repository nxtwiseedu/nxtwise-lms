// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { toast } from "sonner"; // Import toast from sonner
import { useAuth } from "@/contexts/auth-context";
import { LoginForm } from "@/components/auth/LoginForm";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loading: authLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (authLoading) return null;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      if (userCredential.user) {
        const token = await userCredential.user.getIdToken();
        localStorage.setItem("auth-token", token);

        toast.success("Success!", {
          // Use sonner toast for success
          description: "You have successfully logged in.",
        });

        router.push("/dashboard");
      }
    } catch (error: unknown) {
      toast.error("Error", {
        // Use sonner toast for error
        description:
          error instanceof Error
            ? error.message
            : "Failed to login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return <LoginForm form={form} isLoading={isLoading} onSubmit={onSubmit} />;
}
