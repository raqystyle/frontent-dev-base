module.exports = function(grunt) {

  grunt.initConfig({

    paths: {
      fe:       'frontend',
      dev:      '<%= paths.fe %>/builds/dev',
      prod:     '<%= paths.fe %>/builds/prod',
      srcdir:   '<%= paths.fe %>/src',
      tests:    '<%= paths.fe %>/tests',
      scripts:  '<%= paths.srcdir %>/coffee',
      styles:   '<%= paths.srcdir %>/stylus',
      markup:   '<%= paths.srcdir %>/jade'
    },

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      coffee: {
        files: ['<%= paths.scripts %>/**/*.coffee'],
        tasks: ['coffee:dev']
      },
      stylus: {
        files: ['<%= paths.styles %>/**/*.styl'],
        tasks:['stylus:dev']
      },
      jade: {
        files: ['<%= paths.markup %>/**/*.jade'],
        tasks: ['jade:dev']
      }
    },

    coffee: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= paths.scripts %>/',
          src: ['**/*.coffee'],
          dest: '<%= paths.dev %>/js/',
          ext: '.js'
        }]
      },
      prod: {
        files: [{
          expand: true,
          cwd: '<%= paths.scripts %>/',
          src: ['**/*.coffee'],
          dest: 'frontend/temp/js/',
          ext: '.js'
        }]
      },
      tests: {
        files: [{
          expand: true,
          cwd: '<%= paths.tests %>/coffee/',
          src: ['**/*.coffee'],
          dest: '<%= paths.tests %>/js/',
          ext: '.js'
        }]
      }
    },

    stylus: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= paths.styles %>/',
          src: ['**/*.styl'],
          dest: '<%= paths.dev %>/css/',
          ext: '.css'
        }]
      }
    },

    jade: {
      dev: {
        options: {
          pretty: true
        },
        files: [
          {
            src: '<%= paths.srcdir %>/index.jade',
            dest: '<%= paths.dev %>/index.html'
          },
          {
            expand: true,
            cwd: '<%= paths.markup %>/',
            src: ['**/*.jade'],
            dest: '<%= paths.dev %>/templates/',
            ext: '.html'
          }
        ]
      }
    },

    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      prod: {
        src: ['frontend/temp/js/**/*.js'],
        dest: '<%= paths.prod %>/app.js'
      }
    },

    clean: ['frontend/temp'],

    uglify: {
      options: {
        sourceMap: '<%= paths.prod %>/source-map.js',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
      },
      prod: {
        files: {
          '<%= paths.prod %>/app.min.js': ['<%= paths.prod %>/app.js']
        }
      }
    },

    // Tests
    // ----------------
    karma: {
      unit: {
        singleRun: true,
        configFile: '<%= paths.tests %>/karma.conf.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('dev', [
    'coffee:dev', 'stylus:dev', 'jade:dev'
  ]);

  grunt.registerTask('test', [
    'coffee:tests', 'karma'
  ]);

  grunt.registerTask('default', [
    'coffee:prod', 'concat', 'clean', 'uglify'
  ]);

};