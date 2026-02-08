export type MediaType = 'video' | 'text' | 'quiz';

export interface Course {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    instructor_id: string | null;
    price: number;
    is_published: boolean;
    created_at: string;
    modules?: Module[];
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    description: string | null;
    order: number;
    created_at: string;
    lessons?: Lesson[];
}

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    type: MediaType;
    content: string | null; // URL or text content
    duration: number; // seconds
    order: number;
    is_free: boolean;
    created_at: string;
    progress?: LessonProgress;
}

export interface LessonProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    completed: boolean;
    last_watched_at: string;
}
