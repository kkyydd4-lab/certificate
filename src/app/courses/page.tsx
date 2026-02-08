"use server";

import { createClient } from "@/utils/supabase/server";
import { getMyEnrollments } from "./actions";
import { CourseListClient } from "./client";

export default async function StudentCoursesPage() {
    const supabase = await createClient();
    const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

    const enrollments = await getMyEnrollments();

    // Merge enrollment status into courses for UI
    const coursesWithStatus = courses?.map(course => ({
        ...course,
        enrollment: enrollments?.find((e: any) => e.course_id === course.id)
    }))?.filter((c: any) => c.is_published) || [];

    return <CourseListClient courses={coursesWithStatus} />;
}
