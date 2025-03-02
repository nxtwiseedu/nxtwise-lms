// app/courses/[courseId]/layout.tsx
"use client";

import React from "react";
// import { usePathname } from "next/navigation";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();

  // For the course detail page, we want to use full height and remove padding
  // that might be applied from the courses layout
  return <div className="w-full h-full -mx-4 -my-6 md:-mx-6">{children}</div>;
}
