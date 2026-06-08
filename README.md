# G공구 (Ggonggoo)

GIST 학생들을 위한 공동구매 · 배달파티 · 택시쉐어 · 카풀 플랫폼

## 기능

- 🛒 **공동구매** — 대량 구매 나누기, 외부 공구 정보 공유
- 🍕 **배달파티** — 최소배달비 맞추기, 각자 메뉴 주문
- 🚕 **택시쉐어** — 택시비 나누기
- 🚗 **카풀** — 기름값 나누기
- 🔐 **회원가입/로그인** — JWT 기반 인증

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 16, React 19, Tailwind CSS, TypeScript |
| Backend | NestJS 11, TypeORM, SQLite, JWT |
| Package Manager | pnpm |

## 실행 방법

```bash
# 백엔드
cd backend
pnpm install
pnpm run build
node dist/main.js  # http://localhost:3000

# 프론트엔드
cd frontend
pnpm install
pnpm run dev  # http://localhost:3005
```

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/register | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/auth/me | 내 정보 |
| GET | /api/deals | 전체 파티 목록 |
| GET | /api/deals/:id | 파티 상세 |
| POST | /api/deals | 파티 생성 |
| POST | /api/deals/:id/join | 파티 참여 |
