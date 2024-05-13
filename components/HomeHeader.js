import { View, Text, Platform } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { blurhash } from '../utilis/common';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useRouter } from 'expo-router';
import{setLoding,fetchBooks}from '../app/(app)/home';
import { useAuth } from '../context/authContex';
import { MenuItem } from './CustomMenuItems';

const ios = Platform.OS == 'ios';

export default function HomeHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { top } = useSafeAreaInsets();

  const handleProfile = () => {
    router.push('profile');
  };

  const handleCart = () => {
    router.push('cart');
  };

  const handleLogOut = async () => {
    await logout();
  };
  const handleRefresh = () => {
    setLoding(true); // Show loading indicator
    fetchBooks(); // Fetch books again
  };
  return (
    <View
      style={{
        paddingTop: ios ? top : top + 30,
        backgroundColor: '#ca6128',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        // borderRadius: 30,
        borderBottomEndRadius:30,
        borderBottomLeftRadius:30,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        
      }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Home</Text>
      <Menu>
        <MenuTrigger>
          <FontAwesome name="list" size={24} color="black" style={{ paddingTop: 10 }} />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              borderRadius: 10,
              marginTop: 40,
              marginLeft: -10,
              backgroundColor: 'white',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 0 },
              width: 190,
            },
          }}>
          <MenuItem
            text="Profile"
            action={handleProfile}
            value={null}
            icon={<FontAwesome5 name="user-circle" size={20} color="#737373" />}
          />
          <Divider />
          
          <MenuItem
            text="Cart"
            action={handleCart}
            value={null}
            icon={<Feather name="shopping-cart" size={20} color="#737373" />}
          />
          <Divider />
          <MenuItem
            text="Sign Out"
            action={handleLogOut}
            value={null}
            icon={<AntDesign name="logout" size={20} color="#737373" />}
          />
        </MenuOptions>
      </Menu>
    </View>
  );
}

const Divider = () => {
  return <View style={{ paddingVertical: 1, width: '100%', backgroundColor: '#E2E2E2' }} />;
};
