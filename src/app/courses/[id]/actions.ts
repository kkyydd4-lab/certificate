"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCourseWithProgress(courseId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch Course
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

    if (!course) return null;

    // Fetch Modules and Lessons
    const { data: modules } = await supabase
        .from("modules")
        .select(`
            *,
            lessons (
                *,
                lesson_progress (
                    completed,
                    last_watched_at
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
                progress: lesson.lesson_progress?.find((p: any) => p.user_id === user.id) || null
            }))
            .sort((a: any, b: any) => a.order - b.order)
    }));

    return {
        ...course,
        modules: modulesWithProgress
    };
}

export async function updateLessonProgress(lessonId: string, completed: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("lesson_progress")
        .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            completed,
            last_watched_at: new Date().toISOString()
        }, {
            onConflict: 'user_id, lesson_id'
        });

    if (error) return { error: error.message };

    revalidatePath(`/courses/[id]`); // We'll need the course ID to be specific, but this pattern invalidates the dynamic route
    return { success: true };
}
