"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md border-t-4 border-t-destructive shadow-lg">
                <CardHeader className="text-center space-y-4 pb-8">
                    <div className="mx-auto p-3 bg-destructive/10 rounded-full w-fit">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-destructive">Authentication Error</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        We couldn&apos;t verify your session. This might happen if the link has expired or was already used.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button asChild className="w-full h-12 text-base font-medium">
                        <Link href="/">
                            <ArrowLeft className="w-5 h-5 mr-3" />
                            Back to Login
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
