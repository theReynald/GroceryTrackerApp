import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    FlatList,
    Alert,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

type GroceryItem = {
    id: string;
    name: string;
    isEditing: boolean;
};

export default function GroceryList() {
    const [items, setItems] = useState<GroceryItem[]>([]);
    const [inputText, setInputText] = useState('');
    const [editText, setEditText] = useState('');

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    const addItem = () => {
        if (inputText.trim() === '') return;

        const newItem = {
            id: Date.now().toString(),
            name: inputText.trim(),
            isEditing: false
        };

        setItems([...items, newItem]);
        setInputText('');
        
        // Return focus to input field after a short delay
        setTimeout(() => {
            if (inputRef) {
                inputRef.focus();
            }
        }, 50);
    };

    const deleteItem = (id: string) => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setItems(items.filter(item => item.id !== id));
                    }
                }
            ]
        );
    };

    const startEditing = (id: string) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                setEditText(item.name);
                return { ...item, isEditing: true };
            }
            return { ...item, isEditing: false };
        });
        setItems(updatedItems);
    };

    const saveEdit = (id: string) => {
        if (editText.trim() === '') return;

        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, name: editText.trim(), isEditing: false };
            }
            return item;
        });

        setItems(updatedItems);
        setEditText('');
        Keyboard.dismiss();
    };

    const renderItem = ({ item }: { item: GroceryItem }) => (
        <ThemedView style={styles.itemContainer}>
            {item.isEditing ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={[styles.editInput, { color: textColor }]}
                        value={editText}
                        onChangeText={setEditText}
                        autoFocus
                        blurOnSubmit={false}
                        onSubmitEditing={() => saveEdit(item.id)}
                        returnKeyType="done"
                    />
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: tintColor }]}
                        onPress={() => saveEdit(item.id)}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ThemedText style={styles.itemText}>{item.name}</ThemedText>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: tintColor }]}
                            onPress={() => startEditing(item.id)}
                        >
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={() => deleteItem(item.id)}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </ThemedView>
    );

    // Focus the input field when component mounts
    const [inputRef, setInputRef] = useState<TextInput | null>(null);
    
    useEffect(() => {
        // Small delay to ensure the component is fully rendered
        const timer = setTimeout(() => {
            if (inputRef) {
                inputRef.focus();
            }
        }, 100);
        
        return () => clearTimeout(timer);
    }, [inputRef]);

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Grocery List</ThemedText>

            <View style={styles.inputContainer}>
                <TextInput
                    ref={(ref) => setInputRef(ref)}
                    style={[styles.input, { color: textColor }]}
                    placeholder="Add an item..."
                    placeholderTextColor="#888"
                    value={inputText}
                    onChangeText={setInputText}
                    autoFocus={true}
                    blurOnSubmit={false}
                    onSubmitEditing={addItem}
                    returnKeyType="done"
                    enablesReturnKeyAutomatically={true}
                />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: tintColor }]}
                    onPress={addItem}
                >
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>

            {/* List area can be tapped to dismiss keyboard */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.listContainer}>
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={styles.list}
                        ListEmptyComponent={
                            <ThemedText style={styles.emptyListText}>
                                Your grocery list is empty. Add some items!
                            </ThemedText>
                        }
                    />
                </View>
            </TouchableWithoutFeedback>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    addButton: {
        width: 80,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 8,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    editContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    editInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        marginRight: 8,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#888',
    },
});
