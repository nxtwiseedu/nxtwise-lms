"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Force scroll to top on component mount
    window.scrollTo(0, 0);

    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    // Make sure the main content doesn't overlap with navbar
    const body = document.body;
    body.style.paddingTop = "0";
    body.style.overflow = "auto";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      body.style.paddingTop = "0";
    };
  }, []);

  const handleStartLearning = () => {
    router.push("/courses");
  };

  return (
    <div className="bg-white w-full pt-16 sm:pt-20">
      {/* Background patterns - using absolute instead of fixed */}
      <div
        className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 74, 173, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 74, 173, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-90"
        style={{ zIndex: 0 }}
      />

      {/* Main content container */}
      <div
        className="relative w-full pb-16 px-4 md:px-16 lg:px-24"
        style={{ zIndex: 1 }}
      >
        {/* Welcome section */}
        <div className="w-full max-w-7xl mx-auto">
          {/* Desktop layout - two column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left column content */}
            <div className="flex flex-col">
              <div className="inline-block py-1 px-3 bg-blue-50 rounded-full border border-blue-100 mb-6 self-start">
                <span className="text-blue-600 font-medium text-sm">
                  Learning Dashboard
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Welcome to your{" "}
                <span className="text-blue-600">learning journey</span>
              </h1>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We&apos;re thrilled to have you here! Get ready to embark on an
                exciting learning experience tailored to your needs. Explore our
                premium courses and take your skills to the next level.
              </p>

              {/* Mobile Dashboard image - only visible on small screens */}
              <div className="relative w-full max-w-sm mx-auto mb-8 md:hidden">
                <div className="absolute inset-0 bg-blue-50 rounded-3xl transform rotate-3 opacity-50"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-4">
                  <Image
                    src="/dashboard-image.svg"
                    alt="Dashboard Preview"
                    width={500}
                    height={500}
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>

              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleStartLearning}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg flex items-center justify-center gap-2 group"
                >
                  Start Learning
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>

                <button className="px-8 py-4 rounded-xl text-lg font-semibold text-blue-600 hover:bg-blue-50 transition duration-300 border border-blue-200 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Explore Features
                </button>
              </div>

              {/* User stats */}
              <div className="flex items-center gap-3 mb-8 md:mb-0">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                    JD
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                    SK
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                    AR
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Join 10,000+ learners worldwide
                </p>
              </div>
            </div>

            {/* Right column - Desktop layout image */}
            <div className="hidden md:block relative w-full h-full">
              <div className="absolute inset-0 bg-blue-50 rounded-3xl transform rotate-3 opacity-50"></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-6">
                <Image
                  src="/dashboard-image.svg"
                  alt="Dashboard Preview"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Courses
              </h3>
              <p className="text-gray-600">
                Access our exclusive selection of expert-led courses designed to
                accelerate your learning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalized Path
              </h3>
              <p className="text-gray-600">
                Your learning journey is tailored to your pace, preferences, and
                professional goals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community Support
              </h3>
              <p className="text-gray-600">
                Connect with peers and mentors for guidance, collaboration, and
                networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
