import { ExamsClient } from "./client";
import { getExams } from "../actions";

export default async function ExamsPage() {
    const exams = await getExams();

    return <ExamsClient initialExams={exams} />;
}
