"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCourseWithLessons(courseId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Course
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

    if (!course) return null;

    // Fetch Modules and Lessons with Progress
    const { data: modules } = await supabase
        .from("modules")
        .select(`
            *,
            lessons (
                *,
                lesson_progress (
                    completed,
                    last_watched_at,
                    user_id
                )
            )
        `)
        .eq("course_id", courseId)
        .order("order", { ascending: true });

    // Process data to include progress in a clean way & sort lessons
    const modulesWithProgress = modules?.map((mod) => ({
        ...mod,
        lessons: mod.lessons
            ?.map((lesson: any) => ({
                ...lesson,
                isCompleted: user ? lesson.lesson_progress?.some((p: any) => p.user_id === user.id && p.completed) : false
            }))
            .sort((a: any, b: any) => a.order - b.order)
    })) || [];

    // Calculate progress
    const allLessons = modulesWithProgress.flatMap(m => m.lessons || []);
    const completedLessons = allLessons.filter((l: any) => l.isCompleted);
    const progressPercent = allLessons.length > 0
        ? Math.round((completedLessons.length / allLessons.length) * 100)
        : 0;

    return {
        ...course,
        modules: modulesWithProgress,
        totalLessons: allLessons.length,
        completedLessons: completedLessons.length,
        progressPercent
    };
}

export async function markLessonComplete(lessonId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("lesson_progress")
        .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            last_watched_at: new Date().toISOString()
        }, {
            onConflict: 'user_id, lesson_id'
        });

    if (error) return { error: error.message };

    revalidatePath(`/lms`);
    return { success: true };
}

export async function markLessonIncomplete(lessonId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("lesson_progress")
        .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: false,
            last_watched_at: new Date().toISOString()
        }, {
            onConflict: 'user_id, lesson_id'
        });

    if (error) return { error: error.message };

    revalidatePath(`/lms`);
    return { success: true };
}
