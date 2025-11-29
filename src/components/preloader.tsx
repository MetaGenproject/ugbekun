
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { useContext, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PreloaderContext } from '@/context/preloader-context';
import type { PreloaderItem, ProTip } from '@/lib/preloader-data';
import * as LucideIcons from 'lucide-react';

const PRELOADER_CONTENT_DELAY = 1800; // Time before content appears
const PRELOADER_EXIT_DELAY = 2000; // Time content stays on screen

const AnimatedLogo = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 135.07 135.07"
            className={cn("w-24 h-24", className)}
        >
            <style>
                {`
                .shield-outer-path, .shield-inner-path {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: draw-shield 2s ease-in-out forwards;
                }
                .shield-inner-path {
                    animation-delay: 0.5s;
                }
                .logo-glyphs {
                    opacity: 0;
                    animation: fade-in-glyphs 1s ease-out 1.5s forwards;
                }
                @keyframes draw-shield {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes fade-in-glyphs {
                    to {
                        opacity: 1;
                    }
                }
                `}
            </style>
            <g id="Layer_x0020_1" className="fill-none stroke-current stroke-[2]">
                <g id="_2600086860368">
                    <g className="logo-glyphs fill-current stroke-none">
                        <path d="M77.58 74.09c2.28,0 5.37,-0.48 6.86,-1.19 -0.51,-6.16 -7.31,-7.81 -10.74,-2.69 -4.52,-1.21 -2.2,-8.4 -3.58,-14.32l-0.9 0c-0.57,6.8 -1.99,13.83 2.88,16.51 1.21,0.67 3.79,1.69 5.47,1.69z"/>
                        <path d="M59.97 70.51c-0.57,-1.08 -0.52,-1.51 -1.65,-2.23 -3.52,-2.25 -9.09,-1.22 -9.09,4.92 7.15,1.66 16.11,1.03 16.11,-8.06 0,-2.59 0.33,-7.61 -0.6,-9.55 -1.58,1.06 -0.66,1.2 -1.15,5.71 -0.24,2.24 0.23,5.81 -1.96,8.19 -0.49,0.53 -0.96,0.83 -1.67,1.02z"/>
                        <path d="M57.28 89.01c0,2.84 1.02,2.71 3.53,3.04 10.05,1.32 4.94,0.45 11.72,-0.03 1.72,-0.12 3.58,0.3 3.85,-3.01 -2.17,-0.18 -4.28,-2.06 -6.27,-2.03 -0.83,0.02 -2.24,0.69 -3.28,0.69 -0.99,0 -2.72,-0.75 -3.28,-0.75 -2.04,0 -4.24,1.92 -6.27,2.09z"/>
                        <path d="M58.18 82.45l6.27 0.3c0.66,2.85 3.64,3.58 4.48,0l6.57 -0.3c-0.43,-5.22 -6.12,-1.19 -8.65,-1.19 -3.16,0 -8.65,-4.12 -8.65,1.19z"/>
                        <path d="M66.24 100.35c4.01,0 7.46,-1.8 7.76,-5.37 -1.05,0.24 -1.91,0.82 -3.01,1.17 -2.63,0.82 -5.44,0.84 -8.07,0.07 -1.3,-0.38 -2.11,-0.98 -3.24,-1.24 0.07,3.15 3.21,5.37 6.57,5.37z"/>
                    </g>
                    <path className="shield-inner-path" d="M36.99 82.68l6.01 4.4 2.07 5.1 -7.98 -4.79 0.35 6.84 8.9 2.83 1.84 3.29 -10.06 -2.14 1.19 5.55 11.08 0.36 1.74 3.07 -10.85 -1.16 1.95 3.76 10.03 -3.38 2.01 2.05 -9.46 5.51 3.36 3.87 7.68 -8.06 2.36 1.14 -6.74 9.18c1.62,1.82 3.24,1.7 6.01,2.21l3.42 -10.08 2.98 0.31 -2.61 10.62 3.87 0.17 0 0.01 0.08 -0 0.08 0 0 -0.01 3.87 -0.17 -2.62 -10.62 2.98 -0.31 3.42 10.08c2.77,-0.51 4.4,-0.39 6.01,-2.21l-6.74 -9.18 2.36 -1.14 7.68 8.06 3.36 -3.87 -9.46 -5.51 2.01 -2.05 10.03 3.38 1.95 -3.76 -10.85 -1.16 1.74 -3.07 11.08 -0.36 1.2 -5.55 -10.07 2.14 1.84 -3.29 8.9 -2.83 0.35 -6.84 -7.98 4.79 2.07 -5.1 6.01 -4.4 0.08 -5.74 -6.53 0.12c-1.75,13.34 -9.78,32.5 -22.63,32.97 -12.84,-0.46 -21.14,-19.63 -22.9,-32.97l-6.53 -0.12 0.08 5.74z"/>
                    <path className="shield-outer-path" d="M36.9 40.45l-6.63 -2.7c0,0 -1.86,10.33 -1.17,13.38 0.54,2.37 0.62,0.62 1.46,2.34 0.24,0.49 0.55,1.21 0.95,2.27 1.42,3.77 1.23,4.75 -0.04,6.37 -0.33,0.42 -0.74,0.9 -1.22,1.47 -2.28,2.77 1.07,-2.39 -2.94,-2.39 -4,0 -1.37,-0.31 -2.5,-4.4 -0.3,-1.09 1.92,-2 2.19,-2.83 0.69,-2.13 1.11,-16.56 1.11,-16.56l-13.53 -5.2 52.58 -22.8 53.32 21.65 -23.13 9.63c0,0 -0.72,11.09 -0.89,16.96 -0.04,1.24 -0.1,1.75 -0.07,2.43 0.01,0.18 -0.43,2.69 -0.71,4.31 2.29,4.2 -2.08,12.44 -4.54,14.27l0.32 -16.7c0.55,0.06 1.04,0.16 1.48,0.3 -0.81,-1.69 -1.7,-3.51 -2.46,-4.6 -7,-10.02 -41.55,-9.78 -47.56,0 -1.02,1.66 -2.29,3.51 -3.28,4.9 0.6,-0.29 1.32,-0.5 2.18,-0.61l0.49 14.37 0.08 2.35c-2.68,-1.9 -7.32,-10.61 -4.46,-14.68l-1.04 -6.33 0 -17.21z"/>
                </g>
            </g>
        </svg>
    );
};

