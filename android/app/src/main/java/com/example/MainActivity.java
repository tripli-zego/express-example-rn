package com.example;

import android.app.PictureInPictureParams;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.util.Rational;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {
  private final String TAG = "MainActivity";

  private PictureInPictureParams pipParams = null;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "example";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    updatePictureInPictureParams();
  }

  private void updatePictureInPictureParams() {
    Rational rational = new Rational(9, 16);

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      pipParams = new PictureInPictureParams.Builder()
              .setAspectRatio(rational)
              .setAutoEnterEnabled(true)
              .build();
      setPictureInPictureParams(pipParams);
    } else {
      pipParams = new PictureInPictureParams.Builder()
              .setAspectRatio(rational)
              .build();
    }
  }

  @Override
  protected void onUserLeaveHint() {
    super.onUserLeaveHint();
    Log.i(TAG, "onUserLeaveHint");

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
      enterPictureInPictureMode(pipParams);
    }
  }
}
