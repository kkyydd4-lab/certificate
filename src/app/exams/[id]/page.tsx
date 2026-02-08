"use server";

import { createClient } from "@/utils/supabase/server";
import { Exam, Question, ExamQuestion } from "@/types/exam";
import { ExamRoomClient } from "./client";
import { notFound } from "next/navigation";

export default async function ExamRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fetch Exam Details
    const { data: exam, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("id", id)
        .single();

    if (examError || !exam) {
        notFound();
    }

    if (!exam.is_active) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-slate-900">준비 중인 시험입니다.</h1>
                    <p className="text-slate-500 mt-2">관리자의 승인을 기다려주세요.</p>
                </div>
            </div>
        );
    }

    // 2. Fetch Questions for this Exam
    const { data: examQuestions, error: questionsError } = await supabase
        .from("exam_questions")
        .select(`
            *,
            question:questions (*)
        `)
        .eq("exam_id", id)
        .order("order", { ascending: true });

    if (questionsError) {
        console.error("Error fetching questions:", questionsError);
        return <div>문제를 불러오는 중 오류가 발생했습니다.</div>;
    }

    // Transform to cleaner structure
    const questions = examQuestions.map((eq) => ({
        ...eq.question,
        points: eq.points,
        order: eq.order
    }));

    return (
        <ExamRoomClient
            exam={exam as Exam}
            questions={questions as (Question & { points: number, order: number })[]}
        />
    );
}
