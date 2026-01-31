import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useApp } from '@/context/AppContext';
import { LogOut, Award, Settings, User as UserIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, logout, colorScheme } = useApp();
    const router = useRouter();
    const isDark = colorScheme === 'dark';

    if (!user) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center px-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <UserIcon size={64} color={isDark ? '#64748b' : '#94a3b8'} />
                <Text className={`text-xl font-bold mt-4 mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Not Logged In</Text>
                <Text className={`text-center mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Please log in to view your profile</Text>
                <TouchableOpacity
                    onPress={() => router.push('/login')}
                    className="bg-blue-900 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Go to Login</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <View className={`px-6 pt-8 pb-8 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <View className="flex-row items-center gap-4 mb-6">
                    <View className={`w-16 h-16 rounded-full items-center justify-center border-2 ${isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                        <UserIcon size={32} color={isDark ? '#93c5fd' : '#0f172a'} />
                    </View>
                    <View>
                        <Text className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{user.name}</Text>
                        <Text className={isDark ? 'text-slate-400' : 'text-slate-500'}>{user.role} at {user.company}</Text>
                    </View>
                </View>

                <View className="flex-row gap-4">
                    <View className={`flex-1 rounded-xl p-3 border ${isDark ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-100'}`}>
                        <View className="flex-row items-center gap-2 mb-1">
                            <Award size={18} color="#f97316" />
                            <Text className="font-bold text-orange-600 text-lg">{user.points}</Text>
                        </View>
                        <Text className={`text-xs font-medium ${isDark ? 'text-orange-400' : 'text-orange-600/80'}`}>Community Points</Text>
                    </View>
                    <View className={`flex-1 rounded-xl p-3 border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>
                        <Text className={`font-bold text-lg mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Top 5%</Text>
                        <Text className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Global Rank</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="p-4 space-y-4">
                <View className={`rounded-xl overflow-hidden border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <TouchableOpacity
                        onPress={() => router.push('/settings')}
                        className={isDark ? 'flex-row items-center gap-3 p-4 active:bg-slate-700' : 'flex-row items-center gap-3 p-4 active:bg-slate-50'}
                    >
                        <Settings size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                        <Text className={`font-medium text-base ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Settings</Text>
                    </TouchableOpacity>
                    <View className={`h-px mx-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} />
                    <TouchableOpacity
                        onPress={logout}
                        className={isDark ? 'flex-row items-center gap-3 p-4 active:bg-slate-700' : 'flex-row items-center gap-3 p-4 active:bg-red-50'}
                    >
                        <LogOut size={20} color="#dc2626" />
                        <Text className="font-medium text-red-600 text-base">Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
