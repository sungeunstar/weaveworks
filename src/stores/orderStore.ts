import { create } from 'zustand';
import { Order } from '@/lib/types';
import { ordersApi } from '@/lib/api';

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  fetchOrders: (params?: any) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await ordersApi.getAll(params) as Order[];
      set({ orders, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch orders', isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.getById(id) as Order;
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch order', isLoading: false });
    }
  },

  createOrder: async (order) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await ordersApi.create(order) as Order;
      set((state) => ({
        orders: [...state.orders, newOrder],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create order', isLoading: false });
      throw error;
    }
  },

  updateOrder: async (id, order) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await ordersApi.update(id, order) as Order;
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update order', isLoading: false });
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      await ordersApi.updateStatus(id, status);
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === id ? { ...o, status: status as any } : o
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update order status', isLoading: false });
      throw error;
    }
  },

  deleteOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ordersApi.delete(id);
      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete order', isLoading: false });
      throw error;
    }
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));