export function Preloader() {
    const { isPreloading, content } = useContext(PreloaderContext);
    const [stage, setStage] = useState<'logo' | 'content'>('logo');
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        let logoTimer: NodeJS.Timeout;
        if (isPreloading) {
            setStage('logo');
            logoTimer = setTimeout(() => {
                setStage('content');
            }, PRELOADER_CONTENT_DELAY);
        }
        return () => clearTimeout(logoTimer);
    }, [isPreloading]);
    
    // Listen for the custom page-loaded event
    useEffect(() => {
        const pageLoaded = () => setIsLoaded(true);
        if (isPreloading) {
            setIsLoaded(false);
            window.addEventListener('page-loaded', pageLoaded);
        }
        return () => window.removeEventListener('page-loaded', pageLoaded);
    }, [isPreloading]);
    
    let IconComponent: React.ElementType | null = null;
    if (content && 'icon' in content) {
        const proTip = content as ProTip;
        IconComponent = LucideIcons[proTip.icon as keyof typeof LucideIcons] as React.ElementType;
    }

    return (
        <AnimatePresence>
            {isPreloading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
                    className={cn(
                        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ugbekun-blue-dark text-ugbekun-white"
                    )}
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
                        {isLoaded && (
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: PRELOADER_EXIT_DELAY / 1000, ease: 'linear' }}
                            />
                        )}
                    </div>
                    <AnimatePresence mode="wait">
                        {stage === 'logo' && (
                             <motion.div
                                key="logo"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -40, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <AnimatedLogo />
                            </motion.div>
                        )}
                        {(stage === 'content') && content && (
                             <motion.div
                                key={content.text} // Use text as key to trigger re-animation
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="flex flex-col items-center text-center px-4 w-full"
                            >
                                {'lang' in content ? (
                                    <>
                                        <div className="flex items-center gap-2 text-3xl font-semibold">
                                            <span>{content.text}</span>
                                            <motion.span
                                                animate={{ rotate: [0, 20, -10, 20, 0] }}
                                                transition={{ repeat: Infinity, repeatType: "loop", duration: 1.5, ease: "easeInOut" }}
                                                style={{ display: 'inline-block' }}
                                            >
                                                {content.emoji}
                                            </motion.span>
                                        </div>
                                        <motion.p
                                            className="mt-1 text-sm font-medium tracking-widest uppercase text-ugbekun-blue-light/70"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                        >
                                            {content.lang}
                                        </motion.p>
                                    </>
                                ) : 'author' in content ? (
                                     <div className="max-w-md">
                                        <p className="text-xl font-medium">"{content.text}"</p>
                                        <p className="mt-2 text-sm text-ugbekun-blue-light/70">- {content.author}</p>
                                     </div>
                                ) : 'icon' in content && IconComponent ? (
                                    <div className="max-w-md flex items-center gap-4">
                                        <div className="w-12 h-12 grid place-items-center rounded-xl bg-ugbekun-blue-light/20 shrink-0">
                                            <IconComponent className="h-6 w-6 text-ugbekun-blue-light" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-ugbekun-blue-light">{(content as ProTip).category}</p>
                                            <p className="mt-1 text-white/90">{content.text}</p>
                                        </div>
                                    </div>
                                ) : (
                                     <div className="max-w-md">
                                        <p className="font-semibold text-lg">{content.emoji} {content.category}</p>
                                        <p className="mt-1 text-white/90">{content.text}</p>
                                     </div>
                                )}
                                
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
