"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "로그인에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="mb-1 text-xl font-bold text-gray-900">로그인</h1>
        <p className="mb-5 text-sm text-gray-500">
          G공구에 로그인하세요
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
              이메일
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gist.ac.kr"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          아직 계정이 없나요?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
