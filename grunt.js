var spawn = require('child_process').spawn;
var fs= require('fs');

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
        'blog/test/**/*.js',
        'planner/lib/**/*.js',
        'planner/test/**/*.js'
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
    browserify: {
      all : {
        src : ['./blog/lib/markdown'],
        dest : 'blog/public/js/markdown.js'
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

  grunt.registerMultiTask('browserify', 'Run browserify on a file', function() {
    //var inputs = grunt.file.expandFiles(this.file.src);
    var inputs = grunt.config(['browserify', this.target, 'src']);
    var output = grunt.config(['browserify', this.target, 'dest']);
    fs.writeFile(output, require('browserify')({
      exports: ['require'],
      require: inputs
    }).bundle(), this.async());
  });

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

  grunt.registerTask('deploy', 'Switch to the deploy branch, push, and switch back', function() {
    var proc, out = '';

    var next = this.async();

    function pipeAll(proc) {
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
      return proc;
    }

    proc = spawn('git', ['branch']);
    proc.stdout.on('data', function(data) { out += data; });
    proc.stdout.on('end', function() {
      var newline, current, branch;
      if (out[0] === '*') {
        current = -1;
      } else {
        current = out.indexOf('\n*');
      }
      if (!~current) {
        return next(new Error("Current branch could not be determined."));
      }

      current++;

      newline = out.indexOf('\n', current);
      branch = out.substring(current + 2, ~newline ?  newline : undefined);
      console.log('Current branch is ' + branch);

      pipeAll(spawn('git', ['checkout', 'deploy'])).on('exit', function() {
        pipeAll(spawn('git', ['merge', branch])).on('exit', function() {
          pipeAll(spawn('git', ['push'])).on('exit', function() {
            pipeAll(spawn('git', ['checkout', branch])).on('exit', function() {
              next();
            });
          });
        });
      });
    });
  });

  // Default task.
  grunt.registerTask('default', 'clean lint soy browserify test');
  grunt.registerTask('go', 'clean lint soy browserify test devmode run');

};