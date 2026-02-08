"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Settings,
    LogOut,
    GraduationCap,
    Users,
    Shield
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
    userRole?: "admin" | "instructor" | "student";
}

export function Sidebar({ userRole = "student" }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const links = [
        {
            href: "/dashboard",
            label: "대시보드",
            icon: LayoutDashboard,
            roles: ["admin", "instructor", "student"],
        },
        {
            href: "/exams",
            label: "시험 응시",
            icon: FileText,
            roles: ["student", "instructor", "admin"],
        },
        {
            href: "/my-certifications",
            label: "내 자격증",
            icon: GraduationCap,
            roles: ["student", "instructor", "admin"],
        },
        {
            href: "/admin/courses",
            label: "강의 관리",
            icon: BookOpen,
            roles: ["admin", "instructor"],
        },
        {
            href: "/admin/questions",
            label: "문제 은행",
            icon: FileText,
            roles: ["admin", "instructor"],
        },
        {
            href: "/admin/users",
            label: "회원 관리",
            icon: Users,
            roles: ["admin"],
        },
        {
            href: "/admin/exams",
            label: "시험 관리",
            icon: Shield,
            roles: ["admin", "instructor"],
        },
        {
            href: "/certifications",
            label: "발급 증명서",
            icon: GraduationCap,
            roles: ["student"],
        },
        {
            href: "/settings",
            label: "설정",
            icon: Settings,
            roles: ["admin", "instructor", "student"],
        },
    ];

    const filteredLinks = links.filter((link) => link.roles.includes(userRole));

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        K
                    </div>
                    <span className="text-lg font-bold text-slate-900">한국독서논술협회</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {filteredLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    로그아웃
                </button>
            </div>
        </aside>
    );
}
