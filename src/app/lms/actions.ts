"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAllCoursesWithProgress() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch all published courses
    const { data: courses, error } = await supabase
        .from("courses")
        .select(`
            *,
            modules (
                id,
                lessons (
                    id,
                    lesson_progress (
                        completed,
                        user_id
                    )
                )
            )
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching courses:", error);
        return [];
    }

    if (!user) {
        return courses.map(course => ({
            ...course,
            progress: 0,
            totalLessons: course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0,
            completedLessons: 0
        }));
    }

    // Calculate progress for each course
    return courses.map(course => {
        const allLessons = course.modules?.flatMap((m: any) => m.lessons || []) || [];
        const totalLessons = allLessons.length;

        const completedLessons = allLessons.filter((l: any) =>
            l.lesson_progress?.some((p: any) => p.user_id === user.id && p.completed)
        ).length;

        const progress = totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

        return {
            ...course,
            progress,
            totalLessons,
            completedLessons
        };
    });
}
