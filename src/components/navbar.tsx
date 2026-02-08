"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Navbar() {
    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-blue-900 text-white p-1.5 rounded-lg">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-slate-900 leading-none">KAEA</span>
                        <span className="text-[10px] text-blue-800 font-bold tracking-tight">한국독서논술협회</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    <Link href="/about" className="hover:text-blue-600 transition-colors">협회소개</Link>
                    <Link href="/certifications" className="hover:text-blue-600 transition-colors">자격증 과정</Link>
                    <Link href="/lms" className="hover:text-blue-600 transition-colors">나의 강의실</Link>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        로그인
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                    >
                        회원가입
                    </Link>
                </div>
            </div>
        </nav>
    );
}
