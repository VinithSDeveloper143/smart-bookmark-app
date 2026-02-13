"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Bookmark } from "lucide-react";

export default function LoginPage() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="mb-8 flex items-center gap-3">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <Bookmark className="w-8 h-8 text-primary fill-primary" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                    SmartMarks
                </h1>
            </div>

            <Card className="w-full max-w-md border-t-4 border-t-primary shadow-lg">
                <CardHeader className="text-center space-y-4 pb-8">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription className="text-base">
                        Your personal, real-time bookmark manager.
                        <br />
                        Sign in to access your collection.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02]"
                        onClick={handleLogin}
                        size="lg"
                    >
                        <Chrome className="w-5 h-5 mr-3" />
                        Continue with Google
                    </Button>
                </CardContent>
            </Card>

            <p className="mt-8 text-sm text-muted-foreground text-center max-w-sm">
                Secure, private, and always in sync across all your devices.
            </p>
        </div>
    );
}
