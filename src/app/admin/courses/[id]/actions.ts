"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Module Actions
export async function createModule(courseId: string, title: string) {
    const supabase = await createClient();

    // Get max order
    const { data: maxOrder } = await supabase
        .from("modules")
        .select("order")
        .eq("course_id", courseId)
        .order("order", { ascending: false })
        .limit(1)
        .single();

    const nextOrder = (maxOrder?.order ?? -1) + 1;

    const { error } = await supabase
        .from("modules")
        .insert({
            course_id: courseId,
            title,
            order: nextOrder
        });

    if (error) return { error: error.message };
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
}

// Lesson Actions
export async function createLesson(moduleId: string, title: string, type: 'video' | 'text' | 'quiz' = 'video', content: string = '') {
    const supabase = await createClient();

    // Get max order
    const { data: maxOrder } = await supabase
        .from("lessons")
        .select("order")
        .eq("module_id", moduleId)
        .order("order", { ascending: false })
        .limit(1)
        .single();

    const nextOrder = (maxOrder?.order ?? -1) + 1;

    const { error } = await supabase
        .from("lessons")
        .insert({
            module_id: moduleId,
            title,
            type,
            content,
            order: nextOrder
        });

    if (error) return { error: error.message };
    revalidatePath(`/admin/courses/[id]`); // Ideally revalidate the course page
    return { success: true };
}
