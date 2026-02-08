
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface User {
    id: string;
    email: string;
    full_name: string;
    role: "admin" | "instructor" | "student";
    created_at: string;
}

export function UsersClient({ initialUsers }: { initialUsers: User[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<User[]>(initialUsers);

    const filteredUsers = users.filter((user) =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge variant="destructive">관리자</Badge>;
            case "instructor":
                return <Badge variant="default" className="bg-blue-600">강사</Badge>;
            default:
                return <Badge variant="secondary">학생</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">회원 관리</h1>
                    <p className="text-slate-500 mt-1">
                        전체 회원 목록 및 권한 관리
                    </p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="이름 또는 이메일 검색"
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>회원 목록 ({filteredUsers.length}명)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>이름</TableHead>
                                <TableHead>이메일</TableHead>
                                <TableHead>권한</TableHead>
                                <TableHead>가입일</TableHead>
                                <TableHead className="text-right">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.full_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* 추후 권한 수정 기능 추가 */}
                                            <span className="text-xs text-slate-400">수정 불가</span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        검색 결과가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
