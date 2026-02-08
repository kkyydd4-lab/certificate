"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createCourse } from "../actions";
import { Plus, X, Loader2, BookOpen, MoreVertical } from "lucide-react";

const initialState = {
    message: null,
    error: ""
};

interface CoursesClientProps {
    initialCourses: any[];
}

export function CoursesClient({ initialCourses }: CoursesClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createCourse, initialState);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">강의 관리 ({initialCourses.length})</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    새 강의 개설
                </button>
            </div>

            {/* List View */}
            {initialCourses.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">개설된 강의가 없습니다</h3>
                    <p className="text-slate-500 mb-6">새로운 동영상 강의를 개설해보세요.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        강의 개설하기
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-slate-100 relative group">
                                {course.thumbnail_url ? (
                                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <BookOpen className="w-10 h-10" />
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                    <span className={`text-xs px-2 py-1 rounded text-white font-medium ${course.is_published ? 'bg-green-500' : 'bg-slate-500'}`}>
                                        {course.is_published ? '게시됨' : '비공개'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-slate-500 text-sm line-clamp-2 h-10 mb-4">
                                    {course.description || "설명이 없습니다."}
                                </p>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <span className="text-lg font-bold text-slate-900">
                                        {course.price > 0 ? `₩${course.price.toLocaleString()}` : "무료"}
                                    </span>
                                    {/* Link to manager will go here */}
                                    <a href={`/admin/courses/${course.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                                        커리큘럼 관리 →
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg">
                        <form action={formAction} onSubmit={() => setTimeout(() => setIsModalOpen(false), 1000)}>
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900">새 강의 개설</h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">강의 제목</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="예: 리액트 마스터 클래스"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">설명</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        placeholder="강의에 대한 설명을 입력하세요..."
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">가격 (원)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="0 (무료)"
                                        min="0"
                                        step="1000"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                    />
                                </div>

                                {state?.error && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                                        {state.error}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    개설하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
