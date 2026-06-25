/**
 * Banner API Service
 * Handles all banner-related API calls
 */
import type { Banner } from '../types';
import api from './api';

const ENDPOINT = '/banners';

export const bannerService = {
    /**
     * Get all banners
     */
    async getAll(): Promise<Banner[]> {
        const response = await api.get(ENDPOINT);
        return response.data;
    },

    /**
     * Create new banner with image
     */
    async create(file: File): Promise<Banner> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(ENDPOINT, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete banner
     */
    async delete(id: number): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};

export default bannerService;
