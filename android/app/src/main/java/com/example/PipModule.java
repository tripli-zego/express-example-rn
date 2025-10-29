package com.example;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import android.content.Context;

@ReactModule(name = PipModule.NAME)
public class PipModule extends ReactContextBaseJavaModule {
    public static final String NAME = "PipModule";

    public static ReactApplicationContext reactContext;

    public PipModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void notifyPagePipEnable(boolean pipEnable, String pageName) {
        MainActivity mainActivity = (MainActivity) getCurrentActivity();
        if (mainActivity == null) {
            return;
        }

        mainActivity.notifyPagePipEnable(pipEnable, pageName);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    private Context getAppContext() {
      return this.reactContext.getApplicationContext();
    }
}
