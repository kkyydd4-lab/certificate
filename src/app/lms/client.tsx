"use client";

import { Navbar } from "@/components/navbar";
import { PlayCircle, User, BookOpen } from "lucide-react";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    description: string;
    instructor_id: string;
    price: number;
    thumbnail_url: string | null;
    progress: number;
    totalLessons: number;
    completedLessons: number;
}

interface LmsDashboardClientProps {
    courses: Course[];
}

export default function LmsDashboardClient({ courses }: LmsDashboardClientProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">나의 강의실</h1>
                    <p className="text-slate-600 mt-2">수강 중인 강좌를 확인하고 학습을 이어가세요.</p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                        <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">수강 중인 강의가 없습니다.</h3>
                        <p className="text-slate-500 mb-6">새로운 강의를 신청하고 학습을 시작해보세요!</p>
                        <Link
                            href="/courses"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                        >
                            강의 목록 보기
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                {/* Thumbnail */}
                                <div className="aspect-video bg-slate-200 relative group">
                                    {course.thumbnail_url ? (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                            <BookOpen className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/lms/${course.id}`} // Updated link to point to LMS player
                                            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                                        >
                                            <PlayCircle className="w-10 h-10" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 mb-2">
                                        <span className="bg-blue-50 px-2 py-1 rounded-md">자격증 과정</span>
                                        {course.progress > 0 && (
                                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                                진도율 {course.progress}%
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{course.description}</p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>진행도</span>
                                            <span>{course.completedLessons}/{course.totalLessons}강</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/lms/${course.id}`}
                                        className="block w-full py-2.5 text-center text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        {course.progress > 0 ? "이어듣기" : "수강 시작하기"}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
