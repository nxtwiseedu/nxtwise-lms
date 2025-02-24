"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface LoginFormProps {
  form: UseFormReturn<{
    email: string;
    password: string;
  }>;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm({ form, isLoading, onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 relative">
        {/* Left Section with Illustration - Hidden on mobile */}
        <div className="hidden md:flex flex-col items-center justify-center relative p-8">
          <div className="relative w-full max-w-lg">
            {/* Decorative elements */}
            <div className="absolute -top-12 -left-12 w-72 h-72 bg-[#004aad]/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-[#004aad]/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <Image
              src="/Login-rafiki.svg"
              alt="Study Illustration"
              width={500}
              height={500}
              priority
              className="w-full relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Login Form Section */}
        <Card className="w-full shadow-xl backdrop-blur-sm bg-white/95 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-[#004aad]/5"></div>

          <CardHeader className="space-y-8 relative">
            <div className="flex justify-center transform -translate-y-4">
              <Image
                src="/EdzeetaLogo.svg"
                alt="Edzeeta Logo"
                width={300}
                height={80}
                priority
                className="h-20 w-auto drop-shadow-md"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-center text-[#004aad]">
                Welcome to Edzeeta LMS
              </CardTitle>
              <CardDescription className="text-center text-base">
                Enter your credentials to access your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 relative">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div
                          className={`relative group transition-all duration-300 ${
                            focusedField === "email" ? "scale-[1.02]" : ""
                          }`}
                        >
                          <Input
                            placeholder="Enter your email"
                            {...field}
                            type="email"
                            disabled={isLoading}
                            className="pl-10 pr-4 py-6 bg-white/80 border-blue-100 focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all duration-300"
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#004aad] transition-colors duration-300" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div
                          className={`relative group transition-all duration-300 ${
                            focusedField === "password" ? "scale-[1.02]" : ""
                          }`}
                        >
                          <Input
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            disabled={isLoading}
                            className="pl-10 pr-12 py-6 bg-white/80 border-blue-100 focus:border-[#004aad] focus:ring-2 focus:ring-[#004aad]/20 transition-all duration-300"
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#004aad] transition-colors duration-300" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004aad] transition-colors duration-300"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Button variant="link" className="px-0 font-medium">
                    Forgot password?
                  </Button>
                </div>

                <CardFooter className="flex flex-col space-y-4 relative">
                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                  {/* <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Button variant="link" className="px-1 font-medium">
                      Sign up
                    </Button>
                  </p> */}
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
