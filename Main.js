import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

const Main = (props) => {
  const navigation = useNavigation();

  return ( // 로고 이미지 = ai 로고 제작 사이트인 Hatchful에서 제작
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('./assets/logo.png')} style={{width: '100%', height: '100%'}}/>
      </View>
      <TouchableOpacity onPress={() => {
        navigation.navigate('Ar_draw');
      }} style={styles.button}>
        <Text style={styles.buttonText}>사용하러가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  imageContainer: {
    width: '80%',
    height: '50%',
    backgroundColor: '#f6f6f6',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#45555b',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 30,
  },
  buttonText:{
      fontSize:16,
      fontWeight:'bold',
      color:'#f6f6f6'
   }
});

export default Main;
