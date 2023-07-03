'use strict';
import * as path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import Static from 'koa-static';
import Mount from 'koa-mount';
import Proxy from 'koa-better-http-proxy';
import { bodyParser } from '@koa/bodyparser';
import { Database } from './database';
import coreApp from './cached/core_app';
import userApp from './cached/user_app';
import template from './cached/template';
import cachedPkg from './cached/pkg';
import localApp from './local/user_app';
import localDevice from './local/device';
import localDeviceApp from './local/device/app';
import localDeviceData from './local/device/data';
import localDeviceSys from './local/device/sys';
import { Options } from './options';
import { MQTTBroker } from './mqttBroker';

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
const app = new Koa();
app.use(bodyParser());

const prefix = '/local_api';
app.use(coreApp.prefix(prefix).routes());
app.use(userApp.prefix(prefix).routes());
app.use(template.prefix(prefix).routes());
app.use(localApp.prefix(prefix).routes());
app.use(localDevice.prefix(prefix).routes());
app.use(localDeviceApp.prefix(prefix).routes());
app.use(localDeviceData.prefix(prefix).routes());
app.use(localDeviceSys.prefix(prefix).routes());
app.use(cachedPkg.routes()); // TOP /pkg router

const router = new Router();
router.all('/local_api', (ctx, next) => {
  ctx.body = {
    code: 404,
    msg: "unknown",
  };
});
router.all('/api', Proxy(cloudHost, {}));

app.use(router.routes());

const publicFiles = Static(publicDir);
// app.use(Mount('/static', publicFiles));
app.use(publicFiles);

  // Create work dir
Options.init(srcDir, port, workDir, cloudHost).then(()=>{
  MQTTBroker.init(6883, 16883);
  // TODO:
  const cachedFiles = Static('./cached');
  app.use(Mount('/cached', cachedFiles));

  app.listen(port, bindHost, async () => {
    Database.init(Options.instance.dbFolder);
    console.log('Server running on http://' + bindHost + ':' + port);
  });
});

