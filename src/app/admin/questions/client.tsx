"use client";

import { useState, useActionState } from "react";
import { createQuestion } from "../actions";
import { Question, QuestionType } from "@/types/exam";
import { Plus, X, Loader2, FileText, CheckCircle, HelpCircle } from "lucide-react";

const initialState = {
    message: null,
    error: ""
};

interface QuestionsClientProps {
    initialQuestions: Question[];
}

export function QuestionsClient({ initialQuestions }: QuestionsClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
    const [options, setOptions] = useState([{ id: "1", text: "" }, { id: "2", text: "" }]);
    const [state, formAction, isPending] = useActionState(createQuestion, initialState);

    // Reset modal when successful (you might want a useEffect for state.success if actions returned it)

    const handleAddOption = () => {
        setOptions([...options, { id: (options.length + 1).toString(), text: "" }]);
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const getIconByType = (type: QuestionType) => {
        switch (type) {
            case "multiple_choice": return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case "true_false": return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "essay": return <FileText className="w-4 h-4 text-purple-500" />;
            default: return <HelpCircle className="w-4 h-4 text-slate-500" />;
        }
    };

    const getTypeName = (type: QuestionType) => {
        switch (type) {
            case "multiple_choice": return "객관식";
            case "true_false": return "OX 퀴즈";
            case "essay": return "서술형";
            default: return type;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "easy": return "bg-green-100 text-green-700";
            case "medium": return "bg-yellow-100 text-yellow-700";
            case "hard": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">문제 은행 관리 ({initialQuestions.length})</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    새 문제 등록
                </button>
            </div>

            {/* List View */}
            {initialQuestions.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                    등록된 문제가 없습니다. 새로운 문제를 등록해보세요.
                </div>
            ) : (
                <div className="grid gap-4">
                    {initialQuestions.map((question) => (
                        <div key={question.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 bg-slate-100 text-slate-700`}>
                                        {getIconByType(question.type)}
                                        {getTypeName(question.type)}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(question.difficulty)}`}>
                                        {question.difficulty.toUpperCase()}
                                    </span>
                                    {question.category && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                            {question.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2 line-clamp-2">{question.content}</h3>
                            <div className="text-sm text-slate-500">
                                {new Date(question.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form action={formAction} onSubmit={() => setTimeout(() => setIsModalOpen(false), 1000)}>
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white">
                                <h2 className="text-xl font-bold text-slate-900">새 문제 등록</h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Same form fields as before */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">문제 유형</label>
                                        <select
                                            name="type"
                                            value={questionType}
                                            onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                        >
                                            <option value="multiple_choice">객관식</option>
                                            <option value="true_false">OX 퀴즈</option>
                                            <option value="essay">서술형</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">난이도</label>
                                        <select
                                            name="difficulty"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                        >
                                            <option value="easy">쉬움</option>
                                            <option value="medium">보통</option>
                                            <option value="hard">어려움</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">카테고리</label>
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="예: 문학, 비문학, 문법"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">문제 내용</label>
                                    <textarea
                                        name="content"
                                        rows={4}
                                        placeholder="문제를 입력하세요..."
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                                        required
                                    ></textarea>
                                </div>

                                {questionType === "multiple_choice" && (
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-700">보기 설정</label>
                                        {options.map((option, index) => (
                                            <div key={option.id} className="flex gap-2">
                                                <div className="flex-none w-8 h-10 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 font-medium">
                                                    {index + 1}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={option.text}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    placeholder={`보기 ${index + 1}...`}
                                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                                    required
                                                />
                                                {options.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOption(index)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddOption}
                                            className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" /> 보기 추가
                                        </button>
                                        <input type="hidden" name="options" value={JSON.stringify(options)} />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">정답</label>
                                    {questionType === "multiple_choice" ? (
                                        <select
                                            name="correct_answer"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                        >
                                            {options.map((option, index) => (
                                                <option key={option.id} value={(index + 1).toString()}>
                                                    {index + 1}번 ({option.text.substring(0, 20)}...)
                                                </option>
                                            ))}
                                        </select>
                                    ) : questionType === "true_false" ? (
                                        <select
                                            name="correct_answer"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                        >
                                            <option value="true">O (그렇다)</option>
                                            <option value="false">X (아니다)</option>
                                        </select>
                                    ) : (
                                        <textarea
                                            name="correct_answer"
                                            rows={3}
                                            placeholder="모범 답안..."
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                                            required
                                        ></textarea>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">해설 (선택)</label>
                                    <textarea
                                        name="explanation"
                                        rows={3}
                                        placeholder="해설..."
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                                    ></textarea>
                                </div>

                                {state?.error && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                                        {state.error}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white sticky bottom-0 z-10 rounded-b-2xl">
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
                                    등록하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
