#import "PipModule.h"
#import "PipManager.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTView.h>

@implementation PipModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(notifyAndroidPagePipEnable:(BOOL)pipEnable pageName:(NSString *)pageName)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSLog(@"[PipModule] notifyAndroidPagePipEnable, pipEnable: %d, pageName: %@", pipEnable, pageName);
    [[PipManager sharedInstance] notifyAndroidPagePipEnable:pipEnable pageName:pageName];
  });
}

RCT_EXPORT_METHOD(startPlayingStream:(NSDictionary *)map)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *streamID = map[@"streamID"];
    NSNumber *reactTag = map[@"reactTag"];
    NSNumber *viewMode = map[@"viewMode"];
    
    RCTView *rctView = (RCTView *)[self->_bridge.uiManager viewForReactTag: reactTag];
    
    NSLog(@"[PipModule] startPlayingStream: %@, reactTag: %@, viewMode: %@, rnVideoView: %@", streamID, reactTag, viewMode, rctView);
    [[PipManager sharedInstance] startPlayingStream:streamID rnVideoView:rctView viewMode:viewMode.unsignedIntValue];
  });
}

RCT_EXPORT_METHOD(stopPlayingStream:(NSDictionary *)map)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *streamID = map[@"streamID"];
    
    NSLog(@"[PipModule] stopPlayingStream: %@", streamID);
    
    [[PipManager sharedInstance] stopPlayingStream:streamID];
  });
}

RCT_EXPORT_METHOD(addListener:(NSString *)eventName) {
  
}

RCT_EXPORT_METHOD(removeListeners:(int)count) {
  
}

@end
