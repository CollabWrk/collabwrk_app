import { createContext, useContext, useState, type ReactNode } from 'react';
import { Manual, MOCK_MANUALS, MOCK_USER, User, MOCK_THREADS, Thread } from '../lib/mockData';

type AppContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => void;
    logout: () => void;
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
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [manuals, setManuals] = useState<Manual[]>(MOCK_MANUALS);
    const [activeManual, setActiveManual] = useState<Manual | null>(null);
    const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

    const login = (email: string) => {
        setUser(MOCK_USER);
    };

    const logout = () => {
        setUser(null);
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
            isLoading,
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
