/**
 * User Store using Zustand
 * Integrated with production API
 */
import { create } from 'zustand';
import api from '../utils/auth';

export interface User {
    id: number;
    fullname?: string;
    email?: string;
    mobile_number: string;
    pancard_number?: string;
    profile_image?: string;
    role?: string;
    member_directory_access?: boolean;
    created_at?: string;
    updated_at?: string;
    companies?: any[];
}

interface UserState {
    users: User[];
    selectedUser: User | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    isLoading: boolean;
    error: string | null;

    fetchUsers: (page?: number, limit?: number, sort?: string, search?: string) => Promise<void>;
    fetchUserById: (id: number) => Promise<void>;
    deleteUser: (id: number) => Promise<boolean>;
    toggleMemberAccess: (userId: number, value: boolean) => Promise<boolean>;
    setSelectedUser: (user: User | null) => void;
    clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    selectedUser: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    isLoading: false,
    error: null,

    fetchUsers: async (page = 1, limit = 10, sort = 'recent', search = '') => {
        console.log('[UserStore] Fetching users, page:', page, 'limit:', limit, 'sort:', sort, 'search:', search);
        set({ isLoading: true, error: null });
        try {
            const params: any = { page, limit };
            if (search) {
                params.search = search;
            }
            if (sort === 'time') {
                params.sort = 'created_at';
                params.order = 'ASC';
            } else if (sort === 'recent') {
                params.sort = 'created_at';
                params.order = 'DESC';
            }

            const response = await api.get('/users', { params });
            const data = response.data;
            console.log('[UserStore] Raw response:', data);

            let users: User[] = [];
            let total = 0;

            if (Array.isArray(data)) {
                users = data;
                total = data.length;
            } else if (data.data && Array.isArray(data.data)) {
                users = data.data;
                total = data.total || data.data.length;
            }

            set({
                users,
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                totalItems: total,
                isLoading: false,
            });
            console.log('[UserStore] Users loaded:', users.length);
        } catch (error) {
            console.error('[UserStore] fetchUsers error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch users';
            set({ error: message, isLoading: false, users: [] });
        }
    },

    fetchUserById: async (id: number) => {
        console.log('[UserStore] Fetching user by ID:', id);
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/users/${id}`);
            set({ selectedUser: response.data, isLoading: false });
        } catch (error) {
            console.error('[UserStore] fetchUserById error:', error);
            const message = error instanceof Error ? error.message : 'Failed to fetch user';
            set({ error: message, isLoading: false });
        }
    },

    deleteUser: async (id: number) => {
        console.log('[UserStore] Deleting user:', id);
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/users/${id}`);
            set({ isLoading: false });
            get().fetchUsers();
            return true;
        } catch (error) {
            console.error('[UserStore] deleteUser error:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete user';
            set({ error: message, isLoading: false });
            return false;
        }
    },

    toggleMemberAccess: async (userId: number, value: boolean) => {
        try {
            await api.patch(`/users/${userId}`, { member_directory_access: value });
            // Update user in local state
            const users = get().users.map(u =>
                u.id === userId ? { ...u, member_directory_access: value } : u
            );
            set({ users });
            return true;
        } catch (error) {
            console.error('[UserStore] toggleMemberAccess error:', error);
            return false;
        }
    },

    setSelectedUser: (user: User | null) => {
        set({ selectedUser: user });
    },

    clearError: () => {
        set({ error: null });
    },
}));
