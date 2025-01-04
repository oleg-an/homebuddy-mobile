import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {formatPhoneNumber, isValidUSPhoneNumber} from "../utils/phoneUtils";
import {Button} from "../components/Button";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../models";
import {defaultStyles} from "../styles";

type AuthScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Auth'>;
};

export const AuthScreen: React.FC<AuthScreenProps> = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [currentUser, setCurrentUser] = useState<null | { email: string, phone?: string, fullName?: string }>(null);

    // Проверяем текущего пользователя при загрузке экрана
    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }
    };

    const handleAuth = async () => {
        if (!email || !password || (!isLogin && (!phone || !fullName))) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!isLogin && !isValidUSPhoneNumber(phone)) {
            Alert.alert('Error', 'Please enter a valid US phone number');
            return;
        }

        try {
            // Здесь можно добавить реальную логику авторизации с бэкендом

            const userData = {
                email,
                fullName: !isLogin ? fullName : email, // Если логин, используем email как имя
                phone: !isLogin ? phone : undefined,
                lastLoginDate: new Date().toISOString(),
            };

            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setCurrentUser(userData);

            // Показываем успешное сообщение
            Alert.alert(
                'Success',
                isLogin ? 'Successfully logged in!' : 'Account created successfully!',
                [{text: 'OK', onPress: () => navigation.goBack()}]
            );
        } catch (error) {
            Alert.alert('Error', 'Authentication failed. Please try again.');
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        setCurrentUser(null);
        setEmail('');
        setPassword('');
        setPhone('');
    };

    if (currentUser) {
        return (
            <View style={styles.authContainer}>
                <View style={styles.authContent}>
                    <Text style={styles.authTitle}>Profile</Text>
                    {currentUser.fullName && (
                        <Text style={styles.profileText}>Name: {currentUser.fullName}</Text>
                    )}
                    <Text style={styles.profileText}>Email: {currentUser.email}</Text>
                    {currentUser.phone && (
                        <Text style={styles.profileText}>Phone: {currentUser.phone}</Text>
                    )}
                    <Button variant="primary" onPress={handleLogout}>
                        Logout
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.authContainer}
        >
            <View style={styles.authContent}>
                <Text style={styles.authTitle}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </Text>

                {!isLogin && (
                    <View style={defaultStyles.inputContainer}>
                        <Text style={defaultStyles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.authInput}
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                    </View>
                )}

                <View style={defaultStyles.inputContainer}>
                    <Text style={defaultStyles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.authInput}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {!isLogin && (
                    <View style={defaultStyles.inputContainer}>
                        <Text style={defaultStyles.inputLabel}>Phone Number</Text>
                        <TextInput
                            style={styles.authInput}
                            value={phone}
                            onChangeText={(text) => setPhone(formatPhoneNumber(text))}
                            keyboardType="phone-pad"
                            maxLength={12}
                        />
                    </View>
                )}

                <View style={defaultStyles.inputContainer}>
                    <Text style={defaultStyles.inputLabel}>Password</Text>
                    <TextInput
                        style={styles.authInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <Button variant="primary" onPress={handleAuth}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </Button>

                <TouchableOpacity
                    style={styles.switchAuthButton}
                    onPress={() => setIsLogin(!isLogin)}
                >
                    <Text style={styles.switchAuthText}>
                        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    authContent: {
        padding: 20,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    authInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    authContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    switchAuthButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    switchAuthText: {
        color: '#2f54eb',
        fontSize: 16,
    },
    profileText: {
        fontSize: 16,
        marginBottom: 12,
        color: '#333',
    },
});
