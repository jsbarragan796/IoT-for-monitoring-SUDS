process.chdir(__dirname);
 
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
    codeFrame: false
  },
  extends: [
    'airbnb-standard',
  ],
  rules:{
    "react/jsx-filename-extension": 0,
    "react/prefer-stateless-function": [0, { "ignorePureComponents": true }]
  }
};