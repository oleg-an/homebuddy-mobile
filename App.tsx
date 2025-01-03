import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {StatusBar} from 'expo-status-bar';
import { formatPhoneNumber, isValidUSPhoneNumber } from './utils/phoneUtils';

type RootStackParamList = {
    Home: { zipCode?: string } | undefined;
    Details: {
        id: string;
        title: string;
        description: string;
        zipCode: string;
    };
    ZipCode: { currentZipCode?: string } | undefined;
    Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type HomeScreenProps = {
    navigation: HomeScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Home'>;
};

const REPAIR_OFFERS = [
    {
        id: '1',
        title: 'Walk-in Showers',
        description: 'Modern shower cabins with easy access',
    },
    {
        id: '2',
        title: 'Walk-in Tubs',
        description: 'Bathtubs with door for convenient access',
    },
    {
        id: '3',
        title: 'Stairlifts',
        description: 'Safe and reliable stair lift solutions',
    },
    {
        id: '4',
        title: 'Kitchen Cabinets',
        description: 'Custom kitchen cabinet installation',
    },
    {
        id: '5',
        title: 'Window Replacement',
        description: 'Energy-efficient window solutions',
    },
    {
        id: '6',
        title: 'Gutter Guards',
        description: 'Premium gutter protection systems',
    },
];

const HomeScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {
    const [zipCode, setZipCode] = useState(route.params?.zipCode || '');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<{fullName?: string, email: string, phone?: string} | null>(null);
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkAuth();
        });

        return unsubscribe;
    }, [navigation]);

    const checkAuth = async () => {
        const user = await AsyncStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setIsAuthenticated(true);
            setUserData(parsedUser);
        } else {
            setIsAuthenticated(false);
            setUserData(null);
        }
    };

    useEffect(() => {
        const checkZipCode = async () => {
            if (!zipCode) {
                const storedZipCode = await AsyncStorage.getItem('zipCode');
                if (storedZipCode) {
                    setZipCode(storedZipCode);
                } else {
                    navigation.navigate('ZipCode');
                }
            }
        };
        checkZipCode();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.authButton}
                    onPress={() => navigation.navigate('Auth')}
                >
                    {isAuthenticated && userData ? (
                        <View style={styles.headerUserInfo}>
                            <Text style={styles.headerUserName}>
                                {userData.fullName?.split(' ')[0] || userData.email}
                            </Text>
                            <Ionicons 
                                name="person"
                                size={24} 
                                color="#2f54eb"
                            />
                        </View>
                    ) : (
                        <Ionicons 
                            name="person-outline"
                            size={24} 
                            color="#2f54eb"
                        />
                    )}
                </TouchableOpacity>
            ),
        });
    }, [navigation, isAuthenticated, userData]);

    const handleCardPress = (service: typeof REPAIR_OFFERS[0]) => {
        navigation.navigate('Details', {
            ...service,
            zipCode
        });
    };

    const renderOfferCard = (service: typeof REPAIR_OFFERS[0]) => (
        <View key={service.id} style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardDescription}>{service.description}</Text>
                <TouchableOpacity
                    style={styles.cardButton}
                    activeOpacity={0.8}
                    onPress={() => handleCardPress(service)}
                >
                    <Text style={styles.cardButtonText}>See Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.zipButton}
                        onPress={() => navigation.navigate('ZipCode', zipCode ? {currentZipCode: zipCode} : undefined)}
                    >
                        <Text style={styles.headerTitle}>Zip:</Text>
                        <Ionicons name="location" size={24} />
                        <Text style={styles.zipText}>{zipCode}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.authButton}
                        onPress={() => navigation.navigate('Auth')}
                    >
                        <Ionicons 
                            name={isAuthenticated ? "person" : "person-outline"} 
                            size={24} 
                            color="#2f54eb"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView>
                <View style={styles.scrollContent}>
                    {REPAIR_OFFERS.map(renderOfferCard)}
                </View>
            </ScrollView>
        </View>
    );
};

type ZipCodeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ZipCode'>;
    route: RouteProp<RootStackParamList, 'ZipCode'>;
};
import {Image} from 'expo-image';

