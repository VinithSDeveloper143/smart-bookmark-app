"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ExternalLink, Loader2, Calendar } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";


type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

export default function BookmarkList({
    bookmarks,
    userId,
    onDelete,
    onRestore
}: {
    bookmarks: Bookmark[],
    userId: string,
    onDelete: (id: string) => void,
    onRestore: (previousBookmarks: Bookmark[]) => void
}) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bookmark?")) return;

        setDeletingId(id);
        try {
            await onDelete(id);
        } catch (error: any) {
            alert("Failed to delete bookmark: " + error.message);
        } finally {
            setDeletingId(null);
        }
    };

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed">
                <p>No bookmarks yet. Add one above.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="overflow-hidden bg-card hover:bg-accent/5 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline truncate text-lg flex items-center gap-2 text-primary"
                                >
                                    {bookmark.title}
                                    <ExternalLink className="w-4 h-4 opacity-50" />
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <p className="truncate max-w-[250px]">{bookmark.url}</p>
                                <span className="flex items-center gap-1 shrink-0">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(bookmark.created_at)}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(bookmark.id)}
                            disabled={deletingId === bookmark.id}
                        >
                            {deletingId === bookmark.id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Trash2 className="w-5 h-5" />
                            )}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
