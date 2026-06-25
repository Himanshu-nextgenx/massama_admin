/**
 * Company Store using Zustand
 * Integrated with production API
 */
import { create } from 'zustand';
import api from '../utils/auth';

// Types
export interface Company {
  id: number;
  name: string;
  gst_no?: string;
  pancard_no?: string;
  din_no?: string;
  website?: string;
  hughes_no?: string[];
  mobile_number: string;
  resi?: string;
  amd?: boolean;
  email: string;
  address: string;
  city?: string;
  bank?: string;
  branch?: string;
  account_number?: string;
  logo?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyFormData {
  name: string;
  gst_no?: string;
  pancard_no?: string;
  din_no?: string;
  website?: string;
  hughes_no?: string[];
  mobile_number: string;
  amd?: boolean;
  email: string;
  address: string;
  user_id: number;
  logo?: File | null;
  resi?: string;
  city?: string;
  bank?: string;
  branch?: string;
  account_number?: string;
}

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  fetchCompanies: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchCompanyById: (id: number) => Promise<void>;
  createCompany: (data: CompanyFormData) => Promise<boolean>;
  updateCompany: (id: number, data: Partial<CompanyFormData>) => Promise<boolean>;
  deleteCompany: (id: number) => Promise<boolean>;
  setSelectedCompany: (company: Company | null) => void;
  clearError: () => void;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  selectedCompany: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  isLoading: false,
  error: null,

  fetchCompanies: async (page = 1, limit = 10, search = '') => {
    console.log('[CompanyStore] Fetching companies, page:', page, 'limit:', limit, 'search:', search);
    set({ isLoading: true, error: null });
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      const response = await api.get('/company', { params });
      const data = response.data;
      console.log('[CompanyStore] Raw response:', data);

      // Handle different response formats
      let companies: Company[] = [];
      let total = 0;

      if (Array.isArray(data)) {
        companies = data;
        total = data.length;
        console.log('[CompanyStore] Response is array, count:', total);
      } else if (data.data && Array.isArray(data.data)) {
        companies = data.data;
        total = data.total || data.data.length;
        console.log('[CompanyStore] Response has data property, count:', total);
      } else {
        console.warn('[CompanyStore] Unexpected response format:', typeof data);
      }

      set({
        companies,
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalItems: total,
        isLoading: false,
      });
      console.log('[CompanyStore] Companies loaded:', companies.length);
    } catch (error) {
      console.error('[CompanyStore] fetchCompanies error:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch companies';
      set({
        error: message,
        isLoading: false,
        companies: []
      });
    }
  },

  fetchCompanyById: async (id: number) => {
    console.log('[CompanyStore] Fetching company by ID:', id);
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/company/${id}`);
      console.log('[CompanyStore] Company fetched:', response.data);
      set({ selectedCompany: response.data, isLoading: false });
    } catch (error) {
      console.error('[CompanyStore] fetchCompanyById error:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch company';
      set({ error: message, isLoading: false });
    }
  },

  createCompany: async (data: CompanyFormData) => {
    console.log('[CompanyStore] Creating company:', data);
    set({ isLoading: true, error: null });
    try {
      // Get user_id from localStorage if not provided
      if (!data.user_id) {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
          data.user_id = parseInt(storedUserId, 10);
          console.log('[CompanyStore] Using user_id from localStorage:', data.user_id);
        }
      }

      // Use FormData if logo is provided
      if (data.logo instanceof File) {
        console.log('[CompanyStore] Using FormData for logo upload');
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'hughes_no' && Array.isArray(value)) {
            value.forEach((h) => {
              if (h) formData.append('hughes_no', h);
            });
          } else if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        });

        const response = await api.post('/company', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('[CompanyStore] Company created (FormData):', response.data);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { logo, ...jsonData } = data;
        console.log('[CompanyStore] Sending create request (JSON):', jsonData);
        const response = await api.post('/company', jsonData);
        console.log('[CompanyStore] Company created (JSON):', response.data);
      }

      set({ isLoading: false });
      get().fetchCompanies();
      return true;
    } catch (error) {
      console.error('[CompanyStore] createCompany error:', error);
      const message = error instanceof Error ? error.message : 'Failed to create company';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updateCompany: async (id: number, data: Partial<CompanyFormData>) => {
    console.log('[CompanyStore] Updating company:', id, data);
    set({ isLoading: true, error: null });
    try {
      if (data.logo instanceof File) {
        console.log('[CompanyStore] Using FormData for logo update');
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'hughes_no' && Array.isArray(value)) {
            value.forEach((h, i) => {
              if (h) formData.append(`hughes_no[${i}]`, h);
            });
          } else if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        });

        const response = await api.patch(`/company/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('[CompanyStore] Company updated (FormData):', response.data);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { logo, ...jsonData } = data;
        const response = await api.patch(`/company/${id}`, jsonData);
        console.log('[CompanyStore] Company updated (JSON):', response.data);
      }
      set({ isLoading: false });
      get().fetchCompanies();
      return true;
    } catch (error) {
      console.error('[CompanyStore] updateCompany error:', error);
      const message = error instanceof Error ? error.message : 'Failed to update company';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  deleteCompany: async (id: number) => {
    console.log('[CompanyStore] Deleting company:', id);
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/company/${id}`);
      console.log('[CompanyStore] Company deleted');
      set({ isLoading: false });
      get().fetchCompanies();
      return true;
    } catch (error) {
      console.error('[CompanyStore] deleteCompany error:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete company';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  setSelectedCompany: (company: Company | null) => {
    set({ selectedCompany: company });
  },

  clearError: () => {
    set({ error: null });
  },
}));
