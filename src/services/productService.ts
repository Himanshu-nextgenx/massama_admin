/**
 * Product API Service
 * Handles all product-related API calls
 */
import type { CreateProductDto, Product, ProductFilterDto, UpdateProductDto } from '../types';
import type { PaginatedResponse } from './api';
import api from './api';

const ENDPOINT = '/products';

export const productService = {
    /**
     * Get all products with optional filtering/pagination
     */
    async getAll(filters?: ProductFilterDto): Promise<PaginatedResponse<Product>> {
        const response = await api.get(ENDPOINT, { params: filters });
        return response.data;
    },

    /**
     * Get single product by ID
     */
    async getById(id: number): Promise<Product> {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create new product with optional images (max 5)
     */
    async create(data: CreateProductDto, files?: File[]): Promise<Product> {
        const formData = new FormData();

        // Add all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        // Add images if provided (max 5)
        if (files && files.length > 0) {
            files.slice(0, 5).forEach((file) => {
                formData.append('files', file);
            });
        }

        const response = await api.post(ENDPOINT, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Update product with optional new images
     */
    async update(id: number, data: UpdateProductDto, files?: File[]): Promise<Product> {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        if (files && files.length > 0) {
            files.slice(0, 5).forEach((file) => {
                formData.append('files', file);
            });
        }

        const response = await api.patch(`${ENDPOINT}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete product
     */
    async delete(id: number): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },

    /**
     * Remove specific image from product
     */
    async removeImage(id: number, imageUrl: string): Promise<Product> {
        const response = await api.delete(`${ENDPOINT}/${id}/image`, {
            data: { imageUrl },
        });
        return response.data;
    },
};

export default productService;
