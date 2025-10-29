import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const { PipModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(PipModule);

export default class PipModuleHelper {
    static TAG = 'PipModuleHelper'

    static _onPipModeChangedListenerMap: { [pageName: string]: (data: any) => void };

    static init = () => {
      this._onPipModeChangedListenerMap = {}
      eventEmitter.addListener('onPipModeChanged', (data) => {
        console.log(this.TAG, `receive enent: onPipModeChanged, data: ${data}, and will dispatch listeners`)
        this._dispatchPipModeChangedListener(data)
      });
    }

    static uninit = () => {
      eventEmitter.removeAllListeners('onPipModeChanged');
      this._onPipModeChangedListenerMap = {}
    }

    static notifyPagePipEnable = (pipEnable: boolean, pageName: string = 'unknown') => {
      PipModule.notifyPagePipEnable(pipEnable, pageName);
    }

    // Only supports Android temporarily.
    static registerPipModeChangedListener = (pageName: string, listener: (data: any) => void) => {
      if (typeof listener === 'function') {
        console.log(this.TAG, 'register PipModeChanged listener')
        this._onPipModeChangedListenerMap[pageName] = listener;
      } else {
        if (pageName in this._onPipModeChangedListenerMap) {
          console.log(this.TAG, 'remove PipModeChanged listener')
          delete this._onPipModeChangedListenerMap[pageName];
        }
      }
    }

    static _dispatchPipModeChangedListener = (data: any) => {
      Object.keys(this._onPipModeChangedListenerMap).forEach(
        (callbackID) => {
          if (this._onPipModeChangedListenerMap[callbackID]) {
            this._onPipModeChangedListenerMap[callbackID](data);
          }
        }
      );
    }
}
