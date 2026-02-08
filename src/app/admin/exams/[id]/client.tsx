"use client";

import { useState } from "react";
import { Exam, Question } from "@/types/exam";
import { addQuestionToExam, removeQuestionFromExam, updateExam } from "../../actions";
import {
    ArrowLeft, Plus, X, Loader2, Save, Clock, Trophy,
    CheckCircle, FileText, Trash2, GripVertical, Settings,
    Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ExamDetailClientProps {
    exam: Exam;
    linkedQuestions: (Question & { order: number; points: number })[];
    allQuestions: Question[];
}

export function ExamDetailClient({ exam, linkedQuestions, allQuestions }: ExamDetailClientProps) {
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        title: exam.title,
        description: exam.description || "",
        time_limit: exam.time_limit || 60,
        passing_score: exam.passing_score || 60,
        is_active: exam.is_active || false
    });

    // Filter out already linked questions
    const linkedIds = new Set(linkedQuestions.map(q => q.id));
    const availableQuestions = allQuestions.filter(q => !linkedIds.has(q.id));

    const handleAddQuestion = async (questionId: string) => {
        setLoading(questionId);
        const order = linkedQuestions.length;
        const result = await addQuestionToExam(exam.id, questionId, order);
        if (result.error) {
            alert("문제 추가 실패: " + result.error);
        }
        setLoading(null);
        router.refresh();
    };

    const handleRemoveQuestion = async (questionId: string) => {
        if (!confirm("이 문제를 시험에서 제거하시겠습니까?")) return;
        setLoading(questionId);
        const result = await removeQuestionFromExam(exam.id, questionId);
        if (result.error) {
            alert("문제 제거 실패: " + result.error);
        }
        setLoading(null);
        router.refresh();
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        const result = await updateExam(exam.id, settings);
        if (result.error) {
            alert("저장 실패: " + result.error);
        } else {
            setIsSettingsOpen(false);
        }
        setSaving(false);
        router.refresh();
    };

    const handleToggleActive = async () => {
        setSaving(true);
        const result = await updateExam(exam.id, { is_active: !exam.is_active });
        if (result.error) {
            alert("상태 변경 실패: " + result.error);
        }
        setSaving(false);
        router.refresh();
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "multiple_choice": return "객관식";
            case "true_false": return "OX";
            case "essay": return "서술형";
            default: return type;
        }
    };

    const totalPoints = linkedQuestions.reduce((sum, q) => sum + (q.points || 10), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/exams" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">{exam.title}</h1>
                    <p className="text-slate-500 text-sm">{exam.description || "설명 없음"}</p>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Settings className="w-5 h-5 text-slate-600" />
                </button>
                <button
                    onClick={handleToggleActive}
                    disabled={saving || linkedQuestions.length === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${exam.is_active
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        } disabled:opacity-50`}
                >
                    {exam.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {exam.is_active ? "비활성화" : "활성화"}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{linkedQuestions.length}</div>
                    <div className="text-sm text-slate-500">문제 수</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
                    <div className="text-sm text-slate-500">총점</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600">{exam.time_limit}분</div>
                    <div className="text-sm text-slate-500">제한 시간</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{exam.passing_score}점</div>
                    <div className="text-sm text-slate-500">합격 점수</div>
                </div>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-xl border border-slate-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">시험 문제 목록</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        문제 추가
                    </button>
                </div>

                {linkedQuestions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="mb-4">등록된 문제가 없습니다.</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            문제 은행에서 추가하기
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {linkedQuestions.map((question, index) => (
                            <div key={question.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
                                <div className="text-slate-400 cursor-grab">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-900 font-medium truncate">{question.content}</p>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded">{getTypeLabel(question.type)}</span>
                                        <span>{question.points || 10}점</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveQuestion(question.id)}
                                    disabled={loading === question.id}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading === question.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Question Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">문제 은행에서 추가</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {availableQuestions.length === 0 ? (
                                <div className="text-center text-slate-500 py-8">
                                    <p>추가할 수 있는 문제가 없습니다.</p>
                                    <Link href="/admin/questions" className="text-blue-600 hover:underline mt-2 inline-block">
                                        문제 은행에서 새 문제 만들기
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {availableQuestions.map((question) => (
                                        <div key={question.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-900 font-medium line-clamp-2">{question.content}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <span className="px-2 py-0.5 bg-slate-100 rounded">{getTypeLabel(question.type)}</span>
                                                    <span className={`px-2 py-0.5 rounded ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                            question.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>{question.difficulty}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAddQuestion(question.id)}
                                                disabled={loading === question.id}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {loading === question.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                                추가
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-full py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">시험 설정</h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-slate-800">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">시험 제목</label>
                                <input
                                    type="text"
                                    value={settings.title}
                                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">설명</label>
                                <textarea
                                    value={settings.description}
                                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> 제한 시간 (분)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.time_limit}
                                        onChange={(e) => setSettings({ ...settings, time_limit: parseInt(e.target.value) || 60 })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                                        <Trophy className="w-4 h-4" /> 합격 점수
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.passing_score}
                                        onChange={(e) => setSettings({ ...settings, passing_score: parseInt(e.target.value) || 60 })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Save className="w-4 h-4" />
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
