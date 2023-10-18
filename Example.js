import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Example = () => {
  const navigation = useNavigation();
  
  const imageUris = [ //예시 이미지들의 주소
    'https://mblogthumb-phinf.pstatic.net/MjAyMTAxMTFfMjU5/MDAxNjEwMzY4NDgxMzU0.GsNbXIOhjwPrLhiotLS-41NamydpVoBr6DHfXhAeVxkg.WemmnyEBLWGedvYxr1IHs-CahSpZlHpuoXhArVBvH2Yg.JPEG.o8o8o8486/Baby_Shark_Coloring_Pages_05.jpg?type=w800',
    'https://mblogthumb-phinf.pstatic.net/MjAyMTAxMTFfMTEg/MDAxNjEwMzY4MzM1NTUz.ykrV9fVhl3yv0H_wVG56cCzrr7nbEHco3unJtczUYFAg.OxnXGYKD9dVrRacik2rklAnHvvNjrvoeUZjFMyUDzlUg.JPEG.o8o8o8486/Baby_Shark_Coloring_Pages_03.jpg?type=w800',
    'https://blog.kakaocdn.net/dn/J1Lhw/btqDk53SoAq/iBkP5kIcTuLtYABKsiJuf0/img.jpg',
    'https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F9e%2F4e%2F4d%2F9e4e4d7d87aa5731264adaca766e002f.png&type=sc960_832',
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20120119_30%2Fgw7783_1326948043399JTzXG_JPEG%2F4.jpg&type=sc960_832',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeNyQPDh8KJl4_z2o-GgSQrsvMLmbYdpSMAg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfGWdGH7SVjqtbG_OH5vNoXzs3LlzH_jT-NQ&usqp=CAU',
    'https://ipainting.co.kr/wp-content/uploads/2019/02/동물도안_34.jpg',
    'https://dino-typing.com/data/file/dino_color/2038718610_IfTXhGvO_20f04c8989c435c3a4912831703adb190be75c97.png',
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20140111_113%2Fpztclagk1_13893869054783spMJ_JPEG%2Ff24d23d0_1.jpg&type=a340',
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA1MTJfMjI2%2FMDAxNjIwNzcyMDg3NjM3.Hp1DKgnufAm7cQUoz0qeCVTwiGAHbOWHDghE2SJ0jesg.zyuP78U90v7LO_5t5fU7Ye02rkVweksDOIF2SUo5JBog.JPEG.loveplus100%2F01.jpg&type=a340',
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA4MjVfNjIg%2FMDAxNjkyOTY1ODI0Njcx.XYqo4lpDMD4daiiwaTrb8i632RQn99ORb4tFuutyB9gg.Z2Nu2iOrKwJaC6s2cFUnr4xkRtVUGuU3GmQWOzMMqlog.JPEG.hiderist%2F%25C1%25A6%25B8%25F1_%25BE%25F8%25B4%25C2_%25BE%25C6%25C6%25AE%25BF%25F6%25C5%25A9.jpg&type=a340',
  ];

  const handleImagePress = (uri) => {
    navigation.navigate('Ar_draw', { uri });
  }; // 이미지를 선택하면 Ar_draw로 이동하고 uri를 전달함
  
  return (
    <View style={{ flex: 1 , backgroundColor:'#111'}}>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}> 
          <Text style={styles.backText}>뒤로 가기</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>예시</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 30 }}>
        {imageUris.map((uri, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleImagePress(uri)}
            style={{ width: '50%', height: 200 }}
          >
            <Image 
              source={{ uri }} 
              style={{ width: '100%', height: '100%' }} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
        </View>
      </ScrollView>   
      

    </View>
  );
};

export default Example;

const styles = StyleSheet.create({
  backText:{ // 뒤로가기 텍스트 스타일
    color:'#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 50,
    marginLeft: 25,
  },
  titleText:{ // 예시 텍스트 스타일
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize :20,
    flex :1,
    marginTop: 45,
    marginRight: 80,
    fontWeight: 'bold',
  },scrollview: {
    flexGrow: 1,
    justifyContent:'flex-start',
  },
})