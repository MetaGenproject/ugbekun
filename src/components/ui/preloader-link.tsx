/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import Link, { type LinkProps } from 'next/link';
import { useContext } from 'react';
import { PreloaderContext } from '@/context/preloader-context';
import { useRouter, usePathname } from 'next/navigation';

type PreloaderLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function PreloaderLink({ children, className, onClick, ...props }: PreloaderLinkProps) {
  const { showPreloader, isPreloaderEnabled } = useContext(PreloaderContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(event);
    }
    
    const href = typeof props.href === 'object' ? props.href.pathname || '' : props.href;
    
    // Prevent default Next.js navigation and preloader for certain cases
    if (!href || !href.startsWith('/') || href.startsWith('/#') || href === pathname) {
      if (href.startsWith('/#')) {
        // Handle anchor links smoothly
        event.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return; // Standard browser behavior for external links or no-op for same page
    }
    
    event.preventDefault();

    if (isPreloaderEnabled) {
      showPreloader(href);
    } else {
      router.push(href);
    }
  };
  
  return (
    <Link {...props} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
