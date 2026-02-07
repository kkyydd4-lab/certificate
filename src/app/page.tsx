import { Navbar } from "@/components/navbar";
import { ArrowRight, BookOpenCheck, Award, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-6xl">
              대한민국 독서논술의 표준
              <span className="block text-blue-600 mt-2">한국독서논술협회</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600">
              체계적인 교육과정과 전문적인 자격증 시스템으로
              <br className="hidden sm:inline" />
              당신의 독서논술 지도 역량을 증명하세요.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/certifications"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                자격증 과정 알아보기
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
              >
                협회 소개
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">공신력 있는 자격증</h3>
                <p className="text-slate-600">
                  독서토론논술지도사 및 전문강사 자격증을 통해
                  전문성을 인정받고 경력을 개발하세요.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <BookOpenCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">체계적인 커리큘럼</h3>
                <p className="text-slate-600">
                  이론부터 실전 지도법까지, 현장 전문가들이 설계한
                  단계별 맞춤형 교육 과정을 제공합니다.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">강사 네트워크</h3>
                <p className="text-slate-600">
                  전국 독서논술 지도사들과의 교류와 정보 공유를 통해
                  함께 성장하는 커뮤니티를 경험하세요.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-slate-900 text-slate-400 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>© 2024 한국독서논술협회. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
