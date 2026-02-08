"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { createClient } from "@/utils/supabase/client";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [role, setRole] = useState<"admin" | "instructor" | "student">("student");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("role")
                        .eq("id", user.id)
                        .single();

                    if (profile) {
                        setRole(profile.role as "admin" | "instructor" | "student");
                    }
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserRole();
    }, [supabase]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar userRole={role} />
            <main className="ml-64 p-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
