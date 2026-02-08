"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { ArrowLeft, CheckCircle, Lock, Play, FileText, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { markLessonComplete, markLessonIncomplete } from "./actions";
import { useRouter } from "next/navigation";

interface Lesson {
    id: string;
    title: string;
    description: string | null;
    video_url: string | null;
    duration: number;
    order: number;
    isCompleted: boolean;
    isLocked?: boolean;
}

interface Module {
    id: string;
    title: string;
    description: string | null;
    order: number;
    lessons: Lesson[];
}

interface CoursePlayerProps {
    course: {
        id: string;
        title: string;
        description: string | null;
        modules: Module[];
        progressPercent: number;
        completedLessons: number;
        totalLessons: number;
    };
}

export default function CoursePlayerClient({ course }: CoursePlayerProps) {
    const router = useRouter();
    const [activeLessonId, setActiveLessonId] = useState<string | null>(
        course.modules[0]?.lessons[0]?.id || null
    );
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
        course.modules.reduce((acc, mod) => ({ ...acc, [mod.id]: true }), {})
    );
    const [completing, setCompleting] = useState<string | null>(null);

    const activeLesson = course.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === activeLessonId);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const handleLessonSelect = (lessonId: string) => {
        setActiveLessonId(lessonId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleComplete = async (lessonId: string, currentStatus: boolean) => {
        setCompleting(lessonId);
        if (currentStatus) {
            await markLessonIncomplete(lessonId);
        } else {
            await markLessonComplete(lessonId);
        }
        setCompleting(null);
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

                {/* Left: Video Player Area */}
                <div className="flex-1">
                    <Link
                        href="/lms"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        강의 목록으로 돌아가기
                    </Link>

                    <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video relative group">
                        {activeLesson ? (
                            activeLesson.video_url ? (
                                <iframe
                                    src={activeLesson.video_url.replace("watch?v=", "embed/")}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={activeLesson.title}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                    <div className="text-center text-white/50">
                                        <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>동영상이 없는 강의입니다.</p>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                <p className="text-white/50">강의를 선택해주세요.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {activeLesson?.title || course.title}
                                </h1>
                                <p className="text-slate-600 mt-2">
                                    {activeLesson?.description || course.description}
                                </p>
                            </div>
                            {activeLesson && (
                                <button
                                    onClick={() => toggleComplete(activeLesson.id, activeLesson.isCompleted)}
                                    disabled={completing === activeLesson.id}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeLesson.isCompleted
                                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                        } disabled:opacity-50`}
                                >
                                    {activeLesson.isCompleted ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            완료됨
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            수강 완료로 표시
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Attachments Placeholder */}
                        <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
                            <h3 className="font-bold text-lg mb-4">강의 자료</h3>
                            <div className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                등록된 강의 자료가 없습니다.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Curriculum List */}
                <div className="w-full lg:w-96">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-900">{course.title}</h3>
                            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                                <span>진도율 {course.progressPercent}%</span>
                                <span>{course.completedLessons}/{course.totalLessons}강 완료</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500"
                                    style={{ width: `${course.progressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="max-h-[600px] overflow-y-auto">
                            {course.modules.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    등록된 강의가 없습니다.
                                </div>
                            ) : (
                                course.modules.map((module) => (
                                    <div key={module.id} className="border-b border-slate-100 last:border-0">
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50hover:bg-slate-100 transition-colors text-left"
                                        >
                                            <span className="font-semibold text-slate-800 text-sm">{module.title}</span>
                                            {expandedModules[module.id] ? (
                                                <ChevronUp className="w-4 h-4 text-slate-500" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-slate-500" />
                                            )}
                                        </button>

                                        {expandedModules[module.id] && (
                                            <div className="divide-y divide-slate-100">
                                                {module.lessons.map((lesson) => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => handleLessonSelect(lesson.id)}
                                                        className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start gap-3
                                                            ${activeLessonId === lesson.id ? "bg-blue-50/50 border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                                                        `}
                                                    >
                                                        <div className="mt-1 flex-shrink-0">
                                                            {lesson.isCompleted ? (
                                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                            ) : (
                                                                <Play className={`w-5 h-5 ${activeLessonId === lesson.id ? "text-blue-600" : "text-slate-400"}`} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className={`text-sm font-medium ${activeLessonId === lesson.id ? "text-blue-700" : "text-slate-700"}`}>
                                                                {lesson.title}
                                                            </h4>
                                                            <span className="text-xs text-slate-400 mt-1 block">
                                                                {Math.floor(lesson.duration / 60)}분 {lesson.duration % 60}초
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
