import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MapPin, Phone } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

export default function SuppliersScreen() {
    const { colorScheme } = useApp();
    const isDark = colorScheme === 'dark';

    const suppliers = [
        { id: '1', name: "Industrial Supply Co.", distance: "1.2 mi", address: "442 Main St" },
        { id: '2', name: "Grainger Industrial", distance: "3.5 mi", address: "880 Tech Park Blvd" },
        { id: '3', name: "Volt Electric Parts", distance: "5.0 mi", address: "12 Power Rd" },
    ];

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <View className={`px-6 pt-4 pb-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <Text className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Suppliers</Text>
                <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nearby parts & service</Text>
            </View>

            <FlatList
                data={suppliers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity className={`p-6 border-b ${isDark ? 'bg-slate-800 border-slate-700 active:bg-slate-700' : 'bg-white border-slate-200 active:bg-slate-50'}`}>
                        <View className="flex-row justify-between items-start mb-1">
                            <Text className={`font-semibold text-base ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.name}</Text>
                            <View className={isDark ? 'bg-orange-900/30 px-2 py-0.5 rounded-full' : 'bg-orange-50 px-2 py-0.5 rounded-full'}>
                                <Text className="text-xs font-medium text-orange-600">{item.distance}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-2 mb-3">
                            <MapPin size={14} color={isDark ? '#94a3b8' : '#64748b'} />
                            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.address}</Text>
                        </View>
                        <View className="flex-row gap-2">
                            <TouchableOpacity className={`flex-1 h-9 rounded-lg border items-center justify-center flex-row gap-2 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                                <MapPin size={14} color={isDark ? '#f8fafc' : '#0f172a'} />
                                <Text className={`text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Map</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 h-9 rounded-lg bg-slate-900 items-center justify-center flex-row gap-2 shadow-sm">
                                <Phone size={14} color="white" />
                                <Text className="text-sm font-medium text-white">Call</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}
