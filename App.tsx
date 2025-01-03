import React, {useState, useEffect} from 'react';
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

type RootStackParamList = {
    Home: { zipCode?: string } | undefined;
    Details: {
        id: string;
        title: string;
        description: string;
        zipCode: string;
    };
    ZipCode: { currentZipCode?: string } | undefined;
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
                        <Text style={styles.headerTitle}>Zip code:</Text>
                        <Ionicons name="location" size={24} color="#2f54eb"/>
                        <Text style={styles.zipText}>{zipCode}</Text>
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
                <Image style={styles.heroImage} source={require('./assets/hero.svg')}/>
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
        paddingBottom: 15,
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
        marginRight: 10,
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
        fontSize: 16,
        color: '#2f54eb',
        fontWeight: '500',
        marginLeft: 4,
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
});

export default App;
