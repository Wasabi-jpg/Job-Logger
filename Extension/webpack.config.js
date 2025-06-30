const path = require('path');
const CopyPlugin = require('copy-webpack-plugin'); // For copying static files

module.exports = {

context: path.resolve(__dirname, 'src'),
  entry: {
    popup: './popup.js', // Your popup script entry point
    background: './background.js' // Your background script entry point
  },
  output: {
    filename: '[name].bundle.js', // Output will be popup.bundle.js and background.bundle.js
    path: path.resolve(__dirname, 'dist'), // Output to a 'dist' folder
    clean: true // Clean the output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // You might need babel-loader for older browser compatibility, but let's keep it simple first
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'hello.html', to: 'hello.html' },
        { from: 'popup.css', to: 'popup.css' },
        { from : 'hello_extensions.png', to: 'hello_extensions.png'}, // Copy the icon file
        { from: 'manifest.json', to: 'manifest.json', 
            transform: (content, path) =>{
                const manifest_content = JSON.parse(content.toString());
                if(manifest_content.background && manifest_content.background.service_worker){
                    manifest_content.background.service_worker = "background.bundle.js"; // Update the service worker path
                }
                return JSON.stringify(manifest_content, null, 2); // Return the updated manifest content
            }
        } // Copy the manifest file
        // Add other static assets you might have, like icons
        // { from: 'icons', to: 'icons' }
      ],
    }),
  ],
  devtool: 'cheap-module-source-map' // Helps with debugging compiled code
};