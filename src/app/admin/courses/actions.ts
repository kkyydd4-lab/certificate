"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCourse(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string) || 0;

    // Upload thumbnail if exists
    // For now, we'll skip file upload logic and just take a URL/placeholder
    // const thumbnail = formData.get("thumbnail") as File;

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
            instructor_id: user.id,
            is_published: false
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/courses");
    return { success: true };
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
