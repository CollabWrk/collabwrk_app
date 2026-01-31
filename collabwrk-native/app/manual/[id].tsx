import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, Search, Bookmark, MoreHorizontal, ChevronRight, Sparkles, X, FileText, ArrowUp } from 'lucide-react-native';
import { MOCK_AI_RESPONSES } from '@/lib/mockData';

export default function ManualDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { manuals } = useApp();
    const manual = manuals.find(m => m.id === id);
    const [isAIOpen, setIsAIOpen] = useState(false);

    if (!manual) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Manual not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-blue-600">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#0f172a" />
                </TouchableOpacity>
                <View className="flex-1 mx-2">
                    <Text className="font-bold text-slate-900" numberOfLines={1}>{manual.title}</Text>
                    <Text className="text-xs text-slate-500">{manual.model}</Text>
                </View>
                <View className="flex-row gap-1">
                    <TouchableOpacity className="p-2"><Bookmark size={20} color="#0f172a" /></TouchableOpacity>
                    <TouchableOpacity className="p-2"><MoreHorizontal size={20} color="#0f172a" /></TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 bg-slate-50">
                <View className="p-4 bg-white border-b border-slate-100 mb-4">
                    <View className="relative mb-4">
                        <View className="absolute left-3 top-3 z-10"><Search size={18} color="#94a3b8" /></View>
                        <TextInput
                            placeholder="Search in this manual..."
                            placeholderTextColor="#94a3b8"
                            className="w-full h-10 pl-10 bg-slate-100 rounded-lg text-base"
                        />
                    </View>
                    <View className="flex-row gap-2 flex-wrap">
                        {['Fault Codes', 'Wiring', 'Specifications'].map(tag => (
                            <TouchableOpacity key={tag} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white">
                                <Text className="text-xs font-medium text-slate-600">{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="p-4 space-y-2">
                    <Text className="text-xs font-bold text-slate-400 uppercase mb-2">Table of Contents</Text>
                    {[1, 2, 3, 4, 5].map(i => (
                        <TouchableOpacity key={i} className="flex-row items-center gap-4 p-3 bg-white rounded-xl border border-slate-100 mb-2">
                            <View className="w-10 h-14 bg-slate-50 border border-slate-100 items-center justify-center rounded">
                                <Text className="text-xs font-bold text-slate-400">{i}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="font-semibold text-slate-900">Section {i}: Installation</Text>
                                <Text className="text-xs text-slate-500" numberOfLines={1}>Safety precautions and wiring setup...</Text>
                            </View>
                            <ChevronRight size={16} color="#cbd5e1" />
                        </TouchableOpacity>
                    ))}
                    <Text className="text-center text-slate-400 py-8">End of Preview</Text>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                onPress={() => setIsAIOpen(true)}
                className="absolute bottom-8 right-6 w-14 h-14 bg-blue-900 rounded-2xl items-center justify-center shadow-lg shadow-blue-900/30"
            >
                <Sparkles size={24} color="white" />
            </TouchableOpacity>

            <AIBottomSheet isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} model={manual.model} />
        </SafeAreaView>
    );
}

function AIBottomSheet({ isOpen, onClose, model }: { isOpen: boolean, onClose: () => void, model: string }) {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<{ type: 'user' | 'ai', content: string, citations?: string[] }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!query.trim()) return;
        const userMsg = query;
        setMessages(prev => [...prev, { type: 'user', content: userMsg }]);
        setQuery("");
        setLoading(true);

        setTimeout(() => {
            const key = userMsg.toLowerCase().includes('wiring') ? 'wiring' : 'default';
            const response = MOCK_AI_RESPONSES[key];
            setMessages(prev => [...prev, { type: 'ai', content: response.answer, citations: response.citations }]);
            setLoading(false);
        }, 1500);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end bg-black/50">
                <TouchableOpacity className="flex-1" onPress={onClose} />
                <View className="bg-white h-[85%] rounded-t-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-4 border-b border-slate-100">
                        <View className="flex-row items-center gap-2">
                            <Sparkles size={18} color="#0f172a" />
                            <Text className="font-bold text-slate-900">AI Assistant</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-slate-100 rounded-full">
                            <X size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    {/* Chat Area */}
                    <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16, paddingBottom: 20 }}>
                        {messages.length === 0 && (
                            <View className="items-center justify-center mt-20 opacity-60">
                                <Sparkles size={48} color="#0f172a" />
                                <Text className="text-center mt-4 font-medium text-slate-900">Ask about {model}</Text>
                                <View className="flex-row flex-wrap justify-center gap-2 mt-6">
                                    {["Fault E14?", "Wiring Diagram"].map(q => (
                                        <TouchableOpacity key={q} onPress={() => setQuery(q)} className="bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg">
                                            <Text className="text-xs text-slate-700">{q}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {messages.map((msg, i) => (
                            <View key={i} className={`max-w-[85%] ${msg.type === 'user' ? 'self-end' : 'self-start'}`}>
                                <View className={`px-4 py-3 rounded-2xl ${msg.type === 'user' ? 'bg-blue-900 rounded-tr-sm' : 'bg-slate-100 rounded-tl-sm border border-slate-200'}`}>
                                    <Text className={msg.type === 'user' ? 'text-white' : 'text-slate-900'}>{msg.content}</Text>
                                </View>
                                {msg.citations && (
                                    <View className="flex-row flex-wrap gap-2 mt-2">
                                        {msg.citations.map((cit, idx) => (
                                            <TouchableOpacity key={idx} className="flex-row items-center gap-1 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                                                <FileText size={10} color="#ea580c" />
                                                <Text className="text-[10px] font-bold text-orange-600 uppercase">{cit}</Text>
                                                <ChevronRight size={10} color="#ea580c" />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                        {loading && (
                            <View className="self-start bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                                <Text className="text-slate-400">Thinking...</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input */}
                    <View className="p-4 border-t border-slate-100 pb-8 bg-white">
                        <View className="bg-slate-100 rounded-full h-12 flex-row items-center px-4 border border-slate-200">
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                placeholder="Ask a question..."
                                placeholderTextColor="#94a3b8"
                                className="flex-1 text-base text-slate-900 h-12"
                            />
                            <TouchableOpacity onPress={handleSubmit} disabled={!query.trim()} className={`w-8 h-8 rounded-full items-center justify-center ${query.trim() ? 'bg-blue-900' : 'bg-slate-300'}`}>
                                <ArrowUp size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
