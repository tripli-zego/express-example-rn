import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, findNodeHandle, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import ZegoExpressEngine, {ZegoPublishChannel, ZegoTextureView} from 'zego-express-engine-reactnative';

const Preview: React.FC = () => {
  const navigation = useNavigation();

  const { params } = useRoute();
  const { userID } = params;
  
  const previewRef = useRef();
  
  const roomID = '9999'

  useEffect(() => {
    console.log(`loginRoom, room:${roomID}, userID:${userID}`);
    ZegoExpressEngine.instance().loginRoom(roomID, {"userID": userID, "userName": "zego"}, undefined);
    ZegoExpressEngine.instance().startPreview({"reactTag": findNodeHandle(previewRef.current), "viewMode": 0, "backgroundColor": 0}, ZegoPublishChannel.Main);
    ZegoExpressEngine.instance().startPublishingStream(userID, ZegoPublishChannel.Main, undefined);

    return () => {
      ZegoExpressEngine.instance().stopPublishingStream(ZegoPublishChannel.Main);
      ZegoExpressEngine.instance().stopPreview(ZegoPublishChannel.Main);
      ZegoExpressEngine.instance().logoutRoom(roomID);
      console.log(`logoutRoom, room:${roomID}`);
    }
  }, []);

  const goBack = () => {
    navigation.goBack()
  };

  return (
    <View style={styles.container}>
      <ZegoTextureView ref={previewRef} style={styles.fullscreenView} />

      <TouchableOpacity style={styles.backBtnPos} onPress={goBack}>
        <Image 
          style={styles.backBtnImage} 
          source={require('./resources/icon_nav_back.png')} // 替换为你的图片路径
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullscreenView: {
    flex: 1,
  },
  backBtnPos: {
    position: 'absolute',
    left: 10,
    top: 10,
    padding: 10,
  },
  backBtnImage: {
    width: 20,
    height: 20,
  },
});

export default Preview;