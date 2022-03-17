module.exports = {
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