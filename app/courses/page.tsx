"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Clock, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCourses } from "./course-context";
import Image from "next/image";

export default function CoursesPage() {
  const { enrolledCourses, availableCourses, loading } = useCourses();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter courses based on search query
  const filteredEnrolled = enrolledCourses.filter(
    (course) =>
      course.mainTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailable = availableCourses.filter(
    (course) =>
      course.mainTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      },
    },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 5px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  // Progress color based on percentage
  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-[#004aad]/60";
    if (progress < 50) return "bg-[#004aad]/70";
    if (progress < 75) return "bg-[#004aad]/85";
    return "bg-[#004aad]";
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-10 h-10 border-4 border-t-[#004aad] border-r-[#004aad] border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Search with subtle animation */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          className="pl-10 bg-white shadow-sm border-gray-200 focus:border-[#004aad] focus:ring-[#004aad]/10"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* My Courses Section */}
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
        >
          My Courses
          {filteredEnrolled.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-[#004aad]/10 text-[#004aad] hover:bg-[#004aad]/15"
            >
              {filteredEnrolled.length}
            </Badge>
          )}
        </motion.h2>

        {filteredEnrolled.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredEnrolled.map((course, index) => (
              <motion.div
                key={course.id}
                variants={cardVariants}
                whileHover="hover"
              >
                <Link href={`/courses/${course.id}`} className="block h-full">
                  <Card className="h-full overflow-hidden border-gray-200 bg-white/50 backdrop-blur-sm transition-all flex flex-col">
                    <div className="relative">
                      {/* Thumbnail and progress elements remain the same */}
                      <div className="h-36 bg-gradient-to-r from-gray-200 to-gray-100 overflow-hidden relative">
                        <div className="absolute inset-0">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={`${course.mainTitle} thumbnail`}
                              fill
                              quality={85}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <BookOpen size={48} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Progress overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-300/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{
                              duration: 0.8,
                              delay: 0.2 + index * 0.1,
                              ease: "easeOut",
                            }}
                            className={cn(
                              "h-full",
                              getProgressColor(course.progress || 0)
                            )}
                          />
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div className="absolute top-3 right-3">
                        {/* Progress circle code remains the same */}
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-lg line-clamp-1">
                          {course.mainTitle}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">
                          {course.description || ""}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pb-2 flex-grow">
                        <div className="flex items-center justify-between text-xs text-gray-500 space-x-2">
                          <div className="flex items-center">
                            <BookOpen
                              size={14}
                              className="mr-1 text-[#004aad]/70"
                            />
                            <span>{course.moduleCount} modules</span>
                          </div>
                          <div className="flex items-center">
                            <Clock
                              size={14}
                              className="mr-1 text-[#004aad]/70"
                            />
                            <span>{course.totalSections} lessons</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-2 mt-auto">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                          className="w-full"
                        >
                          <Button
                            variant="default"
                            className="w-full bg-[#004aad] hover:bg-[#003b8a] text-white font-medium"
                          >
                            <span>Continue Learning</span>
                            <ChevronRight
                              size={16}
                              className="ml-1 transition-transform group-hover:translate-x-0.5"
                            />
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-50 rounded-lg p-6 text-center"
          >
            <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
              <BookOpen size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              You haven&apos;t enrolled in any courses yet.
            </p>
            <p className="text-gray-500 text-sm">
              Browse available courses below to get started.
            </p>
          </motion.div>
        )}
      </div>

      {/* Available Courses Section */}
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
        >
          Available Courses
          {filteredAvailable.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {filteredAvailable.length}
            </Badge>
          )}
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredAvailable.map((course) => (
            <motion.div
              key={course.id}
              variants={cardVariants}
              whileHover="hover"
            >
              <Card className="h-full overflow-hidden border-gray-200 bg-white/50 backdrop-blur-sm transition-all">
                <div className="h-36 bg-gradient-to-r from-gray-200 to-gray-100 overflow-hidden relative">
                  <div className="absolute inset-0">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={`${course.mainTitle} thumbnail`}
                        fill
                        quality={85}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-lg line-clamp-1">
                    {course.mainTitle}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm text-gray-500">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 space-x-2">
                    <div className="flex items-center">
                      <BookOpen size={14} className="mr-1 text-gray-400" />
                      <span>{course.moduleCount} modules</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      <span>{course.totalSections} lessons</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-[#004aad] text-[#004aad] hover:bg-[#004aad]/5 font-medium"
                      onClick={() => {
                        // Enrollment logic would go here
                        console.log(`Enrolling in course: ${course.id}`);
                        // You can add any future enrollment logic here
                      }}
                    >
                      <span>Enroll Now</span>
                      <ChevronRight
                        size={16}
                        className="ml-1 transition-transform group-hover:translate-x-0.5"
                      />
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
