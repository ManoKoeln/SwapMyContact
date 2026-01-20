const { withAppBuildGradle } = require('@expo/config-plugins');

const withCustomVersionCode = (config) => {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    
    const versionCode = config.android?.versionCode || 1;
    const version = config.version || '1.0.0';
    
    // Remove the old appJson variable references
    contents = contents.replace(
      /def appVersion = appJson\.expo\.version/g,
      `def appVersion = "${version}"`
    );
    
    contents = contents.replace(
      /def appVersionCode = appJson\.expo\.android\.versionCode/g,
      `def appVersionCode = ${versionCode}`
    );
    
    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withCustomVersionCode;
