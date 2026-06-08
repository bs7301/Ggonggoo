"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  ExternalLink,
  Navigation,
} from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { fetchDeal, joinDeal, dealTypeLabels, dealTypeEmojis } from "@/lib/api";
import type { Deal } from "@/lib/api";

export default function DealDetailPage() {
  const params = useParams();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    fetchDeal(id)
      .then(setDeal)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg font-medium text-gray-900">
            파티를 찾을 수 없어요
          </p>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(deal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  const handleJoin = async () => {
    if (isJoined || joining) return;
    setJoining(true);
    try {
      const updated = await joinDeal(deal.id);
      setDeal(updated);
      setIsJoined(true);
    } catch (err) {
      console.error(err);
      alert("참여에 실패했어요. 다시 시도해주세요.");
    } finally {
      setJoining(false);
    }
  };

  const formatDepartureTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day}(${weekday}) ${hours}:${minutes}`;
  };

  /** 타입별 핵심 정보 */
  const renderMainInfo = () => {
    if (deal.type === "taxi-share" || deal.type === "carpool") {
      return (
        <div className="mb-5 rounded-lg bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">출발 시간</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            {deal.departureTime
              ? formatDepartureTime(deal.departureTime)
              : "시간 미정"}
          </span>
          {deal.destination && (
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
              <Navigation className="h-3.5 w-3.5" />
              <span>
                {deal.location} → {deal.destination}
              </span>
            </div>
          )}
          {deal.type === "carpool" && (
            <p className="mt-2 text-xs text-gray-500">
              운전자가 직접 운전합니다. 기름값만 나눠요!
            </p>
          )}
        </div>
      );
    }

    if (deal.type === "delivery") {
      return (
        <div className="mb-5 rounded-lg bg-gray-50 border border-gray-100 p-4">
          <div className="text-sm text-gray-500 mb-1">최소 주문 금액</div>
          <span className="text-xl font-bold text-gray-900">
            {deal.minOrderAmount?.toLocaleString()}원
          </span>
          <p className="mt-2 text-xs text-gray-500">
            각자 먹고 싶은 메뉴를 주문하고 배달비를 나눠요
          </p>
        </div>
      );
    }

    // group-buy
    const discountRate =
      deal.originalPrice && deal.groupPrice
        ? Math.round(
            ((deal.originalPrice - deal.groupPrice) / deal.originalPrice) * 100
          )
        : 0;

    return (
      <div className="mb-5 rounded-lg bg-gray-50 border border-gray-100 p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {deal.groupPrice?.toLocaleString()}원
          </span>
          {discountRate > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {deal.originalPrice?.toLocaleString()}원
              </span>
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-600">
                -{discountRate}%
              </span>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">1인당 가격</p>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back */}
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Link>

      {/* Card */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Image */}
        <div className="relative aspect-[2/1] overflow-hidden">
          <Image
            src={deal.imageUrl || "https://picsum.photos/seed/default/400/300"}
            alt={deal.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3 rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm">
            {dealTypeEmojis[deal.type]} {dealTypeLabels[deal.type]}
          </div>
          {deal.status === "completed" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900">
                모집 완료
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h1 className="mb-1 text-xl font-bold text-gray-900">{deal.title}</h1>
          <p className="mb-4 text-sm text-gray-500">{deal.category}</p>

          {/* Type-specific main info */}
          {renderMainInfo()}

          {/* Progress */}
          <div className="mb-5">
            <ProgressBar
              current={deal.currentParticipants}
              target={deal.targetParticipants}
            />
          </div>

          {/* Info Grid */}
          <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-gray-600">
              <User className="h-4 w-4 text-gray-400" />
              <span className="truncate">{deal.organizer}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {deal.status === "completed" ? "마감됨" : `${daysLeft}일 남음`}
              </span>
            </div>
            {deal.location &&
              deal.type !== "taxi-share" &&
              deal.type !== "carpool" && (
                <div className="col-span-2 flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{deal.location}</span>
                </div>
              )}
          </div>

          {/* External Link */}
          {deal.externalLink && (
            <a
              href={deal.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-5 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="font-medium">공동구매 사이트 바로가기</span>
            </a>
          )}

          {/* Description */}
          <div className="mb-6 border-t border-gray-100 pt-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-900">설명</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {deal.description}
            </p>
          </div>

          {/* Action Button */}
          {deal.status === "active" && (
            <button
              onClick={handleJoin}
              disabled={isJoined || joining}
              className={`w-full rounded-lg py-3.5 text-sm font-semibold text-white transition-colors cursor-pointer ${
                isJoined
                  ? "bg-green-600"
                  : "bg-gray-900 hover:bg-gray-800"
              } disabled:cursor-not-allowed`}
            >
              {joining
                ? "참여 중..."
                : isJoined
                ? "✓ 참여 완료"
                : "참여하기"}
            </button>
          )}

          {deal.status === "completed" && (
            <div className="w-full rounded-lg bg-gray-100 py-3.5 text-center text-sm font-medium text-gray-500">
              모집이 마감되었습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
