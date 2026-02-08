"use client";

import { useState, useEffect } from "react";
// import MuxPlayer from "@mux/mux-player-react"; // Commented out until package is guaranteed installed/working
import { updateLessonProgress } from "./actions";
import { PlayCircle, CheckCircle, Circle, ChevronLeft, Menu, FileText, CheckSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CoursePlayerClientProps {
    course: any;
}

export function CoursePlayerClient({ course }: CoursePlayerClientProps) {
    // Flatten lessons to easily find next/prev
    const allLessons = course.modules?.flatMap((m: any) => m.lessons) || [];

    const [currentLesson, setCurrentLesson] = useState<any>(
        allLessons.find((l: any) => !l.progress?.completed) || allLessons[0]
    );
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLessonComplete = async (completed: boolean) => {
        if (!currentLesson) return;

        // Optimistic update
        const updatedCourse = { ...course }; // Deep clone in real app
        // For now, simpler state update or just relying on revalidation

        await updateLessonProgress(currentLesson.id, completed);

        // Auto-advance if completing
        if (completed) {
            const currentIndex = allLessons.findIndex((l: any) => l.id === currentLesson.id);
            if (currentIndex < allLessons.length - 1) {
                // Optional: Auto-advance logic could go here
                // setCurrentLesson(allLessons[currentIndex + 1]);
            }
        }
    };

    if (!currentLesson) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>등록된 강의 콘텐츠가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
            {/* Sidebar (Lesson List) */}
            <div
                className={cn(
                    "w-80 border-r border-slate-200 bg-slate-50 flex-shrink-0 transition-all duration-300 flex flex-col",
                    !sidebarOpen && "-ml-80"
                )}
            >
                <div className="p-4 border-b border-slate-200">
                    <Link href="/courses" className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-2">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        강의 목록으로
                    </Link>
                    <h2 className="font-bold text-slate-900 line-clamp-2">{course.title}</h2>
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{
                                    width: `${(allLessons.filter((l: any) => l.progress?.completed).length / allLessons.length) * 100}%`
                                }}
                            />
                        </div>
                        <span>
                            {Math.round((allLessons.filter((l: any) => l.progress?.completed).length / allLessons.length) * 100)}%
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {course.modules?.map((module: any) => (
                        <div key={module.id}>
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                                {module.title}
                            </h3>
                            <div className="space-y-1">
                                {module.lessons?.map((lesson: any) => {
                                    const isSelected = currentLesson?.id === lesson.id;
                                    const isCompleted = lesson.progress?.completed;

                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setCurrentLesson(lesson)}
                                            className={cn(
                                                "w-full flex items-start text-left p-2 rounded-lg text-sm transition-colors group",
                                                isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 text-slate-700"
                                            )}
                                        >
                                            <div className="mt-0.5 mr-2 flex-shrink-0">
                                                {isCompleted ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : lesson.type === 'video' ? (
                                                    <PlayCircle className={cn("w-4 h-4", isSelected ? "text-blue-500" : "text-slate-400")} />
                                                ) : (
                                                    <FileText className={cn("w-4 h-4", isSelected ? "text-blue-500" : "text-slate-400")} />
                                                )}
                                            </div>
                                            <span className={cn("line-clamp-2", isCompleted && "text-slate-400 decoration-slate-400")}>
                                                {lesson.title}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Toggle Sidebar Button (Mobile/Desktop) */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur shadow-sm rounded-lg hover:bg-white transition-colors"
                >
                    <Menu className="w-5 h-5 text-slate-700" />
                </button>

                <div className="flex-1 overflow-y-auto bg-slate-900 flex items-center justify-center">
                    {currentLesson.type === 'video' ? (
                        <div className="w-full max-w-4xl aspect-video bg-black shadow-2xl relative">
                            {/* Placeholder for Mux Player until configured */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-lg font-medium">동영상 플레이어 영역</p>
                                <p className="text-sm text-slate-400 mt-2">Mux Playback ID: {currentLesson.content || '미설정'}</p>
                            </div>
                            {/* 
                            <MuxPlayer
                                streamType="on-demand"
                                playbackId={currentLesson.content}
                                metadata={{
                                    video_id: currentLesson.id,
                                    video_title: currentLesson.title,
                                    viewer_user_id: "user-id-placeholder",
                                }}
                                onEnded={() => handleLessonComplete(true)}
                                primaryColor="#2563eb"
                            /> 
                            */}
                        </div>
                    ) : (
                        <div className="w-full max-w-3xl bg-white min-h-[50%] p-8 rounded-xl shadow-lg m-4 self-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">{currentLesson.title}</h2>
                            <div className="prose prose-slate max-w-none">
                                {currentLesson.content || "내용이 없습니다."}
                            </div>
                        </div>
                    )}
                </div>

                {/* specific lesson controls/info footer */}
                <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 line-clamp-1">{currentLesson.title}</h1>
                        <p className="text-sm text-slate-500">
                            {/* Nav info or module name could go here */}
                            {course.modules?.find((m: any) => m.id === currentLesson.module_id)?.title}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleLessonComplete(!currentLesson.progress?.completed)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border",
                                currentLesson.progress?.completed
                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            <CheckCircle className={cn("w-4 h-4", currentLesson.progress?.completed && "fill-current")} />
                            {currentLesson.progress?.completed ? "학습 완료됨" : "학습 완료로 표시"}
                        </button>

                        {/* Next Navigation Logic would need index calculation */}
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            다음 강의 &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
