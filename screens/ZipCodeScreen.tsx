import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../models';
import { Button } from '../components/Button';
import { Image } from 'expo-image';

export type ZipCodeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ZipCode'>;
  route: RouteProp<RootStackParamList, 'ZipCode'>;
};

export const ZipCodeScreen: React.FC<ZipCodeScreenProps> = ({ navigation, route }) => {
  const [zipCode, setZipCode] = useState(route.params?.currentZipCode || '');
  const [error, setError] = useState('');
  const [noServices, setNoServices] = useState(false);

  const validateAndSaveZipCode = async () => {
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    if (zipCode === '00000') {
      setNoServices(true);
      return;
    }

    // Save ZIP code to AsyncStorage
    await AsyncStorage.setItem('zipCode', zipCode);

    // Save ZIP code and go back to Home screen
    navigation.navigate('Home', { zipCode });
  };

  if (noServices) {
    return (
      <View style={[styles.zipCodeScreen, styles.noServicesContainer]}>
        <Image 
          style={[styles.heroImage, styles.dimmed]} 
          source={require('../assets/hero.svg')} 
        />
        <Text style={styles.noServicesText}>
          Sorry, there are no available services in your area yet.
        </Text>
        <Text style={styles.noServicesSubtext}>
          We're constantly expanding our coverage. Please try a different ZIP code.
        </Text>
        <Button 
          variant="primary" 
          onPress={() => {
            setNoServices(false);
            setZipCode('');
          }}
        >
          Try different ZIP code
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.zipCodeScreen}
    >
      <View style={styles.zipCodeContent}>
        <Image style={styles.heroImage} source={require('../assets/hero.svg')} />
        <Text style={styles.zipCodeTitle}>Enter Your ZIP Code</Text>
        <Text style={styles.zipCodeSubtitle}>To see services available in your area</Text>

        <TextInput
          style={[styles.zipCodeInput, error.trim() ? styles.zipCodeInputError : null]}
          placeholder="Enter ZIP code"
          value={zipCode}
          onChangeText={(text) => {
            setZipCode(text.replace(/[^0-9]/g, '').slice(0, 5));
            setError(' ');
          }}
          keyboardType="numeric"
          maxLength={5}
          returnKeyType="go"
          onSubmitEditing={validateAndSaveZipCode}
        />

        <Text style={[styles.errorText, { opacity: error.trim() ? 1 : 0 }]}>{error}</Text>
        <Button variant="primary" onPress={validateAndSaveZipCode}>
          Find available services
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  zipCodeContent: {
    paddingHorizontal: 20,
    alignItems: 'center'
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
  zipCodeScreen: {
    backgroundColor: '#fff',
  },
  heroImage: {
    height: 250,
    width: 120,
    marginBottom: 20,
    marginTop: 40
  },
  noServicesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noServicesText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dimmed: {
    opacity: 0.5,
  },
  noServicesSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
});
