/**
 * Member Store using Zustand
 * Integrated with production API
 */
import { create } from 'zustand';
import api from '../utils/auth';

// Types
export interface Member {
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
  ifsc_code?: string;
  profile_picture?: string;
  account_type?: string;
  upi_id?: string;
  account_holder_name?: string;
  contact_no?: string;
  contact_person_name?: string;
  logo?: string;
  user_id: number;
  user?: {
    fullname?: string;
    email?: string;
    mobile_number: string;
    profile_image?: string;
    member_directory_access?: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface MemberFormData {
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
  ifsc_code?: string;
  account_type?: string;
  upi_id?: string;
  account_holder_name?: string;
  contact_no?: string;
  contact_person_name?: string;
}

interface MemberState {
  members: Member[];
  selectedMember: Member | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  fetchMembers: (page?: number, limit?: number, search?: string, sort?: string) => Promise<void>;
  fetchMemberById: (id: number) => Promise<void>;
  createMember: (data: MemberFormData) => Promise<boolean>;
  updateMember: (id: number, data: Partial<MemberFormData>) => Promise<boolean>;
  deleteMember: (id: number) => Promise<boolean>;
  deleteAllMembers: () => Promise<boolean>;
  toggleMemberAccess: (memberId: number, userId: number, value: boolean) => Promise<boolean>;
  setSelectedMember: (member: Member | null) => void;
  clearError: () => void;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],
  selectedMember: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  isLoading: false,
  error: null,

  fetchMembers: async (page = 1, limit = 10, search = '', sort = 'recent') => {
    console.log('[MemberStore] Fetching members, page:', page, 'limit:', limit, 'search:', search, 'sort:', sort);
    set({ isLoading: true, error: null });
    try {
      const params: any = { page, limit };
      if (search) params.search = search;

      if (sort === 'alpha') {
        params.sort = 'name';
        params.order = 'ASC';
      } else if (sort === 'recent') {
        params.sort = 'created_at';
        params.order = 'DESC';
      }

      const response = await api.get('/company', { params });
      const data = response.data;
      console.log('[MemberStore] Raw response:', data);

      // Handle different response formats
      let members: Member[] = [];
      let total = 0;

      if (Array.isArray(data)) {
        members = data;
        total = data.length;
        console.log('[MemberStore] Response is array, count:', total);
      } else if (data.data && Array.isArray(data.data)) {
        members = data.data;
        total = data.total || data.data.length;
        console.log('[MemberStore] Response has data property, count:', total);
      } else {
        console.warn('[MemberStore] Unexpected response format:', typeof data);
      }

      set({
        members,
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalItems: total,
        isLoading: false,
      });
      console.log('[MemberStore] Members loaded:', members.length);
    } catch (error) {
      console.error('[MemberStore] fetchMembers error:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch members';
      set({
        error: message,
        isLoading: false,
        members: []
      });
    }
  },

  fetchMemberById: async (id: number) => {
    console.log('[MemberStore] Fetching member by ID:', id);
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/company/${id}`);
      console.log('[MemberStore] Member fetched:', response.data);
      set({ selectedMember: response.data, isLoading: false });
    } catch (error) {
      console.error('[MemberStore] fetchMemberById error:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch member';
      set({ error: message, isLoading: false });
    }
  },

  createMember: async (data: MemberFormData) => {
    console.log('[MemberStore] Creating member:', data);
    set({ isLoading: true, error: null });
    try {
      // Get user_id from localStorage if not provided
      if (!data.user_id) {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
          data.user_id = parseInt(storedUserId, 10);
          console.log('[MemberStore] Using user_id from localStorage:', data.user_id);
        }
      }

      // Use FormData if logo is provided
      if (data.logo instanceof File) {
        console.log('[MemberStore] Using FormData for logo upload');
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
        console.log('[MemberStore] Member created (FormData):', response.data);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { logo, ...jsonData } = data;
        console.log('[MemberStore] Sending create request (JSON):', jsonData);
        const response = await api.post('/company', jsonData);
        console.log('[MemberStore] Member created (JSON):', response.data);
      }

      set({ isLoading: false });
      get().fetchMembers();
      return true;
    } catch (error) {
      console.error('[MemberStore] createMember error:', error);
      const message = error instanceof Error ? error.message : 'Failed to create member';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updateMember: async (id: number, data: Partial<MemberFormData>) => {
    console.log('[MemberStore] Updating member:', id, data);

    const isAmdToggle = Object.keys(data).length === 1 && 'amd' in data;

    // Optimistic update for AMD toggle — instant checkbox response, no spinner
    if (isAmdToggle) {
      set((state) => ({
        members: state.members.map(m => m.id === id ? { ...m, amd: data.amd } : m)
      }));
    } else {
      set({ isLoading: true, error: null });
    }

    try {
      // Always use FormData for updates to ensure consistency with backend
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'logo') {
          if (value instanceof File) {
            formData.append('logo', value);
          }
        } else if (key === 'hughes_no' && Array.isArray(value)) {
          value.forEach((h) => {
            if (h) formData.append('hughes_no', h);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      console.log('[MemberStore] Sending update request (FormData)');
      const response = await api.patch(`/company/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('[MemberStore] Member updated:', response.data);

      if (!isAmdToggle) {
        // Only refresh the full list for non-toggle updates
        set({ isLoading: false });
        get().fetchMembers(get().currentPage);
      }
      // For AMD toggle: optimistic update is already applied, no need to refetch
      return true;
    } catch (error) {
      console.error('[MemberStore] updateMember error:', error);
      if (isAmdToggle) {
        // Revert optimistic update on failure
        set((state) => ({
          members: state.members.map(m => m.id === id ? { ...m, amd: !data.amd } : m)
        }));
        alert('Failed to update AMD status');
      }
      const message = error instanceof Error ? error.message : 'Failed to update member';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  deleteMember: async (id: number) => {
    console.log('[MemberStore] Deleting member:', id);
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/company/${id}`);
      console.log('[MemberStore] Member deleted');
      set({ isLoading: false });
      get().fetchMembers();
      return true;
    } catch (error) {
      console.error('[MemberStore] deleteMember error:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete member';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  deleteAllMembers: async () => {
    console.log('[MemberStore] Deleting all members');
    set({ isLoading: true, error: null });
    try {
      await api.delete('/company/wipe-all');
      console.log('[MemberStore] All members deleted');
      set({ isLoading: false, members: [], totalItems: 0, totalPages: 1 });
      get().fetchMembers();
      return true;
    } catch (error) {
      console.error('[MemberStore] deleteAllMembers error:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete all members';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  toggleMemberAccess: async (memberId: number, userId: number, value: boolean) => {
    // Optimistic update
    set((state) => ({
      members: state.members.map(m =>
        m.id === memberId
          ? { ...m, user: { ...m.user!, member_directory_access: value } }
          : m
      ),
    }));
    try {
      await api.patch(`/users/${userId}`, { member_directory_access: value });
      return true;
    } catch (error) {
      console.error('[MemberStore] toggleMemberAccess error:', error);
      // Revert optimistic update
      set((state) => ({
        members: state.members.map(m =>
          m.id === memberId
            ? { ...m, user: { ...m.user!, member_directory_access: !value } }
            : m
        ),
      }));
      return false;
    }
  },

  setSelectedMember: (member: Member | null) => {
    set({ selectedMember: member });
  },

  clearError: () => {
    set({ error: null });
  },
}));
