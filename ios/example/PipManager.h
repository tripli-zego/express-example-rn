
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTView.h>

@import ZegoExpressEngine;

NS_ASSUME_NONNULL_BEGIN

@interface PipManager : NSObject

+ (instancetype)sharedInstance;

- (void)startPlayingStream:(NSString *)streamID rnVideoView:(RCTView *)rnVideoView viewMode:(ZegoViewMode)viewMode;
- (void)stopPlayingStream:(NSString *)streamID;

@end

NS_ASSUME_NONNULL_END
