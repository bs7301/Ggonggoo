"use client";

import { useState, useEffect } from "react";
import { Users, Package, TrendingUp } from "lucide-react";
import DealCard from "@/components/DealCard";
import { fetchDeals, dealTypeLabels, dealTypeEmojis } from "@/lib/api";
import type { Deal, DealType } from "@/lib/api";

type FilterType = "all" | DealType;

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "group-buy", label: `${dealTypeEmojis["group-buy"]} 공동구매` },
  { key: "delivery", label: `${dealTypeEmojis["delivery"]} 배달파티` },
  { key: "taxi-share", label: `${dealTypeEmojis["taxi-share"]} 택시쉐어` },
  { key: "carpool", label: `${dealTypeEmojis["carpool"]} 카풀` },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals()
      .then(setDeals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredDeals =
    activeFilter === "all"
      ? deals
      : deals.filter((deal) => deal.type === activeFilter);

  const activeDeals = filteredDeals.filter((deal) => deal.status === "active");
  const completedDeals = filteredDeals.filter(
    (deal) => deal.status === "completed"
  );

  const totalActive = deals.filter((d) => d.status === "active").length;
  const totalParticipants = deals.reduce(
    (sum, d) => sum + d.currentParticipants,
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">G공구</h1>
            <p className="mb-6 text-sm text-gray-500">
              GIST 학생들을 위한 공동구매 · 배달파티 · 택시쉐어 · 카풀 플랫폼
            </p>
            <div className="inline-flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 px-6 py-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">{totalParticipants}</span>
                <span className="text-gray-500">참여</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-700">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">{totalActive}</span>
                <span className="text-gray-500">진행 중</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-700">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">
                  {deals.length}
                </span>
                <span className="text-gray-500">총 파티</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-14 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-1 overflow-x-auto py-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeFilter === filter.key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Deals */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        {activeDeals.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">모집 중</h2>
              <span className="text-xs text-gray-400">
                {activeDeals.length}개
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </>
        )}

        {/* Completed Deals */}
        {completedDeals.length > 0 && (
          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">모집 완료</h2>
              <span className="text-xs text-gray-400">
                {completedDeals.length}개
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDeals.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-3 text-4xl">🤷</div>
            <p className="text-sm text-gray-500">
              아직 진행 중인 파티가 없어요.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 mt-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-gray-400">
          <p className="font-medium text-gray-500">G공구</p>
          <p className="mt-1">GIST 학생 전용 공동구매 플랫폼</p>
        </div>
      </footer>
    </div>
  );
}
