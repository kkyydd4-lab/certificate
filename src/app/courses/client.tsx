"use client";

import { Course } from "@/types/lms";
import { BookOpen, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CourseListClientProps {
    courses: any[];
}

export function CourseListClient({ courses }: CourseListClientProps) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">나의 강의실</h1>
                <p className="text-slate-500">수강 중인 강의와 새로운 강의를 확인하세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                            {course.thumbnail_url ? (
                                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                                    <BookOpen className="w-12 h-12 mb-2" />
                                    <span className="text-sm">이미지 없음</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 drop-shadow-lg" />
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                                {course.description || "설명이 없습니다."}
                            </p>
                            <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-100 pt-4">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {course.enrollment ? `진도율 ${course.enrollment.progress}%` : "수강신청 전"}
                                </span>
                                <span className={cn(
                                    "font-semibold",
                                    course.enrollment ? "text-blue-600" : "text-green-600"
                                )}>
                                    {course.enrollment ? "계속 학습하기" : "수강신청"}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">등록된 강의가 없습니다</h3>
                    <p className="text-slate-500">지식 관리자가 곧 새로운 강의를 업로드할 예정입니다.</p>
                </div>
            )}
        </div>
    );
}
