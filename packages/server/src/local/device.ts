
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import { Options } from '../options';
import { Database } from '../database';

const router = new Router();

interface Device {
    name?: any;
    desc?: any;
    host?: any;
    port?: number;
    cloudAuth?: boolean;
    sn?: any;
    user?: string;
    password?: string;
}

router.post('/local/device/create', async (ctx) => {
    ctx.type = 'application/json';

    const devs = await Database.instance.dbDevices.findAsync({ sn: ctx.request.body?.sn });
    if (devs?.length > 0) {
        ctx.body = {
            code: 400,
            msg: 'Already cached',
        };
        return;
    }
    try {
        await Database.instance.dbDevices.insertAsync(ctx.request.body).then((value) => {
            ctx.body = {
                code: 0,
                msg: 'Inserted',
            };
        }).catch((reason) => {
            ctx.body = {
                code: 400,
                msg: reason,
            };
        });
    } catch (reason) {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    }
});
router.post('/local/device/delete', async (ctx) => {
    const item = {
        sn: ctx.request.body?.sn
    };
    ctx.type = 'application/json';
    try {
        await Database.instance.dbDevices.removeAsync(item, { multi: true }).then( (removed) => {
            if (removed > 0) {
                ctx.body = {
                    code: 0,
                    msg: 'Deleted',
                };
            }
        });
    } catch (reason) {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Delete device Failed',
        };
    }
});
router.put('/local/device/update', async (ctx) => {
    const item = {
        sn: ctx.request.body?.sn
    };
    ctx.type = 'application/json';
    try {
        await Database.instance.dbDevices.updateAsync(item, ctx.request.body, {}).then( ({ numAffected }) => {
            if (numAffected >= 0) {
                ctx.body = {
                    code: 0,
                    msg: 'Updated',
                };
            }
        });
    } catch (reason) {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Update device Failed',
        };
    }
});
router.get('/local/device/get', async (ctx) => {
    const item = {
        sn: ctx.request.query?.sn
    };
    ctx.type = 'application/json';
    try {
        await Database.instance.dbDevices.findAsync(item).then( (devices) => {
            if (devices.length >= 1) {
                ctx.body = {
                    code: 0,
                    data: {
                        device: devices[0],
                    },
                    msg: 'Got device',
                };
            }
        });
    } catch (reason) {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Get device Failed',
        };
    }
});
router.post('/local/device/list', async (ctx) => {
    let item: Device = {};
    if (ctx.request.body?.name) {
        item.name = { '$regex': '/' + ctx.request.body.name + '/' };
    }
    if (ctx.request.body?.desc) {
        item.desc = { '$regex': '/' + ctx.request.body.desc + '/' };
    }
    if (ctx.request.body?.host) {
        item.host = { '$regex': '/' + ctx.request.body.host + '/' };
    }
    if (ctx.request.body?.sn) {
        item.sn = { '$regex': '/' + ctx.request.body.sn + '/' };
    }
    ctx.type = 'application/json';
    try {
        await Database.instance.dbDevices.findAsync(item).then( (list) => {
            ctx.body = {
                code: 0,
                data: {
                    list: list,
                },
                msg: 'Got List',
            };
        });
    } catch (reason) {
        ctx.body = {
            ode: 0,
            data: {
                list: [],
            },
            msg: reason,
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: {
                list: [],
            },
            msg: 'List devices OK!'
        };
    }
});

export default router;
