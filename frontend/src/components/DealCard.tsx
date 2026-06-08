import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, ExternalLink } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { dealTypeLabels, dealTypeEmojis } from "@/lib/api";
import type { Deal } from "@/lib/api";

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(deal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  /** 택시쉐어/카풀 출발 시간 포맷 */
  const formatDepartureTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}/${day} ${hours}:${minutes}`;
  };

  /** 타입별 가격/정보 표시 */
  const renderPriceInfo = () => {
    if (deal.type === "taxi-share" || deal.type === "carpool") {
      return (
        <div className="mb-3">
          <span className="text-base font-bold text-gray-900">
            🕐{" "}
            {deal.departureTime
              ? formatDepartureTime(deal.departureTime)
              : "시간 미정"}
          </span>
          {deal.destination && (
            <span className="ml-2 text-xs text-gray-500">
              → {deal.destination}
            </span>
          )}
        </div>
      );
    }

    if (deal.type === "delivery") {
      return (
        <div className="mb-3">
          <span className="text-xs text-gray-500">최소주문</span>
          <span className="ml-1 text-base font-bold text-gray-900">
            {deal.minOrderAmount?.toLocaleString()}원
          </span>
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
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-base font-bold text-gray-900">
          {deal.groupPrice?.toLocaleString()}원
        </span>
        {discountRate > 0 && (
          <>
            <span className="text-xs text-gray-400 line-through">
              {deal.originalPrice?.toLocaleString()}원
            </span>
            <span className="rounded bg-red-100 px-1 py-0.5 text-[10px] font-semibold text-red-600">
              -{discountRate}%
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <Link href={`/deals/${deal.id}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md hover:border-gray-300">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={deal.imageUrl || "https://picsum.photos/seed/default/400/300"}
            alt={deal.title}
            fill
            className="object-cover transition-transform group-hover:scale-[1.03]"
          />
          {deal.status === "completed" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900">
                모집 완료
              </span>
            </div>
          )}
          {/* Type Badge */}
          <div className="absolute top-2.5 left-2.5 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
            {dealTypeEmojis[deal.type]} {dealTypeLabels[deal.type]}
          </div>
          {/* External Link Badge */}
          {deal.externalLink && (
            <div className="absolute top-2.5 right-2.5 rounded-md bg-blue-50/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-blue-700 shadow-sm flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              공구정보
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5">
          <h3 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-1">
            {deal.title}
          </h3>
          <p className="mb-2.5 text-xs text-gray-500 line-clamp-1">
            {deal.description}
          </p>

          {/* Type-specific info */}
          {renderPriceInfo()}

          {/* Progress */}
          <ProgressBar
            current={deal.currentParticipants}
            target={deal.targetParticipants}
          />

          {/* Footer */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400">
            {deal.location ? (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{deal.location}</span>
              </div>
            ) : (
              <span className="truncate max-w-[120px]">{deal.organizer}</span>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {deal.status === "completed" ? "마감" : `${daysLeft}일 남음`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
