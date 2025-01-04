import {StyleSheet, Text, TouchableOpacity} from "react-native";
import React, {ReactNode} from "react";

interface ButtonProps {
    onPress?: () => void;
    variant: "primary" | "secondary";
    children: ReactNode | string;
}

export function Button({onPress, variant, children}: ButtonProps) {
    return (
        <TouchableOpacity
            style={[buttonStyles[variant]]}
            onPress={onPress}
        >
            <Text>{children}</Text>
        </TouchableOpacity>);
}

const buttonStyles = StyleSheet.create({
    primary: {
        backgroundColor: '#2f54eb',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondary: {
        backgroundColor: '#ff4d4f',
    }
});
