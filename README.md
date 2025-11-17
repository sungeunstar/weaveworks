# WeaveWorks ERP MVP

원단/섬유 제조·유통 전문 ERP 시스템

## 프로젝트 개요

**WeaveWorks**는 원단 및 섬유 제조·유통 업체를 위한 통합 ERP 시스템입니다.
블랙 & 화이트 기반의 미니멀한 디자인으로 정보 위계가 명확하며, B2B SaaS에 최적화된 UI/UX를 제공합니다.

### 주요 기능

- ✅ **계정/권한 관리** - 마스터/담당자/사용자 권한 구분
- ✅ **업체 관리** - 판매처, 납품처, 원사, 생지, 염색, 가공, 창고 업체 관리
- ✅ **원단/자재 마스터** - 원사, 생지, 원단 정보 관리
- ✅ **주문 관리** - 주문 등록, 조회, 수정, 상태 관리
- ✅ **출고 관리** - 출고 처리 및 재고 차감
- ✅ **재고 관리** - 입고, 재고 조회, 재고 이동
- ✅ **매출/결제** - 매출 현황, 결제 입력, 미수금 관리
- ✅ **결산** - 일일/월간 결산 조회 및 출력

## 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: React Icons
- **HTTP Client**: Axios

### Backend (Mock)
- **json-server** - RESTful API Mock Server

## 디자인 시스템

### 컬러 팔레트
- **Primary**: #1694FF (버튼, 포커스, 인터랙션)
- **Black**: #000000
- **White**: #FFFFFF
- **Gray Scale**: #111111 / #222222 / #333333 / #555555 / #888888 / #DDDDDD / #F5F5F5

### 타이포그래피
- **Font Family**: Pretendard, Inter
- **Heading**: 24px/20px/18px (Bold)
- **Body**: 16px (Medium)
- **Caption**: 13px (Regular)

## 시작하기

### 필수 요구사항
- Node.js 18+
- npm or yarn

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **개발 서버 실행**
```bash
# 터미널 1: Next.js 개발 서버
npm run dev

# 터미널 2: Mock API 서버
npm run api
```

3. **브라우저에서 열기**
```
http://localhost:3000
```

### 데모 계정
- **아이디**: admin
- **비밀번호**: admin

## 프로젝트 구조

```
weaveworks/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (dashboard)/              # 대시보드 레이아웃 그룹
│   │   │   ├── dashboard/            # 대시보드
│   │   │   ├── accounts/             # 계정 관리
│   │   │   ├── companies/            # 업체 관리
│   │   │   ├── materials/            # 원단/자재 관리
│   │   │   │   └── fabrics/          # 원단 관리
│   │   │   ├── orders/               # 주문 관리
│   │   │   │   ├── new/              # 주문 등록
│   │   │   │   └── page.tsx          # 주문 조회
│   │   │   ├── shipping/             # 출고 관리
│   │   │   ├── inventory/            # 재고 관리
│   │   │   │   ├── receiving/        # 재고 입고
│   │   │   │   └── stocks/           # 재고 조회
│   │   │   ├── payments/             # 매출/결제
│   │   │   └── settlement/           # 결산
│   │   ├── login/                    # 로그인
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   └── page.tsx                  # 홈 페이지
│   ├── components/
│   │   └── common/                   # 공통 컴포넌트
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Table.tsx
│   │       ├── Modal.tsx
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── stores/                       # Zustand 상태 관리
│   │   ├── authStore.ts
│   │   ├── companyStore.ts
│   │   ├── materialStore.ts
│   │   ├── orderStore.ts
│   │   └── inventoryStore.ts
│   ├── lib/
│   │   ├── types.ts                  # TypeScript 타입 정의
│   │   └── api.ts                    # API 클라이언트
│   ├── constants/
│   │   └── design-tokens.ts          # 디자인 토큰
│   └── styles/
│       └── globals.css               # 글로벌 스타일
├── public/                           # 정적 파일
├── db.json                           # Mock API 데이터
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 주요 화면

### 1. 로그인
- 사용자 인증 및 권한 확인

### 2. 대시보드
- 금일 주문, 대기 출고, 재고 부족, 미수금 현황
- 최근 주문 내역
- 재고 부족 알림

### 3. 계정 관리
- 계정 생성/수정/비활성화
- 권한 설정 (master/official/user)

### 4. 업체 관리
- 업체 등록/수정/삭제
- 분류별 필터링 (판매처/납품처/원사/생지/염색/가공/창고)

### 5. 원단 관리
- 원단 등록 및 관리
- 스타일코드, 색상, 단가 관리

### 6. 주문 관리
- 주문 등록: 복수 품목 추가, 자동 합계 계산, VAT 계산
- 주문 조회: 기간/판매처/상태별 검색
- 엑셀 다운로드 (구현 예정)

### 7. 출고 관리
- 출고 가능 재고 확인
- 출고 처리 및 재고 자동 차감

### 8. 재고 관리
- 재고 입고 처리 (원사/생지/염색/가공)
- 재고 조회 및 현황 파악
- 재고 이동 (창고 간 이동)

### 9. 매출/결제
- 기간별 매출 요약
- 결제 입력 (현금/이체/분납)
- 미수금 현황

### 10. 결산
- 일일/월간 결산 조회
- 매출, 결제, 미수금 통계
- 결산서 출력 (구현 예정)

## API 엔드포인트

Mock API Server는 `http://localhost:3001`에서 실행됩니다.

### 주요 엔드포인트
- `GET /users` - 사용자 목록
- `GET /companies` - 업체 목록
- `GET /fabrics` - 원단 목록
- `GET /orders` - 주문 목록
- `POST /orders` - 주문 생성
- `GET /inventoryStocks` - 재고 조회
- `POST /inventoryTransactions` - 재고 입고
- `GET /payments` - 결제 내역

## 커스터마이징

### 디자인 토큰 수정
`src/constants/design-tokens.ts` 파일에서 색상, 타이포그래피, 간격 등을 수정할 수 있습니다.

### Tailwind 설정
`tailwind.config.ts` 파일에서 Tailwind CSS 설정을 커스터마이징할 수 있습니다.

## 향후 개발 계획

- [ ] 실제 백엔드 API 연동
- [ ] 엑셀 다운로드 기능 구현
- [ ] PDF 출력 기능 구현
- [ ] 대시보드 차트 추가
- [ ] 알림 시스템 구현
- [ ] 모바일 반응형 최적화
- [ ] 다국어 지원
- [ ] 테마 전환 기능

## 라이선스

MIT License

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**WeaveWorks ERP** - 원단/섬유 산업을 위한 스마트한 솔루션
