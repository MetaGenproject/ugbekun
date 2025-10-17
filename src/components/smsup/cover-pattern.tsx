
"use client";

// A simple coded SVG pattern for the cover
export const CoverPattern = () => (
    <div className="absolute inset-0 bg-secondary overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="text-secondary-foreground/5">
            <defs>
                <pattern id="coverPattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(1) rotate(45)">
                    <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
                    <path d="M-10 10h60v20h-60z" strokeWidth="1" stroke="currentColor" fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#coverPattern)" opacity="0.5" />
        </svg>
    </div>
);
