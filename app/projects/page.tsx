"use client";

import React, { useState, useEffect } from "react";
import { ProjectCategoryWithProjects } from "./types/project";
import ProjectCard from "@/components/projects/project-card";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

// Import Firebase service
import { getUserProjectsByCategory } from "./services/project-service";

export default function ProjectsPage() {
  const [projectCategories, setProjectCategories] = useState<
    ProjectCategoryWithProjects[]
  >([]);
  const [allProjectCategories, setAllProjectCategories] = useState<
    ProjectCategoryWithProjects[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Load projects from Firebase on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Fetch projects from Firebase
        const categories = await getUserProjectsByCategory();

        setAllProjectCategories(categories);
        setProjectCategories(categories);

        // Expand all categories by default
        const newExpandedSet = new Set<string>();
        categories.forEach((category) => newExpandedSet.add(category.id));
        setExpandedCategories(newExpandedSet);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Apply search filter when search query changes
  useEffect(() => {
    if (loading || !allProjectCategories.length) return;

    try {
      if (!searchQuery.trim()) {
        // If search is empty, show all projects
        setProjectCategories(allProjectCategories);
        return;
      }

      // Apply search filter
      const query = searchQuery.toLowerCase();
      const filteredCategories = allProjectCategories
        .map((category) => {
          const filteredProjects = category.projects.filter(
            (project) =>
              project.title.toLowerCase().includes(query) ||
              project.description.toLowerCase().includes(query)
          );

          return {
            ...category,
            projects: filteredProjects,
          };
        })
        .filter((category) => category.projects.length > 0);

      setProjectCategories(filteredCategories);
    } catch (err) {
      console.error("Error applying filters:", err);
    }
  }, [searchQuery, allProjectCategories, loading]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(categoryId)) {
      newExpandedCategories.delete(categoryId);
    } else {
      newExpandedCategories.add(categoryId);
    }
    setExpandedCategories(newExpandedCategories);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-300 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"
            style={{ borderTopColor: "#004aad" }}
          ></div>
          <p className="mt-4 text-slate-700 font-medium">
            Loading your projects...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-8">{error}</p>
          <Button
            className="hover:opacity-90 transition-all w-full"
            style={{ backgroundColor: "#004aad" }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state - No projects at all
  if (!loading && projectCategories.length === 0 && !searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            No projects assigned yet
          </h2>
          <p className="text-slate-600 mb-6">
            You don&apos;t have any projects assigned to you at the moment.
            Check back later or contact your instructor.
          </p>
        </div>
      </div>
    );
  }

  // Empty state - Projects exist but none match search
  if (!loading && projectCategories.length === 0 && searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
        </div>

        {/* Search control */}
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-slate-200"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={28} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            No projects found
          </h2>
          <p className="text-slate-600 mb-6">
            No projects match your search. Try adjusting your search criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            className="border-slate-200"
          >
            Clear Search
          </Button>
        </div>
      </div>
    );
  }

  // Project list view with categories
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
      </div>

      {/* Search control */}
      <div className="mb-8">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200"
          />
        </div>
      </div>

      {/* Projects by Category */}
      <div className="space-y-8">
        {projectCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden"
          >
            <Collapsible
              open={expandedCategories.has(category.id)}
              onOpenChange={() => {}}
            >
              <CollapsibleTrigger asChild>
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    {category.imageUrl && (
                      <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                        <div
                          className="w-full h-full flex items-center justify-center bg-indigo-50"
                          style={{ backgroundColor: "#e6f0ff" }}
                        >
                          <span
                            className="text-xs font-medium"
                            style={{ color: "#004aad" }}
                          >
                            {category.title.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold text-lg text-slate-800">
                        {category.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {category.projects.length}{" "}
                        {category.projects.length === 1
                          ? "project"
                          : "projects"}
                      </p>
                    </div>
                  </div>
                  <div>
                    {expandedCategories.has(category.id) ? (
                      <ChevronUp size={20} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-slate-100 p-4">
                  <div className="text-sm text-slate-500 mb-4">
                    {category.description}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    </div>
  );
}
