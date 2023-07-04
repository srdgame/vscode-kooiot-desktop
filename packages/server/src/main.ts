'use strict';
import createServer from './server';

const args = process.argv.slice(2);

console.log(args);

let bindHost = '0.0.0.0';
// let cloudHost = 'http://iot.kooiot.cn';
let cloudHost = 'http://127.0.0.1:8081';
if (args.length >= 1) {
  cloudHost = args[0];
}
let srcDir = __dirname;
let port = 6108;
if (args.length >= 2) {
  port = parseInt(args[1]);
}

let workDir = '.';
if (args.length >= 3) {
  workDir = args[2];
}

let publicDir = './static';
if (args.length >= 4) {
  publicDir = args[3];
}

const server = createServer(cloudHost, bindHost, srcDir, port, workDir, publicDir);


