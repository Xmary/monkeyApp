module.exports = function(config){
  config.set({

    basePath : './monkeyApp/',

    files : [
      'static/bower_components/angular/angular.js',
      'static/bower_components/angular-ui-router/release/angular-ui-router.js',
      'static/bower_components/angular-mocks/angular-mocks.js',
      'static/app.js',
      'static/components/**/*.js',
      'static/home/*.js',
      'static/single/*.js',
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Firefox'],

    plugins : [
            'karma-firefox-launcher',
            'karma-jasmine'
            ]

  });
};