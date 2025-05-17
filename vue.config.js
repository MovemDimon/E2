module.exports = {
  devServer: {
    port: 8080
  }
};

const path = require('path');

module.exports = {
  configureWebpack: {
    entry: path.resolve(__dirname, 'material/js/main.js')
  }
};
