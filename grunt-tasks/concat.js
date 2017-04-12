module.exports = {
	options: {

	},

    debug_css: {
        src: ["<%= app_files.css %>"],
        dest: "<%= debug_dir %>/pub/styles/style.css"
    },
	release_js: {
		options: {
			stripBanners: {block: true, line: true}
		},
		src: [ "<%= vendor_files.js %>", "<%= app_files.js %>" ],
		dest: "<%= release_dir %>/pub/js/script.js"
	}
}