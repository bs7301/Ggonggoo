const API_BASE = "http://localhost:3000/api";

// ===== Auth Types =====
export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  department: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ===== Deal Types =====
export interface Deal {
  id: number;
  type: "group-buy" | "delivery" | "taxi-share" | "carpool";
  title: string;
  description: string;
  imageUrl: string;
  originalPrice?: number;
  groupPrice?: number;
  currentParticipants: number;
  targetParticipants: number;
  deadline: string;
  organizer: string;
  category: string;
  status: "active" | "completed" | "expired";
  location?: string;
  departureTime?: string;
  destination?: string;
  minOrderAmount?: number;
  externalLink?: string;
  createdAt: string;
}

export type DealType = Deal["type"];

export const dealTypeLabels: Record<DealType, string> = {
  "group-buy": "공동구매",
  delivery: "배달파티",
  "taxi-share": "택시쉐어",
  carpool: "카풀",
};

export const dealTypeEmojis: Record<DealType, string> = {
  "group-buy": "🛒",
  delivery: "🍕",
  "taxi-share": "🚕",
  carpool: "🚗",
};

// ===== Token helpers =====
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ggonggu_token");
}

export function setToken(token: string) {
  localStorage.setItem("ggonggu_token", token);
}

export function removeToken() {
  localStorage.removeItem("ggonggu_token");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("ggonggu_user");
  return data ? JSON.parse(data) : null;
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem("ggonggu_user", JSON.stringify(user));
}

export function removeStoredUser() {
  localStorage.removeItem("ggonggu_user");
}

// ===== Auth API =====
export async function register(data: {
  email: string;
  password: string;
  nickname: string;
  department?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "회원가입 실패");
  }
  return res.json();
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "로그인 실패");
  }
  return res.json();
}

export async function fetchMe(): Promise<AuthUser> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("인증 실패");
  return res.json();
}

// ===== Deals API =====
export async function fetchDeals(): Promise<Deal[]> {
  const res = await fetch(`${API_BASE}/deals`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch deals");
  return res.json();
}

export async function fetchDeal(id: number): Promise<Deal> {
  const res = await fetch(`${API_BASE}/deals/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch deal");
  return res.json();
}

export async function createDeal(
  data: Record<string, unknown>
): Promise<Deal> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/deals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create deal");
  return res.json();
}

export async function joinDeal(id: number): Promise<Deal> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/deals/${id}/join`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Failed to join deal");
  return res.json();
}
