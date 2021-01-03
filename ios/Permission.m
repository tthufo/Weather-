//
//  Permission.m
//  shoubotenken
//
//  Created by Thanh Hai Tran on 9/18/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <AssetsLibrary/AssetsLibrary.h>
#import <AVFoundation/AVFoundation.h>
#import <MediaPlayer/MediaPlayer.h>
#import <CoreLocation/CLGeocoder.h>
#import <CoreLocation/CLPlacemark.h>
#import <UIKit/UIKit.h>
#import "Permission.h"

@implementation Permission

//export the name of the native module as 'Device' since no explicit name is mentioned
RCT_EXPORT_MODULE();

//exports a method getDeviceName to javascript

RCT_EXPORT_METHOD(getPermissionPhotoLibrary:(RCTResponseSenderBlock)callback){
  @try{
    ALAuthorizationStatus status = [ALAssetsLibrary authorizationStatus];
    switch (status) {
      case ALAuthorizationStatusNotDetermined:
      {
        ALAssetsLibrary *assetsLibrary = [[ALAssetsLibrary alloc] init];
        [assetsLibrary enumerateGroupsWithTypes:ALAssetsGroupAll usingBlock:^(ALAssetsGroup *group, BOOL *stop) {
          if (*stop) {
            callback(@[@"granted", @3]);
            return;
          }
          *stop = TRUE;
        } failureBlock:^(NSError *error) {
          callback(@[@"denied", @4]);
        }];
      }
        break;
      case ALAuthorizationStatusRestricted:
        callback(@[@"restricted", @2]);
        break;
      case ALAuthorizationStatusDenied:
        callback(@[@"permissionDenied", @1]);
        break;
      case ALAuthorizationStatusAuthorized:
        callback(@[@"authorized", @0]);
        break;
      default:
        break;
    }
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getPermissionCamera:(RCTResponseSenderBlock)callback){
  @try{
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if(authStatus == AVAuthorizationStatusAuthorized) {
      callback(@[@"authorized", @0]);
    } else if(authStatus == AVAuthorizationStatusDenied) {
      callback(@[@"permissionDenied", @1]);
    } else if(authStatus == AVAuthorizationStatusRestricted) {
      callback(@[@"restricted", @2]);
    } else if(authStatus == AVAuthorizationStatusNotDetermined) {
      [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
        if(granted){
          callback(@[@"granted", @3]);
        } else {
          callback(@[@"denied", @4]);
        }
      }];
    }
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(goToSetting:(RCTResponseSenderBlock)callback){
  @try{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString: UIApplicationOpenSettingsURLString]];
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getAddress:(NSDictionary*)coor callBack:(RCTResponseSenderBlock)callback){
  @try{
    CLGeocoder *geocoder = [CLGeocoder new];

    CLLocation *newLocation = [[CLLocation alloc]initWithLatitude:[coor[@"lat"] doubleValue]
                                                        longitude:[coor[@"long"] doubleValue]];

    [geocoder reverseGeocodeLocation:newLocation
                   completionHandler:^(NSArray *placemarks, NSError *error) {

                       if (error) {
                           NSLog(@"Geocode failed with error: %@", error);
                           return; // Request failed, log error
                       }

                       // Check if any placemarks were found
                       if (placemarks && placemarks.count > 0)
                       {
                           CLPlacemark *placemark = placemarks[0];

                           // Dictionary containing address information
                           NSDictionary *addressDictionary =
                           placemark.addressDictionary;

                           // Extract address information
                           callback(@[addressDictionary[@"Street"], @1]);
                           
//                           NSString *address = [addressDictionary
//                                                objectForKey:(NSString *)kABPersonAddressStreetKey];
//                           NSString *city = [addressDictionary
//                                             objectForKey:(NSString *)kABPersonAddressCityKey];
//                           NSString *state = [addressDictionary
//                                              objectForKey:(NSString *)kABPersonAddressStateKey];
//                           NSString *zip = [addressDictionary
//                                            objectForKey:(NSString *)kABPersonAddressZIPKey];


//                           NSLog(@"%@ %@ %@ %@", address,city, state, zip);
                       }

                   }];
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

@end
