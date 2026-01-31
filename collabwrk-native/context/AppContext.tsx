import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth0 } from 'react-native-auth0';
import { Manual, MOCK_MANUALS, MOCK_THREADS, Thread } from '../lib/mockData';
import { authApi, User as BackendUser } from '../app/services/api/auth';
import { setTokenProvider } from '../app/services/api/client';

type AppContextType = {
    user: BackendUser | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    manuals: Manual[];
    importManual: (metadata: { title: string; category: string; fileName: string }) => void;
    activeManual: Manual | null;
    setActiveManual: (manual: Manual | null) => void;
    threads: Thread[];
    colorScheme: 'light' | 'dark';
    setColorScheme: (scheme: 'light' | 'dark') => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const { authorize, clearSession, user: auth0User, getCredentials, isLoading: isAuthLoading } = useAuth0();
    const [user, setUser] = useState<BackendUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState(false);
    const [manuals, setManuals] = useState<Manual[]>(MOCK_MANUALS);
    const [activeManual, setActiveManual] = useState<Manual | null>(null);
    const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

    // Configure token provider for API client
    useEffect(() => {
        setTokenProvider(async () => {
            try {
                const credentials = await getCredentials();
                // Debug log to verify token format
                console.log('Auth0 Token:', credentials?.accessToken?.substring(0, 20) + '...');
                return credentials?.accessToken || null;
            } catch (e) {
                console.log('Error getting token', e);
                return null;
            }
        });
    }, [getCredentials]);

    // Sync user with backend
    useEffect(() => {
        const syncUser = async () => {
            if (auth0User) {
                setIsAppLoading(true);
                try {
                    // Check if token works and get user
                    const dbUser = await authApi.getCurrentUser();
                    setUser(dbUser);
                } catch (error) {
                    console.log('Error fetching user, trying register', error);
                    // If 404/error, try to register
                    if (auth0User.sub && auth0User.name && auth0User.email) {
                        try {
                            const newUser = await authApi.register({
                                auth0_id: auth0User.sub,
                                email: auth0User.email,
                                first_name: auth0User.given_name || auth0User.name.split(' ')[0] || 'User',
                                last_name: auth0User.family_name || auth0User.name.split(' ')[1] || '',
                            });
                            setUser(newUser);
                        } catch (regError) {
                            console.error('Registration failed', regError);
                        }
                    }
                } finally {
                    setIsAppLoading(false);
                }
            } else {
                setUser(null);
            }
        };

        if (auth0User) {
            syncUser();
        }
    }, [auth0User]);

    const login = async () => {
        try {
            console.log("Using Audience:", process.env.EXPO_PUBLIC_AUTH0_AUDIENCE);
            await authorize({
                scope: 'openid profile email offline_access',
                redirectUrl: 'com.collabwrk.app://dev-if5glqazobmlcydc.us.auth0.com/ios/com.collabwrk.app/callback',
                audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE
            });
        } catch (e) {
            console.log(e);
        }
    };

    const logout = async () => {
        try {
            await clearSession();
            setUser(null);
        } catch (e) {
            console.log(e);
        }
    };

    const importManual = (metadata: { title: string; category: string; fileName: string }) => {
        // Mock import
        const newManual: Manual = {
            id: `m${Date.now()}`,
            title: metadata.title,
            model: 'Detected Model-X',
            manufacturer: 'Unknown',
            category: metadata.category,
            lastOpened: 'Just now',
            pageCount: 150,
        };
        setManuals(prev => [newManual, ...prev]);
    };

    return (
        <AppContext.Provider value={{
            user,
            isLoading: isAuthLoading || isAppLoading,
            login,
            logout,
            manuals,
            importManual,
            activeManual,
            setActiveManual,
            threads,
            colorScheme,
            setColorScheme
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
