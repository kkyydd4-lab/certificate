"use client";

import { Navbar } from "@/components/navbar";
import { COURSES } from "@/lib/mock-data";
import { PlayCircle, Clock, User } from "lucide-react";
import Link from "next/link";

export default function LmsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">나의 강의실</h1>
                    <p className="text-slate-600 mt-2">수강 중인 강좌를 확인하고 학습을 이어가세요.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COURSES.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Thumbnail Placeholder */}
                            <div className="aspect-video bg-slate-200 relative">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/lms/${course.id}`}
                                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                                    >
                                        <PlayCircle className="w-10 h-10" />
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 text-xs font-medium text-blue-600 mb-2">
                                    <span className="bg-blue-50 px-2 py-1 rounded-md">자격증 과정</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>

                                <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{course.instructor}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/lms/${course.id}`}
                                    className="mt-4 block w-full py-2.5 text-center text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    강의 보러가기
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
