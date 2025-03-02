// app/courses/layout.tsx
"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Course Header - No extra padding/margins */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-4 md:px-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-sm text-gray-500">
              Expand your skills with our learning content
            </p>
          </div>
          <Separator className="mt-4" />

          {/* Course Navigation Breadcrumbs */}
          <div className="flex items-center gap-2 mt-4 text-sm"></div>
        </div>
      </div>

      {/* Course Content Area - Direct rendering with minimal padding */}
      <div className="px-4 py-4 md:px-6">{children}</div>
    </>
  );
}
