var path = require('path');

module.exports = {
  entry: './src/js/kapsula.js',
  output: {
    path: path.resolve(__dirname, 'public_html/js'),
    filename: 'kapsula-bundle.js'
  }
};


