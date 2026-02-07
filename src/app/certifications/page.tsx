"use client";

import { Navbar } from "@/components/navbar";
import { Award, Download, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for completed courses eligible for certification
const COMPLETED_COURSES = [
    {
        id: "lecture-1",
        title: "독서논술지도사 1급 과정",
        completionDate: "2024.02.01",
        score: 95,
        isIssued: true,
        certNumber: "KREA-2024-0012",
    },
    {
        id: "lecture-3",
        title: "초등 글쓰기 지도법 특강",
        completionDate: "2024.02.15",
        score: 88,
        isIssued: false, // Certified but not yet issued by user
        certNumber: null,
    },
];

export default function CertificationsPage() {
    const [issuedCerts, setIssuedCerts] = useState(COMPLETED_COURSES);

    const handleIssue = (courseId: string) => {
        // Simulate API call to issue certificate
        const updated = issuedCerts.map(c => {
            if (c.id === courseId) {
                return { ...c, isIssued: true, certNumber: `KREA-2024-${Math.floor(Math.random() * 10000)}` };
            }
            return c;
        });
        setIssuedCerts(updated);
        alert("자격증이 성공적으로 발급되었습니다!");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">자격증 관리</h1>
                    <p className="text-slate-600 mt-2">취득한 자격증을 확인하고 발급받을 수 있습니다.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            취득 현황
                        </h2>
                        <span className="text-sm text-slate-500">총 {issuedCerts.length}개</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {issuedCerts.map((cert) => (
                            <div key={cert.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 text-lg">{cert.title}</h3>
                                        {cert.isIssued ? (
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">발급 완료</span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">미발급</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-500 space-y-1">
                                        <p>수료일: {cert.completionDate} | 종합 점수: {cert.score}점</p>
                                        {cert.certNumber && <p>자격 번호: {cert.certNumber}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {cert.isIssued ? (
                                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                                            <Download className="w-4 h-4" />
                                            PDF 다운로드
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleIssue(cert.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm animate-pulse"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            자격증 발급받기
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {issuedCerts.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>아직 취득한 자격증이 없습니다.</p>
                            <Link href="/lms" className="text-blue-600 hover:underline mt-2 inline-block">
                                강의 수강하러 가기
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-2">💡 자격증 발급 안내</h3>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                        <li>진도율 90% 이상, 최종 시험 60점 이상 합격 시 자격증 발급이 가능합니다.</li>
                        <li>발급된 자격증은 [PDF 다운로드]를 통해 영구 소장하실 수 있습니다.</li>
                        <li>실물 자격증(상장형/카드형) 신청은 별도 문의 바랍니다.</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
