import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Step = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Share Details Of Your Project',
    description: 'Answer a few simple questions about your project.',
    icon: 'create-outline',
  },
  {
    id: 2,
    title: 'Match With An Expert Local Contractor',
    description: "You\'ll be connected with a trusted contractor ready to complete your home improvement project.",
    icon: 'people-outline',
  },
  {
    id: 3,
    title: 'You Get A Free Quote',
    description: 'A contractor will get in touch to set up an estimate and answer your questions.',
    icon: 'calculator-outline',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {STEPS.map((step) => (
          <View key={step.id} style={styles.step}>
            <View style={styles.iconContainer}>
              <Ionicons name={step.icon} size={32} color="#2f54eb" />
              <Text style={styles.stepNumber}>{step.id}</Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  step: {
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#2f54eb',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
}); 