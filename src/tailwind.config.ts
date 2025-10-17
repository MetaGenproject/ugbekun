

import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        'ugbekun-blue-dark': 'hsl(var(--ugbekun-blue-dark))',
        'ugbekun-blue-light': 'hsl(var(--ugbekun-blue-light))',
        'ugbekun-white': 'hsl(var(--ugbekun-white))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-4px) scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-4px) scale(0.98)',
          },
        },
        'blur-in': {
          from: { opacity: '0', filter: 'blur(8px)', transform: 'translateY(12px)' },
          to: { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(14px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'in-up': {
            '0%': {
                opacity: '0',
                transform: 'translateY(24px) scale(0.95)'
            },
            '100%': {
                opacity: '1',
                transform: 'translateY(0px) scale(1)'
            }
        },
        'in-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
         'in-blur': {
          '0%': { opacity: '0', filter: 'blur(16px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - 1.5rem))' },
        },
        'marquee-l': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-r': { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        // Admin card animations
        'admin-header': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '20%, 80%': { transform: 'translateY(-5px)', opacity: '0.5' },
        },
        'admin-bar-1': {
          '0%, 100%': { transform: 'scaleY(0.6)' },
          '25%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.4)' },
          '75%': { transform: 'scaleY(0.8)' },
        },
        'admin-bar-2': {
          '0%, 100%': { transform: 'scaleY(0.8)' },
          '25%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
          '75%': { transform: 'scaleY(0.6)' },
        },
        'admin-bar-3': {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '25%': { transform: 'scaleY(0.8)' },
          '50%': { transform: 'scaleY(0.6)' },
          '75%': { transform: 'scaleY(1)' },
        },
        // Teacher card animations
        'teacher-line-1': {
          '0%, 100%': { width: '100%' },
          '50%': { width: '80%' },
        },
        'teacher-line-2': {
          '0%, 100%': { width: '83.333333%' },
          '50%': { width: '100%' },
        },
        'teacher-line-3': {
          '0%, 100%': { width: '66.666667%' },
          '50%': { width: '90%' },
        },
        'teacher-check-1': {
          '0%, 20%, 100%': { transform: 'translateX(0)' },
          '40%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(2px)' },
        },
        'teacher-check-2': {
          '0%, 25%, 100%': { transform: 'translateX(0)' },
          '45%': { transform: 'translateX(3px)' },
          '65%': { transform: 'translateX(-2px)' },
        },
        'teacher-check-3': {
          '0%, 30%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-3px)' },
          '70%': { transform: 'translateX(4px)' },
        },
        // Guardian card animations
        'guardian-card': {
          '0%, 100%': { transform: 'translateX(0) scale(1)' },
          '25%': { transform: 'translateX(-2px) scale(1.02)' },
          '75%': { transform: 'translateX(2px) scale(0.98)' },
        },
        // Student card animations
        'student-header': {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-2px) scaleY(0.8)' },
        },
        'student-item-1': {
          '0%, 100%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(0.75)' },
        },
        'student-item-2': {
          '0%, 100%': { transform: 'scaleX(1)' },
          '60%': { transform: 'scaleX(0.8)' },
        },
        'student-item-3': {
          '0%, 100%': { backgroundColor: 'hsl(var(--card))' },
          '50%': { backgroundColor: 'hsl(var(--accent))' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'in-up': 'in-up 0.6s ease-out both',
        'in-fade': 'in-fade 0.6s ease-out both',
        'in-blur': 'in-blur 0.8s ease-out both',
        'slide-up': 'slide-up 0.6s ease-out both',
        marquee: 'marquee 40s linear infinite',
        'marquee-l': 'marquee-l 60s linear infinite',
        'marquee-r': 'marquee-r 60s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'admin-header': 'admin-header 4s ease-in-out infinite',
        'admin-bar-1': 'admin-bar-1 4s ease-in-out infinite',
        'admin-bar-2': 'admin-bar-2 4s ease-in-out infinite',
        'admin-bar-3': 'admin-bar-3 4s ease-in-out infinite',
        'teacher-line-1': 'teacher-line-1 4s ease-in-out infinite',
        'teacher-line-2': 'teacher-line-2 4s ease-in-out infinite',
        'teacher-line-3': 'teacher-line-3 4s ease-in-out infinite',
        'teacher-check-1': 'teacher-check-1 4s ease-in-out infinite',
        'teacher-check-2': 'teacher-check-2 4s ease-in-out infinite',
        'teacher-check-3': 'teacher-check-3 4s ease-in-out infinite',
        'guardian-card': 'guardian-card 4s ease-in-out infinite',
        'student-header': 'student-header 4s ease-in-out infinite',
        'student-item-1': 'student-item-1 4s ease-in-out infinite',
        'student-item-2': 'student-item-2 4s ease-in-out infinite',
        'student-item-3': 'student-item-3 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
