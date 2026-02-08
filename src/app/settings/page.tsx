"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User as UserIcon, Mail, Bell, Shield, LogOut, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
    });

    useEffect(() => {
        async function loadUserData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setFormData({
                    full_name: profileData.full_name || "",
                    email: user.email || "",
                });
            }
            setLoading(false);
        }
        loadUserData();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        const { error } = await supabase
            .from("profiles")
            .update({ full_name: formData.full_name })
            .eq("id", user.id);

        if (error) {
            alert("저장 중 오류가 발생했습니다: " + error.message);
        } else {
            alert("설정이 저장되었습니다.");
        }
        setSaving(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">설정</h1>

                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                        프로필 정보
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                placeholder="이름을 입력하세요"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl text-slate-600">
                                <Mail className="w-4 h-4" />
                                {formData.email}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">이메일은 변경할 수 없습니다.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        저장하기
                    </button>
                </div>

                {/* Account Info Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-green-600" />
                        계정 정보
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">역할</span>
                            <span className="font-medium text-slate-900 capitalize">{profile?.role || "student"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">가입일</span>
                            <span className="font-medium text-slate-900">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("ko-KR") : "-"}</span>
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}
