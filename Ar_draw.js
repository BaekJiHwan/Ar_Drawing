import React, { useState, useEffect } from 'react';
import { Text, View, Image, Button, StyleSheet,TouchableOpacity,PanResponder,Animated} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImageManipulator from 'expo-image-manipulator';
import { PanGestureHandler,PinchGestureHandler, State } from 'react-native-gesture-handler';


const Ar_draw = ({route}) => {
  const [selectedImageUri, setSelectedImageUri] = useState(null); //선택한 이미지의 URI를 저장하고 그 값을 변경하는 함수
  const [hasCameraPermission, setHasCameraPermission] = useState(null); // 카메라 권한이 있는지 여부를 저장하는 변수
  const [originalWidth, setOriginalWidth] = useState(0); // 선택한 이미지의 원본 너비를 저장하기 위한 함수
  const [originalHeight, setOriginalHeight] = useState(0); // 선택한 이미지의 원본 높이를 저장하기 위한 함수
  const [imageOpacity, setImageOpacity] = useState(0.5); // 이미지의 투명도 조절을 위해 추가한 함수
  const navigation = useNavigation();
  const cameraRef = useRef(null); // 사진 촬영을 위해 생성
  const pan = useRef(new Animated.ValueXY()).current; // 이미지 위치 저장
  const lastPan = useRef({ x: 0, y: 0 });
  const baseScale = useRef(new Animated.Value(1)).current; // 이전 핀치 제스처들에 의한 총 스케일 값
  const pinchScale = useRef(new Animated.Value(1)).current; // 현재 진행 중인 핀치 제스처에 의한 상대적인 스케일 값 
  const scale = Animated.multiply(baseScale, pinchScale);
  const lastScale = useRef(1);

  const onPanEvent = Animated.event( // 사용자가 드래그 할 때마다 x, y 값을 가져오면서 실시간으로 업데이트함
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: false }
  );

  const onPanStateChange = (event) => { // 사용자가 터치를 마치는 경우
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastPan.current.x += event.nativeEvent.translationX; // 마지막으로 기록된 팬 위치에 현재 팬위치를 더하고 x값을 lastPan.current.x에 저장
      lastPan.current.y += event.nativeEvent.translationY; // 마지막으로 기록된 팬 위치에 현재 팬위치를 더하고 y값을 lastPan.current.y에 저장
      pan.setOffset({ x: lastPan.current.x, y:lastPan.current.y }); //현재 위치의 오프셋 추가
      pan.setValue({ x:0, y:0 }); // 마지막으로 팬 값을 0,0으로 재설정함
    }
  };

  const onPinchEvent = Animated.event( // 핀치 제스처가 일어날 때마다 함수가 호출되어 pinchScale값을 업데이트 
    [{ nativeEvent: { scale: pinchScale } }], // 핀치하는 동안 이미지가 커지는 것을 수정하기 위해 scale:scale에서 변경
    { useNativeDriver: false }
  );

  const onPinchStateChange = (event) => { // 현재의 총 스케일 값을 baseScale에 저장
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      baseScale.setValue(scale.__getValue()); //Hermes 엔진에서는 Animated.Value 객체에 직접 접근해서 'value'를 가져오지 못해서 __getValue()로 변경 
      pinchScale.setValue(1);
    }
  };
  

  
  const handleGoBack = () => { // 이전 화면으로 돌리기 위한 함수
    navigation.goBack();
  };

  const handleTakePicture = async () => { // 카메라로 사진을 촬영 -> 사진을 문서 디렉토리로 복사 -> 갤러리에 저장
    if (cameraRef.current) {
      try { // 촬영 버튼을 눌러도 촬영이 되지 않아서 문제를 찾기 위한 try catch문
        const options = { quality: 0.5, base64: true }; // 촬영 옵션
        const data = await cameraRef.current.takePictureAsync(options); //takePicutuerAsync 메소드를 호출하여 사진 촬영
        
        let fileExtension = data.uri.split('.').pop(); // 원본 파일의 확장자 정보 추출
        
        const newUri = FileSystem.documentDirectory + data.uri.split('/').pop() + '.' + fileExtension; // 디렉토리 경로와 원본 파일의 확장자를 결합해서 새로운 URI 생성
        
        await FileSystem.copyAsync({ //expo-media-library의 createAssetAsync() 대신 FileSystem.copyAsync() 메소드를 사용하여 이미지를 앱의 문서 디렉토리로 복사한 후 해당 경로를 사용하여 자산을 생성하기 위해 기존 코드에서 추가
          from: data.uri,
          to: newUri,
        });
        
        const asset = await MediaLibrary.createAssetAsync(newUri); //createAssetAsync 메소드를 사용해서 asset으로 생성할 수 있도록 URI(이미지 파일)
        await MediaLibrary.saveToLibraryAsync(asset.uri); // saveToLibraryAsync 메소드를 사용해서 갤러리에 저장
        
        alert("사진이 갤러리에 저장되었습니다.");
      } catch (error) {
        // Gpt에게 질문을 아무리 해도 경고가 나오는 것이 해결이 되지 않아서 error 부분을 비움
      }
    } else {
      alert("카메라를 찾을 수 없습니다.");
    }
    
  };
  useEffect(() => { 
    pan.setValue({ x: 0, y: 0 }); // pan 값을 (0,0)으로 초기화
    pan.setOffset({ x: 0, y: 0 }); // offset을 (0,0)으로 설정
    baseScale.setValue(1); // 이미지 크기 초기화
    pinchScale.setValue(1); // 핀치 스케일 값 초기화
    lastPan.current = { x: 0, y: 0 }; // 마지막 팬 이벤트 결과 리셋
    lastScale.current = scale.__getValue(); // 마지막 핀치 이벤트 결과 리셋  
  }, [selectedImageUri]);

  useEffect(() => { 
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // requestPermissionAsync() 메소드가 폐기 되어서 requestCamerPermissionsAsync() 메소드로 변경
      setHasCameraPermission(status === 'granted'); // 카메라 권한 상태가 'granted'인지 확인

      if (Platform.OS !== "web") {
        const {
          status: imagePickerStatus,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (imagePickerStatus !== "granted") {
          alert("Sorry! We need your permission to access the gallery.");
        }
      }
    })();

    if (route.params?.uri) { // example.js에서 이미지를 불러오는 것을 계속 실패(react-native-fast-image사용) -> Expo Image manipulator라는 api를 알려줘서 해결완료
      setSelectedImageUri(route.params.uri);

      ImageManipulator.manipulateAsync(
        route.params.uri,
        [],
        { base64: true }
      ).then((result) => {
          setOriginalWidth(result.width);
          setOriginalHeight(result.height);
      }).catch((error) => console.error(error));
    }
  }, [route.params?.uri]);

  async function handlePickFromGallery() { // 갤러리에서 이미지를 선택 -> 이미지의 URI와 원본 너비/높이 정보 저장 
    try { // try catch 문으로 감싸기 전에는 오류가 났었음
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      }); // 메소드를 사용하여 갤러리에서 이미지를 선택 -> 미디어 타입, 편집 가능 여부, 가르세로 비율, 품질 설정 

      if (!result.canceled && result.assets) { // cancelled가 sdk48에서 폐기 될 예정이여서 canceled로 변경
        const { uri } = result.assets[0]; //'width', 'height'가 sdk48에서 폐기 될 예정이여서 assets 배열로 변경 (이미지의 asset 배열의 0번 인덱스 URI 값 추출)

        setSelectedImageUri(uri); // 추출한 URI 값을 변수에 저장

        if (result.assets[0].width && result.assets[0].height) {
          setOriginalWidth(result.assets[0].width);
          setOriginalHeight(result.assets[0].height);
        } // 이미지의 assets 배열의 0번과 너비, 높이 정보가 있으면 아래 코드 실행
      }
    } catch (error) {
      console.error(error);
    }
  }

   return ( // ref={cameraRef} = 카메라를 찾을 수 없다는 오류 때문에 추가
     <View style={{ flex:1 }}> 
       <Camera style={{ flex:1 }} ref={cameraRef} type={Camera.Constants.Type.back}> 
        {!!selectedImageUri && (
          <PanGestureHandler onGestureEvent={onPanEvent} onHandlerStateChange={onPanStateChange}>
            <Animated.View style={{
                transform:[
                  ...pan.getTranslateTransform(),
                  { scale },
                ]
            }}>
              <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
              <Animated.Image
                source={{ uri:selectedImageUri }}
                style={{
                  width: '100%',
                  height: undefined,
                  aspectRatio:
                    originalWidth && originalHeight 
                      ? originalWidth / originalHeight 
                      : undefined,
                  opacity: imageOpacity,
                  transform: [{ scale }]
                }}
                resizeMode="contain"
              />
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        )}
       </Camera>

       <View style={styles.topContainer}>
        <TouchableOpacity onPress={handleGoBack} >
         <Text style={styles.backText}>뒤로 가기</Text>
        </TouchableOpacity>
        <Text style={styles.mainText}>Ar-Drawing</Text>
      </View>
       {!!selectedImageUri && ( 
         <View style = {styles.sliderContainer}>
          <Text style={styles.sliderLabel}>투명도 조절</Text>
          <Slider // 이미지의 투명도 조절을 위한 슬라이더
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={imageOpacity}
            onValueChange={(value) => setImageOpacity(value)}
          />
         </View>
       )}

      <View style={styles.buttonContainer}>
      
        <TouchableOpacity onPress={handlePickFromGallery}>
          <Icon name="image-outline" size={30} color="#000" />  
        </TouchableOpacity>

        <TouchableOpacity onPress= {handleTakePicture}>
          <Icon name="camera-outline" size={30} color="#000" />
        </TouchableOpacity> 

        <TouchableOpacity onPress={() => navigation.navigate('Example')}>
          <Icon name="documents-outline" size={30} color="#000" />
        </TouchableOpacity> 

      </View>

     </View>
   );
}

