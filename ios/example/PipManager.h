
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTView.h>

NS_ASSUME_NONNULL_BEGIN

@interface PipManager : NSObject

+ (instancetype)sharedInstance;

- (void)startPlayingStream:(NSString *)streamID rnVideoView:(RCTView *)rnVideoView;
- (void)stopPlayingStream:(NSString *)streamID;

@end

NS_ASSUME_NONNULL_END
