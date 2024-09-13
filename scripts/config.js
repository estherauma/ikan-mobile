const fs = require('fs');
const setEnv = require('./set-env');
const buildContent = require('./build-content');

module.exports = (cts) => {
  let buildType = '';
  const foundStaging = cts.argv.includes('--configuration=staging');
  const foundProduction = cts.argv.includes('--configuration=production');
  const foundTest = cts.argv.includes('--configuration=test');
  let buildDir = './build';

  if (foundStaging) {
    buildType = 'staging';
  } else if (foundProduction) {
    buildType = 'production';
  } else if (foundTest) {
    buildType = 'test';
  } else {
    console.log('No build type specified, defaulting to debug');
    buildType = 'debug';
  }

  setEnv.generateEnvironmentFiles(buildType);
  buildContent.generateContentFiles(buildDir, buildType);
};
