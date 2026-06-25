import api from './api';

// Types
export interface CatalogItem {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SubCategory extends CatalogItem {
    category_id: number;
    category?: CatalogItem;
}

export interface Category extends CatalogItem {
    subcategories?: SubCategory[];
}

// Product Names
export const getProductNames = () => api.get<CatalogItem[]>('/catalog/product-names');
export const getActiveProductNames = () => api.get<CatalogItem[]>('/catalog/product-names/active');
export const createProductName = (name: string) => api.post<CatalogItem>('/catalog/product-names', { name });
export const updateProductName = (id: number, data: { name?: string; is_active?: boolean }) =>
    api.patch<CatalogItem>(`/catalog/product-names/${id}`, data);
export const deleteProductName = (id: number) => api.delete(`/catalog/product-names/${id}`);

// Product Types
export interface ProductType extends CatalogItem {
    product_name_id?: number;
    product_name?: CatalogItem;
}

export const getProductTypes = (productNameId?: number) => {
    const params = productNameId ? `?product_name_id=${productNameId}` : '';
    return api.get<ProductType[]>(`/catalog/product-types${params}`);
};
export const getActiveProductTypes = (productNameId?: number) => {
    const params = productNameId ? `?product_name_id=${productNameId}` : '';
    return api.get<ProductType[]>(`/catalog/product-types/active${params}`);
};
export const createProductType = (name: string, product_name_id?: number) =>
    api.post<ProductType>('/catalog/product-types', { name, product_name_id });
export const updateProductType = (id: number, data: { name?: string; product_name_id?: number; is_active?: boolean }) =>
    api.patch<ProductType>(`/catalog/product-types/${id}`, data);
export const deleteProductType = (id: number) => api.delete(`/catalog/product-types/${id}`);

// Categories
export const getCategories = () => api.get<Category[]>('/catalog/categories');
export const getActiveCategories = () => api.get<Category[]>('/catalog/categories/active');
export const createCategory = (name: string) => api.post<Category>('/catalog/categories', { name });
export const updateCategory = (id: number, data: { name?: string; is_active?: boolean }) =>
    api.patch<Category>(`/catalog/categories/${id}`, data);
export const deleteCategory = (id: number) => api.delete(`/catalog/categories/${id}`);

// SubCategories
export const getSubCategories = (categoryId?: number) => {
    const params = categoryId ? `?category_id=${categoryId}` : '';
    return api.get<SubCategory[]>(`/catalog/subcategories${params}`);
};
export const getActiveSubCategories = (categoryId?: number) => {
    const params = categoryId ? `?category_id=${categoryId}` : '';
    return api.get<SubCategory[]>(`/catalog/subcategories/active${params}`);
};
export const createSubCategory = (name: string, category_id: number) =>
    api.post<SubCategory>('/catalog/subcategories', { name, category_id });
export const updateSubCategory = (id: number, data: { name?: string; category_id?: number; is_active?: boolean }) =>
    api.patch<SubCategory>(`/catalog/subcategories/${id}`, data);
export const deleteSubCategory = (id: number) => api.delete(`/catalog/subcategories/${id}`);
