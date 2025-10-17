
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import {
  Search,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Building,
  Sun,
  Moon,
  HelpCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useContext, useEffect, useState } from 'react';
import { PreloaderContext } from '@/context/preloader-context';
import { NotificationsMenu } from './notifications-menu';
import type { NavItem } from '@/lib/nav-data';
import { CommandMenu } from './command-menu';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePlan } from "@/context/plan-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type School, schoolsData } from "@/lib/super-admin-data";
import { PreloaderLink } from "../ui/preloader-link";
import { MobileSidebar } from "./mobile-sidebar";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Logo } from "../logo";
import { useSidebar } from "../ui/sidebar";
import { LogoIcon } from "../logo-icon";
import { useTheme } from "next-themes";
import { HelpDrawer } from "./help-drawer";

type AppTopbarProps = {
    userRole: 'super-admin' | 'admin' | 'teacher' | 'parent' | 'student';
    navItems: NavItem[];
    userDetails: {
        name: string;
        role: string;
        avatar: string;
        fallback: string;
    };
    searchPlaceholders: string[];
}

export function AppTopbar({ userRole, navItems, userDetails, searchPlaceholders }: AppTopbarProps) {
  const { showPreloader, isPreloaderEnabled, setIsPreloaderEnabled } = useContext(PreloaderContext);
  const [openCommandMenu, setOpenCommandMenu] = useState(false);
  const { setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const [placeholder, setPlaceholder] = useState("Search...");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { plan } = usePlan();
  const [schools] = useLocalStorage<School[]>('schools', schoolsData);
  const schoolName = schools[0]?.name || "Your School";

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    showPreloader('/login');
  }

  const handleAiCommand = (prompt: string) => {
    // This functionality is currently disabled.
  }

  useEffect(() => {
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const delay = 2000;

    const handleTyping = () => {
      const currentPlaceholder = searchPlaceholders[placeholderIndex];
      if (!isDeleting) {
        if (charIndex < currentPlaceholder.length) {
          setPlaceholder(currentPlaceholder.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (charIndex > 0) {
          setPlaceholder(currentPlaceholder.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, placeholderIndex, searchPlaceholders]);


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenCommandMenu((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [openCommandMenu])


  return (
    <>
    <header className="bg-background h-16 xl:h-20 py-3 xl:py-0">
      <div className="px-4 lg:px-6 xl:px-8 h-full">
        <div className="flex items-center gap-2 h-full">
            <div className="xl:hidden">
                <Button variant="ghost" size="icon" onClick={() => setOpenMobile(true)}>
                    <LogoIcon className="h-7 text-foreground" />
                </Button>
            </div>
            
             <div className="relative w-full flex-1 min-w-0">
                <Popover open={openCommandMenu} onOpenChange={setOpenCommandMenu}>
                    <PopoverTrigger asChild>
                        <Button 
                            variant="outline"
                            className="w-full justify-start text-muted-foreground pl-10 pr-4 py-2.5 rounded-full text-sm h-11 font-normal"
                        >
                            <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                            <span className="h-5 flex items-center truncate">{placeholder}</span>
                            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded-md border bg-muted px-2 font-mono text-sm font-medium opacity-100 sm:flex">
                                <span className="text-lg">⌘</span>K
                            </kbd>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[640px] p-0" align="start">
                        <CommandMenu 
                            navItems={navItems} 
                            userRole={userRole} 
                            onOpenChange={setOpenCommandMenu}
                            onAiCommand={handleAiCommand}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            
            <div className="flex items-center gap-1 ml-auto">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setIsHelpOpen(true)}>
                  <HelpCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
              <NotificationsMenu userRole={userRole} />
              <div className="h-10 w-px bg-border mx-1 hidden xl:block"></div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 cursor-pointer h-12 rounded-full px-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
                            <AvatarFallback>{userDetails.fallback}</AvatarFallback>
                        </Avatar>
                        <div className="leading-tight hidden xl:block text-left">
                            <div className="text-sm font-medium tracking-tight">{userDetails.name}</div>
                            <div className="text-xs text-muted-foreground">{userDetails.role}</div>
                        </div>
                         <ChevronDown className="h-4 w-4 text-muted-foreground hidden xl:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <div className="p-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
                                <AvatarFallback>{userDetails.fallback}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-sm">{userDetails.name}</p>
                                <p className="text-xs text-muted-foreground">{userDetails.role}</p>
                            </div>
                        </div>
                        {userRole !== 'super-admin' && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pt-2 border-t">
                              <Building className="h-3 w-3" />
                              <span>{schoolName} ({plan} Plan)</span>
                          </div>
                        )}
                    </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <PreloaderLink href={`/${userRole}/dashboard`}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </PreloaderLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <PreloaderLink href={`/${userRole}/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </PreloaderLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center justify-between">
                        <Label htmlFor="preloader-switch" className="font-normal cursor-pointer">Enable Preloader</Label>
                        <Switch id="preloader-switch" checked={isPreloaderEnabled} onCheckedChange={setIsPreloaderEnabled} />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
      </div>
      <MobileSidebar />
    </header>
    <HelpDrawer isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </>
  );
}

    