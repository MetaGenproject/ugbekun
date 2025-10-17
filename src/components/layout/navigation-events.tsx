'use client'
 
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
 
type NavigationEventsProps = {
    onPageLoad: () => void;
}

// THIS COMPONENT IS DEPRECATED AND NO LONGER USED.
// The logic has been moved to the root layout for better reliability.
export function NavigationEvents({ onPageLoad }: NavigationEventsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  useEffect(() => {
    // This logic is flawed and has been moved.
  }, [pathname, searchParams, onPageLoad])
 
  return null
}
