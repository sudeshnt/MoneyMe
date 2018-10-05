common errors

1. Plugin with id 'com.google.gms.google-services' not found for cordova-plugin-firebase
   steps :
    ionic cordova platform rm android
    ionic cordova plugin rm cordova-plugin-firebase
    ionic cordova platform add android@6.3.0
    ionic cordova plugin add cordova-plugin-firebase

    https://stackoverflow.com/questions/47152282/gradle-could-not-find-method-google-for-arguments-on-repository-container?noredirect=1&lq=1
    if error : Could not find method google() for arguments [] on repository container
    goto platforms/android/build.gradle ,
    allprojects {
        repositories {
            jcenter()
            maven {
                url "https://maven.google.com"
            }
        }
    }
