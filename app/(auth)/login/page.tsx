"use client";
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
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* Image Section - Hidden on mobile, visible on md and up */}
        <div className="hidden md:flex items-center justify-center relative">
          <Image
            src="/Studying-rafiki.svg"
            alt="Study Illustration"
            width={400}
            height={400}
            priority
            className="w-full max-w-md"
          />
        </div>

        {/* Login Form Section */}
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <Image
                src="/EdzeetaLogo.svg"
                alt="Edzeeta Logo"
                width={300}
                height={80}
                priority
                className="h-16 w-auto"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center text-[#004aad]">
                Welcome to Edzeeta LMS
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Button
                variant="link"
                className="px-0 font-semibold text-[#004aad] hover:text-[#004aad]/90"
              >
                Forgot password?
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full">Sign in</Button>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="px-1 font-semibold text-[#004aad] hover:text-[#004aad]/90"
              >
                Sign up
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
