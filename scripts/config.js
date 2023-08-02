const fs = require('fs');
const setEnv = require('./set-env');
const buildContent = require('./build-content');

module.exports = (cts) => {
  let buildType = cts.argv.find((item)=>item.includes('--configuration=production')) ? 'release' : 'debug';
  let buildDir = './build';

  if (!fs.existsSync(buildDir)){
    buildDir = './build'
    buildType = 'debug'
  }

  setEnv.generateEnvironmentFiles();
  buildContent.generateContentFiles(buildDir, buildType);
};
