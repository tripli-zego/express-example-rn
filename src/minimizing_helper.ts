export default class MinimizingHelper {
    _isMinimize = false;

    _onNeedsInitCallbackMap: { [index: string]: (data?: any) => void } = {};
    _onWindowMinimizeCallbackMap: { [index: string]: (data?: any) => void } = {};
    _onWindowMaximizeCallbackMap: { [index: string]: (data?: any) => void } = {};
    _onWindowRestoreCallbackMap: { [index: string]: (data?: any) => void } = {};

    _streamAction: string = '';
    _actionRoomID: string = '';
    _actionStreamID: string = '';

    constructor() { }

    // instance
    static _instance: MinimizingHelper;
    static instance() {
        return this._instance || (this._instance = new MinimizingHelper());
    }

    // init
    _registerNeedsInit(callbackID: string, callback?: (data: any) => void) {
        if (callback !== undefined) {
            console.log(`register needsInit, callbackID:${callbackID}`);
        } else {
            console.log(`register needsInit, callbackID:${callbackID} removed`);
        }

        if (typeof callback !== 'function') {
            delete this._onNeedsInitCallbackMap[callbackID];
        } else {
            this._onNeedsInitCallbackMap[callbackID] = callback;
        }
    }

    initMinimize() {
        console.log('initMinimize dispatch');

        console.log('clear Min & Max callback list');
        this._onWindowMinimizeCallbackMap = {};
        this._onWindowMaximizeCallbackMap = {};

        Object.keys(this._onNeedsInitCallbackMap).forEach((callbackID) => {
            if (this._onNeedsInitCallbackMap[callbackID]) {
                this._onNeedsInitCallbackMap[callbackID]();
            }
        })
    }

    // minimized
    _registerWillMinimized(callbackID: string, callback?: (data: any) => void) {
        if (callback !== undefined) {
            console.log(`register willMinimized, callbackID:${callbackID}`);
        } else {
            console.log(`register willMinimized, callbackID:${callbackID} removed`);
        }

        if (typeof callback !== 'function') {
            delete this._onWindowMinimizeCallbackMap[callbackID];
        } else {
            this._onWindowMinimizeCallbackMap[callbackID] = callback;
        }
    }

    setStreamActionInMinimized(action: string, roomID: string, streamID: string) {
        this._streamAction = action;
        this._actionRoomID = roomID;
        this._actionStreamID = streamID;
    }

    _getStreamAction() {
        return this._streamAction;
    }

    _getActionRoomID() {
        return this._actionRoomID;
    }

    _getActionStreamID() {
        return this._actionStreamID;
    }

    notifyMinimize() {
        console.log('notifyMinimize dispatch');
        this._isMinimize = true;

        Object.keys(this._onWindowMinimizeCallbackMap).forEach((callbackID) => {
            if (this._onWindowMinimizeCallbackMap[callbackID]) {
                this._onWindowMinimizeCallbackMap[callbackID]();
            }
        })
    }

    // maximize
    registerWillMaximized(callbackID: string, callback?: (data: any) => void) {
        if (callback !== undefined) {
            console.log(`register willMaximized, callbackID:${callbackID}`);
        } else {
            console.log(`register willMaximized, callbackID:${callbackID} removed`);
        }

        if (typeof callback !== 'function') {
            delete this._onWindowMaximizeCallbackMap[callbackID];
        } else {
            this._onWindowMaximizeCallbackMap[callbackID] = callback;
        }
    }

    _notifyMaximize() {
        console.log('notifyMaximize dispatch');
        this._isMinimize = false;

        Object.keys(this._onWindowMaximizeCallbackMap).forEach((callbackID) => {
            if (this._onWindowMaximizeCallbackMap[callbackID]) {
                this._onWindowMaximizeCallbackMap[callbackID]();
            }
        })
    }

    // restore
    _registerWillRestore(callbackID: string, callback?: (data: any) => void) {
        if (callback !== undefined) {
            console.log(`register willRestore, callbackID:${callbackID}`);
        } else {
            console.log(`register willRestore, callbackID:${callbackID} removed`);
        }

        if (typeof callback !== 'function') {
            delete this._onWindowRestoreCallbackMap[callbackID];
        } else {
            this._onWindowRestoreCallbackMap[callbackID] = callback;
        }
    }

    notifyRestore() {
        console.log('notifyRestore only for FloatingMinimizedView');
        this._isMinimize = false;

        if (this._onWindowRestoreCallbackMap['FloatingMinimizedView']) {
            this._onWindowRestoreCallbackMap['FloatingMinimizedView']();
        }
    }
}