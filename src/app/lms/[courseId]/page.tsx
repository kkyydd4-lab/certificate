"use client";

import { Navbar } from "@/components/navbar";
import { COURSES } from "@/lib/mock-data";
import { ArrowLeft, CheckCircle, Lock, Play } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock lecture list for the player
const LECTURES = [
    { id: 1, title: "1강. 독서논술지도의 이해", duration: "25:00", isCompleted: true },
    { id: 2, title: "2강. 아동 발달과 독서", duration: "32:00", isCompleted: true },
    { id: 3, title: "3강. 갈래별 글쓰기 지도법 (1)", duration: "45:00", isCompleted: false },
    { id: 4, title: "4강. 갈래별 글쓰기 지도법 (2)", duration: "40:00", isCompleted: false },
    { id: 5, title: "5강. 독서 토론 실전 가이드", duration: "50:00", isLocked: true },
];

export default function CoursePlayerPage({ params }: { params: { courseId: string } }) {
    const course = COURSES.find((c) => c.id === params.courseId);

    if (!course) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

                {/* Left: Video Player Area */}
                <div className="flex-1">
                    <Link
                        href="/lms"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        강의 목록으로 돌아가기
                    </Link>

                    <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video relative group">
                        {/* Placeholder for Video Player */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white/50">
                                <Play className="w-16 h-16 mx-auto mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <p>동영상 플레이어가 여기에 로드됩니다.</p>
                            </div>
                        </div>
                        {/* Fake Controls */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                            <div className="h-full w-1/3 bg-blue-600"></div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
                        <p className="text-slate-600 mt-2">{course.description}</p>

                        <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
                            <h3 className="font-bold text-lg mb-4">강의 자료</h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">PDF</div>
                                    <span>1강 강의안.pdf</span>
                                </li>
                                <li className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">PDF</div>
                                    <span>실습 활동지_v1.0.pdf</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right: Curriculum List */}
                <div className="w-full lg:w-96">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-900">커리큘럼</h3>
                            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                                <span>진도율 40%</span>
                                <span>2/5강 완료</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-blue-600 w-[40%]"></div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                            {LECTURES.map((lecture) => (
                                <button
                                    key={lecture.id}
                                    disabled={lecture.isLocked}
                                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start gap-3
                    ${lecture.id === 3 ? "bg-blue-50/50 border-l-4 border-blue-600" : ""}
                    ${lecture.isLocked ? "opacity-50 cursor-not-allowed hover:bg-white" : ""}
                  `}
                                >
                                    <div className="mt-1">
                                        {lecture.isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : lecture.isLocked ? (
                                            <Lock className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <Play className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-medium ${lecture.id === 3 ? "text-blue-700" : "text-slate-700"}`}>
                                            {lecture.title}
                                        </h4>
                                        <span className="text-xs text-slate-400 mt-1 block">{lecture.duration}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
