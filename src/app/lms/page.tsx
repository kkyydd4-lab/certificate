import { getAllCoursesWithProgress } from "./actions";
import LmsDashboardClient from "./client";

export default async function LmsPage() {
    const courses = await getAllCoursesWithProgress();
    return <LmsDashboardClient courses={courses} />;
}
