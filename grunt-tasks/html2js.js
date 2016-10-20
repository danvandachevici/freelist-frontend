module.exports = {
	options: {
		base: 'src/app',
		module: 'app-templates',
		indentString: '	'
	},
	debug: {
		src: [ "<%= app_files.templates %>" ],
		dest: "<%= debug_dir %>/pub/scripts/app/templates.js"
	},
	release: {
		options: {
			htmlmin: {
				collapseBooleanAttributes: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true
			}
		},
		src: [ "<%= app_files.templates %>" ],
		dest: "<%= tmp_dir %>/templates.js"
	}
}