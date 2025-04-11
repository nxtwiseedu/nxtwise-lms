"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ProjectWithStatus } from "@/app/projects/types/project";
import { Calendar, Clock, ArrowRight, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectWithStatus;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Status configuration
  const statusConfig = {
    notStarted: {
      label: "Not Started",
      color: "bg-slate-100 text-slate-800 border-slate-200",
      icon: Circle,
    },
    inProgress: {
      label: "In Progress",
      color: "bg-amber-50 text-amber-600 border-amber-200",
      icon: Clock,
    },
    submitted: {
      label: "Submitted",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: CheckCircle,
    },
  };

  const StatusIcon = statusConfig[project.status].icon;

  // Format deadline
  const deadline = new Date(project.deadline);
  const formattedDate = deadline.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Determine deadline visual cues based on days remaining
  const deadlineColor =
    project.daysRemaining < 0
      ? "text-red-600"
      : project.daysRemaining <= 3
      ? "text-amber-600"
      : "text-slate-600";

  const deadlineText =
    project.daysRemaining < 0
      ? "Overdue"
      : project.daysRemaining === 0
      ? "Due today"
      : project.daysRemaining === 1
      ? "Due tomorrow"
      : `${project.daysRemaining} days left`;

  return (
    <Card className="transition-all hover:shadow-md border-slate-200 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1",
              statusConfig[project.status].color
            )}
          >
            <StatusIcon size={12} />
            <span>{statusConfig[project.status].label}</span>
          </Badge>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight line-clamp-2">
          {project.title}
        </h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-slate-600 text-sm line-clamp-3 mb-4">
          {project.description}
        </p>

        <div className="flex items-center text-xs mb-2">
          <Calendar size={14} className="mr-1.5 flex-shrink-0" />
          <span className="text-slate-600">Due: {formattedDate}</span>
        </div>

        <div className="flex items-center text-xs">
          <Clock
            size={14}
            className={cn("mr-1.5 flex-shrink-0", deadlineColor)}
          />
          <span className={cn("font-medium", deadlineColor)}>
            {deadlineText}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t border-slate-100">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm font-medium inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors w-full justify-end"
          style={{ color: "#004aad" }}
        >
          View Project
          <ArrowRight size={14} className="ml-1.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
