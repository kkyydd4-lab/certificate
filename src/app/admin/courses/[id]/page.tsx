"use server";

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { CurriculumBuilder } from "./client";

export default async function CourseBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Course
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

    if (!course) notFound();

    // Fetch Modules & Lessons
    const { data: modules } = await supabase
        .from("modules")
        .select(`
            *,
            lessons (*)
        `)
        .eq("course_id", id)
        .order("order", { ascending: true });

    // Sort lessons manually if needed (Supabase sorts nested array slightly inconsistently sometimes, but let's try)
    const sortedModules = modules?.map(mod => ({
        ...mod,
        lessons: mod.lessons?.sort((a: any, b: any) => a.order - b.order)
    }));

    return (
        <CurriculumBuilder
            course={course}
            initialModules={sortedModules || []}
        />
    );
}
