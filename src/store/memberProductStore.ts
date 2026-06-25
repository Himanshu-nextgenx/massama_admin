/**
 * Member Product Store using Zustand
 * Integrated with production API
 */
import { create } from 'zustand';
import api from '../utils/auth';

export type MemberProductType = 'TYPE_A' | 'TYPE_B';
export type MemberProductCategory = 'CATEGORY_A' | 'CATEGORY_B';
export type MemberProductSubCategory = 'SUB_CATEGORY_A' | 'SUB_CATEGORY_B';

export interface MemberProduct {
    id: number;
    product_name_id: number;
    product_name?: { id: number; name: string };
    product?: { id: number; name: string };
    member_id: number;
    member?: { id: number; name: string; logo?: string };
    type: MemberProductType;
    category: MemberProductCategory;
    sub_category: MemberProductSubCategory;
    grade: string;
    quantity: number;
    price: number;
    images: string[];
    created_at?: string;
    updated_at?: string;
}

export interface MemberProductFormData {
    product_name_id: number;
    member_id: number;
    type: MemberProductType;
    category: MemberProductCategory;
    sub_category: MemberProductSubCategory;
    grade: string;
    quantity: number;
    price: number;
    files?: File[];
}

export interface MemberProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    product_name_id?: number;
    member_id?: number;
    type?: MemberProductType;
    category?: MemberProductCategory;
    sub_category?: MemberProductSubCategory;
    grade?: string;
    minPrice?: number;
    maxPrice?: number;
}

interface MemberProductState {
    memberProducts: MemberProduct[];
    selectedMemberProduct: MemberProduct | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    error: string | null;

    fetchMemberProducts: (filters?: MemberProductFilters) => Promise<void>;
    fetchMemberProductById: (id: number) => Promise<void>;
    createMemberProduct: (data: MemberProductFormData) => Promise<boolean>;
    updateMemberProduct: (id: number, data: Partial<MemberProductFormData>) => Promise<boolean>;
    deleteMemberProduct: (id: number) => Promise<boolean>;
    removeImage: (id: number, imageUrl: string) => Promise<boolean>;
    setSelectedMemberProduct: (cp: MemberProduct | null) => void;
    clearError: () => void;
}

export const useMemberProductStore = create<MemberProductState>((set, get) => ({
    memberProducts: [],
    selectedMemberProduct: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    isLoading: false,
    error: null,

    fetchMemberProducts: async (filters: MemberProductFilters = {}) => {
        const { page = 1, limit = 10, ...otherFilters } = filters;
        console.log('[MemberProductStore] Fetching member products:', filters);
        set({ isLoading: true, error: null });
        try {
            const params: Record<string, unknown> = { page, limit, ...otherFilters };
            // Map member_id back to company_id for API
            if (params.member_id) {
                params.company_id = params.member_id;
                delete params.member_id;
            }
            // Remove undefined params
            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

            const response = await api.get('/products', { params });
            const data = response.data;
            console.log('[MemberProductStore] Raw response:', data);

            let memberProducts: MemberProduct[] = [];
            let total = 0;

            if (data.data && Array.isArray(data.data)) {
                memberProducts = data.data;
                total = data.total || data.data.length;
            } else if (Array.isArray(data)) {
                memberProducts = data;
                total = data.length;
            }

            set({
                memberProducts: memberProducts.map((i: any) => ({
                    ...i,
                    member_id: i.company_id,
                    member: i.company,
                    product: i.product_name || i.product || { name: 'Unknown Product' }
                })),
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                totalItems: total,
                isLoading: false,
            });
            console.log('[MemberProductStore] Member products loaded:', memberProducts.length);
        } catch (error) {
            console.error('[MemberProductStore] fetchMemberProducts error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch member products';
            set({ error: message, isLoading: false, memberProducts: [] });
        }
    },

    fetchMemberProductById: async (id: number) => {
        console.log('[MemberProductStore] Fetching member product by ID:', id);
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/products/${id}`);
            console.log('[MemberProductStore] Member product fetched:', response.data);
            const data = response.data;
            set({
                selectedMemberProduct: {
                    ...data,
                    member_id: data.company_id,
                    member: data.company
                },
                isLoading: false
            });
        } catch (error) {
            console.error('[MemberProductStore] fetchMemberProductById error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch member product';
            set({ error: message, isLoading: false });
        }
    },

    createMemberProduct: async (data: MemberProductFormData) => {
        console.log('[MemberProductStore] Creating member product:', data);
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('product_name_id', String(data.product_name_id));
            formData.append('company_id', String(data.member_id));
            formData.append('type', data.type);
            formData.append('category', data.category);
            formData.append('sub_category', data.sub_category);
            formData.append('grade', data.grade);
            formData.append('quantity', String(data.quantity));
            formData.append('price', String(data.price));

            if (data.files) {
                data.files.forEach((file) => {
                    formData.append('files', file);
                });
            }

            const response = await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('[MemberProductStore] Member product created:', response.data);
            set({ isLoading: false });
            get().fetchMemberProducts();
            return true;
        } catch (error) {
            console.error('[MemberProductStore] createMemberProduct error:', error);
            const message = error instanceof Error ? error.message : 'Failed to create member product';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    updateMemberProduct: async (id: number, data: Partial<MemberProductFormData>) => {
        console.log('[MemberProductStore] Updating member product:', id, data);
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            if (data.product_name_id) formData.append('product_name_id', String(data.product_name_id));
            if (data.member_id) formData.append('company_id', String(data.member_id));
            if (data.type) formData.append('type', data.type);
            if (data.category) formData.append('category', data.category);
            if (data.sub_category) formData.append('sub_category', data.sub_category);
            if (data.grade) formData.append('grade', data.grade);
            if (data.quantity !== undefined) formData.append('quantity', String(data.quantity));
            if (data.price !== undefined) formData.append('price', String(data.price));

            if (data.files) {
                data.files.forEach((file) => {
                    formData.append('files', file);
                });
            }

            const response = await api.patch(`/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('[MemberProductStore] Member product updated:', response.data);
            set({ isLoading: false });
            get().fetchMemberProducts();
            return true;
        } catch (error) {
            console.error('[MemberProductStore] updateMemberProduct error:', error);
            const message = error instanceof Error ? error.message : 'Failed to update member product';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    deleteMemberProduct: async (id: number) => {
        console.log('[MemberProductStore] Deleting member product:', id);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/products/${id}`);
            console.log('[MemberProductStore] Member product deleted');
            set({ isLoading: false });
            get().fetchMemberProducts();
            return true;
        } catch (error) {
            console.error('[MemberProductStore] deleteMemberProduct error:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete member product';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    removeImage: async (id: number, imageUrl: string) => {
        console.log('[MemberProductStore] Removing image from member product:', id, imageUrl);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/products/${id}/image`, { data: { imageUrl } });
            console.log('[MemberProductStore] Image removed');
            set({ isLoading: false });
            get().fetchMemberProducts();
            return true;
        } catch (error) {
            console.error('[MemberProductStore] removeImage error:', error);
            const message = error instanceof Error ? error.message : 'Failed to remove image';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    setSelectedMemberProduct: (cp: MemberProduct | null) => {
        set({ selectedMemberProduct: cp });
    },

    clearError: () => {
        set({ error: null });
    },
}));
