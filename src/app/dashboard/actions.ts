"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch Profile for Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const role = profile?.role || 'student';

    if (role === 'student') {
        // 1. Enrolled Courses (Active)
        const { data: enrollments, count: enrollmentCount } = await supabase
            .from("enrollments")
            .select(`
                *,
                course:courses(title, thumbnail_url, id)
            `, { count: 'exact' })
            .eq("user_id", user.id)
            .eq("status", "active");

        // 2. Completed Certifications
        const { count: certCount } = await supabase
            .from("certifications")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", user.id);

        // 3. Upcoming/Available Exams (Mock logic for now, or fetch from exams table)
        const { data: exams } = await supabase
            .from("exams")
            .select("*")
            .eq("is_published", true)
            .limit(3);

        return {
            role,
            stats: {
                activeCourses: enrollmentCount || 0,
                completedCerts: certCount || 0,
                averageScore: 0, // Placeholder
            },
            recentCourses: enrollments?.slice(0, 3).map((e: any) => ({
                id: e.course.id,
                title: e.course.title,
                progress: e.progress,
                thumbnail: e.course.thumbnail_url
            })) || [],
            upcomingExams: exams || []
        };
    } else {
        // Admin/Instructor Stats
        const { count: studentCount } = await supabase
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .eq("role", "student");

        const { count: courseCount } = await supabase
            .from("courses")
            .select("*", { count: 'exact', head: true });

        const { count: examCount } = await supabase
            .from("exams")
            .select("*", { count: 'exact', head: true });

        return {
            role,
            stats: {
                totalStudents: studentCount || 0,
                totalCourses: courseCount || 0,
                totalExams: examCount || 0
            }
        };
    }
}
