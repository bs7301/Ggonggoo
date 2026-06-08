"use client";

import Link from "next/link";
import { Plus, Home, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            G공구
          </span>
          <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
            GIST
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">홈</span>
          </Link>

          {user ? (
            <>
              <Link
                href="/deals/new"
                className="flex items-center gap-1 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>새 파티</span>
              </Link>
              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{user.nickname}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>로그인</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
