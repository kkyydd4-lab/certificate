"use client";

import { useState } from "react";
import { Award, Download, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

interface MyCertificationsClientProps {
    initialCertifications: any[];
}

export function MyCertificationsClient({ initialCertifications }: MyCertificationsClientProps) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900">내 자격증</h1>
                <p className="text-slate-500">취득한 자격증을 확인하고 증명서를 발급받으세요.</p>
            </div>

            {initialCertifications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">취득한 자격증이 없습니다</h3>
                    <p className="text-slate-500 mb-6">강의를 수료하고 자격증을 취득해보세요!</p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        강의 목록 보러가기
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initialCertifications.map((cert) => (
                        <div key={cert.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            {/* Certificate Preview Frame */}
                            <div className="bg-slate-900 p-8 relative overflow-hidden text-center border-b border-slate-100 h-64 flex flex-col items-center justify-center">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

                                {/* Certificate Content */}
                                <div className="relative z-10 w-full">
                                    <div className="w-12 h-12 mx-auto bg-blue-800/50 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm border border-blue-700">
                                        <Award className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <h4 className="text-white font-serif font-bold text-xl mb-1 tracking-wide">독서논술지도사 1급</h4>
                                    <p className="text-blue-200 text-[10px] uppercase tracking-[0.2em] font-medium mb-6">Korea Reading & Essay Association</p>

                                    <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        <span>Official Certification</span>
                                    </div>
                                </div>

                                {/* Association Seal */}
                                <div className="absolute -bottom-6 -right-6 w-28 h-28 border-4 border-red-600 rounded-full flex items-center justify-center text-red-600 font-serif font-bold opacity-80 rotate-[-15deg] mix-blend-screen pointer-events-none select-none">
                                    <div className="w-full h-full border border-red-600 rounded-full m-1 flex items-center justify-center flex-col leading-tight text-center pt-2">
                                        <span className="text-[10px] block mb-0.5">사단법인</span>
                                        <span className="text-sm block">한국독서</span>
                                        <span className="text-sm block">논술협회</span>
                                        <span className="text-[10px] block mt-0.5">인</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details & Actions */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1">
                                        {cert.course?.title || "삭제된 강의"}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                        <span>No. {cert.cert_number}</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(cert.issued_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-100 p-1.5 rounded-md">
                                                <Award className="w-4 h-4 text-blue-700" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">인증 기관</p>
                                                <p className="text-[10px] text-slate-500">가치인 독서교육연구소</p>
                                            </div>
                                        </div>
                                        <button className="text-blue-600 text-xs font-bold hover:underline">
                                            인증 확인
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold text-sm transition-all shadow-md active:scale-[0.98]">
                                            <Download className="w-4 h-4" />
                                            자격증 PDF 다운로드
                                        </button>

                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 font-bold text-sm transition-all border border-indigo-200 group-hover:border-indigo-300">
                                            <Download className="w-4 h-4" />
                                            창업 가이드북 받기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
