"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  FileText,
  Briefcase,
  Clipboard,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define types for navigation items
type NavItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

// Define navigation items
const navItems: NavItem[] = [
  { icon: <Home size={20} />, label: "Home", href: "/" },
  { icon: <BookOpen size={20} />, label: "Courses", href: "/courses" },
  { icon: <FileText size={20} />, label: "Resume", href: "/resume" },
  { icon: <Briefcase size={20} />, label: "Jobs", href: "/jobs" },
  { icon: <Clipboard size={20} />, label: "Projects", href: "/projects" },
];

interface NavBarProps {
  children: React.ReactNode;
}

const NavBar = ({ children }: NavBarProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Header (new) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 shadow-sm md:hidden z-20">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <Image
              src="/EdzeetaLogo.svg"
              alt="Edzeeta Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <Avatar className="h-9 w-9 border-2 border-[#004aad]/20">
            <AvatarImage src="https://i.pravatar.cc/300" alt="User" />
            <AvatarFallback className="bg-[#004aad]/10 text-[#004aad]">
              US
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Mobile Footer Navigation */}
      <motion.nav
        className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] md:hidden z-10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-between items-center px-6 py-2">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </div>
      </motion.nav>

      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:block fixed inset-y-0 left-0 w-[280px] border-r border-gray-100 bg-white z-40 shadow-[4px_0_10px_rgba(0,0,0,0.02)]"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Logo */}
          <div className="h-16 border-b border-gray-100 flex items-center px-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/EdzeetaLogo.svg"
                alt="Edzeeta Logo"
                width={130}
                height={36}
                className="h-9 w-auto"
              />
            </div>
          </div>

          {/* Scrollable Sidebar Content */}
          <ScrollArea className="flex-1 py-6">
            <div className="px-3 space-y-6">
              {/* Main Navigation Section */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-3">
                  Main Navigation
                </h3>
                <nav className="space-y-1">
                  {navItems.map((item, index) => (
                    <SidebarItem
                      key={item.href}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      active={pathname === item.href}
                      index={index}
                    />
                  ))}
                </nav>
              </div>

              {/* Learning Progress Section (example) */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-3">
                  Your Progress
                </h3>
                <div className="bg-gradient-to-br from-[#004aad]/10 to-[#0063e6]/5 rounded-xl p-4 mx-3">
                  <h4 className="font-medium text-gray-800 mb-2">
                    React Fundamentals
                  </h4>
                  <div className="w-full bg-white/70 rounded-full h-2 mb-2">
                    <div
                      className="bg-[#004aad] h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>65% Complete</span>
                    <span>6/11 Modules</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full bg-white/80 hover:bg-white border-gray-200 text-[#004aad]"
                  >
                    Resume Course
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* User Profile Section at Bottom */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border-2 border-[#004aad]/10">
                <AvatarImage src="https://i.pravatar.cc/300" alt="User" />
                <AvatarFallback className="bg-[#004aad]/10 text-[#004aad]">
                  US
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Alex Johnson
                </p>
                <p className="text-xs text-gray-500">alex@example.com</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <ChevronRight size={16} className="text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile header spacer */}
      <div className="h-16 md:hidden"></div>

      {/* Content wrapper with appropriate positioning but no extra padding/margins */}
      <main className="md:ml-[280px] min-h-screen pb-20 md:pb-0">
        {children}
      </main>
    </>
  );
};

// Mobile Navigation Item Component
interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}

const MobileNavItem = ({ icon, label, href, active }: MobileNavItemProps) => {
  return (
    <Link href={href} className="block">
      <div
        className={cn(
          "flex flex-col items-center justify-center py-1",
          active ? "text-[#004aad]" : "text-gray-500"
        )}
      >
        <div
          className={cn(
            "relative p-1.5 rounded-full",
            active ? "bg-[#004aad]/10" : "hover:bg-gray-100"
          )}
        >
          {active && (
            <motion.div
              layoutId="mobileActiveBackground"
              className="absolute inset-0 bg-[#004aad]/10 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <div className="relative z-10">{icon}</div>
        </div>
        <span className="text-xs mt-1 font-medium">{label}</span>
      </div>
    </Link>
  );
};

// Sidebar Item Component
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  index: number;
}

const SidebarItem = ({
  icon,
  label,
  href,
  active,
  index,
}: SidebarItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.2 }}
    >
      <Link
        href={href}
        className={cn(
          "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          active ? "text-[#004aad]" : "text-gray-700 hover:bg-gray-50"
        )}
      >
        {active && (
          <motion.div
            layoutId="sidebarActiveBackground"
            className="absolute inset-0 bg-gradient-to-r from-[#004aad]/10 to-[#004aad]/5 rounded-lg"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <div
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-lg z-10 transition-colors",
            active ? "bg-[#004aad]/15" : "bg-gray-100 group-hover:bg-gray-200"
          )}
        >
          <div className={active ? "text-[#004aad]" : "text-gray-500"}>
            {icon}
          </div>
        </div>
        <span className="ml-3 font-medium z-10">{label}</span>
        {active && (
          <div className="ml-auto">
            <div className="h-1.5 w-1.5 rounded-full bg-[#004aad]"></div>
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default NavBar;
