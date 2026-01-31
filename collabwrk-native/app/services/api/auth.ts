import apiClient from './client';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company_id?: string;
    seat_id?: string;
    role: string;
    points: number;
    rank: string;
}

export interface RegisterData {
    auth0_id: string;
    email: string;
    first_name: string;
    last_name: string;
}

export const authApi = {
    register: async (data: RegisterData): Promise<User> => {
        const response = await apiClient.post<User>('/auth/register', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },
};
