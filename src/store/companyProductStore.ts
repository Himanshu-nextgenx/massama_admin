/**
 * Company Product Store using Zustand
 * Integrated with production API
 */
import { create } from 'zustand';
import api from '../utils/auth';

export type CompanyProductType = 'TYPE_A' | 'TYPE_B';
export type CompanyProductCategory = 'CATEGORY_A' | 'CATEGORY_B';
export type CompanyProductSubCategory = 'SUB_CATEGORY_A' | 'SUB_CATEGORY_B';

export interface CompanyProduct {
    id: number;
    product_name_id: number;
    product_name?: { id: number; name: string };
    product?: { id: number; name: string };
    company_id: number;
    company?: { id: number; name: string; logo?: string };
    type: CompanyProductType;
    category: CompanyProductCategory;
    sub_category: CompanyProductSubCategory;
    grade: string;
    quantity: number;
    price: number;
    images: string[];
    created_at?: string;
    updated_at?: string;
}

export interface CompanyProductFormData {
    product_name_id: number;
    company_id: number;
    type: CompanyProductType;
    category: CompanyProductCategory;
    sub_category: CompanyProductSubCategory;
    grade: string;
    quantity: number;
    price: number;
    files?: File[];
}

export interface CompanyProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    product_name_id?: number;
    company_id?: number;
    type?: CompanyProductType;
    category?: CompanyProductCategory;
    sub_category?: CompanyProductSubCategory;
    grade?: string;
    minPrice?: number;
    maxPrice?: number;
}

interface CompanyProductState {
    companyProducts: CompanyProduct[];
    selectedCompanyProduct: CompanyProduct | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    error: string | null;

    fetchCompanyProducts: (filters?: CompanyProductFilters) => Promise<void>;
    fetchCompanyProductById: (id: number) => Promise<void>;
    createCompanyProduct: (data: CompanyProductFormData) => Promise<boolean>;
    updateCompanyProduct: (id: number, data: Partial<CompanyProductFormData>) => Promise<boolean>;
    deleteCompanyProduct: (id: number) => Promise<boolean>;
    removeImage: (id: number, imageUrl: string) => Promise<boolean>;
    setSelectedCompanyProduct: (cp: CompanyProduct | null) => void;
    clearError: () => void;
}

export const useCompanyProductStore = create<CompanyProductState>((set, get) => ({
    companyProducts: [],
    selectedCompanyProduct: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    isLoading: false,
    error: null,

    fetchCompanyProducts: async (filters: CompanyProductFilters = {}) => {
        const { page = 1, limit = 10, ...otherFilters } = filters;
        console.log('[CompanyProductStore] Fetching company products:', filters);
        set({ isLoading: true, error: null });
        try {
            const params: Record<string, unknown> = { page, limit, ...otherFilters };
            // Remove undefined params
            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

            const response = await api.get('/products', { params });
            const data = response.data;
            console.log('[CompanyProductStore] Raw response:', data);

            let companyProducts: CompanyProduct[] = [];
            let total = 0;

            if (data.data && Array.isArray(data.data)) {
                companyProducts = data.data;
                total = data.total || data.data.length;
            } else if (Array.isArray(data)) {
                companyProducts = data;
                total = data.length;
            }

            set({
                companyProducts: companyProducts.map((i: any) => ({
                    ...i,
                    product: i.product_name || i.product || { name: 'Unknown Product' }
                })),
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                totalItems: total,
                isLoading: false,
            });
            console.log('[CompanyProductStore] Company products loaded:', companyProducts.length);
        } catch (error) {
            console.error('[CompanyProductStore] fetchCompanyProducts error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch company products';
            set({ error: message, isLoading: false, companyProducts: [] });
        }
    },

    fetchCompanyProductById: async (id: number) => {
        console.log('[CompanyProductStore] Fetching company product by ID:', id);
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/products/${id}`);
            console.log('[CompanyProductStore] Company product fetched:', response.data);
            set({ selectedCompanyProduct: response.data, isLoading: false });
        } catch (error) {
            console.error('[CompanyProductStore] fetchCompanyProductById error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch company product';
            set({ error: message, isLoading: false });
        }
    },

    createCompanyProduct: async (data: CompanyProductFormData) => {
        console.log('[CompanyProductStore] Creating company product:', data);
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('product_name_id', String(data.product_name_id));
            formData.append('company_id', String(data.company_id));
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
            console.log('[CompanyProductStore] Company product created:', response.data);
            set({ isLoading: false });
            get().fetchCompanyProducts();
            return true;
        } catch (error) {
            console.error('[CompanyProductStore] createCompanyProduct error:', error);
            const message = error instanceof Error ? error.message : 'Failed to create company product';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    updateCompanyProduct: async (id: number, data: Partial<CompanyProductFormData>) => {
        console.log('[CompanyProductStore] Updating company product:', id, data);
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            if (data.product_name_id) formData.append('product_name_id', String(data.product_name_id));
            if (data.company_id) formData.append('company_id', String(data.company_id));
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
            console.log('[CompanyProductStore] Company product updated:', response.data);
            set({ isLoading: false });
            get().fetchCompanyProducts();
            return true;
        } catch (error) {
            console.error('[CompanyProductStore] updateCompanyProduct error:', error);
            const message = error instanceof Error ? error.message : 'Failed to update company product';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    deleteCompanyProduct: async (id: number) => {
        console.log('[CompanyProductStore] Deleting company product:', id);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/products/${id}`);
            console.log('[CompanyProductStore] Company product deleted');
            set({ isLoading: false });
            get().fetchCompanyProducts();
            return true;
        } catch (error) {
            console.error('[CompanyProductStore] deleteCompanyProduct error:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete company product';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    removeImage: async (id: number, imageUrl: string) => {
        console.log('[CompanyProductStore] Removing image from company product:', id, imageUrl);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/products/${id}/image`, { data: { imageUrl } });
            console.log('[CompanyProductStore] Image removed');
            set({ isLoading: false });
            get().fetchCompanyProducts();
            return true;
        } catch (error) {
            console.error('[CompanyProductStore] removeImage error:', error);
            const message = error instanceof Error ? error.message : 'Failed to remove image';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    setSelectedCompanyProduct: (cp: CompanyProduct | null) => {
        set({ selectedCompanyProduct: cp });
    },

    clearError: () => {
        set({ error: null });
    },
}));
