import React from 'react';
import { MenuOption } from 'react-native-popup-menu';
import { View, Text } from 'react-native';

// Define your own width and height percentages
const screenWidthPercentage = percent => `${percent}%`;
const screenHeightPercentage = percent => `${percent}%`;

export const MenuItem = ({ text, action, value, icon }) => {
    return (
        <MenuOption onSelect={() => action(value)}>
            <View style={{
                paddingHorizontal: screenWidthPercentage(4),
                paddingVertical: screenHeightPercentage(1),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%', // Using flex to occupy available space
            }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                    {text}
                </Text>
                {icon}
            </View>
        </MenuOption>
    );
};
