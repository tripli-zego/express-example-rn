//
//  KitRemoteView.h
//  example
//
//  Created by tripli on 2024/9/25.
//

#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface KitRemoteView : UIView

@property(nonatomic, strong) AVSampleBufferDisplayLayer *displayLayer;

- (void)addDisplayLayer:(AVSampleBufferDisplayLayer *)layer;

@end

NS_ASSUME_NONNULL_END
