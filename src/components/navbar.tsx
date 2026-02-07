"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Navbar() {
    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <span>한국독서논술협회</span>
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
