import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

export default function Loading({size}) {
  return (
    <View style={{height:size ,aspectRatio:1}}>
      {/* <Text>Loading</Text>00 */}
      <LottieView style={{flex:1}} source={require('../assets/images/Animation - 1714141390960.json')} autoPlay loop />
    </View>
  )
}