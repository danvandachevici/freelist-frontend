module.exports = function ( grunt ) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');


	var tasks = (function loadConfig(path) {
		var glob = require('glob');
		var object = {};
		var key;

		glob.sync('*', {cwd: path}).forEach(function(option) {
			key = option.replace(/\.js$/,'');
			object[key] = require(path + option);
		});

		return object;
	})('./grunt-tasks/');

	var userConfig = require( './build.config.js' );

	var taskConfig = {
		pkg: grunt.file.readJSON("package.json"),
		clean: tasks.clean,
		html2js: tasks.html2js,
		copy: tasks.copy,
		jshint: tasks.jshint,
		concat: tasks.concat,
		build_index: tasks.build_index,
		sass: tasks.sass,
		watch: tasks.watch
	};

	grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

	grunt.registerTask ('debug', 'A debug task - no minification / uglification', [
		'clean:tmp', 'clean:debug',
		'html2js:debug',
		'copy:d_app_images',
		'copy:d_vendor_images',
		'copy:d_app_fonts',
		'copy:d_vendor_fonts',
		'copy:d_app_js',
		'copy:d_vendor_js',
		'copy:d_vendor_css',
		"copy:d_assets",
		'sass:debug',
        "copy:d_app_css",
		'build_index:debug'
	]);
	grunt.registerTask ('release', 'The release task', [
		'clean:tmp', 'clean:release',
		'html2js:release',
		'copy:r_vendor_fonts',
		'copy:r_vendor_images',
		'copy:r_app_images',
		'sass:release',
		'concat:r_js', 'concat:r_css',
		'build_index:release'
	]);

	function filterForJS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.js$/ );
		});
	};
	function filterForCSS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.css$/ );
		});
	};
	function flatten_file_name (filename) {
        return filename.replace (/(.+\/)+/, '');
    };

	grunt.registerMultiTask( 'build_index', 'Process index.html template', function () {
		var dirRE = new RegExp( '^('+grunt.config('debug_dir')+'|'+grunt.config('release_dir')+')\/', 'g' );
		var vendorRE = new RegExp ('vendor');
		var jsFiles, cssFiles;
		if (this.data.release === 0) {
			jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
				if (file.match (vendorRE)) {
					return 'scripts/extern/' + flatten_file_name(file);
				}
				return 'scripts/app/' + flatten_file_name(file);
			});
			cssFiles = filterForCSS(this.filesSrc).map ( function (file) {
				return 'styles/' + flatten_file_name(file);
			});
		} else {
			jsFiles = filterForJS(this.filesSrc).map(function (file){
				return 'scripts/' + flatten_file_name(file);
			});
			cssFiles = filterForCSS(this.filesSrc).map ( function (file) {
				return 'styles/' + flatten_file_name(file);
			});
		}

		grunt.file.copy('src/index.html', this.data.dir + '/pub/index.html', { 
			process: function ( contents, path ) {
				return grunt.template.process( contents, {
					data: {
						scripts: jsFiles,
						styles: cssFiles
					}
				});
			}
		});
	});
};
