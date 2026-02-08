"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { Question, QuestionType, Difficulty, Exam } from "@/types/exam";

// ... existing createQuestion ...

export async function createQuestion(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const content = formData.get("content") as string;
    const type = formData.get("type") as QuestionType;
    const difficulty = formData.get("difficulty") as Difficulty;
    const category = formData.get("category") as string;
    const explanation = formData.get("explanation") as string;
    const correctAnswer = formData.get("correct_answer") as string;

    // Parse options for multiple choice
    let options = null;
    if (type === "multiple_choice") {
        const optionsJson = formData.get("options") as string;
        try {
            options = JSON.parse(optionsJson);
        } catch (e) {
            return { error: "Invalid options format" };
        }
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("questions")
        .insert({
            content,
            type,
            difficulty,
            category,
            explanation,
            correct_answer: correctAnswer,
            options,
            created_by: user.id
        });

    if (error) {
        return { message: null, error: error.message };
    }

    revalidatePath("/admin/questions");
    return { message: "Question created successfully", error: null };
}

export async function getQuestions() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching questions:", error);
        return [];
    }

    return data as Question[];
}

export async function createExam(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const timeLimit = parseInt(formData.get("time_limit") as string);
    const passingScore = parseInt(formData.get("passing_score") as string);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("exams")
        .insert({
            title,
            description,
            time_limit: timeLimit,
            passing_score: passingScore,
            created_by: user.id,
            is_active: false // Default to inactive
        });

    if (error) {
        return { message: null, error: error.message };
    }

    revalidatePath("/admin/exams");
    return { message: "Exam created successfully", error: null };
}

export async function getExams() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching exams:", error);
        return [];
    }

    return data as Exam[];
}

export async function getCourses() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching courses:", error);
        return [];
    }

    return data;
}

export async function getUsers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return data;
}

export async function createCourse(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string) || 0;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("courses")
        .insert({
            title,
            description,
            price,
            created_by: user.id,
            is_published: false
        });

    if (error) {
        return { message: null, error: error.message };
    }

    revalidatePath("/admin/courses");
    return { message: "Course created successfully", error: null };
}

// ========== EXAM QUESTION MANAGEMENT ==========

export async function getExamWithQuestions(examId: string) {
    const supabase = await createClient();

    // Get exam details
    const { data: exam, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("id", examId)
        .single();

    if (examError) {
        console.error("Error fetching exam:", examError);
        return { exam: null, questions: [] };
    }

    // Get questions linked to this exam
    const { data: examQuestions, error: eqError } = await supabase
        .from("exam_questions")
        .select(`
            question_id,
            "order",
            points,
            questions (*)
        `)
        .eq("exam_id", examId)
        .order("order", { ascending: true });

    if (eqError) {
        console.error("Error fetching exam questions:", eqError);
        return { exam, questions: [] };
    }

    const questions = examQuestions?.map((eq: any) => ({
        ...eq.questions,
        order: eq.order,
        points: eq.points
    })) || [];

    return { exam, questions };
}

export async function addQuestionToExam(examId: string, questionId: string, order: number = 0, points: number = 10) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("exam_questions")
        .insert({
            exam_id: examId,
            question_id: questionId,
            order,
            points
        });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, error: null };
}

export async function removeQuestionFromExam(examId: string, questionId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("exam_questions")
        .delete()
        .eq("exam_id", examId)
        .eq("question_id", questionId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, error: null };
}

export async function updateExam(examId: string, updates: { title?: string; description?: string; time_limit?: number; passing_score?: number; is_active?: boolean }) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("exams")
        .update(updates)
        .eq("id", examId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath(`/admin/exams/${examId}`);
    revalidatePath("/admin/exams");
    return { success: true, error: null };
}
