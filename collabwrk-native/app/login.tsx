import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { Building2, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
    const { login, user, isLoading, colorScheme } = useApp();
    const router = useRouter();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        if (user) {
            router.replace('/(tabs)');
        }
    }, [user]);

    const handleLogin = () => {
        login();
    };

    return (
        <SafeAreaView className={`flex-1 justify-center px-8 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <View className="items-center mb-12">
                <View className="h-20 w-20 bg-blue-900 rounded-2xl items-center justify-center shadow-lg shadow-blue-900/20 mb-6">
                    <Building2 size={40} color="white" />
                </View>
                <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>CollabWrk</Text>
                <Text className={isDark ? 'text-slate-400' : 'text-slate-500'}>Industrial knowledge, simplified.</Text>
            </View>

            <View className="space-y-6 w-full">
                <View className="items-center mb-8">
                    <Text className={`text-center mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Sign in to access manuals, community knowledge, and AI assistance.
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isLoading}
                    className="w-full h-14 bg-blue-900 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg">Sign In / Register</Text>
                            <ArrowRight size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
