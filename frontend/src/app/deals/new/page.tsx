"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createDeal } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { DealType } from "@/lib/api";

interface FormData {
  type: DealType | "";
  title: string;
  description: string;
  imageUrl: string;
  // 공동구매
  originalPrice: string;
  groupPrice: string;
  externalLink: string;
  // 배달파티
  minOrderAmount: string;
  // 택시쉐어/카풀
  departureTime: string;
  destination: string;
  // 공통
  targetParticipants: string;
  deadline: string;
  category: string;
  location: string;
  organizer: string;
}

const typeOptions: {
  key: DealType;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  { key: "group-buy", label: "공동구매", emoji: "🛒", desc: "같이 사서 절약" },
  { key: "delivery", label: "배달파티", emoji: "🍕", desc: "배달비 나누기" },
  { key: "taxi-share", label: "택시쉐어", emoji: "🚕", desc: "택시비 나누기" },
  { key: "carpool", label: "카풀", emoji: "🚗", desc: "기름값 나누기" },
];

const categoryOptions: Record<DealType, string[]> = {
  "group-buy": ["생활용품", "전자기기", "학용품", "게임", "의류", "기타"],
  delivery: [
    "치킨",
    "피자",
    "패스트푸드",
    "중식",
    "일식",
    "한식",
    "분식",
    "카페",
    "기타",
  ],
  "taxi-share": ["택시"],
  carpool: ["카풀"],
};

export default function NewDealPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    type: "",
    title: "",
    description: "",
    imageUrl: "",
    originalPrice: "",
    groupPrice: "",
    externalLink: "",
    minOrderAmount: "",
    departureTime: "",
    destination: "",
    targetParticipants: "",
    deadline: "",
    category: "",
    location: "",
    organizer: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // 로그인 안 된 경우
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg font-medium text-gray-900">
            로그인이 필요해요
          </p>
          <p className="mb-4 text-sm text-gray-500">
            파티를 만들려면 먼저 로그인해주세요.
          </p>
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            로그인하러 가기
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: DealType) => {
    setFormData((prev) => ({ ...prev, type, category: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) return;

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        organizer: user.department
          ? `${user.nickname} (${user.department})`
          : user.nickname,
        targetParticipants: Number(formData.targetParticipants),
        deadline: formData.deadline,
        category:
          formData.category ||
          (formData.type === "taxi-share"
            ? "택시"
            : formData.type === "carpool"
            ? "카풀"
            : ""),
      };

      if (formData.imageUrl) payload.imageUrl = formData.imageUrl;
      if (formData.location) payload.location = formData.location;

      if (formData.type === "group-buy") {
        if (formData.originalPrice)
          payload.originalPrice = Number(formData.originalPrice);
        if (formData.groupPrice)
          payload.groupPrice = Number(formData.groupPrice);
        if (formData.externalLink) payload.externalLink = formData.externalLink;
      }

      if (formData.type === "delivery") {
        if (formData.minOrderAmount)
          payload.minOrderAmount = Number(formData.minOrderAmount);
      }

      if (formData.type === "taxi-share" || formData.type === "carpool") {
        if (formData.departureTime)
          payload.departureTime = formData.departureTime;
        if (formData.destination) payload.destination = formData.destination;
      }

      await createDeal(payload as any);
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("파티 생성에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Back */}
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h1 className="mb-5 text-lg font-bold text-gray-900">
          새 파티 만들기
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              파티 유형 *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleTypeSelect(option.key)}
                  className={`rounded-lg border p-3 text-center transition-colors cursor-pointer ${
                    formData.type === option.key
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <div className="text-lg mb-0.5">{option.emoji}</div>
                  <div className="text-xs font-medium">{option.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      formData.type === option.key
                        ? "text-gray-300"
                        : "text-gray-400"
                    }`}
                  >
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder={
                formData.type === "delivery"
                  ? "예: 버거킹 같이 주문하실 분"
                  : formData.type === "taxi-share"
                  ? "예: GIST → 광주송정역"
                  : formData.type === "carpool"
                  ? "예: GIST → 상무지구 카풀"
                  : "예: 코스트코 휴지 같이 사실 분"
              }
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>

          {/* Category */}
          {formData.type &&
            formData.type !== "taxi-share" &&
            formData.type !== "carpool" && (
              <div>
                <label
                  htmlFor="category"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  카테고리 *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                >
                  <option value="">선택하세요</option>
                  {(categoryOptions[formData.type as DealType] || []).map(
                    (cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              설명 *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder={
                formData.type === "delivery"
                  ? "예: 각자 먹고싶은 거 주문하고 배달비 나눠요!"
                  : formData.type === "taxi-share"
                  ? "예: 오후 2시 출발합니다. KTX 타시는 분 같이 가요!"
                  : formData.type === "carpool"
                  ? "예: 제가 운전해요! 기름값만 나눠주세요."
                  : "예: 코스트코 휴지 30롤 나눠 사려고 해요."
              }
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none resize-none"
            />
          </div>

          {/* === 공동구매 전용 === */}
          {formData.type === "group-buy" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="originalPrice"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    정가 (원)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="159000"
                    min="0"
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="groupPrice"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    공구가/1인당 (원) *
                  </label>
                  <input
                    type="number"
                    id="groupPrice"
                    name="groupPrice"
                    required
                    value={formData.groupPrice}
                    onChange={handleChange}
                    placeholder="9700"
                    min="0"
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="externalLink"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  공구 사이트 링크 (선택)
                </label>
                <input
                  type="url"
                  id="externalLink"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleChange}
                  placeholder="https://공구사이트링크..."
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  외부 공동구매 정보가 있으면 링크를 공유해주세요
                </p>
              </div>
            </>
          )}

          {/* === 배달파티 전용 === */}
          {formData.type === "delivery" && (
            <>
              <div>
                <label
                  htmlFor="minOrderAmount"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  최소 주문 금액 (원) *
                </label>
                <input
                  type="number"
                  id="minOrderAmount"
                  name="minOrderAmount"
                  required
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  placeholder="15000"
                  min="0"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  배달앱에 표시된 최소 주문 금액을 적어주세요
                </p>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  수령 장소 *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="예: 기숙사 A동 로비"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* === 택시쉐어/카풀 전용 === */}
          {(formData.type === "taxi-share" || formData.type === "carpool") && (
            <>
              <div>
                <label
                  htmlFor="departureTime"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  출발 시간 *
                </label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  name="departureTime"
                  required
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    출발지 *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="예: GIST 정문"
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="destination"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    도착지 *
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="예: 광주송정역"
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* 공통: 모집인원 + 마감일 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="targetParticipants"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                모집 인원 *
              </label>
              <input
                type="number"
                id="targetParticipants"
                name="targetParticipants"
                required
                value={formData.targetParticipants}
                onChange={handleChange}
                placeholder={
                  formData.type === "taxi-share" || formData.type === "carpool"
                    ? "4"
                    : "3"
                }
                min="2"
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="deadline"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                마감일 *
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              이미지 URL (선택)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formData.type || submitting}
            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? "생성 중..." : "파티 만들기"}
          </button>
        </form>
      </div>
    </div>
  );
}
