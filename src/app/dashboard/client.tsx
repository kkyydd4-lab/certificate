"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Trophy, Users, FileText, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardClientProps {
    data: any;
}

export function DashboardClient({ data }: DashboardClientProps) {
    if (!data) return <div>Loading...</div>;

    const { role, stats, recentCourses, upcomingExams } = data;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">
                {role === 'student' ? '나의 학습 현황' : '관리자 대시보드'}
            </h1>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                {role === 'student' ? (
                    <>
                        <StatsCard
                            title="수강 중인 강의"
                            value={stats.activeCourses}
                            icon={BookOpen}
                            description="현재 학습 중"
                        />
                        <StatsCard
                            title="취득 자격증"
                            value={stats.completedCerts}
                            icon={GraduationCap}
                            description="발급 완료"
                        />
                        <StatsCard
                            title="평균 점수"
                            value={`${stats.averageScore}점`}
                            icon={Trophy}
                            description="최근 시험 기준"
                        />
                    </>
                ) : (
                    <>
                        <StatsCard
                            title="총 수강생"
                            value={stats.totalStudents}
                            icon={Users}
                            description="등록된 학생 수"
                        />
                        <StatsCard
                            title="개설된 강의"
                            value={stats.totalCourses}
                            icon={BookOpen}
                            description="운영 중인 강좌"
                        />
                        <StatsCard
                            title="등록된 시험"
                            value={stats.totalExams}
                            icon={FileText}
                            description="문제 은행 포함"
                        />
                    </>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Content Area (Courses / Student List) */}
                <Card className="col-span-4 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>{role === 'student' ? '최근 학습 중인 강의' : '최근 개설된 강의'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {role === 'student' ? (
                            <div className="space-y-4">
                                {recentCourses.length > 0 ? (
                                    recentCourses.map((course: any) => (
                                        <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                            <div className="h-12 w-20 bg-slate-200 rounded overflow-hidden flex-shrink-0 relative">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt="" className="object-cover w-full h-full" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-400">
                                                        <PlayCircle className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-slate-900 truncate">{course.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{course.progress}%</span>
                                                </div>
                                            </div>
                                            <Link href={`/courses/${course.id}`} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                                                이어하기
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500 text-sm">
                                        수강 중인 강의가 없습니다.
                                        <br />
                                        <Link href="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
                                            강의 둘러보기
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-500">
                                관리자용 최근 활동 목록 (준비중)
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Side Content Area (Exams / Notifications) */}
                <Card className="col-span-3 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>{role === 'student' ? '예정된 시험' : '빠른 작업'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {role === 'student' ? (
                            <div className="space-y-4">
                                {upcomingExams.length > 0 ? (
                                    upcomingExams.map((exam: any) => (
                                        <div key={exam.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                            <div className="p-2 bg-white rounded-md border border-slate-200 text-blue-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm text-slate-900">{exam.title}</h4>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                    <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-600 font-medium">
                                                        {exam.time_limit}분
                                                    </span>
                                                    <span>•</span>
                                                    <span>{exam.passing_score}점 합격</span>
                                                </div>
                                            </div>
                                            <Link href={`/exams/${exam.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-full transition-colors">
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500 text-sm">
                                        예정된 시험이 없습니다.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <QuickActionLink href="/admin/courses" icon={BookOpen} title="강의 관리" description="새 강의 개설 및 수정" />
                                <QuickActionLink href="/admin/exams" icon={FileText} title="시험 관리" description="시험 생성 및 문제 출제" />
                                <QuickActionLink href="/admin/users" icon={Users} title="회원 관리" description="가입자 및 권한 관리" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, description }: any) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <p className="text-xs text-slate-500 mt-1">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function QuickActionLink({ href, icon: Icon, title, description }: any) {
    return (
        <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h4>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-blue-400 transition-colors" />
        </Link>
    );
}
