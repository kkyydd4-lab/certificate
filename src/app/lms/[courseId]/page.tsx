import { notFound, redirect } from "next/navigation";
import { getCourseWithLessons } from "./actions";
import CoursePlayerClient from "./client";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

export default async function CoursePlayerPage({ params }: PageProps) {
    const { courseId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const courseData = await getCourseWithLessons(courseId);

    if (!courseData) {
        notFound();
    }

    return <CoursePlayerClient course={courseData} />;
}
