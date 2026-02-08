"use client";

import { useState, useEffect } from "react";
import { Exam, Question } from "@/types/exam";
import { useExamSecurity } from "@/hooks/use-exam-security";
import { AlertTriangle, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { submitExam } from "../actions";

interface ExamRoomClientProps {
    exam: Exam;
    questions: (Question & { points: number; order: number })[];
}

export function ExamRoomClient({ exam, questions }: ExamRoomClientProps) {
    const router = useRouter();
    const [hasStarted, setHasStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState((exam.time_limit || 60) * 60); // seconds
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Anti-cheating hook
    const { warnings, requestFullScreen } = useExamSecurity({
        onViolation: (type) => {
            console.log("Violation detected:", type);
            // In a real app, you might auto-submit or disqualify here
        }
    });

    // Timer
    useEffect(() => {
        if (!hasStarted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, timeLeft]);

    const handleStart = () => {
        if (confirm("시험을 시작하시겠습니까? 시작하면 타이머가 작동하며 멈출 수 없습니다.")) {
            requestFullScreen();
            setHasStarted(true);
        }
    };

    const handleSubmit = async () => {
        if (!confirm("정말 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.")) return;

        setIsSubmitting(true);
        try {
            const timeSpent = (exam.time_limit || 60) * 60 - timeLeft;
            const result = await submitExam(exam.id, answers, timeSpent);

            if (result.error) {
                alert("제출 중 오류가 발생했습니다: " + result.error);
                return;
            }

            if (result.success) {
                alert("답안이 성공적으로 제출되었습니다.");
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
            alert("제출 중 알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    // Format time mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!hasStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{exam.title}</h1>
                        <p className="text-slate-500">{exam.description}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 text-left space-y-3">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> 주의사항
                        </h3>
                        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                            <li>시험이 시작되면 <strong>전체 화면</strong>으로 전환됩니다.</li>
                            <li>화면을 이탈하거나 다른 탭을 열 경우 <strong>경고</strong>가 부여됩니다.</li>
                            <li>복사, 붙여넣기, 마우스 우클릭은 사용할 수 없습니다.</li>
                            <li>제한 시간 내에 답안을 제출해야 합니다.</li>
                        </ul>
                    </div>

                    <div className="flex justify-center gap-4 text-slate-600 font-medium my-4">
                        <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> {exam.time_limit}분</span>
                        <span>|</span>
                        <span>총 {questions.length}문제</span>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        시험 시작하기
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="text-slate-500 hover:text-slate-800 text-sm font-medium"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Timer */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-50">
                <div className="font-bold text-slate-900 truncate max-w-xs">{exam.title}</div>
                <div className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>
                    {formatTime(timeLeft)}
                </div>
                <div className="text-sm font-medium text-amber-600 flex items-center gap-1">
                    {warnings > 0 && (
                        <>
                            <AlertTriangle className="w-4 h-4" /> 경고 {warnings}회
                        </>
                    )}
                </div>
            </header>

            <main className="pt-24 pb-24 max-w-3xl mx-auto px-6 space-y-12">
                {questions.map((question, index) => (
                    <div key={question.id} className="space-y-4">
                        <div className="flex gap-3">
                            <div className="text-lg font-bold text-slate-400">Q{index + 1}.</div>
                            <div className="space-y-4 flex-1">
                                <h3 className="text-lg font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">
                                    {question.content}
                                </h3>

                                <div className="space-y-3">
                                    {question.type === 'multiple_choice' && question.options?.map((option: any, optIndex: number) => (
                                        <label
                                            key={optIndex}
                                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${answers[question.id] === (optIndex + 1).toString()
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`q-${question.id}`}
                                                value={(optIndex + 1).toString()}
                                                checked={answers[question.id] === (optIndex + 1).toString()}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="flex-1">{option.text}</span>
                                        </label>
                                    ))}

                                    {question.type === 'true_false' && (
                                        <div className="flex gap-4">
                                            <label className={`flex-1 p-4 rounded-xl border text-center cursor-pointer transition-all ${answers[question.id] === 'true'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500 font-bold'
                                                : 'border-slate-200 hover:bg-slate-50'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name={`q-${question.id}`}
                                                    value="true"
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    className="hidden"
                                                />
                                                O (그렇다)
                                            </label>
                                            <label className={`flex-1 p-4 rounded-xl border text-center cursor-pointer transition-all ${answers[question.id] === 'false'
                                                ? 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500 font-bold'
                                                : 'border-slate-200 hover:bg-slate-50'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name={`q-${question.id}`}
                                                    value="false"
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    className="hidden"
                                                />
                                                X (아니다)
                                            </label>
                                        </div>
                                    )}

                                    {question.type === 'essay' && (
                                        <textarea
                                            rows={5}
                                            placeholder="답안을 작성하세요..."
                                            value={answers[question.id] || ''}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        ></textarea>
                                    )}
                                </div>
                            </div>
                        </div>
                        {index < questions.length - 1 && <hr className="border-slate-100" />}
                    </div>
                ))}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        {Object.keys(answers).length} / {questions.length} 문제 완료
                    </span>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        제출하기
                    </button>
                </div>
            </footer>
        </div>
    );
}
