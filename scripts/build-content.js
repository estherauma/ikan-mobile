const fs = require('fs');
const path = require("path")

module.exports.generateContentFiles = (buildDir, buildType)=>{
  try {
    const sourceExists = fs.existsSync(buildDir);
    const firebaseFileUrlAndroid = `build/${buildType}/google-services.json`
    const firebaseFileUrlDestAndroid = 'android/app/google-services.json'
    const firebaseFileUrlIos = `build/${buildType}/GoogleService-Info.plist`
    const firebaseFileUrlDestIos = 'ios/App/App/GoogleService-Info.plist'
    const ciConfigLocation = '.circleci/config.yml'

    if (sourceExists) {
      if (fs.existsSync(firebaseFileUrlAndroid)) {
        fs.copyFileSync(firebaseFileUrlAndroid, firebaseFileUrlDestAndroid);
      } else {
        console.log('ERROR: Android firebase file directory is missing.');
        if (fs.existsSync(firebaseFileUrlDestAndroid)) {
          fs.unlinkSync(firebaseFileUrlDestAndroid);
          console.log('ERROR: Previous Android firebase file will be deleted');
        }
      }
      if (fs.existsSync(firebaseFileUrlIos)) {
        fs.copyFileSync(firebaseFileUrlIos, firebaseFileUrlDestIos);
      } else {
        console.log('ERROR: iOS firebase file directory is missing.');
        if (fs.existsSync(firebaseFileUrlDestIos)) {
          fs.unlinkSync(firebaseFileUrlDestIos);
          console.log('ERROR: Previous iOS firebase file will be deleted');
        }
      }
      if (!fs.existsSync(ciConfigLocation)) {
        console.log('ERROR: CircleCI  file directory is missing.');
      }
    }else {
      console.log('ERROR: Build directory is missing.');
    }
  } catch (error) {
    console.log('content generation error',error)
  }
}
