/**
 * Banner Store using Zustand
 * Integrated with production API
 */
import { create } from 'zustand';
import api from '../utils/auth';

export interface Banner {
    id: number;
    image: string;
    position: string;
    created_at?: string;
    updated_at?: string;
}

interface BannerState {
    banners: Banner[];
    isLoading: boolean;
    error: string | null;

    fetchBanners: (position?: string) => Promise<void>;
    uploadBanner: (file: File, position?: string) => Promise<boolean>;
    deleteBanner: (id: number) => Promise<boolean>;
    clearError: () => void;
}

export const useBannerStore = create<BannerState>((set, get) => ({
    banners: [],
    isLoading: false,
    error: null,

    fetchBanners: async (position?: string) => {
        console.log('[BannerStore] Fetching banners, position:', position);
        set({ isLoading: true, error: null });
        try {
            const params: any = {};
            if (position) params.position = position;
            const response = await api.get('/banners', { params });
            const data = response.data;
            console.log('[BannerStore] Raw response:', data);

            const banners = Array.isArray(data) ? data : [];
            set({ banners, isLoading: false });
            console.log('[BannerStore] Banners loaded:', banners.length);
        } catch (error) {
            console.error('[BannerStore] fetchBanners error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch banners';
            set({ error: message, isLoading: false, banners: [] });
        }
    },

    uploadBanner: async (file: File, position: string = 'top') => {
        console.log('[BannerStore] Uploading banner:', file.name, 'position:', position);
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('position', position);

            const response = await api.post('/banners', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('[BannerStore] Banner uploaded:', response.data);
            set({ isLoading: false });
            get().fetchBanners();
            return true;
        } catch (error) {
            console.error('[BannerStore] uploadBanner error:', error);
            const message = error instanceof Error ? error.message : 'Failed to upload banner';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    deleteBanner: async (id: number) => {
        console.log('[BannerStore] Deleting banner:', id);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/banners/${id}`);
            console.log('[BannerStore] Banner deleted');
            set({ isLoading: false });
            get().fetchBanners();
            return true;
        } catch (error) {
            console.error('[BannerStore] deleteBanner error:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete banner';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
