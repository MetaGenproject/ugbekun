
"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface ResponsiveCalendarProps extends ButtonProps {
    selected: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    calendarProps?: Omit<CalendarProps, 'selected' | 'onSelect' | 'mode'>;
}

export function ResponsiveCalendar({ selected, onSelect, calendarProps, children, ...buttonProps }: ResponsiveCalendarProps & {children?: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    setIsOpen(false);
  }

  if (isDesktop) {
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button {...buttonProps}>{children}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                 <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={handleSelect}
                    initialFocus
                    {...calendarProps}
                />
            </PopoverContent>
        </Popover>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
         <Button {...buttonProps}>{children}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
            <DrawerTitle>Select a date</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0 flex justify-center">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            initialFocus
            className="w-auto"
            {...calendarProps}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
