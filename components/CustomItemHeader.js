import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ios = Platform.OS == 'ios';

export default function CustomItemHeader({ router,name }) {
    const { top } = useSafeAreaInsets();

    return (
      <Stack.Screen
        options={{
          title: "Item",
          headerShadowVisible: false,
        //   headerTintColor:"black",
          header: () => (
            <View style={{
              paddingTop: ios ? top : top + 10,
              backgroundColor: '#ca6128',
              flexDirection: 'row',
              alignItems: 'center', // Align items vertically
              paddingHorizontal: 20, // Adjust horizontal padding
              paddingBottom: 10,
              borderBottomEndRadius: 10,
              borderBottomLeftRadius: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}>

<TouchableOpacity onPress={()=>router.back()}>
                <FontAwesome name="chevron-left" size={20} color="white" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>
                  {name}
                </Text>
              </View>
            </View>
          ),
        }}
      />
    );
  }
