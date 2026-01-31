import apiClient from './client';

export interface ManualChunk {
    chunk_id: string;
    text: string;
    page_start: number;
    page_end: number;
}

export interface AIQuery {
    question: string;
    manual_fingerprint: string;
    chunks: ManualChunk[];
    model_numbers?: string[];
}

export interface Citation {
    chunk_id: string;
    page_start: number;
    page_end: number;
    relevance_score?: number;
}

export interface SuggestedFault {
    type: string;
    id: string;
    title: string;
}

export interface AIAnswer {
    answer: string;
    citations: Citation[];
    suggested_faults: SuggestedFault[];
    confidence: 'high' | 'medium' | 'low';
}

export const aiApi = {
    askManual: async (query: AIQuery): Promise<AIAnswer> => {
        const response = await apiClient.post<AIAnswer>('/ai/answer', query);
        return response.data;
    },
};
