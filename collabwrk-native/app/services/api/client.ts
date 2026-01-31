import axios from 'axios';
import { Platform } from 'react-native';

// Default to localhost for dev, but handle Android emulator specially if needed
const DEV_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api/v1' : 'http://localhost:8000/api/v1';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEV_API_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        // We will need a way to get the token. 
        // Since we can't import hooks here easily (rules of hooks), we might assign the token getter function later
        // or rely on a global store / storage.
        // For now, let's assume we can get it from a storage helper we'll create or just skip if not set.
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper to set auth token (called from AuthProvider)
let getTokenFn: (() => Promise<string | null>) | null = null;

export const setTokenProvider = (fn: () => Promise<string | null>) => {
    getTokenFn = fn;
};

apiClient.interceptors.request.use(async (config) => {
    if (getTokenFn) {
        const token = await getTokenFn();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default apiClient;