const styles = StyleSheet.create({
  slider:{ // 슬라이더 스타일
    width:'80%',
    alignSelf:'center',
    marginTop:'3%',
    backgroundColor:'white',
    marginBottom: '2%',
  },
  sliderContainer:{ // 슬라이더 콘테이너 스타일
    backgroundColor:'white',
    borderRadius: 20,
    width: '95%',
    position:'absolute',
    bottom: 120,
    left: 10,
  },
  buttonContainer: { // 하단 버튼 콘테이너 스타일
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal: '15%',
    width: '95%',
    height: '10%',
    backgroundColor: 'white',
    borderRadius:20,
    position: 'absolute',
    bottom: 20,
    left: 10
  },sliderLabel: { // 슬라이더 텍스트 스타일
    color: '#111',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 18,
    marginLeft: 40
  }, topContainer:{ // 최상단 검은색 컨테이너 스타일
    position:'absolute',
    left:'0%', 
    right:'0%', 
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    top:0,
    height: 90,
  }, backText:{ // 뒤로가기 텍스트 스타일
    color:'#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 60,
    marginLeft: 25,
  }, mainText:{ // 최상단 가운데에 있는 Ar-Drawing 텍스트 스타일
    color:'#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: -22,
  }, example:{ // 예시 콘테이너 스타일
    flex:1 , 
    justifyContent:'center', 
    alignItems:'center'
  }, exscroll: { // 예시 스크롤 스타일 
    alignItems: 'center', 
    marginTop:300 
  }, expimage: { 
    width: 200, 
    height: 200, 
    marginHorizontal:10 
  },
});
   

export default Ar_draw;