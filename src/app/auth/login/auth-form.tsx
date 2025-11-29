
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { useState, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signupAction } from "./actions";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Sun, Moon, Mail, Lock, Eye, EyeOff, UserRound, LockKeyhole, CheckCircle2, ShieldCheck, Settings, GraduationCap, User, Heart, Twitter, Github, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PreloaderContext } from "@/context/preloader-context";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/logo";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpDrawer } from "@/components/layout/help-drawer";


const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  role: z.enum(["super-admin", "admin", "teacher", "student", "guardian"]),
});

const signupSchema = z.object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions.",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

type Role = LoginValues["role"];

const roles: { id: Role, name: string, icon: React.ReactNode }[] = [
    { id: "super-admin", name: "Super Admin", icon: <ShieldCheck strokeWidth="1.5" className="h-5 w-5" /> },
    { id: "admin", name: "Admin", icon: <Settings strokeWidth="1.5" className="h-5 w-5" /> },
    { id: "teacher", name: "Teacher", icon: <GraduationCap strokeWidth="1.5" className="h-5 w-5" /> },
    { id: "student", name: "Student", icon: <User strokeWidth="1.5" className="h-5 w-5" /> },
    { id: "guardian", name: "Guardian", icon: <Heart strokeWidth="1.5" className="h-5 w-5" /> },
]

// For development reference only
// const testUsers: Record<Role, { email: string; password: string }> = {
//     "super-admin": { email: "superadmin@ugbekun.com", password: "password123" },
//     admin: { email: "admin@ugbekun.com", password: "password123" },
//     teacher: { email: "teacher@ugbekun.com", password: "password123" },
//     student: { email: "student@ugbekun.com", password: "password123" },
//     guardian: { email: "guardian@ugbekun.com", password: "password123" },
// };


