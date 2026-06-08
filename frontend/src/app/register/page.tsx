"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않아요.");
      return;
    }

    if (form.password.length < 4) {
      setError("비밀번호는 4자 이상이어야 해요.");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        department: form.department || undefined,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="mb-1 text-xl font-bold text-gray-900">회원가입</h1>
        <p className="mb-5 text-sm text-gray-500">
          GIST 학생이라면 누구나 가입할 수 있어요
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              이메일 *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="example@gist.ac.kr"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="nickname"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              닉네임 *
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              required
              value={form.nickname}
              onChange={handleChange}
              placeholder="예: 김민수"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="department"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              학과/학번 (선택)
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="예: 전산학부 22"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              비밀번호 *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="4자 이상"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              비밀번호 확인 *
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              required
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호 다시 입력"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있나요?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
