"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Project } from "@/app/projects/types/project";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="transition-all hover:shadow-md border-slate-200 h-full flex flex-col">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight line-clamp-2">
          {project.title}
        </h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-slate-600 text-sm line-clamp-3 mb-4">
          {project.description}
        </p>
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
