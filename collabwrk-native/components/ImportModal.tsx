import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { X, FileText, Check, ChevronDown } from "lucide-react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

type ImportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (metadata: { title: string; category: string; fileName: string }) => void;
    fileName: string;
};

const CATEGORY_OPTIONS = ["Drives", "PLC", "Mechanical", "Electrical", "Safety", "Other"];

export function ImportModal({ isOpen, onClose, onConfirm, fileName }: ImportModalProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Drives");
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState("");

    useEffect(() => {
        if (isOpen) {
            setTitle(fileName.replace('.pdf', ''));
            setCategory("Drives");
            setIsCustomCategory(false);
            setCustomCategory("");
        }
    }, [isOpen, fileName]);

    const handleSubmit = () => {
        const finalCategory = isCustomCategory ? customCategory : category;
        if (!title.trim() || !finalCategory.trim()) return;

        onConfirm({ title, category: finalCategory, fileName });
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.centeredView}
            >
                <View style={styles.modalView}>
                    <View className="flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900">Import Manual</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100 mb-6">
                        <View className="w-10 h-10 rounded-lg bg-blue-100 items-center justify-center">
                            <FileText size={20} color="#0f172a" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs font-semibold text-blue-900 uppercase">Selected File</Text>
                            <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>{fileName}</Text>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">Manual Title</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-base"
                            placeholder="e.g. VFD User Manual"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">Category</Text>
                        <View className="flex-row flex-wrap gap-2 mb-3">
                            {CATEGORY_OPTIONS.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => {
                                        setCategory(cat);
                                        setIsCustomCategory(false);
                                    }}
                                    className={`px-3 py-2 rounded-full border ${category === cat && !isCustomCategory ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                                >
                                    <Text className={`text-xs font-medium ${category === cat && !isCustomCategory ? 'text-white' : 'text-gray-700'}`}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                onPress={() => setIsCustomCategory(true)}
                                className={`px-3 py-2 rounded-full border ${isCustomCategory ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`text-xs font-medium ${isCustomCategory ? 'text-white' : 'text-gray-700'}`}>+ Custom</Text>
                            </TouchableOpacity>
                        </View>

                        {isCustomCategory && (
                            <TextInput
                                autoFocus
                                value={customCategory}
                                onChangeText={setCustomCategory}
                                placeholder="Enter category name..."
                                placeholderTextColor="#94a3b8"
                                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-base"
                            />
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="w-full h-12 bg-blue-900 rounded-xl flex-row items-center justify-center gap-2"
                    >
                        <Check size={18} color="white" />
                        <Text className="text-white font-bold text-base">Confirm Import</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalView: {
        width: '100%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
});
