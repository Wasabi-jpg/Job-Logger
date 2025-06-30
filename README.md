# Job-Logger

## Installations
Due to Manifest V3 CSP, bundling via WebPack was utilized. Alongside such, a 
few installations were needed to be able to connect to AWS' Lex Chatbot. Here they are below.

For AWS Lex:
` npm install @aws-sdk/client-lex-runtime-v2 uuid `

For WebPack, as it uses Babel for handling bundling:
`npm install --save-dev @babel/core @babel/preset-env babel-loader `

For WebPack, to create the destination folder that contains all the bundled code for the extension:
`npm run start`