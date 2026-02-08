"use server";

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { CoursePlayerClient } from "./client";
import { getCourseWithProgress } from "./actions";

export default async function CoursePlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await getCourseWithProgress(id);

    if (!course) notFound();

    return <CoursePlayerClient course={course} />;
}
