package com.example

import android.app.PictureInPictureParams
import android.content.res.Configuration
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.util.Rational

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class MainActivity : ReactActivity() {
    private val TAG = "MainActivity"

    private var pipParams: PictureInPictureParams? = null
    private var pipAutoEnterEnabled = false

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "example"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        updatePictureInPictureParams()
    }

    private fun updatePictureInPictureParams() {
        val rational = Rational(9, 16)

        pipParams = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            PictureInPictureParams.Builder()
                .setAspectRatio(rational)
                .setAutoEnterEnabled(pipAutoEnterEnabled)
                .build()
        } else {
            PictureInPictureParams.Builder()
                .setAspectRatio(rational)
                .build()
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            pipParams?.let { params ->
                setPictureInPictureParams(params)
            }
        }
    }

    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        Log.i(TAG, "onUserLeaveHint")

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S && pipAutoEnterEnabled) {
            pipParams?.let { params ->
                enterPictureInPictureMode(params)
            }
        }
    }

    fun notifyAndroidPagePipEnable(pipEnable: Boolean, pageName: String) {
        Log.i(TAG, String.format("notifyPage: %s, pipEnable: %b", pageName, pipEnable))

        pipAutoEnterEnabled = pipEnable
        updatePictureInPictureParams()
    }

    override fun onPictureInPictureModeChanged(
        isInPictureInPictureMode: Boolean,
        newConfig: Configuration
    ) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)

        val context = PipModule.reactContext
        if (context.hasActiveReactInstance()) {
            context.getJSModule(RCTDeviceEventEmitter::class.java)
                .emit("onPipModeChanged", isInPictureInPictureMode)
        }
    }
}