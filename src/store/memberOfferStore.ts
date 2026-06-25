import { create } from 'zustand';
import api from '../utils/auth';

export interface MemberOfferEntity {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    start_date: string;
    end_date: string;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface MemberOfferFormData {
    title: string;
    description?: string;
    category?: string;
    start_date: string;
    end_date: string;
    file?: File;
    is_active?: boolean;
}

interface MemberOfferStore {
    offers: MemberOfferEntity[];
    selectedOffer: MemberOfferEntity | null;
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;

    fetchOffers: (page?: number, limit?: number, search?: string, is_active?: boolean, sort?: string) => Promise<void>;
    fetchOfferById: (id: number) => Promise<void>;
    createOffer: (data: MemberOfferFormData) => Promise<MemberOfferEntity | null>;
    updateOffer: (id: number, data: MemberOfferFormData) => Promise<MemberOfferEntity | null>;
    deleteOffer: (id: number) => Promise<boolean>;
}

export const useMemberOfferStore = create<MemberOfferStore>((set, get) => ({
    offers: [],
    selectedOffer: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,

    fetchOffers: async (page = 1, limit = 10, search?: string, is_active?: boolean, sort?: string) => {
        console.log('[MemberOfferStore] Fetching member offers');
        set({ isLoading: true, error: null });
        try {
            const params: Record<string, any> = { page, limit };
            if (search) params.search = search;
            if (is_active !== undefined) params.is_active = is_active;
            if (sort) params.sort = sort;

            const response = await api.get('/member-offers', { params });
            const data = response.data;
            console.log('[MemberOfferStore] Response:', data);

            set({
                offers: data.data || [],
                currentPage: data.page || 1,
                totalPages: data.totalPages || 1,
                totalItems: data.total || 0,
                isLoading: false,
            });
        } catch (error) {
            console.error('[MemberOfferStore] fetchOffers error:', error);
            set({ error: 'Failed to fetch member offers', isLoading: false });
        }
    },

    fetchOfferById: async (id: number) => {
        console.log('[MemberOfferStore] Fetching offer by ID:', id);
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/member-offers/${id}`);
            console.log('[MemberOfferStore] Offer fetched:', response.data);
            set({ selectedOffer: response.data, isLoading: false });
        } catch (error) {
            console.error('[MemberOfferStore] fetchOfferById error:', error);
            set({ error: 'Failed to fetch offer details', isLoading: false });
        }
    },

    createOffer: async (data: MemberOfferFormData) => {
        console.log('[MemberOfferStore] Creating member offer:', data);
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'file' && value instanceof File) {
                    formData.append('file', value);
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            const response = await api.post('/member-offers', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('[MemberOfferStore] Offer created:', response.data);
            set({ isLoading: false });
            get().fetchOffers();
            return response.data;
        } catch (error) {
            console.error('[MemberOfferStore] createOffer error:', error);
            set({ error: 'Failed to create member offer', isLoading: false });
            return null;
        }
    },

    updateOffer: async (id: number, data: MemberOfferFormData) => {
        console.log('[MemberOfferStore] Updating member offer:', id, data);
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'file' && value instanceof File) {
                    formData.append('file', value);
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            const response = await api.patch(`/member-offers/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('[MemberOfferStore] Offer updated:', response.data);
            set({ isLoading: false });
            get().fetchOffers();
            return response.data;
        } catch (error) {
            console.error('[MemberOfferStore] updateOffer error:', error);
            set({ error: 'Failed to update member offer', isLoading: false });
            return null;
        }
    },

    deleteOffer: async (id: number) => {
        console.log('[MemberOfferStore] Deleting member offer:', id);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/member-offers/${id}`);
            console.log('[MemberOfferStore] Offer deleted');
            set({ isLoading: false });
            get().fetchOffers();
            return true;
        } catch (error) {
            console.error('[MemberOfferStore] deleteOffer error:', error);
            set({ error: 'Failed to delete member offer', isLoading: false });
            return false;
        }
    },
}));
