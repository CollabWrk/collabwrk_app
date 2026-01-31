import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { colorScheme, setColorScheme } = useApp();
    const isDarkMode = colorScheme === 'dark';

    const toggleDarkMode = () => {
        setColorScheme(isDarkMode ? 'light' : 'dark');
    };

    return (
        <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Header */}
            <View className={`flex-row items-center px-4 py-3 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border-b`}>
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color={isDarkMode ? '#f8fafc' : '#0f172a'} />
                </TouchableOpacity>
                <Text className={`flex-1 text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} ml-2`}>Settings</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Appearance Section */}
                <View className="mt-4">
                    <Text className={`px-6 py-2 text-xs font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Appearance</Text>
                    <View className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border-y`}>
                        <View className="flex-row items-center justify-between px-6 py-4">
                            <View className="flex-row items-center gap-3 flex-1">
                                {isDarkMode ? (
                                    <Moon size={20} color="#f59e0b" />
                                ) : (
                                    <Sun size={20} color="#f59e0b" />
                                )}
                                <View className="flex-1">
                                    <Text className={`font-semibold text-base ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Dark Mode</Text>
                                    <Text className={`text-sm mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={isDarkMode}
                                onValueChange={toggleDarkMode}
                                trackColor={{ false: '#e2e8f0', true: '#0f172a' }}
                                thumbColor={isDarkMode ? '#f97316' : '#f8fafc'}
                            />
                        </View>
                    </View>
                </View>

                {/* About Section */}
                <View className="mt-6">
                    <Text className={`px-6 py-2 text-xs font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>About</Text>
                    <View className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border-y`}>
                        <View className="px-6 py-4">
                            <Text className={`font-semibold text-base mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>CollabWrk Manuals</Text>
                            <Text className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Version 1.0.0</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
