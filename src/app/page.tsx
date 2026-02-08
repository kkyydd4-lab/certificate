import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Award, Users, CheckCircle, GraduationCap, ChevronRight, Star, Building2, Download } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white p-2 rounded-lg shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-none tracking-tight">한국독서논술협회(KAEA)</span>
              <span className="text-xs text-blue-800 font-semibold tracking-wide mt-1">가치인(Gachiin) 독서교육연구소 공식 인증 과정</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900">협회 소개</a>
            <a href="#courses" className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900">지도사 과정</a>
            <a href="#certifications" className="hover:text-blue-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-900">자격증 안내</a>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5">
                <Users className="w-4 h-4" />
                마이페이지
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors">
                  로그인
                </Link>
                <Link href="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-900 text-sm font-bold mb-8 border border-blue-100 shadow-sm animate-fade-in-up">
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            2024년도 제1회 자격검정 접수 중 (~3/31)
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            권위와 전문성의 조화, <br />
            <span className="text-blue-900 relative inline-block">
              한국독서논술협회
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
              </svg>
            </span>입니다.
          </h1>
          <p className="text-sm md:text-base font-bold text-slate-500 mb-8 tracking-wider uppercase">
            가치인(Gachiin) 독서교육연구소 공식 인증 과정
          </p>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed break-keep font-medium">
            본 협회는 올바른 독서 문화 확산과 전문적인 독서논술 교육 시스템을 구축하여,
            창의적이고 비판적인 사고를 갖춘 미래 인재를 양성합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="#courses" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 flex items-center justify-center gap-2 transform hover:-translate-y-1">
              교육과정 자세히 보기 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#certifications" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-blue-900" />
              자격증 취득 안내
            </Link>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40">
          <div className="absolute top-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-blue-100 rounded-full blur-3xl mix-blend-multiply filter opacity-70"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-50 rounded-full blur-3xl mix-blend-multiply filter opacity-70"></div>
        </div>
      </section>

      {/* Association Introduction (About) */}
      <section id="about" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold mb-4">
                <Building2 className="w-3 h-3" />
                Since 2008
              </div>
              <h2 className="text-blue-900 font-bold tracking-wider uppercase text-sm mb-3">About KAEA & Gachiin</h2>
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-6 leading-snug">
                16년 교육 노하우의 결정체,<br />가치인의 역사가 곧 협회의 뿌리입니다.
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                한국독서논술협회는 대한민국 대표 독서교육 브랜드 <strong>'가치인(Gachiin) 아카데미'</strong>의 16년 현장 노하우를 학술적 토대로 설립되었습니다.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                단순한 이론 교육이 아닌, <strong className="text-blue-900 font-bold bg-blue-50 px-1">전국 37개 가맹점의 실전 임상 데이터</strong>를 바탕으로 고안된 표준 검정 시스템을 통해 현장에서 즉시 활용 가능한 실무형 인재를 양성합니다.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 transform hover:-translate-y-1 transition-transform">
                  <div className="text-3xl font-bold text-blue-900 mb-1">2008</div>
                  <div className="text-sm text-slate-600 font-medium">설립 연도</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 transform hover:-translate-y-1 transition-transform">
                  <div className="text-3xl font-bold text-blue-900 mb-1">37개</div>
                  <div className="text-sm text-slate-600 font-medium">전국 가맹점 데이터</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 transform hover:-translate-y-1 transition-transform">
                  <div className="text-3xl font-bold text-blue-900 mb-1">15,000+</div>
                  <div className="text-sm text-slate-600 font-medium">누적 수강생</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 transform hover:-translate-y-1 transition-transform">
                  <div className="text-3xl font-bold text-blue-900 mb-1">98%</div>
                  <div className="text-sm text-slate-600 font-medium">자격 취득 만족도</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 group">
                {/* Placeholder for Association Image */}
                <div className="absolute inset-0 bg-blue-900/5 flex items-center justify-center">
                  <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
                    <BookOpen className="w-32 h-32 mx-auto text-blue-900 mb-4" />
                    <p className="font-serif font-bold text-2xl text-blue-900">GACHIIN ACADEMY</p>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-lg">
                  <p className="font-serif italic text-slate-800 text-lg leading-relaxed">
                    "가치인의 현장 경험이<br />대한민국 독서 교육의 표준이 됩니다."
                  </p>
                  <div className="flex items-center justify-end gap-3 mt-4">
                    <div className="h-px w-12 bg-slate-300"></div>
                    <p className="text-sm text-slate-500 font-bold">한국독서논술협회장</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Course Section */}
      <section id="courses" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-900 font-bold tracking-wider uppercase text-sm mb-3">Curriculum</h2>
            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-4">전문 지도사 양성 과정</h3>
            <p className="text-lg text-slate-600">
              가치인 아카데미의 실전 커리큘럼을 그대로! 이론부터 실무까지 완벽하게 마스터하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <CourseCard
              step="01"
              title="독서 교육론"
              description="아동 발달 단계에 따른 독서 지도 원리와 독서 심리의 이해"
              tags={["발달심리", "독서흥미", "도서선정"]}
            />
            <CourseCard
              step="02"
              title="글쓰기 및 토론 지도"
              description="다양한 갈래별 글쓰기 지도법과 하브루타 독서 토론 실습"
              tags={["논설문", "감상문", "토론기법"]}
            />
            <CourseCard
              step="03"
              title="수업 운영 실무"
              description="연간/월간 계획안 작성법 및 학부모 상담, 공부방 창업 노하우"
              tags={["계획안", "상담법", "창업가이드"]}
            />
          </div>

          <div className="mt-12 text-center">
            <Link href="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-xl border-2 border-blue-900 hover:bg-blue-50 transition-colors">
              전체 커리큘럼 보기 <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Certification Guide Section */}
      <section id="certifications" className="py-24 bg-blue-900 text-white scroll-mt-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-blue-200 font-bold tracking-wider uppercase text-sm mb-3">Certification</h2>
              <h3 className="text-4xl font-serif font-bold mb-6 leading-snug">
                공신력 있는 자격증으로<br />전문성을 증명하세요.
              </h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                본 협회의 독서논술지도사 자격증은 한국직업능력연구원에 정식 등록된 민간자격증입니다.
                자격 취득 즉시 현장에서 활용 가능한 전문 교안 작성 능력을 검증합니다.
              </p>

              <ul className="space-y-6">
                <ListItem text="자격명: 독서논술지도사 1급 / 2급" />
                <ListItem text="등록번호: 2024-001234 (한국직업능력연구원 등록)" />
                <ListItem text="검정방법: 필기시험 (객관식/단답형) + 실기시험 (교안작성)" />
                <ListItem text="합격기준: 100점 만점에 60점 이상" />
              </ul>

              <div className="mt-10">
                <Link href="/exams" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg transform hover:-translate-y-1">
                  자격검정 신청하기 <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-white text-slate-900 p-8 rounded-2xl shadow-2xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-900">
                      <Award className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">자격증 활용 분야</h4>
                      <p className="text-sm text-slate-500">Certified Instructor Career Path</p>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-semibold">공부방/교습소/학원 창업</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-semibold">방과후 학교/문화센터 강사 출강</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-semibold">홈스쿨링 및 자녀 교육 지도</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-semibold">가치인(Gachiin) 가맹점 개설 자격 부여</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/20 skew-x-12 transform origin-top-right -z-10"></div>
      </section>

      {/* Franchise Benefit Section (NEW) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold mb-4">
              <Star className="w-3 h-3 fill-indigo-800" />
              Special Benefits
            </div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">
              자격증 취득자만의<br />
              <span className="text-indigo-600">특별한 창업 혜택</span>을 만나보세요
            </h2>
            <p className="text-lg text-slate-600">
              한국독서논술협회 자격증을 취득하시면, 대한민국 1등 독서교육 브랜드 '가치인'의 가맹점 개설 시 파격적인 혜택을 드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Download className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">가맹비 20% 즉시 할인</h3>
              <p className="text-slate-600 leading-relaxed">
                자격증 소지자가 가치인 아카데미 가맹점 개설 시, 초기 가맹비의 20%를 즉시 지원해드립니다.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">초도 물품 패키지 지원</h3>
              <p className="text-slate-600 leading-relaxed">
                수업에 필요한 교재, 배너, 홍보물 등 200만원 상당의 초도 물품 패키지를 무상으로 제공합니다.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">본사 마케팅 지원</h3>
              <p className="text-slate-600 leading-relaxed">
                지역 맘카페 홍보, 블로그 마케팅 가이드 제공 등 초기 원생 모집을 위한 본사의 노하우를 전수합니다.
              </p>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden text-center">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">가맹점 창업 가이드북을 받아보세요</h3>
              <p className="text-indigo-100 mb-8">
                구체적인 창업 비용과 수익 모델, 성공 사례가 담긴 가이드북을 무료로 보내드립니다.
              </p>
              <button className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                창업 가이드북 무료 다운로드
              </button>
            </div>
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">지금 바로 시작하세요</h2>
          <p className="text-lg text-slate-600 mb-10">
            당신의 열정이 아이들의 미래를 밝힙니다.<br />
            한국독서논술협회와 가치인이 든든한 파트너가 되어드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg">
              회원가입하고 시작하기
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              무료 샘플강의 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 text-slate-500 py-16 border-t border-slate-200 font-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6 text-slate-900">
                <BookOpen className="w-6 h-6 text-blue-900" />
                <span className="text-xl font-bold font-serif">한국독서논술협회 | 가치인 독서교육연구소</span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-bold">협회장:</span> 홍길동 | <span className="font-bold">사업자등록번호:</span> 123-80-00000</p>
                <p><span className="font-bold">주소:</span> 서울특별시 마포구 월드컵북로 400, 가치인빌딩 2층</p>
                <p><span className="font-bold">통신판매업신고:</span> 제 2024-서울마포-0000호</p>
                <p><span className="font-bold">개인정보보호책임자:</span> 정보팀 (privacy@kaea.or.kr)</p>
                <p><span className="font-bold">고객센터:</span> 1588-0000 (평일 10:00~17:00 / 점심시간 12:30~13:30)</p>
                <p className="mt-4 text-xs text-slate-400">Copyright © Korea Reading & Essay Association. All rights reserved.</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">자격정보 (민간자격 표시의무 준수)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <tbody>
                    <tr>
                      <th className="border border-slate-200 p-2 bg-slate-100 font-bold">자격명</th>
                      <td className="border border-slate-200 p-2">독서논술지도사 1급/2급</td>
                      <th className="border border-slate-200 p-2 bg-slate-100 font-bold">등록번호</th>
                      <td className="border border-slate-200 p-2">2024-001234</td>
                    </tr>
                    <tr>
                      <th className="border border-slate-200 p-2 bg-slate-100 font-bold">자격발급기관</th>
                      <td className="border border-slate-200 p-2">한국독서논술협회</td>
                      <th className="border border-slate-200 p-2 bg-slate-100 font-bold">총비용</th>
                      <td className="border border-slate-200 p-2">
                        <ul className="list-disc list-inside">
                          <li>검정료: 50,000원</li>
                          <li>자격발급비: 30,000원</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <th className="border border-slate-200 p-2 bg-slate-100 font-bold">환불규정</th>
                      <td colSpan={3} className="border border-slate-200 p-2">
                        접수마감 전 100% 환불, 검정 당일 취소 불가
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                ※ 상기 자격은 자격기본법 규정에 따라 등록한 민간자격으로, 국가로부터 인정받은 공인자격이 아닙니다.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <div className="flex gap-4">
              <Link href="#" className="font-bold text-slate-700 hover:text-blue-900">이용약관</Link>
              <Link href="#" className="font-bold text-slate-700 hover:text-blue-900">개인정보처리방침</Link>
              <Link href="#" className="text-slate-500 hover:text-slate-900">제휴문의</Link>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              {/* Social Icons Placeholder */}
              <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-900 hover:text-white transition-colors cursor-pointer">B</span>
              <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-900 hover:text-white transition-colors cursor-pointer">I</span>
              <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-900 hover:text-white transition-colors cursor-pointer">Y</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CourseCard({ step, title, description, tags }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-blue-50 text-blue-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
        STEP {step}
      </div>
      <div className="mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900 mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
          <PenTool className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-slate-600 leading-relaxed text-sm h-10">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
        {tags.map((tag: string) => (
          <span key={tag} className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 min-w-[20px]">
        <CheckCircle className="w-5 h-5 text-blue-300" />
      </div>
      <span className="text-blue-50">{text}</span>
    </li>
  );
}
