import { create } from 'zustand';
import api from '../utils/auth';

export interface CommitteeMember {
    id: number;
    name: string;
    designation: string;
    years: string;
    profile_image?: string;
    social_links?: {
        linkedin?: string;
        instagram?: string;
        facebook?: string;
        youtube?: string;
        twitter?: string;
        phone?: string;
        whatsapp?: string;
    };
    rank: number;
}

export interface CommitteeMemberFormData {
    name: string;
    designation: string;
    years: string;
    profile_image?: File | null;
    social_links?: string; // JSON string for upload
    rank?: number;
}

interface CommitteeMemberState {
    committeeMembers: CommitteeMember[];
    isLoading: boolean;
    error: string | null;

    fetchCommitteeMembers: () => Promise<void>;
    createCommitteeMember: (data: any) => Promise<boolean>;
    updateCommitteeMember: (id: number, data: any) => Promise<boolean>;
    deleteCommitteeMember: (id: number) => Promise<boolean>;
    reorderCommitteeMembers: (ids: number[]) => Promise<boolean>;
}

export const useCommitteeMemberStore = create<CommitteeMemberState>((set, get) => ({
    committeeMembers: [],
    isLoading: false,
    error: null,

    reorderCommitteeMembers: async (ids: number[]) => {
        try {
            await api.patch('/committee-members/reorder', { ids });
            return true;
        } catch (error) {
            console.error('Reorder failed', error);
            return false;
        }
    },

    fetchCommitteeMembers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/committee-members');
            set({ committeeMembers: response.data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    createCommitteeMember: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('designation', data.designation);
            formData.append('years', data.years);
            if (data.rank) formData.append('rank', data.rank.toString());

            if (data.social_links) {
                const socialString = typeof data.social_links === 'string'
                    ? data.social_links
                    : JSON.stringify(data.social_links);
                formData.append('social_links', socialString);
            }

            if (data.profile_image instanceof File) {
                formData.append('file', data.profile_image);
            }

            await api.post('/committee-members', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            get().fetchCommitteeMembers();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    updateCommitteeMember: async (id: number, data: any) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.designation) formData.append('designation', data.designation);
            if (data.years) formData.append('years', data.years);
            if (data.rank !== undefined) formData.append('rank', data.rank.toString());

            if (data.social_links) {
                const socialString = typeof data.social_links === 'string'
                    ? data.social_links
                    : JSON.stringify(data.social_links);
                formData.append('social_links', socialString);
            }

            if (data.profile_image instanceof File) {
                formData.append('file', data.profile_image);
            }

            await api.patch(`/committee-members/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            get().fetchCommitteeMembers();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    deleteCommitteeMember: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/committee-members/${id}`);
            get().fetchCommitteeMembers();
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },
}));
