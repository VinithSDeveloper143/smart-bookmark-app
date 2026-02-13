"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { Database } from "@/types/supabase";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

export default function BookmarkForm({
    userId,
    onSubmit
}: {
    userId: string,
    onSubmit: (url: string, title?: string) => Promise<void>
}) {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const isValidUrl = (string: string) => {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!isValidUrl(url)) {
            setMessage({ type: 'error', text: "Please enter a valid URL starting with http:// or https://" });
            return;
        }

        setLoading(true);

        try {
            await onSubmit(url, title);
            setMessage({ type: 'success', text: "Bookmark added successfully!" });
            setUrl("");
            setTitle("");
            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to add bookmark" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-8">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={loading}
                                required
                                className={message?.type === 'error' && message.text.includes("URL") ? "border-red-500" : ""}
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                placeholder="Title (optional)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            {loading ? "Adding..." : "Add"}
                        </Button>
                    </div>
                    {message && (
                        <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
