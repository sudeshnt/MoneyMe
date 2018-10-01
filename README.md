common errors

1. Plugin with id 'com.google.gms.google-services' not found for cordova-plugin-firebase
   steps :
    ionic cordova platform rm android
    ionic cordova plugin rm cordova-plugin-firebase
    ionic cordova platform add android@6.3.0
    ionic cordova plugin add cordova-plugin-firebase

    https://stackoverflow.com/questions/47152282/gradle-could-not-find-method-google-for-arguments-on-repository-container?noredirect=1&lq=1
    Find the file named: gradle-wrapper.properties, and change the distributionUrl value to: "https\://services.gradle.org/distributions/gradle-4.1-all.zip"
   if error : Could not find method google() for arguments [] on repository container
    goto platforms/android/build.gradle , remove google() from line number 25
