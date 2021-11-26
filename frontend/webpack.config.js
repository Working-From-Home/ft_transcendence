const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	optimization: {
	  minimize: true,
	  minimizer: [
		new TerserPlugin({
		  minify: TerserPlugin.uglifyJsMinify,
		  // `terserOptions` options will be passed to `uglify-js`
		  // Link to options - https://github.com/mishoo/UglifyJS#minify-options
		  terserOptions: {
			comments: false,
			// Compression specific options
			compress: {
				// remove warnings
				warnings: false,
				// Drop console statements
				drop_console: true
			},
		  },
		}),
	  ],
	},
  };