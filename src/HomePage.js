/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  StatusBar,
  PermissionsAndroid,
  Platform,
  Text
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import DeviceInfo from 'react-native-device-info'
import { withNavigation } from '@react-navigation/compat';

import ZegoExpressEngine, {ZegoScenario} from 'zego-express-engine-reactnative';
import KeyCenter from '../KeyCenter';
import MinimizingHelper from './minimizing_helper';
import RoomConstants from './RoomConstants';

const granted = (Platform.OS == 'android' ? PermissionsAndroid.check(
                                              PermissionsAndroid.PERMISSIONS.CAMERA,
                                              PermissionsAndroid.RECORD_AUDIO) : undefined);

const appID = KeyCenter.appID
const appSign = KeyCenter.appSign

class Home extends Component {
  TAG = 'Home'

  constructor(props) {
    super(props)

    this.version = ""
  }

  static navigationOptions = {
    title: 'Home',
  };

  initMinimize() {
    MinimizingHelper.instance().initMinimize();
  }

  onClickPreview() {
    console.log(this.TAG, 'onClickPreview');
    MinimizingHelper.instance().notifyRestore();
    this.navigateToPreview();
  }

  navigateToPreview() {
    MinimizingHelper.instance().registerWillMaximized('Home', () => {
      this.navigateToPreview();
    });
    this.props.navigation.navigate('Preview', {
      roomID: RoomConstants.roomID,
      userID: RoomConstants.hostID,
    });
  }

  onClickAudience() {
    console.log('onClickAudience');
    MinimizingHelper.instance().notifyRestore();
    this.navigateToAudience();
  }

  navigateToAudience() {
    MinimizingHelper.instance().registerWillMaximized('Home', () => {
      this.navigateToAudience();
    });
    this.props.navigation.navigate('Audience', {
      roomID: RoomConstants.roomID,
      userID: RoomConstants.audienceID,
      hostStreamID: RoomConstants.hostID,
    });
  }

  componentDidMount() {
    console.log(this.TAG, "componentDidMount")

    ZegoExpressEngine.setEngineConfig({advancedConfig: {"preview_clear_last_frame": "true"}})
    let profile = {appID: appID, appSign: appSign, scenario: ZegoScenario.Default}
    ZegoExpressEngine.createEngineWithProfile(
        profile
    ).then((engine) => {
        // 动态获取设备权限（android）
        if (Platform.OS == 'android') {
          granted.then((data)=>{
            console.log(this.TAG, "是否已有相机、麦克风权限: " + data)
            if(!data) {
              const permissions = [
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA
              ]
              //返回得是对象类型
              PermissionsAndroid.requestMultiple(permissions)
              }
          }).catch((err)=>{
            console.log(this.TAG, "check err: " + err.toString())
          })
        }

        engine.getVersion().then((ver) => {
          console.log(this.TAG, "Express SDK Version: " + ver)
        });

        this.initMinimize();
    });
  }

  componentWillUnmount() {
    console.log(this.TAG, 'componentWillUnmount');

    if (ZegoExpressEngine.instance()) {
      console.log(this.TAG, '[LZP] destroyEngine')
      ZegoExpressEngine.destroyEngine();
    }
  }


  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
            <Header />

            <View style={styles.body}>
              <View style={styles.descContainer}>
                <Text style={styles.title}>roomID: {RoomConstants.roomID}      userID: {RoomConstants.hostID}</Text>
              </View>
              <View style={styles.buttomContainer}>
                <Button onPress={this.onClickPreview.bind(this)}
                        title="Start preview and publish"/>
              </View>
              <View style={styles.descContainer}>
              </View>
              <View style={styles.descContainer}>
              </View>
              <View style={styles.descContainer}>
                <Text style={styles.title}>roomID: {RoomConstants.roomID}      userID: {RoomConstants.audienceID}</Text>
              </View>
              <View style={styles.buttomContainer}>
                <Button onPress={this.onClickAudience.bind(this)}
                        title="Watch host"/>
              </View>
              <View style={styles.descContainer}>
              </View>
            </View>

            <View style={{ marginTop: 50, alignItems: 'center' }}>
              <Text style={styles.version}>App Version: {DeviceInfo.getVersion()}.{DeviceInfo.getBuildNumber()}</Text>
            </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
  },
  descContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  buttomContainer: {
    marginTop: 10,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  version: {
    fontSize: 16,
    color: Colors.black,
  },
});

export default withNavigation(Home);
