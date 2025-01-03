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
        description: 'Современные душевые кабины с удобным входом',
        price: 'от 50,000 ₽',
    },
    {
        id: '2',
        title: 'Walk-in Tubs',
        description: 'Ванны с дверцей для удобного доступа',
        price: 'от 75,000 ₽',
    },
    {
        id: '3',
        title: 'Ремонт Ванной Комнаты',
        description: 'Полный ремонт ванной под ключ',
        price: 'от 100,000 ₽',
    },
    {
        id: '4',
        title: 'Установка Плитки',
        description: 'Профессиональная укладка плитки',
        price: 'от 30,000 ₽',
    },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const renderOfferCard = ({ id, title, description, price }: typeof REPAIR_OFFERS[0]) => (
        <TouchableOpacity
            key={id}
            style={styles.card}
            onPress={() => {
                navigation.navigate('Details', { id, title, description, price });
            }}
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
                <Text style={styles.cardPrice}>{price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Услуги по Ремонту</Text>
                <Text style={styles.headerSubtitle}>Выберите интересующую услугу</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {REPAIR_OFFERS.map(renderOfferCard)}
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
                <TouchableOpacity style={styles.orderButton}>
                    <Text style={styles.orderButtonText}>Заказать</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    scrollView: {
        flex: 1,
        padding: 15,
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
        marginBottom: 10,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2ecc71',
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
        color: '#2ecc71',
        marginBottom: 20,
    },
    orderButton: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default App;
