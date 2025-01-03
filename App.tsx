import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
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
import { StatusBar } from 'expo-status-bar';


type RootStackParamList = {
    Home: undefined;
    Details: {
        id: string;
        title: string;
        description: string;
        price: string;
        zipCode: string;
    };
    ZipCode: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type HomeScreenProps = {
    navigation: HomeScreenNavigationProp;
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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [zipCode, setZipCode] = useState('');
    const [zipError, setZipError] = useState('');

    const validateZipCode = (zip: string) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zip);
    };

    const handleCardPress = (service: typeof REPAIR_OFFERS[0]) => {
        navigation.navigate('Details', {
            ...service,
            price: 'from $500',
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
            <StatusBar style="auto" />
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Home Repair Services</Text>
                    <TouchableOpacity
                        style={styles.zipButton}
                        onPress={() => navigation.navigate('ZipCode')}
                    >
                        <Text style={styles.locationIcon}>📍</Text>
                        {zipCode ? (
                            <Text style={styles.zipText}>{zipCode}</Text>
                        ) : null}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.scrollContent}>
                    {REPAIR_OFFERS.map(renderOfferCard)}
                </View>
            </ScrollView>
        </View>
    );
};

type ZipCodeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ZipCode'>;
};

const ZipCodeScreen: React.FC<ZipCodeScreenProps> = ({ navigation }) => {
    const [zipCode, setZipCode] = useState('');
    const [error, setError] = useState('');

    const validateAndSaveZipCode = () => {
        const zipRegex = /^\d{5}$/;
        if (!zipCode) {
            setError('ZIP code is required');
            return;
        }

        if (!zipRegex.test(zipCode)) {
            setError('Please enter a valid 5-digit ZIP code');
            return;
        }

        // Here you would typically save the ZIP code to your app's state management
        setError('');
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.zipCodeScreen}
        >
            <View style={styles.zipCodeContent}>
                <Text style={styles.zipCodeTitle}>Enter Your ZIP Code</Text>
                <Text style={styles.zipCodeSubtitle}>
                    To see services available in your area
                </Text>

                <TextInput
                    style={[
                        styles.zipCodeInput,
                        error ? styles.zipCodeInputError : null
                    ]}
                    placeholder="Enter ZIP code"
                    value={zipCode}
                    onChangeText={(text) => {
                        setZipCode(text.replace(/[^0-9]/g, '').slice(0, 5));
                        setError('');
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                />

                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        !zipCode && styles.submitButtonDisabled
                    ]}
                    onPress={validateAndSaveZipCode}
                    disabled={!zipCode}
                >
                    <Text style={styles.submitButtonText}>Save ZIP Code</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

type DetailsScreenProps = {
    route: RouteProp<RootStackParamList, 'Details'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'Details'>;
};

const DetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
    const { title, description, price, zipCode } = route.params;

    const handleEstimate = () => {
        Alert.alert(
            'Success',
            `We'll prepare an estimate for ${title} in ZIP code ${zipCode}`,
            [{ text: 'OK' }]
        );
    };

    return (
        <View style={styles.detailsContainer}>
            <View style={styles.detailsContent}>
                <Text style={styles.detailsTitle}>{title}</Text>
                <Text style={styles.detailsDescription}>{description}</Text>
                <Text style={styles.detailsPrice}>{price}</Text>
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
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={({ route }) => ({ title: route.params.title })}
                />
                <Stack.Screen
                    name="ZipCode"
                    component={ZipCodeScreen}
                    options={{
                        title: 'Enter ZIP Code',
                        presentation: 'modal'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
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
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '500',
        color: '#2f54eb',
    },
    zipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    locationIcon: {
        fontSize: 20,
        marginRight: 4,
    },
    zipText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#2f54eb',
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
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
    },
    zipCodeContent: {
        padding: 20,
        alignItems: 'center',
    },
    zipCodeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    zipCodeSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    zipCodeInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        width: '100%',
        marginBottom: 10,
    },
    zipCodeInputError: {
        borderColor: '#ff4d4f',
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 14,
        marginTop: 4,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#2f54eb',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default App;
