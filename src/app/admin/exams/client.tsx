"use client";

import { useState, useActionState } from "react";
import { createExam } from "../actions";
import { Exam } from "@/types/exam";
import { Plus, X, Loader2, Calendar, Clock, Trophy, MoreVertical, Edit } from "lucide-react";
import Link from "next/link";

const initialState = {
    message: null,
    error: ""
};

interface ExamsClientProps {
    initialExams: Exam[];
}

export function ExamsClient({ initialExams }: ExamsClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createExam, initialState);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">시험 관리 ({initialExams.length})</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    새 시험 생성
                </button>
            </div>

            {/* List View */}
            {initialExams.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">등록된 시험이 없습니다</h3>
                    <p className="text-slate-500 mb-6">새로운 자격증 시험이나 모의고사를 생성해보세요.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        시험 생성하기
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialExams.map((exam) => (
                        <Link href={`/admin/exams/${exam.id}`} key={exam.id} className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{exam.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${exam.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {exam.is_active ? '진행중' : '준비중'}
                                    </span>
                                </div>
                                <Edit className="w-5 h-5 text-slate-400" />
                            </div>

                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">
                                {exam.description || "설명이 없습니다."}
                            </p>

                            <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {exam.time_limit}분
                                </div>
                                <div className="flex items-center gap-1">
                                    <Trophy className="w-4 h-4" />
                                    {exam.passing_score}점 합격
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg">
                        <form action={formAction} onSubmit={() => setTimeout(() => setIsModalOpen(false), 1000)}>
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900">새 시험 생성</h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Form fields same as before... */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">시험 제목</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">설명</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> 제한 시간 (분)
                                        </label>
                                        <input
                                            type="number"
                                            name="time_limit"
                                            defaultValue={60}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            <Trophy className="w-4 h-4" /> 합격 점수
                                        </label>
                                        <input
                                            type="number"
                                            name="passing_score"
                                            defaultValue={60}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                            required
                                        />
                                    </div>
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
                                    생성하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
