import { create } from 'zustand';
import api from '../utils/auth';

export interface EssentialContactCategory {
    id: number;
    name: string;
    icon?: string;
}

export interface EssentialContact {
    id: number;
    name: string;
    phone: string;
    address?: string;
    city?: string;
    telephone_number?: string;
    residence_number?: string;
    category?: EssentialContactCategory;
}

interface EssentialContactState {
    categories: EssentialContactCategory[];
    contacts: EssentialContact[];
    isLoading: boolean;
    error: string | null;

    fetchCategories: () => Promise<void>;
    fetchContacts: (search?: string) => Promise<void>;

    createCategory: (data: any) => Promise<boolean>;
    updateCategory: (id: number, data: any) => Promise<boolean>;
    deleteCategory: (id: number) => Promise<boolean>;

    createContact: (data: any) => Promise<boolean>;
    updateContact: (id: number, data: any) => Promise<boolean>;
    deleteContact: (id: number) => Promise<boolean>;
}

export const useEssentialContactStore = create<EssentialContactState>((set, get) => ({
    categories: [],
    contacts: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/essential-contacts/categories');
            set({ categories: response.data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    fetchContacts: async (search?: string) => {
        set({ isLoading: true });
        try {
            const params = search ? { search } : {};
            const response = await api.get('/essential-contacts', { params });
            set({ contacts: response.data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    createCategory: async (data: any) => {
        try {
            await api.post('/essential-contacts/categories', data);
            get().fetchCategories();
            return true;
        } catch (error) {
            return false;
        }
    },

    updateCategory: async (id: number, data: any) => {
        try {
            await api.patch(`/essential-contacts/categories/${id}`, data);
            get().fetchCategories();
            return true;
        } catch (error) {
            return false;
        }
    },

    deleteCategory: async (id: number) => {
        try {
            await api.delete(`/essential-contacts/categories/${id}`);
            get().fetchCategories();
            return true;
        } catch (error) {
            return false;
        }
    },

    createContact: async (data: any) => {
        set({ error: null });
        try {
            await api.post('/essential-contacts', data);
            get().fetchContacts();
            return true;
        } catch (error: any) {
            // Check for specific error message from backend
            const msg = error.response?.data?.message || (error as Error).message;
            set({ error: msg });
            return false;
        }
    },

    updateContact: async (id: number, data: any) => {
        set({ error: null });
        try {
            await api.patch(`/essential-contacts/${id}`, data);
            get().fetchContacts();
            return true;
        } catch (error: any) {
            const msg = error.response?.data?.message || (error as Error).message;
            set({ error: msg });
            return false;
        }
    },

    deleteContact: async (id: number) => {
        try {
            await api.delete(`/essential-contacts/${id}`);
            get().fetchContacts();
            return true;
        } catch (error) {
            return false;
        }
    },
}));
