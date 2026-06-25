/**
 * Member API Service
 * Handles all member-related API calls
 */
import type { Member as Company, MemberFilterDto as CompanyFilterDto, CreateMemberDto as CreateCompanyDto, UpdateMemberDto as UpdateCompanyDto } from '../types';
import type { PaginatedResponse } from './api';
import api from './api';

const ENDPOINT = '/company';

export const memberService = {
    /**
     * Get all members with optional filtering/pagination
     */
    async getAll(filters?: CompanyFilterDto): Promise<PaginatedResponse<Company>> {
        const response = await api.get(ENDPOINT, { params: filters });
        return response.data;
    },

    /**
     * Get single member by ID
     */
    async getById(id: number): Promise<Company> {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Get members by user ID
     */
    async getByUserId(userId: number): Promise<Company[]> {
        const response = await api.get(`${ENDPOINT}/user/${userId}`);
        return response.data;
    },

    /**
     * Create new member
     */
    async create(data: CreateCompanyDto): Promise<Company> {
        const response = await api.post(ENDPOINT, data);
        return response.data;
    },

    /**
     * Update member
     */
    async update(id: number, data: UpdateCompanyDto): Promise<Company> {
        const response = await api.patch(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete member
     */
    async delete(id: number): Promise<{ message: string }> {
        const response = await api.delete(`${ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Upload/update member logo
     */
    async updateLogo(id: number, file: File): Promise<{ message: string; data: Company }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.patch(`${ENDPOINT}/${id}/logo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete member logo
     */
    async deleteLogo(id: number): Promise<{ message: string; data: Company }> {
        const response = await api.delete(`${ENDPOINT}/${id}/logo`);
        return response.data;
    },
};

export default memberService;
