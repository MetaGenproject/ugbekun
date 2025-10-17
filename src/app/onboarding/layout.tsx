
export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background">
             <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-ugbekun-blue-light/30 blur-3xl opacity-40 dark:opacity-20 animate-in-blur"></div>
                <div className="absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-full bg-ugbekun-blue-dark/5 blur-3xl opacity-40 dark:bg-ugbekun-blue-light/10 animate-in-blur" style={{ animationDelay: "120ms" }}></div>
                <div className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2 h-[26rem] w-[36rem] rounded-[40%] bg-gradient-to-tr from-ugbekun-blue-light/20 to-ugbekun-blue-dark/5 blur-3xl opacity-50 dark:from-ugbekun-blue-light/20 dark:to-ugbekun-blue-light/5 animate-in-fade" style={{ animationDelay: "240ms" }}></div>
            </div>
            {children}
        </main>
    );
}
