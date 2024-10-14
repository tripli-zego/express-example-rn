import React, { useEffect, useRef, useState } from 'react';
import { findNodeHandle, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import ZegoExpressEngine, {ZegoTextureView} from 'zego-express-engine-reactnative';
import MinimizingHelper from './minimizing_helper';
import PipModuleHelper from './PipModuleHelper';
import StreamHelper from './StreamHelper';

const Audience: React.FC = () => {
  const TAG = 'Audience'

  const navigation = useNavigation();

  const { params } = useRoute();
  const { roomID, userID, hostStreamID } = params;
  
  const textureRef = useRef();
  const [isShowTopButton, setIsShowTopButton] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log(`${TAG} is focused`);
      PipModuleHelper.notifyAndroidPagePipEnable(true, TAG)
      PipModuleHelper.registerPipModeChangedListener(TAG, (data) => {
        if (typeof data === 'boolean') {
          setIsShowTopButton(!data)
        }
      })

      return () => {
        console.log(`${TAG} is unfocused`);
        // @ts-ignore
        PipModuleHelper.registerPipModeChangedListener(TAG, null)
      };
    }, [])
  );

  useEffect(() => {
    console.log(TAG, `loginRoom, room:${roomID}, userID:${userID}`);
    ZegoExpressEngine.instance().loginRoom(
      roomID, {"userID": userID, "userName": "Audience"}, undefined
    ).then((loginResult) => {
      if (loginResult.errorCode != 0 && loginResult.errorCode != 1002001) {
        console.error(TAG, `loginRoom, result:${loginResult.errorCode}, message:${loginResult.extendedData}`)
        Toast.show(`Failed to login the room, errorCode: ${loginResult.errorCode}.`, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
        });

        return
      }

      console.log(TAG, 'startPlayingStream')
      StreamHelper.setIosPipStreamID(hostStreamID)
      StreamHelper.startPlayingStream(hostStreamID, findNodeHandle(textureRef.current));    
    });

    return () => {
    }
  }, []);

  const onClickBack = () => {
    StreamHelper.stopPlayingStream(hostStreamID);
    StreamHelper.setIosPipStreamID('')
    ZegoExpressEngine.instance().logoutRoom(roomID);
    console.log(TAG, `logoutRoom, room:${roomID}`);
  
    navigation.goBack()
  };

  const onClickMinimize = () => {
    MinimizingHelper.instance().setStreamActionInMinimized('PlayingStream', roomID, hostStreamID);
    MinimizingHelper.instance().notifyMinimize();
    navigation.goBack();
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ZegoTextureView ref={textureRef} style={styles.fullscreenView} />

      { isShowTopButton ? <View style={[styles.top_btn_container, {top: insets.top}]}>
        <TouchableOpacity style={styles.backBtnPos} onPress={onClickBack}>
          <Image 
            style={styles.backBtnImage} 
            source={require('./resources/icon_nav_back.png')} // 替换为你的图片路径
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.minimizeBtnPos} onPress={onClickMinimize}>
          <Image 
            style={styles.minimizeBtnImage} 
            source={require('./resources/icon_minimize.png')} // 替换为你的图片路径
          />
        </TouchableOpacity>
      </View> : null }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'gray'
  },
  fullscreenView: {
    flex: 1,
  },
  top_btn_container: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    left: 0,
    height: 40,
    zIndex: 1,
  },
  backBtnPos: {
    top: 10,
    left: 15,
    width: 20,
    height: 20,
  },
  backBtnImage: {
  },
  minimizeBtnPos: {
    top: 10,
    marginLeft: 50,
    width: 20,
    height: 20,
  },
  minimizeBtnImage: {
  },
});

export default Audience;