"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("enrollments")
        .insert({
            user_id: user.id,
            course_id: courseId,
            status: 'active',
            progress: 0
        });

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { message: "Already enrolled" };
        }
        return { error: error.message };
    }

    revalidatePath("/courses");
    return { success: true };
}

export async function getMyCertifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from("certifications")
        .select(`
            *,
            course:courses(*)
        `)
        .eq("user_id", user.id);

    return data || [];
}

export async function getMyEnrollments() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from("enrollments")
        .select(`
            *,
            course:courses(*)
        `)
        .eq("user_id", user.id);

    return data || [];
}
