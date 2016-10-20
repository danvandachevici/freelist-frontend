module.exports = {
	options: {

	},
	
	release_js: {
		options: {
			stripBanners: {block: true, line: true}
		},
		src: [ "<%= vendor_files.js %>", "<%= app_files.js %>" ],
		dest: "<%= release_dir %>/pub/js/script.js"
	}
}