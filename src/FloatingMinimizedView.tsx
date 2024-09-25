import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Animated, findNodeHandle, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';

import ZegoExpressEngine, {ZegoPublishChannel, ZegoTextureView} from 'zego-express-engine-reactnative';

import MinimizingHelper from './minimizing_helper';
import StreamHelper from './StreamHelper';

export default function FloatingMinimizedView(props: any) {
    const TAG = 'FloatingMinimizedView';

    const window = useWindowDimensions();
    const {
        width = 90,
        height = 160,
        borderRadius = 10,
        left = window.width / 2 || 100,
        top = 10,
    } = props;
    const [isInit, setIsInit] = useState(false);
    const [isVisable, setIsVisable] = useState(false);
    const [layout, setLayout] = useState({
        left,
        top,
    });
    const [floatViewInfo, setFloatViewInfo] = useState({
        width: 0, height: 0,
    });
    const [isMoving, setIsMoving] = useState(false);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => {
            setIsMoving(false);
        },
        onPanResponderMove: (evt, gestureState) => {
            if (
                Math.abs(gestureState.dx) < 5 &&
                Math.abs(gestureState.dy) < 5 &&
                !isMoving
            ) {
                setIsMoving(false);
            } else {
                setIsMoving(true);
                const newLeft = layout.left + gestureState.dx;
                const newTop = layout.top + gestureState.dy;
                if (newLeft >= (window.width - floatViewInfo.width) || newTop >= (window.height - floatViewInfo.height) || newLeft <= 0 || newTop <= 0) return;
                setLayout({
                    left: newLeft,
                    top: newTop,
                });
            }
        },
        onPanResponderEnd: (evt, gestureState) => {
        },
        onPanResponderRelease: () => {
            if (!isMoving) {
                // Click
                pressedHandle();
            }
            setIsMoving(false);
        },
    });

    const layoutHandle = useCallback((e) => {
        const  { x, y, width, height } = e.nativeEvent.layout;
        setFloatViewInfo({ width, height });
    }, []);
    const pressedHandle = async () => {
        MinimizingHelper.instance()._notifyMaximize();
    }

    const miniTextureViewRef = useRef();

    useEffect(() => {
        console.log(TAG, 'FloatingMinimizedView register init');
        MinimizingHelper.instance()._registerNeedsInit('FloatingMinimizedView', () => {
            setIsInit(true);
        });
        return () => {
            MinimizingHelper.instance()._registerNeedsInit('FloatingMinimizedView');
        };
    }, []);

    useEffect(() => {
        if (isInit) {
            console.log(`${TAG} start init`);

            MinimizingHelper.instance()._registerWillMinimized(TAG, () => {
                console.log(`${TAG} visable(minimized)`)
                setIsVisable(true);
            });

            MinimizingHelper.instance().registerWillMaximized(TAG, () => {
                console.log(`${TAG} invisable(maximized)`)
                setIsVisable(false);
            });

            MinimizingHelper.instance()._registerWillRestore(TAG, () => {
                console.log(`${TAG} invisable(restore)`)
                setIsVisable(false);

                ZegoExpressEngine.instance().stopPublishingStream(ZegoPublishChannel.Main)  // for disable publish if needs

                let roomID = MinimizingHelper.instance()._getActionRoomID();
                ZegoExpressEngine.instance().logoutRoom(roomID)
                console.log(TAG, `logoutRoom, room:${roomID}`);

                let streamID = MinimizingHelper.instance()._getActionStreamID();
                StreamHelper.stopPlayingStream(streamID)    // for disable custom video render if needs, should be called after logoutroom

                MinimizingHelper.instance().setStreamActionInMinimized('', '', '');
            });
        }
        return () => {
            MinimizingHelper.instance()._registerWillMinimized(TAG);
            MinimizingHelper.instance().registerWillMaximized(TAG);
            MinimizingHelper.instance()._registerWillRestore(TAG);
        }
    }, [isInit]);

    useEffect(() => {
        if (isVisable) {
            if (MinimizingHelper.instance()._getStreamAction() === 'Preview') {
                console.log(TAG, 'startPreview')
                ZegoExpressEngine.instance().startPreview({"reactTag": findNodeHandle(miniTextureViewRef.current), "viewMode": 0, "backgroundColor": 0}, ZegoPublishChannel.Main);
            } else if (MinimizingHelper.instance()._getStreamAction() === 'PlayingStream') {
                console.log(TAG, 'startPlayingStream')
                let streamID = MinimizingHelper.instance()._getActionStreamID();
                StreamHelper.startPlayingStream(streamID, findNodeHandle(miniTextureViewRef.current))
            }
        }
    }, [isVisable]);

    return (
        <Animated.View
            style={[
                { position: 'absolute', left: layout.left, top: layout.top },
                { display: isVisable ? 'flex' : 'none' },
            ]}
            onLayout={layoutHandle}
            {...panResponder.panHandlers}
        >
            <View
                style={[
                    styles.floatView,
                    {
                        width,
                        height,
                        borderRadius,
                    }
                ]}
            >
                <ZegoTextureView ref={miniTextureViewRef} style={styles.fullscreenView} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    floatView: {
        overflow: 'hidden',
        zIndex: 10000,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8,
        backgroundColor: 'gray'
    },
    fullscreenView: {
        flex: 1,
    },
});