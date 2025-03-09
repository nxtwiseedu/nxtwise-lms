"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface VideoPlayerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  isOpen,
  onClose,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (!videoId || !isOpen) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate-video-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate secure video URL");
        }

        const { url } = await response.json();
        setVideoUrl(url);
      } catch (err) {
        setError("Error loading video. Please try again.");
        console.error("Error fetching video URL:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, [videoId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 bg-black overflow-hidden w-[95vw]">
        <DialogTitle className="sr-only">Course Video</DialogTitle>
        <div className="relative w-full h-full">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-1.5"
          >
            <X size={18} />
          </Button>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center h-72 sm:h-[60vh] w-full">
              <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-300 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="flex items-center justify-center h-72 sm:h-[60vh] w-full bg-slate-900 text-white p-4 text-center">
              <div>
                <p className="mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => setError(null)}
                  className="border-white text-white hover:bg-white/20"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Video */}
          {videoUrl && !loading && !error && (
            <div className="aspect-video w-full h-full">
              <iframe
                src={videoUrl}
                className="w-full h-full min-h-[60vh]"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                title="Course video"
              ></iframe>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
