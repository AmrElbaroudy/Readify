import { View, Text,KeyboardAvoidingView,ScrollView, Platform  } from 'react-native'
import React, { Children } from 'react'
import { } from 'react-native-web'

const ios =Platform.OS=='ios';
export default function CustomKeyBoardView({children}) {
  return (
    <KeyboardAvoidingView behavior={ios? 'padding': 'height'} style={{flex:1}}>
        <ScrollView style={{flex:1}} bounces={false} showsVerticalScrollIndicator={false}>
            {
                children
            }
        </ScrollView>
    </KeyboardAvoidingView>
)
}