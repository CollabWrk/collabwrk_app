import { StyleSheet, View, Text, FlatList, TextInput, Pressable, SafeAreaView, Platform, ScrollView } from 'react-native';
import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Manual } from '@/lib/mockData';
import { FileText, Plus, Search, Clock } from 'lucide-react-native';
import { ImportModal } from '@/components/ImportModal';
import { useRouter } from 'expo-router';

export default function LibraryScreen() {
  const { manuals, importManual, setActiveManual, colorScheme } = useApp();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [mockSelectedFile, setMockSelectedFile] = useState<string>("");
  const isDark = colorScheme === 'dark';

  const categories = useMemo(() => {
    const cats = new Set(manuals.map(m => m.category || 'Uncategorized'));
    return ['All', ...Array.from(cats)];
  }, [manuals]);

  const filteredManuals = useMemo(() => {
    return manuals.filter(manual => {
      const matchesCategory = selectedCategory === 'All' || (manual.category || 'Uncategorized') === selectedCategory;
      const matchesSearch = manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manual.model.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [manuals, selectedCategory, searchQuery]);

  // Mock File Picker
  const handlePickFile = () => {
    setMockSelectedFile(`file-${Date.now()}.pdf`);
    setIsImportModalOpen(true);
  };

  const handleImportConfirm = (metadata: { title: string; category: string; fileName: string }) => {
    importManual(metadata);
  };

  const handleManualPress = (manual: Manual) => {
    setActiveManual(manual);
    // Navigate to detail page
    // @ts-ignore - Expo router dynamic routes
    router.push(`/manual/${manual.id}`);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={handleImportConfirm}
        fileName={mockSelectedFile}
      />

      <View className={`px-6 pt-4 pb-4 z-10 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>My Manuals</Text>
          <Pressable
            onPress={handlePickFile}
            style={{
              height: 40,
              width: 40,
              backgroundColor: '#f97316',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={24} color="white" />
          </Pressable>
        </View>

        <View className="relative mb-4">
          <View className="absolute left-3 top-3 z-10">
            <Search size={18} color={isDark ? '#94a3b8' : '#64748b'} />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search model, fault code..."
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            className={`w-full h-10 pl-10 pr-4 rounded-lg border-none text-base ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-200/50 text-slate-900'}`}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 -mx-6 px-6">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;

            return (
              <View key={cat} style={{ marginRight: 8 }}>
                <Pressable
                  onPress={() => setSelectedCategory(cat)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 9999,
                    backgroundColor: isSelected
                      ? (isDark ? '#f97316' : '#0f172a')
                      : (isDark ? '#1e293b' : '#ffffff'),
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isSelected ? '#ffffff' : (isDark ? '#cbd5e1' : '#0f172a')
                  }}>
                    {cat}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredManuals}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 24, gap: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className={isDark ? 'text-slate-500' : 'text-slate-400'}>No manuals found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ManualCard manual={item} onPress={() => handleManualPress(item)} isDark={isDark} />
        )}
      />
    </SafeAreaView>
  );
}

function ManualCard({ manual, onPress, isDark }: { manual: Manual; onPress: () => void; isDark: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
      }}
    >
      <View className={`w-16 h-20 rounded-lg items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
        <FileText size={32} color={isDark ? '#64748b' : '#94a3b8'} />
      </View>
      <View className="flex-1">
        <Text className={`font-semibold mb-1 leading-5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`} numberOfLines={2}>{manual.title}</Text>
        <Text className="text-sm font-medium text-orange-500 mb-2">{manual.model}</Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <Clock size={12} color={isDark ? '#64748b' : '#94a3b8'} />
            <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{manual.lastOpened}</Text>
          </View>
          <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>•</Text>
          <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{manual.manufacturer}</Text>
        </View>
      </View>
    </Pressable>
  );
}
