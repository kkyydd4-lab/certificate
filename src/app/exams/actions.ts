"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitExam(examId: string, answers: Record<string, string>, timeSpent: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    // 1. Fetch Exam and Questions with Correct Answers
    const { data: examQuestions, error: fetchError } = await supabase
        .from("exam_questions")
        .select(`
            points,
            question:questions (
                id,
                type,
                correct_answer
            )
        `)
        .eq("exam_id", examId);

    if (fetchError || !examQuestions) {
        console.error("Error fetching exam data:", fetchError);
        return { error: "Failed to process submission" };
    }

    // 2. Calculate Score
    let totalScore = 0;
    let earnedScore = 0;
    const gradedAnswers: Record<string, { answer: string; is_correct: boolean; points: number }> = {};

    examQuestions.forEach((eq: any) => {
        const q = eq.question;
        const studentAnswer = answers[q.id];
        const point = eq.points || 0;
        totalScore += point;

        let isCorrect = false;

        // Simple grading logic for now
        if (q.type === "multiple_choice" || q.type === "true_false") {
            if (studentAnswer === q.correct_answer) {
                isCorrect = true;
                earnedScore += point;
            }
        } else {
            // Essay questions: Mark as correct for now or leave for manual review
            // For this phase, we'll just save it. Logic can be expanded.
            // isCorrect = false; // Pending review
        }

        gradedAnswers[q.id] = {
            answer: studentAnswer,
            is_correct: isCorrect,
            points: isCorrect ? point : 0
        };
    });

    // 3. Determine Pass/Fail (Fetch passing score from exam)
    const { data: exam } = await supabase
        .from("exams")
        .select("passing_score")
        .eq("id", examId)
        .single();

    const passed = earnedScore >= (exam?.passing_score || 0);

    // 4. Save Submission
    const { data: submission, error: submitError } = await supabase
        .from("exam_submissions")
        .insert({
            exam_id: examId,
            user_id: user.id,
            score: earnedScore,
            passed: passed,
            answers: gradedAnswers,
            status: 'completed',
            started_at: new Date(Date.now() - timeSpent * 1000).toISOString(), // Estimate start time
            submitted_at: new Date().toISOString()
        })
        .select()
        .single();

    if (submitError) {
        console.error("Error saving submission:", submitError);
        return { error: "Failed to save submission" };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/exams/${examId}`);

    return { success: true, submissionId: submission.id };
}
