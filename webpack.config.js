const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css 파일로 분리 플러그인

module.exports = {
  // mode: 'development', // 모드 (개발시: development, 실서비스: production)
  watch: true, // 워치모드
  entry: {
    main: './src/client/js/main.js',
    videoPlayer: './src/client/js/videoPlayer.js',
    form: './src/client/js/form.js',
  }, // 엔트리
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'js/[name].js', // 파일을 여러개로 뽑고싶을경우 [name]: 엔트리의 key 네임을 따라간다.
    clean: true, // 하나로 모으기전에 파일을 청소(삭제)
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};
