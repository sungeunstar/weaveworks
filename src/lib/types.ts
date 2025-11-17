/**
 * WeaveWorks ERP - Type Definitions
 */

// ============================================
// Auth & Account Types
// ============================================

export type UserRole = 'master' | 'official' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ============================================
// Company Types
// ============================================

export type CompanyType =
  | '판매처'
  | '납품처'
  | '원사'
  | '생지'
  | '염색'
  | '가공'
  | '창고';

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  businessNumber?: string;
  representative?: string;
  phone: string;
  email?: string;
  address?: string;
  deliveryAddress?: string;
  memo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Material Types
// ============================================

export type UnitType = 'KG' | 'YD' | '절';

// 원사
export interface Yarn {
  id: string;
  name: string;
  color: string;
  code?: string;
  unit: UnitType;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

// 원사 조합 비율
export interface YarnComposition {
  yarnId: string;
  yarnName?: string;
  ratio: number; // 비율 (%)
}

// 생지
export interface GreyFabric {
  id: string;
  name: string;
  yarnIds: string[]; // 원사 조합 (레거시 호환성)
  yarnCompositions?: YarnComposition[]; // 원사 조합 비율
  code?: string;
  unit: UnitType;
  lossPercentage?: number; // 로스율 (%)
  weightPerYard?: number; // YD당 중량 (KG/YD) - 단위 변환용
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

// 원단
export interface Fabric {
  id: string;
  name: string;
  color: string;
  styleCode: string;
  greyFabricId?: string;
  unit: UnitType;
  price?: number;
  lossPercentage?: number; // 로스율 (%)
  weightPerYard?: number; // YD당 중량 (KG/YD) - 단위 변환용
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Order Types
// ============================================

export type OrderStatus =
  | '주문접수'
  | '생산중'
  | '생산완료'
  | '출고대기'
  | '출고완료'
  | '취소';

export interface OrderItem {
  id: string;
  fabricId: string;
  fabricName: string;
  fabricColor: string;
  styleCode: string;
  quantity: number;
  unit: UnitType;
  unitPrice: number;
  totalPrice: number;
  memo?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string; // 판매처
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  shippingInfo?: string;
  warehouseContact?: string;
  instructions?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Shipping Types
// ============================================

export interface ShippingItem {
  orderItemId: string;
  fabricName: string;
  fabricColor: string;
  orderedQuantity: number;
  shippedQuantity: number;
  unit: UnitType;
}

export interface Shipping {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: ShippingItem[];
  shippingDate: string;
  warehouseId?: string;
  memo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Inventory Types
// ============================================

export type InventoryType = '원사' | '생지' | '염색' | '가공';

export interface InventoryTransaction {
  id: string;
  type: InventoryType;
  transactionType: '입고' | '출고' | '이동';
  itemId: string;
  itemName: string;
  quantity: number;
  weight?: number; // KG
  yardage?: number; // YD
  rolls?: number; // 절
  unit: UnitType;
  unitPrice?: number;
  supplierId?: string;
  supplierName?: string;
  warehouseId?: string;
  warehouseName?: string;
  toWarehouseId?: string; // 이동 시
  toWarehouseName?: string;
  memo?: string;
  transactionDate: string;
  createdBy: string;
  createdAt: string;
}

export interface InventoryStock {
  id: string;
  type: InventoryType;
  itemId: string;
  itemName: string;
  itemColor?: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  weight?: number;
  yardage?: number;
  rolls?: number;
  unit: UnitType;
  lastUpdated: string;
}

// ============================================
// Payment Types
// ============================================

export type PaymentMethod = '현금' | '이체' | '분납';
export type PaymentStatus = '완납' | '미수' | '부분납부';

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: PaymentStatus;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  memo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Settlement Types
// ============================================

export interface DailySales {
  date: string;
  totalOrders: number;
  totalSales: number;
  totalPayments: number;
  totalVAT: number;
  remainingReceivables: number;
}

export interface MonthlySales {
  month: string;
  totalOrders: number;
  totalSales: number;
  totalPayments: number;
  totalVAT: number;
  remainingReceivables: number;
}

export interface Settlement {
  id: string;
  period: string; // YYYY-MM-DD or YYYY-MM
  type: 'daily' | 'monthly';
  sales: DailySales | MonthlySales;
  createdAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
