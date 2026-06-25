/**
 * User API Service
 * Handles all user-related API calls
 */
import type { UpdateUserDto, User, UserFilterDto } from '../types';
import type { PaginatedResponse } from './api';
import api from './api';

const ENDPOINT = '/users';

export const userService = {
    /**
     * Get all users with optional filtering/pagination
     */
    async getAll(filters?: UserFilterDto): Promise<PaginatedResponse<User>> {
        const response = await api.get(ENDPOINT, { params: filters });
        return response.data;
    },

    /**
     * Get single user by ID
     */
    async getById(id: number): Promise<User> {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Update user
     */
    async update(id: number, data: UpdateUserDto): Promise<User> {
        const response = await api.patch(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete user
     */
    async delete(id: number): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },

    /**
     * Upload/update user profile image
     */
    async updateProfileImage(id: number, file: File): Promise<{ message: string; data: User }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.patch(`${ENDPOINT}/${id}/profile-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete user profile image
     */
    async deleteProfileImage(id: number): Promise<{ message: string; data: User }> {
        const response = await api.delete(`${ENDPOINT}/${id}/profile-image`);
        return response.data;
    },
};

export default userService;
