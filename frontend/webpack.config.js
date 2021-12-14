module.exports = {
  module: {
    rules: [
      {
        resolve: {
          fullySpecified: false,
          extensions: [".wasm", ".mjs", ".js", ".jsx", ".json"],
        },
      },
    ],
  },
};
