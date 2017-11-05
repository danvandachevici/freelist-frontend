module.exports = {
	d_app_images: {
		expand: true,
		flatten: true,
		src: [ "*.jpg", "*.jpeg", "*.gif", "*.png" ],
		cwd: "<%= app_files.images %>",
		dest: "<%= debug_dir %>/pub/img/"
	},
	d_vendor_images: {
		expand: true,
		flatten: true,
		src: [ "*.jpg", "*.jpeg", "*.gif", "*.png" ],
		src: [ "<%= vendor_files.images %>" ],
		dest: "<%= debug_dir %>/pub/img/"
	},
	d_app_js: {
		expand: true,
		flatten: true,
		src: [ "<%= app_files.js %>"],
		dest: "<%= debug_dir %>/pub/scripts/app/"
	},
	d_vendor_js: {
		expand: true,
		flatten: true,
		src: [ "<%= vendor_files.js %>"],
		dest: "<%= debug_dir %>/pub/scripts/extern/",
		process: function (content, src) {
			return content.replace (/sourceMappingURL/ig, '')
		}
	},
    d_app_css: {
        expand: true,
        flatten: true,
        src: ["<%= app_files.css %>"],
        dest: "<%= debug_dir %>/pub/styles/"
    },
	d_assets: {
		expand: true,
		flatten: true,
		src: ["<%= app_files.assets %>"],
		dest: "<%= debug_dir %>/pub/assets/"
	},
	d_app_fonts: {
		expand: true,
		flatten: true,
		src: ['<%= app_files.fonts %>'],
		dest: '<%= debug_dir %>/pub/fonts/'
	},
	d_vendor_fonts: {
		expand: true,
		flatten: true,
		src: ['<%= vendor_files.fonts %>'],
		dest: '<%= debug_dir %>/pub/fonts/'
	},
	d_vendor_css: {
		expand: true,
		flatten: true,
		src: [ '<%= vendor_files.css %>' ],
		dest: '<%= debug_dir %>/pub/styles/',
	},

	r_app_images: {
		src: [ "*.jpg", "*.jpeg", "*.gif", "*.png" ],
		cwd: "<%= app_files.images %>",
		dest: "<%= release_dir %>/pub/img/"
	},
	r_vendor_images: {
		src: [ "*.jpg", "*.jpeg", "*.gif", "*.png" ],
		cwd: "<%= vendor_files.images %>",
		dest: "<%= release_dir %>/pub/img/"
	},
	r_app_fonts: {
		expand: true,
		flatten: true,
		src: ['<%= app_files.fonts %>'],
		dest: '<%= release_dir %>/pub/fonts/'
	},
	r_vendor_fonts: {
		expand: true,
		flatten: true,
		src: ['<%= vendor_files.fonts %>'],
		dest: '<%= release_dir %>/pub/fonts/'
	}
}