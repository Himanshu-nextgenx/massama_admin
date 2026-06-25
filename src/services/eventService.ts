/**
 * Event API Service
 * Handles all event-related API calls
 */
import type { CreateEventDto, EventEntity, EventFilterDto, UpdateEventDto } from '../types';
import type { PaginatedResponse } from './api';
import api from './api';

const ENDPOINT = '/events';

export const eventService = {
    /**
     * Get all events with optional filtering/pagination
     */
    async getAll(filters?: EventFilterDto): Promise<PaginatedResponse<EventEntity>> {
        const response = await api.get(ENDPOINT, { params: filters });
        return response.data;
    },

    /**
     * Get single event by ID
     */
    async getById(id: number): Promise<EventEntity> {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create new event with optional image
     */
    async create(data: CreateEventDto, file?: File): Promise<EventEntity> {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        if (file) {
            formData.append('file', file);
        }

        const response = await api.post(ENDPOINT, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Update event with optional new image
     */
    async update(id: number, data: UpdateEventDto, file?: File): Promise<EventEntity> {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        if (file) {
            formData.append('file', file);
        }

        const response = await api.patch(`${ENDPOINT}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete event
     */
    async delete(id: number): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};

export default eventService;
