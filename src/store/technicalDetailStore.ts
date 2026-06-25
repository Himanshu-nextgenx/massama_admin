import { create } from 'zustand';
import api from '../utils/auth';

export interface TechnicalDetail {
    id: number;
    label_name: string;
    link: string;
    rank: number;
}

interface TechnicalDetailState {
    technicalDetails: TechnicalDetail[];
    isLoading: boolean;
    error: string | null;

    fetchTechnicalDetails: () => Promise<void>;
    createTechnicalDetail: (data: any) => Promise<boolean>;
    updateTechnicalDetail: (id: number, data: any) => Promise<boolean>;
    deleteTechnicalDetail: (id: number) => Promise<boolean>;
    reorderTechnicalDetails: (ids: number[]) => Promise<boolean>;
}

export const useTechnicalDetailStore = create<TechnicalDetailState>((set, get) => ({
    technicalDetails: [],
    isLoading: false,
    error: null,

    reorderTechnicalDetails: async (ids: number[]) => {
        try {
            await api.patch('/technical-details/reorder', { ids });
            return true;
        } catch (error) {
            console.error('Reorder failed', error);
            return false;
        }
    },

    fetchTechnicalDetails: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/technical-details');
            set({ technicalDetails: response.data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    createTechnicalDetail: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/technical-details', data);
            get().fetchTechnicalDetails();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    updateTechnicalDetail: async (id: number, data: any) => {
        set({ isLoading: true, error: null });
        try {
            await api.patch(`/technical-details/${id}`, data);
            get().fetchTechnicalDetails();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    deleteTechnicalDetail: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/technical-details/${id}`);
            get().fetchTechnicalDetails();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },
}));
