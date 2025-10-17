"use client";

import { useState, useEffect, useContext } from 'react';
import { PreloaderContext } from '@/context/preloader-context';

type UserRole = 'super-admin' | 'admin' | 'teacher' | 'student' | 'parent';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showPreloader } = useContext(PreloaderContext);

  useEffect(() => {
    try {
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      const role = localStorage.getItem('userRole') as UserRole | null;
      setIsLoggedIn(loggedInStatus);
      setUserRole(loggedInStatus ? role : null);
    } catch (error) {
      console.error("Could not access localStorage:", error);
      setIsLoggedIn(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'isLoggedIn' || event.key === 'userRole') {
            const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
            const role = localStorage.getItem('userRole') as UserRole | null;
            setIsLoggedIn(loggedInStatus);
            setUserRole(loggedInStatus ? role : null);
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 

  return { isLoggedIn, userRole, isLoading, showPreloader };
}
