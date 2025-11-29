

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { useState, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "../api/apiSlice";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Sun, Moon, Mail, Lock, Eye, EyeOff, UserRound, LockKeyhole, CheckCircle2, ShieldCheck, Settings, GraduationCap, User, Heart, Twitter, Github, HeartHandshake, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PreloaderContext } from "@/context/preloader-context";
import { Form } from "@/components/ui/form";
import { Logo } from "@/components/logo";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Card } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const testimonialImage = PlaceHolderImages.find(p => p.id === 'auth-testimonial');

  const { setTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  const { showPreloader } = useContext(PreloaderContext);
  const dispatch = useDispatch();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // signup is now handled in the onboarding flow; keep this component focused on sign-in

  const handleLogin: SubmitHandler<LoginValues> = async (data) => {
    try {
      const result = await login(data).unwrap();
     
      if (result.token && result.data?.user) {
        dispatch(setCredentials({ 
            token: result.token,
            user: result.data.user }));
        
        toast({
          variant: "success",
          title: "Login Successful",
          description: "Welcome back! Redirecting you now...",
        });

        const userRole = result.data.user.role?.toLowerCase() || 'dashboard';
        const redirectPath = `/${userRole}`;
        showPreloader(redirectPath);
      } else {
        toast({ 
          variant: "destructive", 
          title: "Login Failed", 
          description: "Invalid credentials. Please try again." 
        });
      }
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
        description: "An unexpected error occurred. Please try again." 
      });
    }
  };
  
  // Signup is handled during onboarding. This form only performs sign-in.

  return (
    <div className="w-full max-w-4xl mx-auto animate-in-up">
        <div className="rounded-2xl border bg-card/80 text-card-foreground shadow-2xl backdrop-blur-lg md:grid md:grid-cols-2 overflow-hidden mt-5">
            <div className="flex flex-col">
                <div className="flex items-center justify-between p-2 mt-4">
                     <Link href="/" className="inline-block p-2">
                        <Logo className="h-8 text-primary dark:text-white" />
                    </Link>
                    <button 
                      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} 
                      className="mr-2 h-9 w-9 rounded-lg grid place-items-center border bg-background shadow-sm hover:bg-muted transition-colors" 
                      aria-label="Toggle theme"
                    >
                        {resolvedTheme === 'dark' ? <Moon strokeWidth="1.5" className="h-5 w-5" /> : <Sun strokeWidth="1.5" className="h-5 w-5" />}
                    </button>
                </div>

                <div className="px-6 sm:px-8 pt-6 pb-6 flex-1 flex flex-col justify-center">
                        <section id="panel-signin" className="animate-in-up">
                          <div className="w-full max-w-sm mx-auto">
                            <header className="text-center mb-8">
                                <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
                                <p className="mt-2 text-sm text-muted-foreground">Sign in to your account.</p>
                            </header>

                            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <div className="relative">
                                        <Mail strokeWidth="1.5" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input 
                                          id="email" 
                                          type="email" 
                                          required 
                                          autoComplete="email" 
                                          {...loginForm.register("email")}
                                          className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 ring-ring placeholder:text-muted-foreground transition" 
                                        />
                                    </div>
                                    {loginForm.formState.errors.email && (
                                      <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                                        <a href="#" className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">Forgot?</a>
                                    </div>
                                    <div className="relative group">
                                        <Lock strokeWidth="1.5" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input 
                                          id="password" 
                                          type={showPassword ? "text" : "password"} 
                                          required 
                                          autoComplete="current-password" 
                                          {...loginForm.register("password")}
                                          className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 ring-ring transition placeholder:text-muted-foreground" 
                                        />
                                        <button 
                                          type="button" 
                                          onClick={() => setShowPassword(!showPassword)} 
                                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg grid place-items-center hover:bg-muted"
                                        >
                                            {showPassword ? <EyeOff strokeWidth="1.5" className="h-5 w-5 text-muted-foreground" /> : <Eye strokeWidth="1.5" className="h-5 w-5 text-muted-foreground" />}
                                        </button>
                                    </div>
                                    {loginForm.formState.errors.password && (
                                      <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                                    )}
                                </div>
                                
                                <button 
                                  type="submit" 
                                  disabled={isLoggingIn} 
                                  className="w-full rounded-xl px-4 py-2.5 text-sm font-medium tracking-tight bg-primary text-primary-foreground hover:-translate-y-px hover:shadow-lg transition mt-4"
                                >
                                    {isLoggingIn ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>
                          </div>
                        </section>
                    

                    
                </div>
            </div>
             <div className="hidden md:flex flex-col bg-primary text-primary-foreground p-8">
                <div className="flex-1 flex flex-col justify-center">
                    <blockquote className="space-y-2">
                         {testimonialImage && (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-foreground/50">
                                <Image 
                                  src={testimonialImage.imageUrl} 
                                  alt="Mrs. Adebayo" 
                                  width={64} 
                                  height={64} 
                                  data-ai-hint={testimonialImage.imageHint} 
                                />
                            </div>
                         )}
                        <p className="text-lg font-medium">
                           "Ugbekun revolutionized how we manage our school. From finances to parent communication, everything is streamlined. It's been a game-changer for us."
                        </p>
                        <footer className="text-sm">
                            <span className="font-semibold">Mrs. Adebayo</span>
                            <span className="text-primary-foreground/80"> — Principal, Bright Star Academy</span>
                        </footer>
                    </blockquote>
                </div>
                <div className="mt-8 text-xs text-primary-foreground/70 text-center">
                     <p>© {new Date().getFullYear()} Ugbekun. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>
  );
}