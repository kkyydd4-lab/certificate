"use server";

import { getCourses } from "../actions";
import { CoursesClient } from "./client";

export default async function CoursesPage() {
    // Fetch courses on server
    const courses = await getCourses();

    return <CoursesClient initialCourses={courses} />;
}
