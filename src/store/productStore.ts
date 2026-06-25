import { create } from 'zustand';
import api from '../utils/auth';

// Master Product Name (from Catalog)
export interface MasterProductName {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
}

// Member Product (the actual product with details)
export interface MemberProduct {
    id: number;
    product_name_id: number;
    product_name?: MasterProductName;
    product?: string; // Mapped name for UI compatibility
    member_id: number;
    member?: {
        id: number;
        name: string;
        logo?: string;
    };
    type: string;
    category: string;
    sub_category: string;
    grade?: string;
    quantity: number;
    price: number;
    images: string[];
}

// UI Wrapper for Summary
export interface ProductSummary {
    id: number;
    name: string;
    count: number;
}

interface ProductState {
    catalogProductNames: MasterProductName[];
    memberProducts: MemberProduct[];
    summaries: ProductSummary[];
    isLoading: boolean;
    error: string | null;
    totalItems: number;
    currentPage: number;
    totalPages: number;

    fetchCatalog: () => Promise<void>;
    fetchMemberProducts: (page?: number, limit?: number, productNameId?: number, search?: string) => Promise<void>;
    createMemberProduct: (data: any) => Promise<any>;
    deleteMemberProduct: (id: number) => Promise<boolean>;
}

export const useProductStore = create<ProductState>((set: any, get: any) => ({
    catalogProductNames: [],
    memberProducts: [],
    summaries: [],
    isLoading: false,
    error: null,
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,

    fetchCatalog: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/catalog/product-names/active');
            set({ catalogProductNames: response.data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch catalog', isLoading: false });
        }
    },

    fetchMemberProducts: async (page = 1, limit = 10, productNameId?: number, search?: string) => {
        set({ isLoading: true });
        try {
            const params: any = { page, limit };
            if (productNameId) params.product_name_id = productNameId;
            if (search) params.search = search;

            const response = await api.get('/products', { params });
            const data = response.data;

            const items = Array.isArray(data) ? data : (data.data || []);
            const total = data.total || items.length;

            // Update summaries based on catalog + counts
            const catalog = get().catalogProductNames;
            if (catalog.length === 0) {
                await get().fetchCatalog();
            }

            const currentCatalog = get().catalogProductNames;
            const summaries = currentCatalog.map((cat: MasterProductName) => {
                // This is a bit inefficient without a dedicated count endpoint, 
                // but works for now as we grouped them
                return {
                    id: cat.id,
                    name: cat.name,
                    count: items.filter((i: any) => i.product_name_id === cat.id).length
                };
            });

            set({
                memberProducts: items.map((i: any) => ({
                    ...i,
                    member_id: i.company_id,
                    member: i.company,
                    product: i.product_name?.name || i.name || 'Unknown Product'
                })),
                summaries,
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                isLoading: false
            });
        } catch (error) {
            set({ error: 'Failed to fetch products', isLoading: false });
        }
    },

    createMemberProduct: async (data: any) => {
        set({ isLoading: true });
        try {
            // Check if we have files in data
            if (data.files && Array.isArray(data.files)) {
                console.log('[ProductStore] Using FormData for product creation');
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'files') {
                        (value as File[]).forEach(file => {
                            formData.append('files', file);
                        });
                    } else if (value !== null && value !== undefined) {
                        formData.append(key === 'member_id' ? 'company_id' : key, String(value));
                    }
                });

                const response = await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                await get().fetchMemberProducts();
                return response.data;
            } else {
                const response = await api.post('/products', data);
                await get().fetchMemberProducts();
                return response.data;
            }
        } catch (error) {
            console.error('[ProductStore] createMemberProduct error:', error);
            set({ error: 'Failed to create product', isLoading: false });
            return null;
        }
    },

    deleteMemberProduct: async (id: number) => {
        try {
            await api.delete(`/products/${id}`);
            await get().fetchMemberProducts();
            return true;
        } catch (error) {
            return false;
        }
    }
}));
