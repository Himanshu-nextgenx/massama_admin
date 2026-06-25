import { create } from 'zustand';
import api from '../utils/auth';

export interface Hughes {
    id: number;
    category: string;
    name: string;
    address: string;
    hughes1?: string;
    hughes2?: string;
    hughes3?: string;
    hughes4?: string;
    hughes5?: string;
    rank: number;
}

interface HughesState {
    hughesList: Hughes[];
    isLoading: boolean;
    error: string | null;

    fetchHughes: () => Promise<void>;
    createHughes: (data: Partial<Hughes>) => Promise<boolean>;
    updateHughes: (id: number, data: Partial<Hughes>) => Promise<boolean>;
    deleteHughes: (id: number) => Promise<boolean>;
    reorderHughes: (ids: number[]) => Promise<boolean>;
    bulkCreateHughes: (items: Partial<Hughes>[]) => Promise<boolean>;
    renameCategory: (oldCategory: string, newCategory: string) => Promise<boolean>;
}

export const useHughesStore = create<HughesState>((set, get) => ({
    hughesList: [],
    isLoading: false,
    error: null,

    fetchHughes: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/hughes');
            set({ hughesList: response.data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    createHughes: async (data: Partial<Hughes>) => {
        try {
            await api.post('/hughes', data);
            get().fetchHughes();
            return true;
        } catch (error) {
            return false;
        }
    },

    updateHughes: async (id: number, data: Partial<Hughes>) => {
        try {
            await api.patch(`/hughes/${id}`, data);
            get().fetchHughes();
            return true;
        } catch (error) {
            return false;
        }
    },

    deleteHughes: async (id: number) => {
        try {
            await api.delete(`/hughes/${id}`);
            get().fetchHughes();
            return true;
        } catch (error) {
            return false;
        }
    },

    reorderHughes: async (ids: number[]) => {
        try {
            await api.patch('/hughes/reorder', { ids });
            return true;
        } catch (error) {
            console.error('Reorder failed', error);
            return false;
        }
    },

    bulkCreateHughes: async (items: Partial<Hughes>[]) => {
        try {
            await api.post('/hughes/bulk', items);
            get().fetchHughes();
            return true;
        } catch (error) {
            return false;
        }
    },

    renameCategory: async (oldCategory: string, newCategory: string) => {
        try {
            await api.patch('/hughes/category/rename', { oldCategory, newCategory });
            get().fetchHughes();
            return true;
        } catch (error) {
            return false;
        }
    },
}));
