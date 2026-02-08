"use server";

import { getExamWithQuestions, getQuestions } from "../../actions";
import { ExamDetailClient } from "./client";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ExamDetailPage({ params }: PageProps) {
    const { id } = await params;
    const { exam, questions: linkedQuestions } = await getExamWithQuestions(id);
    const allQuestions = await getQuestions();

    if (!exam) {
        redirect("/admin/exams");
    }

    return (
        <ExamDetailClient
            exam={exam}
            linkedQuestions={linkedQuestions}
            allQuestions={allQuestions}
        />
    );
}
