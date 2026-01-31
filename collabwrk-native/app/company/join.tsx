import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { companyApi } from '../../services/api/company';
import { useApp } from '../../context/AppContext';

export default function JoinCompanyScreen() {
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useApp(); // Used to refresh user state if needed

    const handleJoin = async () => {
        if (!inviteCode.trim()) {
            Alert.alert('Error', 'Please enter an invite code');
            return;
        }

        setLoading(true);
        try {
            await companyApi.join(inviteCode.trim());
            Alert.alert('Success', 'You have joined the company!');
            // Refresh user state/profile logic might be needed here to update context
            // For now, assume context refreshes or navigation to tabs works
            router.replace('/(tabs)');
        } catch (error: any) {
            console.log('Join error', error);
            Alert.alert('Error', error.response?.data?.detail || 'Failed to join company');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-black justify-center items-center p-6">
            <View className="w-full max-w-sm">
                <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join Your Team</Text>
                <Text className="text-gray-500 dark:text-gray-400 mb-8">
                    Enter the invite code shared by your company admin.
                </Text>

                <View className="mb-4">
                    <Text className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Invite Code</Text>
                    <TextInput
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white"
                        placeholder="e.g. AB12CD34"
                        placeholderTextColor="#9CA3AF"
                        value={inviteCode}
                        onChangeText={setInviteCode}
                        autoCapitalize="characters"
                    />
                </View>

                <TouchableOpacity
                    className={`w-full bg-blue-600 rounded-lg p-4 items-center ${loading ? 'opacity-70' : ''}`}
                    onPress={handleJoin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Join Company</Text>
                    )}
                </TouchableOpacity>

                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-500 dark:text-gray-400 mr-1">First one here?</Text>
                    <Link href="/company/create" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 dark:text-blue-400 font-medium">Create a company</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
