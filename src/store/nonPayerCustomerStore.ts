import { create } from 'zustand';
import api from '../utils/auth';

export interface NonPayerCustomer {
    id: number;
    partyName: string;
    city: string;
    year: string;
}

export interface NonPayerCustomerFormData {
    partyName: string;
    city: string;
    year: string;
}

interface NonPayerCustomerState {
    customers: NonPayerCustomer[];
    isLoading: boolean;
    error: string | null;

    fetchCustomers: () => Promise<void>;
    createCustomer: (data: NonPayerCustomerFormData) => Promise<boolean>;
    updateCustomer: (id: number, data: NonPayerCustomerFormData) => Promise<boolean>;
    deleteCustomer: (id: number) => Promise<boolean>;
}

export const useNonPayerCustomerStore = create<NonPayerCustomerState>((set, get) => ({
    customers: [],
    isLoading: false,
    error: null,

    fetchCustomers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/non-payer-customers');
            set({ customers: response.data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    createCustomer: async (data: NonPayerCustomerFormData) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/non-payer-customers', data);
            get().fetchCustomers();
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    updateCustomer: async (id: number, data: NonPayerCustomerFormData) => {
        set({ isLoading: true, error: null });
        try {
            await api.patch(`/non-payer-customers/${id}`, data);
            get().fetchCustomers();
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    deleteCustomer: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/non-payer-customers/${id}`);
            get().fetchCustomers();
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },
}));
