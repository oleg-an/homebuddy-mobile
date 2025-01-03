import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type RootStackParamList = {
    Home: undefined;
    Details: {
        id: string;
        title: string;
        description: string;
        price: string;
    };
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
    const renderOfferCard = ({ id, title, description }: typeof REPAIR_OFFERS[0]) => (
        <View key={id} style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
                <TouchableOpacity
                    style={styles.cardButton}
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate('Details', { id, title, description, price: 'from $500' });
                    }}
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
                <Text style={styles.headerTitle}>Home Repair Services</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.scrollContent}>
                    {REPAIR_OFFERS.map(renderOfferCard)}
                </View>
            </ScrollView>
        </View>
    );
};

type DetailsScreenProps = {
    route: RouteProp<RootStackParamList, 'Details'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'Details'>;
};

const DetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
    const { title, description, price } = route.params;

    return (
        <View style={styles.detailsContainer}>
            <View style={styles.detailsContent}>
                <Text style={styles.detailsTitle}>{title}</Text>
                <Text style={styles.detailsDescription}>{description}</Text>
                <Text style={styles.detailsPrice}>{price}</Text>
                <TouchableOpacity
                    style={styles.orderButton}
                    activeOpacity={0.6}
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
        paddingLeft: 20,
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
    howItWorksCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#2f54eb',
    },
    howItWorksTitle: {
        fontSize: 22,
        fontWeight: '500',
        color: '#2f54eb',
        marginBottom: 5,
    },
    howItWorksDescription: {
        fontSize: 16,
        color: '#666',
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 20,
    },
    sectionText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        lineHeight: 24,
    },
});

export default App;
