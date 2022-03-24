module.exports = {
  devServer: {
	  host: '0.0.0.0',
	  port: process.env.VUE_APP_FRONTEND_PORT,
  },
  css: {
    loaderOptions: {
      sass: {
        // additionalData: `
        //   @import "@/assets/scss/custom.scss";
        // `
        additionalData: `
          @import "@/assets/scss/_variables.scss";
        `
      },
    },
  },
};
