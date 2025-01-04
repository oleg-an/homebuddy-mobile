import { StyleSheet, Text, Pressable } from 'react-native';
import React, { ReactNode } from 'react';

interface ButtonProps {
  onPress?: () => void;
  variant: 'primary' | 'secondary';
  children: ReactNode | string;
}

export function Button({ onPress, variant, children }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyles[variant],
        pressed && buttonStyles[`${variant}Pressed`],
      ]}
      onPress={onPress}
    >
      <Text style={[textStyles[variant]]}>{children}</Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: '#2f54eb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  primaryPressed: {
    backgroundColor: '#1939c0', // более темный оттенок primary
  },
  secondary: {
    backgroundColor: '#ff4d4f',
  },
  secondaryPressed: {
    backgroundColor: '#d93133', // более темный оттенок secondary
  },
});

const textStyles = StyleSheet.create({
  primary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
