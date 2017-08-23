
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
      home: './public/js/home.js',
      weather: './public/js/weather.js',
      qus: './public/js/qus.js',
      recommend: './public/js/recommend.js',
      detail: './public/js/detail.js',
      food: './public/js/food.js',
      density: './public/js/density.js',
      map: './public/js/map.js',
      poi: './public/js/poi.js',
      common: './public/js/common.js',
      faq:'./public/js/faq.js',
      filter:'./public/js/filter.js',
      path:'./public/js/path.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                },
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
            {
                test: /\.png$/,
                loader: 'url',
                query: {
                    'mimetype': 'image/png',
                },
            },
            {
                test: /\.ttf$/,
                loader: 'url?limit=128000&context=./public/&name=[path][name].[ext]',
            },
        ],
    },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]
};
