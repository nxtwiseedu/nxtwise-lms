import { Clock } from "lucide-react";
import Image from "next/image";

export default function ResumePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <div className="flex flex-col items-center justify-center text-center max-w-md w-full">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Something&apos;s Cooking!
        </h2>

        {/* Cooking Image */}
        <div className="mb-8 relative">
          <Image
            src="/cooking-logo.svg"
            alt="Cooking in progress"
            width={192}
            height={192}
            className="object-contain"
          />
        </div>

        {/* Message */}
        <div className="mb-8">
          <p className="text-lg font-medium mb-3" style={{ color: "#004aad" }}>
            We&apos;re cooking up something special!
          </p>
          <p className="text-gray-600 mb-2">
            Our team is hard at work preparing fresh content for this section.
          </p>
          <p className="text-gray-600">
            Please check back soon to see what we&apos;ve been creating.
          </p>
        </div>

        {/* Timer indicator */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100">
          <Clock className="mr-2" size={18} style={{ color: "#004aad" }} />
          <span className="font-medium" style={{ color: "#004aad" }}>
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
}
