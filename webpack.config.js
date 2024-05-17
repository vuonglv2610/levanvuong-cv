const path = require('path');

module.exports = {
  // Các cấu hình khác...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Đảm bảo các đuôi file phù hợp với dự án của bạn
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Các rules khác...
    ],
  },
  // Các cấu hình khác...
};
