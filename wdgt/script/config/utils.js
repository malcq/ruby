const createSassLoader = ({
  developmentMode = false,
} = {}) => {
  return {
    test: /\.scss$/,
    use: [
      {
        loader: 'style-loader',
        options: {
          sourceMap: developmentMode
        }
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: developmentMode
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: developmentMode,
        }
      }
    ]
  };
}

const createTSLoader = () => {
  return {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node-modules/
  };
}

module.exports.createLoaders = ({
  development = false,
} = {}) => {
  return [
    createTSLoader(),
    createSassLoader({ developmentMode: development }),
  ]
}