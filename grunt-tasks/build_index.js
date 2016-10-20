module.exports = {
	debug: {
		release: 0,
		dir: '<%= debug_dir %>',
		src: [
		'<%= vendor_files.js %>',
		'<%= app_files.js %>',
		'<%= html2js.debug.dest %>',
		'<%= vendor_files.css %>',
		'<%= sass.debug.dest %>'
		]
	}/*,

	release: {
		release: 1,
		dir: '<%= compile_dir %>',
		src: [
		'<%= concat.compile_js.dest %>',
		'<%= vendor_files.css %>',
		'<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
		]
	}*/
}