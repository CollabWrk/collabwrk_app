import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useApp } from '@/context/AppContext';
import { MessageSquare, ThumbsUp, CheckCircle } from 'lucide-react-native';
import { Thread } from '@/lib/mockData';

export default function CommunityScreen() {
    const { threads, colorScheme } = useApp();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <View className={`px-6 pt-4 pb-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <Text className={`text-2xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Community</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 -mx-6 px-6">
                    <Chip active isDark={isDark}>All</Chip>
                    <Chip isDark={isDark}>Solved</Chip>
                    <Chip isDark={isDark}>Your Models</Chip>
                    <Chip isDark={isDark}>My Requests</Chip>
                </ScrollView>
            </View>

            <FlatList
                data={threads}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({ item }) => <ThreadCard thread={item} isDark={isDark} />}
            />
        </SafeAreaView>
    );
}

function Chip({ children, active, isDark }: { children: React.ReactNode, active?: boolean, isDark: boolean }) {
    return (
        <TouchableOpacity
            className={`px-4 py-1.5 rounded-full mr-2 ${active
                ? (isDark ? 'bg-orange-600' : 'bg-slate-900')
                : (isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200')}`}
        >
            <Text className={`text-xs font-semibold ${active ? 'text-white' : (isDark ? 'text-slate-300' : 'text-slate-900')}`}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

function ThreadCard({ thread, isDark }: { thread: Thread, isDark: boolean }) {
    return (
        <TouchableOpacity className={`border rounded-xl p-4 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row flex-wrap gap-2">
                    {thread.tags.map(tag => (
                        <View key={tag} className={isDark ? 'bg-orange-900/30 px-2 py-0.5 rounded-sm' : 'bg-orange-50 px-2 py-0.5 rounded-sm'}>
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                                {tag}
                            </Text>
                        </View>
                    ))}
                </View>
                {thread.solved && (
                    <View className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full border ${isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-100'}`}>
                        <CheckCircle size={10} color="#16a34a" />
                        <Text className="text-[10px] font-bold text-green-600">SOLVED</Text>
                    </View>
                )}
            </View>

            <Text className={`font-semibold mb-1 leading-5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{thread.title}</Text>
            <Text className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>by {thread.author} • {thread.date}</Text>

            <View className={`flex-row items-center gap-4 border-t pt-3 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <View className="flex-row items-center gap-1.5">
                    <MessageSquare size={14} color={isDark ? '#94a3b8' : '#64748b'} />
                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{thread.replies} Replies</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <ThumbsUp size={14} color={isDark ? '#94a3b8' : '#64748b'} />
                    <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Helpful</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
