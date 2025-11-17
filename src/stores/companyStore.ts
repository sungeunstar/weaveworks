import { create } from 'zustand';
import { Company } from '@/lib/types';
import { companiesApi } from '@/lib/api';

interface CompanyStore {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  companies: [],
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const companies = await companiesApi.getAll() as Company[];
      set({ companies, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch companies', isLoading: false });
    }
  },

  addCompany: async (company) => {
    set({ isLoading: true, error: null });
    try {
      const newCompany = await companiesApi.create(company) as Company;
      set((state) => ({
        companies: [...state.companies, newCompany],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add company', isLoading: false });
      throw error;
    }
  },

  updateCompany: async (id, company) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCompany = await companiesApi.update(id, company) as Company;
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? updatedCompany : c)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update company', isLoading: false });
      throw error;
    }
  },

  deleteCompany: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await companiesApi.delete(id);
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete company', isLoading: false });
      throw error;
    }
  },
}));