export function AuthForm() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("super-admin");
  const testimonialImage = PlaceHolderImages.find(p => p.id === 'auth-testimonial');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  const { showPreloader } = useContext(PreloaderContext);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "super-admin",
    },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    },
  });


  const handleRoleChange = (role: Role) => {
      setSelectedRole(role);
      loginForm.setValue("role", role);
  }

  const handleLogin: SubmitHandler<LoginValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await loginUser(data);
      if (result.success && result.token && result.user) {
        // Store token and user info
        localStorage.setItem('token', result.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', result.user.role);
        
        toast({
          variant: "success",
          title: "Login Successful",
          description: "Welcome back! Redirecting you now...",
        });

        // Determine redirect path based on role
        const redirectPath = `/${data.role.toLowerCase()}`;
        showPreloader(redirectPath);
      } else {
        toast({ 
          variant: "destructive", 
          title: "Login Failed", 
          description: result.error || "Invalid credentials. Please try again." 
        });
      }
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
        description: "An unexpected error occurred. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };
  


  const handleSignup: SubmitHandler<SignupValues> = async (data) => {
      setIsLoading(true);
      const result = await signupAction({fullName: data.fullName, email: data.email, password: data.password });
      if (result.success && result.redirectPath) {
        toast({ 
          variant: "success",
          title: "Account Created!", 
          description: "Let's get you set up."
        });
        showPreloader(result.redirectPath);
      } else {
        toast({ 
          variant: "destructive", 
          title: "Signup Failed", 
          description: result.error || "An unknown error occurred." 
        });
        setIsLoading(false);
      }
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Coming Soon!",
      description: "Google sign-in is not yet implemented.",
    });
  };

  return (
    <>
    <div className="w-full max-w-4xl mx-auto">
        <div className="rounded-2xl border bg-card/80 text-card-foreground shadow-2xl backdrop-blur-lg md:grid md:grid-cols-2 overflow-hidden">
            <div className="flex flex-col">
                <div className="flex items-center justify-between p-2">
                     <Link href="/" className="inline-block p-2">
                        <Logo className="h-8 text-primary dark:text-white" />
                    </Link>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border bg-background shadow-sm" aria-label="Help" onClick={() => setIsHelpOpen(true)}>
                            <HelpCircle strokeWidth="1.5" className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="h-9 w-9 rounded-lg border bg-background shadow-sm" aria-label="Toggle theme">
                            {resolvedTheme === 'dark' ? <Moon strokeWidth="1.5" className="h-5 w-5" /> : <Sun strokeWidth="1.5" className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                <div className="px-6 sm:px-8 pt-6 pb-8 flex-1 flex flex-col justify-center">
                     {activeTab === 'signin' && (
                        <section id="panel-signin" className="animate-in-up">
                          <div className="w-full max-w-sm mx-auto">
                            <header className="text-center mb-6">
                                <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
                                <p className="mt-1 text-sm text-muted-foreground">Select your role to sign in.</p>
                            </header>
                            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5 mt-6">
                                <input type="hidden" {...loginForm.register("role")} />
                                
                                <div className="grid grid-cols-2 gap-3">
                                    {roles.slice(0, 4).map(role => (
                                        <button 
                                            key={role.id}
                                            type="button"
                                            onClick={() => handleRoleChange(role.id)}
                                            className={cn(
                                                "flex items-center gap-3 p-2.5 rounded-lg border transition-colors",
                                                selectedRole === role.id 
                                                    ? "bg-secondary border-primary/20" 
                                                    : "bg-background/50 border-border hover:border-primary/20"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-8 w-8 rounded-md grid place-items-center transition-colors",
                                                selectedRole === role.id 
                                                    ? "bg-primary text-primary-foreground" 
                                                    : "bg-secondary text-secondary-foreground"
                                            )}>
                                                {role.icon}
                                            </div>
                                            <span className="text-xs font-medium tracking-tight">{role.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleRoleChange("guardian")}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-2.5 rounded-lg border transition-colors",
                                        selectedRole === 'guardian' ? "bg-secondary border-primary/20" : "bg-background/50 border-border hover:border-primary/20"
                                    )}
                                >
                                    <div className={cn("h-8 w-8 rounded-md grid place-items-center transition-colors", selectedRole === 'guardian' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                                        {roles.find(r => r.id === 'guardian')?.icon}
                                    </div>
                                    <span className="text-xs font-medium tracking-tight">Guardian</span>
                                </button>
                                
                                <div className="space-y-1.5 pt-4">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <div className="relative">
                                        <Mail strokeWidth="1.5" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input id="email" type="email" required autoComplete="email" {...loginForm.register("email")}
                                            className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 ring-ring placeholder:text-muted-foreground transition" />
                                    </div>
                                    {loginForm.formState.errors.email && <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                                        <a href="#" className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">Forgot?</a>
                                    </div>
                                    <div className="relative group">
                                        <Lock strokeWidth="1.5" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" {...loginForm.register("password")}
                                            className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 ring-ring transition placeholder:text-muted-foreground" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg grid place-items-center hover:bg-muted">
                                            {showPassword ? <EyeOff strokeWidth="1.5" className="h-5 w-5 text-muted-foreground" /> : <Eye strokeWidth="1.5" className="h-5 w-5 text-muted-foreground" />}
                                        </button>
                                    </div>
                                    {loginForm.formState.errors.password && <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>}
                                </div>
                                
                                <button type="submit" disabled={isLoading} className="w-full rounded-xl px-4 py-2.5 text-sm font-medium tracking-tight bg-primary text-primary-foreground hover:-translate-y-px hover:shadow-lg transition">
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </button>
                                
                                <div className="text-xs text-muted-foreground text-center pt-2">
                                    No account? <button type="button" onClick={() => setActiveTab('signup')} className="text-foreground underline underline-offset-2 hover:no-underline font-medium">Create one</button>
                                </div>
                            </form>
                          </div>
                        </section>
                    )}

                    {activeTab === 'signup' && (
                        <section id="panel-signup" className="animate-in-up">
                          <div className="w-full max-w-sm mx-auto">
                            <header className="text-center mb-6">
                                <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
                            </header>
                             <div className="mt-6 space-y-3">
                                <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
                                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 56.5l-63.4 61.9C331.4 99.4 293.4 82 248 82c-100.9 0-183.3 81.6-183.3 182.1 0 100.5 82.4 182.1 183.3 182.1 105.1 0 160.2-73.4 165.5-114.2H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
                                    </svg>
                                    Sign up with Google
                                </Button>
                            </div>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Form {...signupForm}>
                                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                                     <FormField
                                        control={signupForm.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input placeholder="Full Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    <FormField
                                        control={signupForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input type="email" placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                     <FormField
                                        control={signupForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    <FormField
                                        control={signupForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input type="password" placeholder="Confirm Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />

                                    <FormField
                                    control={signupForm.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-xs sm:text-sm text-muted-foreground font-normal">
                                            I agree to the <a href="#" className="underline underline-offset-2 hover:no-underline text-foreground">Terms</a> and <a href="#" className="underline underline-offset-2 hover:no-underline text-foreground">Privacy Policy</a>.
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                        </FormItem>
                                    )}
                                    />
                                    
                                    <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? 'Creating Account...' : 'Create account'}
                                    </Button>
                                </form>
                            </Form>
                            <div className="text-xs text-muted-foreground text-center pt-4">
                                Already have an account? <button type="button" onClick={() => setActiveTab('signin')} className="text-foreground underline underline-offset-2 hover:no-underline font-medium">Sign in</button>
                            </div>
                           </div>
                        </section>
                    )}
                </div>
            </div>
             <div className="hidden md:flex flex-col bg-primary text-primary-foreground p-8">
                <div className="flex-1 flex flex-col justify-center">
                    <blockquote className="space-y-2">
                         {testimonialImage && (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-foreground/50">
                                <Image src={testimonialImage.imageUrl} alt="Mrs. Adebayo" width={64} height={64} data-ai-hint={testimonialImage.imageHint} />
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
    <HelpDrawer isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </>
  );
}

    