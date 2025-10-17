/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import Link, { type LinkProps } from 'next/link';
import { useContext } from 'react';
import { PreloaderContext } from '@/context/preloader-context';
import { useRouter } from 'next/navigation';

type PreloaderLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function PreloaderLink({ children, className, onClick, ...props }: PreloaderLinkProps) {
  const { showPreloader, isPreloaderEnabled } = useContext(PreloaderContext);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(event);
    }
    
    // Prevent preloader for external links or anchor links
    const href = typeof props.href === 'object' ? props.href.pathname || '' : props.href;
    if (!href || !href.startsWith('/') || href.startsWith('/#')) {
        return;
    }

    if (isPreloaderEnabled) {
      event.preventDefault();
      showPreloader(href);
    } else {
        // If preloader is disabled, use standard Next.js routing.
        event.preventDefault();
        router.push(href);
    }
  };
  
  return (
    <Link {...props} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
