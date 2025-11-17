import { create } from 'zustand';
import { Yarn, GreyFabric, Fabric } from '@/lib/types';
import { yarnsApi, greyFabricsApi, fabricsApi } from '@/lib/api';

interface MaterialStore {
  yarns: Yarn[];
  greyFabrics: GreyFabric[];
  fabrics: Fabric[];
  isLoading: boolean;
  error: string | null;

  // Yarns
  fetchYarns: () => Promise<void>;
  addYarn: (yarn: Omit<Yarn, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateYarn: (id: string, yarn: Partial<Yarn>) => Promise<void>;
  deleteYarn: (id: string) => Promise<void>;

  // Grey Fabrics
  fetchGreyFabrics: () => Promise<void>;
  addGreyFabric: (greyFabric: Omit<GreyFabric, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGreyFabric: (id: string, greyFabric: Partial<GreyFabric>) => Promise<void>;
  deleteGreyFabric: (id: string) => Promise<void>;

  // Fabrics
  fetchFabrics: () => Promise<void>;
  addFabric: (fabric: Omit<Fabric, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFabric: (id: string, fabric: Partial<Fabric>) => Promise<void>;
  deleteFabric: (id: string) => Promise<void>;
}

export const useMaterialStore = create<MaterialStore>((set) => ({
  yarns: [],
  greyFabrics: [],
  fabrics: [],
  isLoading: false,
  error: null,

  // Yarns
  fetchYarns: async () => {
    set({ isLoading: true, error: null });
    try {
      const yarns = await yarnsApi.getAll() as Yarn[];
      set({ yarns, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch yarns', isLoading: false });
    }
  },

  addYarn: async (yarn) => {
    set({ isLoading: true, error: null });
    try {
      const newYarn = await yarnsApi.create(yarn) as Yarn;
      set((state) => ({ yarns: [...state.yarns, newYarn], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to add yarn', isLoading: false });
      throw error;
    }
  },

  updateYarn: async (id, yarn) => {
    set({ isLoading: true, error: null });
    try {
      const updatedYarn = await yarnsApi.update(id, yarn) as Yarn;
      set((state) => ({
        yarns: state.yarns.map((y) => (y.id === id ? updatedYarn : y)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update yarn', isLoading: false });
      throw error;
    }
  },

  deleteYarn: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await yarnsApi.delete(id);
      set((state) => ({
        yarns: state.yarns.filter((y) => y.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete yarn', isLoading: false });
      throw error;
    }
  },

  // Grey Fabrics
  fetchGreyFabrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const greyFabrics = await greyFabricsApi.getAll() as GreyFabric[];
      set({ greyFabrics, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch grey fabrics', isLoading: false });
    }
  },

  addGreyFabric: async (greyFabric) => {
    set({ isLoading: true, error: null });
    try {
      const newGreyFabric = await greyFabricsApi.create(greyFabric) as GreyFabric;
      set((state) => ({
        greyFabrics: [...state.greyFabrics, newGreyFabric],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add grey fabric', isLoading: false });
      throw error;
    }
  },

  updateGreyFabric: async (id, greyFabric) => {
    set({ isLoading: true, error: null });
    try {
      const updatedGreyFabric = await greyFabricsApi.update(id, greyFabric) as GreyFabric;
      set((state) => ({
        greyFabrics: state.greyFabrics.map((gf) => (gf.id === id ? updatedGreyFabric : gf)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update grey fabric', isLoading: false });
      throw error;
    }
  },

  deleteGreyFabric: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await greyFabricsApi.delete(id);
      set((state) => ({
        greyFabrics: state.greyFabrics.filter((gf) => gf.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete grey fabric', isLoading: false });
      throw error;
    }
  },

  // Fabrics
  fetchFabrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const fabrics = await fabricsApi.getAll() as Fabric[];
      set({ fabrics, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch fabrics', isLoading: false });
    }
  },

  addFabric: async (fabric) => {
    set({ isLoading: true, error: null });
    try {
      const newFabric = await fabricsApi.create(fabric) as Fabric;
      set((state) => ({ fabrics: [...state.fabrics, newFabric], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to add fabric', isLoading: false });
      throw error;
    }
  },

  updateFabric: async (id, fabric) => {
    set({ isLoading: true, error: null });
    try {
      const updatedFabric = await fabricsApi.update(id, fabric) as Fabric;
      set((state) => ({
        fabrics: state.fabrics.map((f) => (f.id === id ? updatedFabric : f)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update fabric', isLoading: false });
      throw error;
    }
  },

  deleteFabric: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await fabricsApi.delete(id);
      set((state) => ({
        fabrics: state.fabrics.filter((f) => f.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete fabric', isLoading: false });
      throw error;
    }
  },
}));
