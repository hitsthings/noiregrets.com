var spawn = require('child_process').spawn;

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: [
        'grunt.js',
        'lib/**/*.js',
        'test/**/*.js',
        'blog/lib/**/*.js',
        'blog/test/**/*.js'//,
//        'planner/lib/**/*.js',
//        'planner/test/**/*.js'
      ]
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    },
    soy: {
      root: {
        outputPathFormat: 'public/js/soy/{INPUT_DIRECTORY}/{INPUT_FILE_NAME_NO_EXT}.js',
        inputPrefix: 'lib/',
        src: ['lib/**/*.soy']
      },
      planner: {
        outputPathFormat: 'planner/public/js/soy/{INPUT_DIRECTORY}/{INPUT_FILE_NAME_NO_EXT}.js',
        inputPrefix: 'planner/lib/',
        src: ['planner/lib/**/*.soy']
      },
      blog: {
        outputPathFormat: 'blog/public/js/soy/{INPUT_DIRECTORY}/{INPUT_FILE_NAME_NO_EXT}.js',
        inputPrefix: 'blog/lib/',
        src: ['blog/lib/**/*.soy']
      }
    },
    clean : {
      soyRoot : 'public/js/soy/',
      soyPlanner : 'planner/public/js/soy',
      soyBlog : 'blog/public/js/soy'
    },
    watch : {
      soy : {
        files : '**/*.soy',
        tasks : 'soy'
      },
      lint : {
        files: '<config:lint.files>',
        tasks: 'default'
      }
    }
  });

  grunt.loadNpmTasks('grunt-soy');
  grunt.loadNpmTasks('grunt-clean');

  grunt.registerTask('run', 'Run noiregrets.com locally', function() {
    require('./web');
    this.async();
  });

  grunt.registerTask('devmode', 'Set NODE_ENV=development', function() {
    process.env.NODE_ENV='development';
  });

  grunt.registerTask('devstart', 'Run the mongo test db and watch:soy in another process', function() {
    spawn('grunt.cmd', ['watch:soy']);
    spawn('mongod');
    this.async();
  });

  // Default task.
  grunt.registerTask('default', 'clean lint soy test');
  grunt.registerTask('go', 'clean lint soy test devmode run');

};