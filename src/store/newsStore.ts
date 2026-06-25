/**
 * News Store using Zustand
 */
import { create } from 'zustand';
import api from '../utils/auth';

export interface NewsItem {
    id: number;
    title: string;
    description?: string;
    image?: string;
    category?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface NewsFormData {
    title: string;
    description?: string;
    category?: string;
    file?: File | null;
}

interface NewsState {
    newsList: NewsItem[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;

    fetchNews: (page?: number, limit?: number, category?: string) => Promise<void>;
    createNews: (data: NewsFormData) => Promise<boolean>;
    updateNews: (id: number, data: NewsFormData) => Promise<boolean>;
    deleteNews: (id: number) => Promise<boolean>;
    clearError: () => void;
}

export const useNewsStore = create<NewsState>((set, get) => ({
    newsList: [],
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,

    fetchNews: async (page = 1, limit = 20, category?: string) => {
        set({ isLoading: true, error: null });
        try {
            const params: any = { page, limit };
            if (category) params.category = category;
            const response = await api.get('/news', { params });
            const data = response.data;

            const items = data.data || (Array.isArray(data) ? data : []);
            const total = data.total || items.length;

            set({
                newsList: items,
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                isLoading: false,
            });
        } catch (error) {
            console.error('[NewsStore] fetchNews error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch news';
            set({ error: message, isLoading: false, newsList: [] });
        }
    },

    createNews: async (data: NewsFormData) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            if (data.description) formData.append('description', data.description);
            if (data.category) formData.append('category', data.category);
            if (data.file) formData.append('file', data.file);

            await api.post('/news', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set({ isLoading: false });
            get().fetchNews();
            return true;
        } catch (error) {
            console.error('[NewsStore] createNews error:', error);
            const message = error instanceof Error ? error.message : 'Failed to create news';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    updateNews: async (id: number, data: NewsFormData) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            if (data.description) formData.append('description', data.description);
            if (data.category) formData.append('category', data.category);
            if (data.file) formData.append('file', data.file);

            await api.patch(`/news/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set({ isLoading: false });
            get().fetchNews();
            return true;
        } catch (error) {
            console.error('[NewsStore] updateNews error:', error);
            const message = error instanceof Error ? error.message : 'Failed to update news';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    deleteNews: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/news/${id}`);
            set({ isLoading: false });
            get().fetchNews();
            return true;
        } catch (error) {
            console.error('[NewsStore] deleteNews error:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete news';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
