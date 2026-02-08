"use client";

import { Exam } from "@/types/exam";
import { Clock, Trophy, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface ExamsListClientProps {
    exams: Exam[];
}

export function ExamsListClient({ exams }: ExamsListClientProps) {
    if (exams.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">진행 중인 시험이 없습니다</h3>
                <p className="text-slate-500">현재 응시 가능한 시험이 없습니다. 나중에 다시 확인해주세요.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                    <div className="mb-4">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-2">
                            자격증 과정
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{exam.title}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2 h-10">
                            {exam.description || "설명이 없습니다."}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{exam.time_limit}분</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 text-slate-400" />
                            <span>{exam.passing_score}점 합격</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <Link
                            href={`/exams/${exam.id}`}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            시험 시작하기
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
