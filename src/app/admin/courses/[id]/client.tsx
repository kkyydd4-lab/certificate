"use client";

import { useState } from "react";
import { createModule, createLesson } from "./actions";
import { Plus, GripVertical, Video, FileText, ChevronDown, ChevronRight, Loader2 } from "lucide-react";

interface CurriculumBuilderProps {
    course: any;
    initialModules: any[];
}

export function CurriculumBuilder({ course, initialModules }: CurriculumBuilderProps) {
    const [modules, setModules] = useState(initialModules);
    const [isCreatingModule, setIsCreatingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    // Lesson creation state
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [newLessonTitle, setNewLessonTitle] = useState("");

    const handleCreateModule = async () => {
        if (!newModuleTitle.trim()) return;
        await createModule(course.id, newModuleTitle);
        setNewModuleTitle("");
        setIsCreatingModule(false);
        // Optimistic update or refresh handled by Next.js revalidatePath if strict
        // For smoother UX, we might reload or rely on server action returning data
        window.location.reload();
    };

    const handleCreateLesson = async (moduleId: string) => {
        if (!newLessonTitle.trim()) return;
        await createLesson(moduleId, newLessonTitle, 'video');
        setNewLessonTitle("");
        setActiveModuleId(null);
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
                    <p className="text-slate-500 mt-1">커리큘럼 구성</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium">
                        미리보기
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        게시하기
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[500px]">
                {/* Modules List */}
                <div className="space-y-4">
                    {modules.map((module) => (
                        <div key={module.id} className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="text-slate-400 cursor-move" />
                                    <span className="font-bold text-slate-900">{module.title}</span>
                                    <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                        {module.lessons?.length || 0} 강의
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}
                                        className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"
                                    >
                                        + 강의 추가
                                    </button>
                                </div>
                            </div>

                            {/* Lessons List */}
                            <div className="divide-y divide-slate-100 bg-white">
                                {module.lessons?.map((lesson: any) => (
                                    <div key={lesson.id} className="p-3 pl-10 flex items-center justify-between hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            {lesson.type === 'video' ? (
                                                <Video className="w-4 h-4 text-slate-400" />
                                            ) : (
                                                <FileText className="w-4 h-4 text-slate-400" />
                                            )}
                                            <span className="text-slate-700 text-sm">{lesson.title}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {lesson.duration > 0 ? `${Math.floor(lesson.duration / 60)}분` : '컨텐츠 없음'}
                                        </span>
                                    </div>
                                ))}

                                {/* Add Lesson Input */}
                                {activeModuleId === module.id && (
                                    <div className="p-3 pl-10 bg-blue-50 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newLessonTitle}
                                            onChange={(e) => setNewLessonTitle(e.target.value)}
                                            placeholder="강의 제목 입력..."
                                            className="flex-1 px-3 py-1.5 border border-blue-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateLesson(module.id)}
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleCreateLesson(module.id)}
                                            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                            추가
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add Module Button */}
                    {isCreatingModule ? (
                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 flex items-center gap-3">
                            <input
                                type="text"
                                value={newModuleTitle}
                                onChange={(e) => setNewModuleTitle(e.target.value)}
                                placeholder="새 섹션 제목 (예: 1장. 오리엔테이션)"
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateModule()}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreateModule}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                                >
                                    추가
                                </button>
                                <button
                                    onClick={() => setIsCreatingModule(false)}
                                    className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-sm"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreatingModule(true)}
                            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            섹션 추가하기
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
