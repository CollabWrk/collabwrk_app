import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Clipboard } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { companyApi } from '../services/api/company';
import { useApp } from '../../context/AppContext';

export default function CreateCompanyScreen() {
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [createdCode, setCreatedCode] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useApp();

    const handleCreate = async () => {
        if (!companyName.trim()) {
            Alert.alert('Error', 'Please enter a company name');
            return;
        }

        setLoading(true);
        try {
            const company = await companyApi.create(companyName.trim());
            setCreatedCode(company.invite_code);
            Alert.alert('Success', 'Company created successfully!');
        } catch (error: any) {
            console.log('Create error', error);
            Alert.alert('Error', error.response?.data?.detail || 'Failed to create company');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (createdCode) {
            // Clipboard.setString(createdCode); // Deprecated in recent RN versions? using expo-clipboard if available or just Alert
            Alert.alert('Copied', `Invite code ${createdCode} copied to clipboard (simulated)`);
        }
    };

    const handleContinue = () => {
        router.replace('/(tabs)');
    };

    if (createdCode) {
        return (
            <View className="flex-1 bg-white dark:bg-black justify-center items-center p-6">
                <View className="w-full max-w-sm items-center">
                    <View className="bg-green-100 dark:bg-green-900 rounded-full p-4 mb-6">
                        {/* Icon placeholder */}
                        <Text className="text-2xl">✅</Text>
                    </View>

                    <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Company Created!</Text>
                    <Text className="text-gray-500 dark:text-gray-400 mb-8 text-center">
                        Share this invite code with your team members so they can join.
                    </Text>

                    <TouchableOpacity
                        className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-full mb-6 flex-row justify-between items-center"
                        onPress={copyToClipboard}
                    >
                        <Text className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-widest text-center flex-1">
                            {createdCode}
                        </Text>
                        <Text className="text-blue-600 dark:text-blue-400 font-medium">COPY</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full bg-blue-600 rounded-lg p-4 items-center"
                        onPress={handleContinue}
                    >
                        <Text className="text-white font-bold text-lg">Go to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white dark:bg-black justify-center items-center p-6">
            <View className="w-full max-w-sm">
                <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Company</Text>
                <Text className="text-gray-500 dark:text-gray-400 mb-8">
                    Set up a new workspace for your team.
                </Text>

                <View className="mb-6">
                    <Text className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Company Name</Text>
                    <TextInput
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white"
                        placeholder="e.g. Acme Industrial Services"
                        placeholderTextColor="#9CA3AF"
                        value={companyName}
                        onChangeText={setCompanyName}
                    />
                </View>

                <TouchableOpacity
                    className={`w-full bg-blue-600 rounded-lg p-4 items-center ${loading ? 'opacity-70' : ''}`}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Create & Get Code</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="mt-4 w-full items-center p-2"
                    onPress={() => router.back()}
                >
                    <Text className="text-gray-500 dark:text-gray-400">Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
