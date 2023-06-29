'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import MakeDir from 'make-dir';
import { Options } from '../options';

const router = new Router();

router.post('/local/user_app/create', async (ctx) => {
    const localPath = path.join(Options.instance.workPath, 'local');
    const appPath = path.join(localPath, ctx.request.body?.app_id);
    const infoPath = path.join(appPath, '.freeioe.app.json');

    try {
        fs.accessSync(appPath);
    } catch (err) {
        await MakeDir(appPath).then((path) => {
            fs.writeFileSync(infoPath, JSON.stringify(ctx.request.body, null, 4), 'utf8');
            ctx.type = 'application/json';
            ctx.body = {
                code: 0,
                msg: 'Created app'
            };
        });
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create app'
        };
    }
});
router.post('/local/user_app/delete', async (ctx) => {
    try {
        const localPath = path.join(Options.instance.workPath, 'local');
        const appPath = path.join(localPath, ctx.request.body?.app_id);

        fs.accessSync(appPath);
        fs.rmSync(appPath, { recursive: true, force: true });
        ctx.type = 'application/json';
        ctx.body = {
            code: 0,
            msg: 'Created app'
        };
    } catch (err) {
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create app'
        };
    }
});
router.put('/local/user_app/update', async (ctx) => {
    try {
        const localPath = path.join(Options.instance.workPath, 'local');
        const appPath = path.join(localPath, ctx.request.body?.app_id);
        const infoPath = path.join(appPath, '.freeioe.app.json');

        fs.accessSync(appPath);
        fs.rmSync(infoPath);
        fs.writeFileSync(infoPath, JSON.stringify(ctx.request.body, null, 4), 'utf8');
        ctx.type = 'application/json';
        ctx.body = {
            code: 0,
            msg: 'Updated app'
        };
    } catch (err) {
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create app'
        };
    }
});
router.get('/local/user_app/get', async (ctx) => {
    let appId = ctx.request.query?.app_id;
    if (typeof(appId) !== 'string') {
        appId = '__UNKNONWN_APP_ID';
    }
    const localPath = path.join(Options.instance.workPath, 'local');
    const appPath = path.join(localPath, appId);
    const infoPath = path.join(appPath, '.freeioe.app.json');
    try {

        fs.accessSync(infoPath);
        const readResults: string = fs.readFileSync(infoPath, 'utf8');
        const appInfo = JSON.parse(readResults);
        ctx.type = 'application/json';
        ctx.body = {
            code: 0,
            data: {
                app: appInfo,
            },
            msg: 'App read OK!'
        };
    } catch (err) {
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create app'
        };
    }
});

router.post('/local/user_app/list', async (ctx) => {
    let apps: Object[] = [];
    try {
        const localPath = path.join(Options.instance.workPath, 'local');
        fs.readdir(localPath, (err, files) => {
            files.forEach( file => {
                const infoPath = path.join(file, '.freeioe.app.json');
                fs.access(infoPath, (err) => {
                    if (!err) {
                        const readResults: string = fs.readFileSync(infoPath, 'utf8');
                        const appInfo = JSON.parse(readResults);
                        if (appInfo && appInfo.app_id) {
                            apps.push(appInfo);
                        }
                    }
                });
            });
        });
    } catch (err) {
    }
    ctx.type = 'application/json';
    ctx.body = {
        code: 0,
        data: {
            list: apps,
        },
        msg: 'App list OK!'
    };
});

export default router;
