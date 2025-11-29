
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandInput,
  Command
} from "@/components/ui/command"
import type { NavItem } from "@/lib/nav-data"
import { useTheme } from "next-themes"
import { Bot, Moon, Sun, GraduationCap, Building, User, Users2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { schoolsData as initialSchools, type School } from "@/lib/super-admin-data"
import { recentStudents as initialStudents, type Student } from "@/lib/admin-data"
import { staff as initialStaff, type Staff } from '@/lib/hr-data';
import { initialTeamMembers, type TeamMember } from '@/lib/team-data';
import { initialClasses, type Class } from "@/lib/school-data"


interface CommandMenuProps {
    onOpenChange: (open: boolean) => void;
    navItems: NavItem[];
    userRole: 'super-admin' | 'admin' | 'teacher' | 'parent' | 'student';
    onAiCommand: (prompt: string) => void;
}

export function CommandMenu({ onOpenChange, navItems, userRole, onAiCommand }: CommandMenuProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [search, setSearch] = React.useState('');

  const [schools] = useLocalStorage<School[]>('schools', initialSchools);
  const [students] = useLocalStorage<Student[]>('students', initialStudents);
  const [staff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
  const [team] = useLocalStorage<TeamMember[]>('internal-team', initialTeamMembers);
  const [classes] = useLocalStorage<Class[]>('school-classes', initialClasses);
  
  // Role-specific data filtering
  const searchResults = React.useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return {};

    const results: { students?: Student[], staff?: Staff[], schools?: School[], team?: TeamMember[], classes?: Class[] } = {};

    if (userRole === 'super-admin') {
      results.schools = schools.filter(school => school.name.toLowerCase().includes(s));
      results.team = team.filter(member => member.name.toLowerCase().includes(s) || member.email.toLowerCase().includes(s));
    }
    
    if (userRole === 'admin') {
      results.students = students.filter(student => student.name.toLowerCase().includes(s) || student.class.toLowerCase().includes(s));
      results.staff = staff.filter(staffMember => staffMember.name.toLowerCase().includes(s) || staffMember.role.toLowerCase().includes(s));
      results.classes = classes.filter(c => c.name.toLowerCase().includes(s));
    }
    
    if (userRole === 'teacher') {
      const teacher = staff.find(stf => stf.id === 'stf-001'); // Mock logged-in teacher
      if (teacher) {
        const teacherClasses = teacher.assignedClasses.map(c => c.class);
        results.students = students.filter(student => teacherClasses.includes(student.class) && student.name.toLowerCase().includes(s));
      }
    }

    if (userRole === 'parent') {
        results.staff = staff.filter(s => s.department === 'Academics' && s.name.toLowerCase().includes(s));
    }

    return results;

  }, [search, userRole, schools, students, staff, team, classes]);


  const runCommand = React.useCallback((command: () => unknown) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  const handleAiSelect = () => {
    onOpenChange(false);
    onAiCommand(search);
  }
  
  const handleValueChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
      <CommandInput 
        placeholder="Type a command or search..."
        value={search}
        onValueChange={handleValueChange}
       />
      <CommandList>
        <CommandEmpty>
            {search.trim().length > 2 ? (
                <CommandItem
                    value={search}
                    onSelect={handleAiSelect}
                    className="aria-selected:bg-primary/10"
                >
                    <Bot className="mr-2 h-4 w-4" />
                    <span>Ask AI: "{search}"</span>
                </CommandItem>
            ) : "No results found."}
        </CommandEmpty>
        
        {searchResults.schools && searchResults.schools.length > 0 && (
          <CommandGroup heading="Schools">
            {searchResults.schools.map((school) => (
              <CommandItem
                key={school.id}
                value={`School: ${school.name}`}
                onSelect={() => runCommand(() => router.push(`/schools/${school.id}`))}
              >
                <Building className="mr-2 h-4 w-4" />
                <span>{school.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {searchResults.team && searchResults.team.length > 0 && (
          <CommandGroup heading="Team Members">
            {searchResults.team.map((member) => (
              <CommandItem
                key={member.id}
                value={`Team: ${member.name}`}
                onSelect={() => runCommand(() => router.push(`/super-admin/team/${member.id}`))}
              >
                <Users2 className="mr-2 h-4 w-4" />
                <span>{member.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchResults.students && searchResults.students.length > 0 && (
          <CommandGroup heading="Students">
            {searchResults.students.slice(0, 5).map((student) => (
              <CommandItem
                key={student.name}
                value={`Student: ${student.name}`}
                onSelect={() => runCommand(() => router.push(`/admin/students/${student.id}`))}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{student.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{student.class}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {searchResults.staff && searchResults.staff.length > 0 && (
            <CommandGroup heading="Staff">
              {searchResults.staff.slice(0,5).map(staffMember => (
                <CommandItem 
                  key={staffMember.id}
                  value={`Staff: ${staffMember.name}`}
                  onSelect={() => runCommand(() => router.push(`/admin/hr/${staffMember.id}`))}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>{staffMember.name}</span>
                   <span className="text-xs text-muted-foreground ml-auto">{staffMember.role}</span>
                </CommandItem>
              ))}
            </CommandGroup>
        )}
        
        {searchResults.classes && searchResults.classes.length > 0 && (
            <CommandGroup heading="Classes">
              {searchResults.classes.slice(0,5).map(c => (
                <CommandItem 
                  key={c.id}
                  value={`Class: ${c.name}`}
                  onSelect={() => runCommand(() => router.push(`/admin/classes`))}>
                  <Building className="mr-2 h-4 w-4" />
                  <span>{c.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
        )}

        <CommandGroup heading="Navigation">
            {navItems.filter(item => !item.isHeader && item.href).map((item) => (
                <CommandItem
                    key={item.href}
                    value={item.label}
                    onSelect={() => {
                        runCommand(() => router.push(item.href as string))
                    }}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
