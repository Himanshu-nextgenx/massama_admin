/**
 * Event Store using Zustand
 * Integrated with production API
 */
import { create } from 'zustand';
import api from '../utils/auth';

export interface EventEntity {
    id: number;
    name: string;
    date: string;
    time: string;
    image?: string | object;
    description?: string;
    country: string;
    city: string;
    address: string;
    landmark?: string;
    created_at?: string;
    updated_at?: string;
}

export interface EventFormData {
    name: string;
    date: string; // YYYY-MM-DD format
    time: string; // HH:MM format
    description?: string;
    country: string;
    city: string;
    address: string;
    landmark?: string;
    file?: File;
    type?: 'event' | 'exhibition';
}

interface EventState {
    events: EventEntity[];
    selectedEvent: EventEntity | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    error: string | null;

    fetchEvents: (page?: number, limit?: number, search?: string, type?: 'event' | 'exhibition', sort?: string) => Promise<void>;
    fetchEventById: (id: number) => Promise<void>;
    createEvent: (data: EventFormData) => Promise<boolean>;
    updateEvent: (id: number, data: Partial<EventFormData>) => Promise<boolean>;
    deleteEvent: (id: number) => Promise<boolean>;
    setSelectedEvent: (event: EventEntity | null) => void;
    clearError: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    selectedEvent: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    isLoading: false,
    error: null,

    fetchEvents: async (page = 1, limit = 10, search?: string, type?: 'event' | 'exhibition', sort?: string) => {
        console.log('[EventStore] Fetching events, page:', page, 'limit:', limit, 'search:', search, 'type:', type, 'sort:', sort);
        set({ isLoading: true, error: null });
        try {
            const params: Record<string, unknown> = { page, limit };
            if (search) params.search = search;
            if (type) params.type = type;
            if (sort) params.sort = sort;

            const response = await api.get('/events', { params });
            const data = response.data;
            console.log('[EventStore] Raw response:', data);

            // Handle paginated response format { data: [], total, page, limit }
            let events: EventEntity[] = [];
            let total = 0;

            if (data.data && Array.isArray(data.data)) {
                events = data.data;
                total = data.total || data.data.length;
                console.log('[EventStore] Paginated response, events:', total);
            } else if (Array.isArray(data)) {
                events = data;
                total = data.length;
                console.log('[EventStore] Array response, events:', total);
            } else {
                console.warn('[EventStore] Unexpected response format:', typeof data);
            }

            set({
                events,
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                totalItems: total,
                isLoading: false,
            });
            console.log('[EventStore] Events loaded:', events.length);
        } catch (error) {
            console.error('[EventStore] fetchEvents error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch events';
            set({
                error: message,
                isLoading: false,
                events: []
            });
        }
    },

    fetchEventById: async (id: number) => {
        console.log('[EventStore] Fetching event by ID:', id);
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/events/${id}`);
            console.log('[EventStore] Event fetched:', response.data);
            set({ selectedEvent: response.data, isLoading: false });
        } catch (error) {
            console.error('[EventStore] fetchEventById error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch event';
            set({ error: message, isLoading: false });
        }
    },

    createEvent: async (data: EventFormData) => {
        console.log('[EventStore] Creating event:', data);
        set({ isLoading: true, error: null });
        try {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('date', data.date);
            formData.append('time', data.time);
            formData.append('country', data.country);
            formData.append('city', data.city);
            formData.append('address', data.address);
            if (data.description) formData.append('description', data.description);
            if (data.landmark) formData.append('landmark', data.landmark);
            if (data.file) formData.append('file', data.file);
            if (data.type) formData.append('type', data.type);

            console.log('[EventStore] Sending FormData request');
            const response = await api.post('/events', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('[EventStore] Event created:', response.data);
            set({ isLoading: false });
            get().fetchEvents();
            return true;
        } catch (error) {
            console.error('[EventStore] createEvent error:', error);
            const message = error instanceof Error ? error.message : 'Failed to create event';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    updateEvent: async (id: number, data: Partial<EventFormData>) => {
        console.log('[EventStore] Updating event:', id, data);
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.date) formData.append('date', data.date);
            if (data.time) formData.append('time', data.time);
            if (data.country) formData.append('country', data.country);
            if (data.city) formData.append('city', data.city);
            if (data.address) formData.append('address', data.address);
            if (data.description) formData.append('description', data.description);
            if (data.landmark) formData.append('landmark', data.landmark);
            if (data.file) formData.append('file', data.file);

            const response = await api.patch(`/events/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('[EventStore] Event updated:', response.data);
            set({ isLoading: false });
            get().fetchEvents();
            return true;
        } catch (error) {
            console.error('[EventStore] updateEvent error:', error);
            const message = error instanceof Error ? error.message : 'Failed to update event';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    deleteEvent: async (id: number) => {
        console.log('[EventStore] Deleting event:', id);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/events/${id}`);
            console.log('[EventStore] Event deleted');
            set({ isLoading: false });
            get().fetchEvents();
            return true;
        } catch (error) {
            console.error('[EventStore] deleteEvent error:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete event';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    setSelectedEvent: (event: EventEntity | null) => {
        set({ selectedEvent: event });
    },

    clearError: () => {
        set({ error: null });
    },
}));