const ZipCodeScreen: React.FC<ZipCodeScreenProps> = ({navigation, route}) => {
    const [zipCode, setZipCode] = useState(route.params?.currentZipCode || '');
    const [error, setError] = useState('');

    const validateAndSaveZipCode = async () => {
        const zipRegex = /^\d{5}$/;
        if (!zipRegex.test(zipCode)) {
            setError('Please enter a valid 5-digit ZIP code');
            return;
        }

        // Save ZIP code to AsyncStorage
        await AsyncStorage.setItem('zipCode', zipCode);

        // Save ZIP code and go back to Home screen
        navigation.navigate('Home', {zipCode});
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.zipCodeScreen}
        >

            <View style={styles.zipCodeContent}>
                {/*<Image style={styles.heroImage} source={require('./assets/hero.svg')}/>*/}
                <Text style={styles.zipCodeTitle}>Enter Your ZIP Code</Text>
                <Text style={styles.zipCodeSubtitle}>
                    To see services available in your area
                </Text>

                <TextInput
                    style={[
                        styles.zipCodeInput,
                        error.trim() ? styles.zipCodeInputError : null
                    ]}
                    placeholder="Enter ZIP code"
                    value={zipCode}
                    onChangeText={(text) => {
                        setZipCode(text.replace(/[^0-9]/g, '').slice(0, 5));
                        setError(' ');
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                />

                <Text style={[
                    styles.errorText,
                    {opacity: error.trim() ? 1 : 0}
                ]}>
                    {error}
                </Text>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={validateAndSaveZipCode}
                >
                    <Text style={styles.submitButtonText}>Find available services</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

type DetailsScreenProps = {
    route: RouteProp<RootStackParamList, 'Details'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'Details'>;
};

const DetailsScreen: React.FC<DetailsScreenProps> = ({route}) => {
    const {title, description, zipCode} = route.params;

    const handleEstimate = () => {
        Alert.alert(
            'Success',
            `We'll prepare an estimate for ${title} in ZIP code ${zipCode}`,
            [{text: 'OK'}]
        );
    };

    return (
        <View style={styles.detailsContainer}>
            <View style={styles.detailsContent}>
                <Text style={styles.detailsTitle}>{title}</Text>
                <Text style={styles.detailsDescription}>{description}</Text>
                <TouchableOpacity
                    style={styles.orderButton}
                    activeOpacity={0.6}
                    onPress={handleEstimate}
                >
                    <Text style={styles.orderButtonText}>Get Estimate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

type AuthScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Auth'>;
};

const AuthScreen: React.FC<AuthScreenProps> = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [currentUser, setCurrentUser] = useState<null | {email: string, phone?: string, fullName?: string}>(null);

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
                [{ text: 'OK', onPress: () => navigation.goBack() }]
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
                    <TouchableOpacity
                        style={[styles.submitButton, styles.logoutButton]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.submitButtonText}>Logout</Text>
                    </TouchableOpacity>
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
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.authInput}
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.authInput}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                
                {!isLogin && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <TextInput
                            style={styles.authInput}
                            value={phone}
                            onChangeText={(text) => setPhone(formatPhoneNumber(text))}
                            keyboardType="phone-pad"
                            maxLength={12}
                        />
                    </View>
                )}
                
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                        style={styles.authInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAuth}
                >
                    <Text style={styles.submitButtonText}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

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

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#2f54eb',
                    headerTitleStyle: {
                        fontWeight: '500',
                        color: '#2f54eb',
                    },
                }}
            >
                <Stack.Screen
                    name="ZipCode"
                    component={ZipCodeScreen}
                    options={{
                        title: 'Choose area',
                        gestureEnabled: false, // Disable swipe back on iOS
                    }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                        gestureEnabled: false // Disable swipe back on iOS
                    }}
                />
                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={({route}) => ({title: route.params.title})}
                />
                <Stack.Screen
                    name="Auth"
                    component={AuthScreen}
                    options={{
                        title: 'Account',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    heroImage: {
        height: 250,
        width: 120,
        marginBottom: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 40,
        paddingBottom: 5,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerTitle: {
        marginRight: 4,
        fontSize: 20,
        fontWeight: '500',
        color: '#2f54eb',
    },
    zipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    zipText: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 2,
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        marginBottom: 15,
    },
    cardButton: {
        backgroundColor: '#2f54eb',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cardButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    detailsContent: {
        padding: 20,
    },
    detailsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    detailsDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        lineHeight: 24,
    },
    detailsPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fa8c16',
        marginBottom: 20,
    },
    orderButton: {
        backgroundColor: '#fa8c16',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    zipCodeScreen: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center', // Center content vertically
    },
    zipCodeContent: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    zipCodeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    zipCodeSubtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    zipCodeInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        width: '100%',
        marginBottom: 4,
    },
    zipCodeInputError: {
        borderColor: '#ff4d4f',
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 14,
        height: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#2f54eb',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },

    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    authButton: {
        padding: 8,
    },
    authContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
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
    logoutButton: {
        backgroundColor: '#ff4d4f',
        marginTop: 20,
    },
    inputContainer: {
        marginBottom: 4,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    },
    headerUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerUserName: {
        fontSize: 14,
        color: '#2f54eb',
        fontWeight: '500',
    },
    authButton: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default App;
