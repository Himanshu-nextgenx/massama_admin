import { create } from 'zustand';
import api from '../utils/auth';

export interface President {
    id: number;
    name: string;
    designation: string;
    years: string;
    profile_image?: string;
    social_links?: {
        linkedin?: string;
        instagram?: string;
        facebook?: string;
        youtube?: string;
        twitter?: string;
        phone?: string;
        whatsapp?: string;
    };
    rank: number;
}

export interface PresidentFormData {
    name: string;
    designation: string;
    years: string;
    profile_image?: File | null;
    social_links?: string; // JSON string for upload
    rank?: number;
}

interface PresidentState {
    presidents: President[];
    isLoading: boolean;
    error: string | null;

    fetchPresidents: () => Promise<void>;
    createPresident: (data: any) => Promise<boolean>;
    updatePresident: (id: number, data: any) => Promise<boolean>;
    deletePresident: (id: number) => Promise<boolean>;
    reorderPresidents: (ids: number[]) => Promise<boolean>;
}

export const usePresidentStore = create<PresidentState>((set, get) => ({
    presidents: [],
    isLoading: false,
    error: null,

    reorderPresidents: async (ids: number[]) => {
        try {
            await api.patch('/presidents/reorder', { ids });
            return true;
        } catch (error) {
            console.error('Reorder failed', error);
            return false;
        }
    },

    fetchPresidents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/presidents');
            set({ presidents: response.data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    createPresident: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('designation', data.designation);
            formData.append('years', data.years);
            if (data.rank) formData.append('rank', data.rank.toString());

            if (data.social_links) {
                // Determine if social_links is object or string, convert to string
                const socialString = typeof data.social_links === 'string'
                    ? data.social_links
                    : JSON.stringify(data.social_links);
                formData.append('social_links', socialString);
            }

            if (data.profile_image instanceof File) {
                formData.append('file', data.profile_image);
            } else if (typeof data.profile_image === 'string' && data.profile_image) {
                // If it's a URL string (unlikely for create, but robust)
                // We don't append 'file', maybe we append 'profile_image' if backend supported it,
                // but our backend logic relies on file upload for image.
            }

            await api.post('/presidents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            get().fetchPresidents();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    updatePresident: async (id: number, data: any) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.designation) formData.append('designation', data.designation);
            if (data.years) formData.append('years', data.years);
            if (data.rank !== undefined) formData.append('rank', data.rank.toString());

            if (data.social_links) {
                const socialString = typeof data.social_links === 'string'
                    ? data.social_links
                    : JSON.stringify(data.social_links);
                formData.append('social_links', socialString);
            }

            if (data.profile_image instanceof File) {
                formData.append('file', data.profile_image);
            }

            await api.patch(`/presidents/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            get().fetchPresidents();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    deletePresident: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/presidents/${id}`);
            get().fetchPresidents();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },
}));
