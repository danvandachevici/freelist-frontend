module.exports = {
	options: {
		precision: 4,
	},
	debug: {
		options: {
			style: 'expanded'
		},
		src: ['<%= app_files.sass %>'],
		dest: '<%= debug_dir %>/pub/styles/main.css'
	},
	release: {
		options: {
			style: 'compressed'
		},
		src: ['app/main.scss'],
		dest: '<%= tmp_dir %>/app.css'
	}
}