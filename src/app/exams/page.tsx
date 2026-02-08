"use server";

import { createClient } from "@/utils/supabase/server";
import { Exam } from "@/types/exam";
import { ExamsListClient } from "./client";

export default async function StudentExamsPage() {
    const supabase = await createClient();

    // Fetch active exams only
    const { data: exams, error } = await supabase
        .from("exams")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching exams:", error);
        return <div>Error loading exams</div>;
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">시험 응시</h1>
                <p className="text-slate-500 mt-2">
                    현재 응시 가능한 자격 시험 목록입니다.
                </p>
            </header>

            <ExamsListClient exams={exams as Exam[]} />
        </div>
    );
}
