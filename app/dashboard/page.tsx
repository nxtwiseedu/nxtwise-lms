"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // Import motion for animations
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function DashboardPage() {
  const router = useRouter(); // Initialize router for navigation

  const handleStartLearning = () => {
    router.push("/courses"); // Navigate to the courses page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-start justify-center text-left px-8 py-12 md:px-16">
      <div className="max-w-3xl w-full space-y-8">
        {/* Welcome Message */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-gray-900 leading-tight"
        >
          Welcome
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-700"
        >
          We&apos;re thrilled to have you here! Get ready to embark on an
          exciting learning journey. Explore our courses, engage with the
          content, and enjoy the experience.
        </motion.p>

        {/* Dashboard Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-lg mx-auto md:mx-0"
        >
          <Image
            src="/dashboard-image.svg" // Replace with your image path
            alt="Dashboard Logo"
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </motion.div>

        {/* Additional Information */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-600"
        >
          If you have any questions or need assistance, feel free to reach out.
          We&apos;re here to support you every step of the way.
        </motion.p>

        {/* Call to Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={handleStartLearning}
          className="bg-[#004aad] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#003c8a] transition duration-300 shadow-lg"
        >
          Start Learning
        </motion.button>
      </div>
    </div>
  );
}
