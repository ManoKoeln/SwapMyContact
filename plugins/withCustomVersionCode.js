const { withAppBuildGradle } = require('@expo/config-plugins');

const withCustomVersionCode = (config) => {
  return withAppBuildGradle(config, (config) => {
    const { contents } = config.modResults;
    
    // Add versionCode from app.json
    if (contents.includes('versionCode')) {
      // Replace existing versionCode line
      config.modResults.contents = contents.replace(
        /versionCode\s+\d+/g,
        `versionCode ${config.android.versionCode}`
      );
    }
    
    return config;
  });
};

module.exports = withCustomVersionCode;
