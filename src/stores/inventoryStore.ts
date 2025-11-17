import { create } from 'zustand';
import { InventoryTransaction, InventoryStock } from '@/lib/types';
import { inventoryApi } from '@/lib/api';

interface InventoryStore {
  transactions: InventoryTransaction[];
  stocks: InventoryStock[];
  isLoading: boolean;
  error: string | null;

  fetchTransactions: (params?: any) => Promise<void>;
  fetchStocks: (params?: any) => Promise<void>;
  createTransaction: (transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>) => Promise<void>;
  transferStock: (data: any) => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  transactions: [],
  stocks: [],
  isLoading: false,
  error: null,

  fetchTransactions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await inventoryApi.getTransactions(params) as InventoryTransaction[];
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transactions', isLoading: false });
    }
  },

  fetchStocks: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const stocks = await inventoryApi.getStocks(params) as InventoryStock[];
      set({ stocks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch stocks', isLoading: false });
    }
  },

  createTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const newTransaction = await inventoryApi.createTransaction(transaction) as InventoryTransaction;
      set((state) => ({
        transactions: [...state.transactions, newTransaction],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create transaction', isLoading: false });
      throw error;
    }
  },

  transferStock: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryApi.transfer(data);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to transfer stock', isLoading: false });
      throw error;
    }
  },
}));
