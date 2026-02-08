export type QuestionType = 'multiple_choice' | 'essay' | 'true_false';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    content: string;
    type: QuestionType;
    options: QuestionOption[] | null;
    correct_answer: string | null;
    explanation: string | null;
    category: string | null;
    difficulty: Difficulty;
    created_by: string;
    created_at: string;
}

export interface Exam {
    id: string;
    title: string;
    description: string | null;
    time_limit: number | null;
    passing_score: number;
    is_active: boolean;
    created_by: string;
    created_at: string;
}

export interface ExamQuestion {
    exam_id: string;
    question_id: string;
    order: number;
    points: number;
    question?: Question; // For joined queries
}
