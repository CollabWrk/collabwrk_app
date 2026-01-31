import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { Building2, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
    const { login, colorScheme } = useApp();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const isDark = colorScheme === 'dark';

    const handleLogin = () => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            login(email);
            setLoading(false);
            router.replace('/(tabs)');
        }, 800);
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
                <View>
                    <Text className={`text-xs font-bold uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Work Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="technician@company.com"
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        className={`w-full h-14 rounded-xl border px-4 text-base shadow-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View className="mb-4">
                    <Text className={`text-xs font-bold uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Password</Text>
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        className={`w-full h-14 rounded-xl border px-4 text-base shadow-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className="w-full h-14 bg-blue-900 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg">Sign In</Text>
                            <ArrowRight size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity className="items-center mt-4">
                    <Text className="text-orange-600 font-semibold">Join with Company Code</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
