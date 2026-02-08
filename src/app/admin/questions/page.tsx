import { QuestionsClient } from "./client";
import { getQuestions } from "../actions";

export default async function QuestionsPage() {
    const questions = await getQuestions();

    return <QuestionsClient initialQuestions={questions} />;
}
