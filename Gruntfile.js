'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      livereload: {
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/styles/{,*/}*.{css}',
          '<%= yeoman.app %>/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      },
      stylus: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.styl'
        ],
        tasks: ['stylus', 'livereload']
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '<%= yeoman.app %>/manifest.appcache',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/lib/{,*/}*.js'
      ]
    },
    stylus: {
      main: {
        expand: true,
        cwd: 'app/',
        src: ['**/*.styl'],
        dest: 'app/',
        ext: '.css'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    manifest: {
      generate: {
        options: {
          basePath: '<%= yeoman.dist %>',
          //cache: ['js/app.js', 'css/style.css'],
          fallback: ['/ /index.html'],
          preferOnline: true
        },
        src: [
          'index.html',
          '{images,scripts,styles}/**/*.*',
          'favicon.ico'
        ],
        dest: '<%= yeoman.dist %>/manifest.appcache'
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*',
            '!<%= yeoman.dist %>/images/firefox/**/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt,webapp,manifest}',
            '.htaccess',
            'jsonp.php',
            'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            'styles/fonts/*'
          ]
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('run', [
    'livereload-start',
    'stylus',
    'watch'
  ]);

  grunt.registerTask('test', [
    'stylus',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'stylus',
    'jshint',
    //'test',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy',
    'uglify',
    'rev',
    'usemin',
    'manifest'
  ]);

  grunt.registerTask('default', ['build']);
};
