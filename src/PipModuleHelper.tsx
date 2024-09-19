import { Platform, NativeModules } from 'react-native';

const { PipModule } = NativeModules;

export default class PipModuleHelper {
    static notifyAndroidPagePipEnable = (pipEnable: boolean, pageName: string = 'unknown') => {
      if (Platform.OS !== 'android') {
        return;
      }

      PipModule.notifyAndroidPagePipEnable(pipEnable, pageName);
    }
}
