
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import { Options } from '../options';

const router = new Router();

interface UserApp {
    app_id?: any;
    name?: any;
    description?: any;
    local_folder?: any;
}

router.post('/local/user_app/create', async (ctx) => {
    const infoPath = path.join(Options.instance.localFolder, 'freeioe.apps.json');
    ctx.type = 'application/json';

    try {
        fs.accessSync(infoPath);
        const readResults: string = fs.readFileSync(infoPath, 'utf8');
        const devices: Object[] = JSON.parse(readResults);
        devices.push(ctx.request.body);
        fs.writeFileSync(infoPath, JSON.stringify(devices, null, 4), 'utf8');

        ctx.body = {
            code: 0,
            msg: 'App read OK!'
        };
    } catch (err) {
        let devices = [ctx.request.body];
        fs.writeFileSync(infoPath, JSON.stringify(devices, null, 4), 'utf8');
        ctx.body = {
            code: 0,
            msg: 'Created app'
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Failed to create app'
        };
    }
});
router.post('/local/user_app/delete', async (ctx) => {
    const infoPath = path.join(Options.instance.localFolder, 'freeioe.apps.json');
    ctx.type = 'application/json';

    try {
        fs.accessSync(infoPath);
        const readResults: string = fs.readFileSync(infoPath, 'utf8');
        const devices: UserApp[] = JSON.parse(readResults);
        const index = devices.findIndex(item => item.app_id === ctx.request.body?.app_id);
        if (index !== -1) {
            devices.splice(index, 1);
            fs.writeFileSync(infoPath, JSON.stringify(devices, null, 4), 'utf8');

            ctx.body = {
                code: 0,
                msg: 'App read OK!'
            };
        }
    } catch (err) {
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Failed to delete app'
        };
    }
});
router.put('/local/user_app/update', async (ctx) => {
    const infoPath = path.join(Options.instance.localFolder, 'freeioe.apps.json');
    ctx.type = 'application/json';

    try {
        fs.accessSync(infoPath);
        const readResults: string = fs.readFileSync(infoPath, 'utf8');
        const devices: UserApp[] = JSON.parse(readResults);
        const index = devices.findIndex(item => item.app_id === ctx.request.body?.app_id);
        if (index !== -1) {
            devices[index] = ctx.request.body;
            fs.writeFileSync(infoPath, JSON.stringify(devices, null, 4), 'utf8');

            ctx.body = {
                code: 0,
                msg: 'App read OK!'
            };
        }
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
    const infoPath = path.join(Options.instance.localFolder, 'freeioe.apps.json');
    ctx.type = 'application/json';
    const app_id = ctx.request.query?.app_id;
    try {
        fs.accessSync(infoPath);
        const readResults: string = fs.readFileSync(infoPath, 'utf8');
        const apps: UserApp[] = JSON.parse(readResults);
        const index = apps.findIndex(item => item.app_id === app_id);
        if (index !== -1) {
            ctx.body = {
                code: 0,
                data: {
                    app: apps[index]
                },
                msg: 'App read OK!'
            };
        }
    } catch (err) {
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to get app'
        };
    }
});

router.post('/local/user_app/list', async (ctx) => {
    const infoPath = path.join(Options.instance.localFolder, 'freeioe.apps.json');
    ctx.type = 'application/json';

    let item: UserApp = {};
    if (ctx.request.body?.name) {
        item.name = { '$regex': '/' + ctx.request.body.name + '/' };
    }
    if (ctx.request.body?.description) {
        item.description = { '$regex': '/' + ctx.request.body.description + '/' };
    }
    if (ctx.request.body?.app_id) {
        item.app_id = { '$regex': '/' + ctx.request.body.app_id + '/' };
    }
    if (ctx.request.body?.local_folder) {
        item.local_folder = { '$regex': '/' + ctx.request.body.local_folder + '/' };
    }
    try {
        fs.accessSync(infoPath);
        const readResults: string = fs.readFileSync(infoPath, 'utf8');
        const apps: UserApp[] = JSON.parse(readResults);
        ctx.body = {
            code: 0,
            data: {
                list: apps,
            },
            msg: 'List local apps OK!'
        };
    } catch (err) {
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: {
                list: [],
            },
            msg: 'List local apps OK!'
        };
    }
});

export default router;
