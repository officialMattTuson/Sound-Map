module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      subdir: '.',
      includeAllSources: true
    },
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};
