module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore source maps in node_modules
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules/,
      });
      return webpackConfig;
    },
  },
};
