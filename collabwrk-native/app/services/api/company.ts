import apiClient from './client';

export interface Company {
    id: string;
    name: string;
    invite_code: string;
    max_seats: number;
}

export interface Seat {
    id: string;
    company_id: string;
    user_id?: string;
    status: string;
    assigned_at?: string;
    user?: {
        first_name: string;
        last_name: string;
        email: string;
    }
}

export interface CompanySeatsResponse {
    seats: Seat[];
    available_count: number;
    total_count: number;
}

export const companyApi = {
    create: async (name: string, maxSeats: number = 10): Promise<Company> => {
        const response = await apiClient.post<Company>('/company/create', { name, max_seats: maxSeats });
        return response.data;
    },

    join: async (inviteCode: string): Promise<Company> => {
        const response = await apiClient.post<Company>('/company/join', { invite_code: inviteCode });
        return response.data;
    },

    getSeats: async (): Promise<CompanySeatsResponse> => {
        const response = await apiClient.get<CompanySeatsResponse>('/company/seats');
        return response.data;
    }
};
