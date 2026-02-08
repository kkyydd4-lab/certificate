"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { login } from "../actions";

const initialState = {
    error: "",
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                메인으로 돌아가기
            </Link>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">로그인</h1>
                    <p className="text-slate-500 mt-2">한국독서논술협회에 오신 것을 환영합니다.</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">이메일</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                                name="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">비밀번호</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                                name="password"
                                required
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isPending ? "로그인 중..." : "로그인하기"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    계정이 없으신가요?{" "}
                    <Link href="/register" className="text-blue-600 font-medium hover:underline">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
