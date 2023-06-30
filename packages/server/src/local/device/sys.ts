
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import { FreeIOEWS } from './freeioe_ws';
import { Options } from '../../options';

const router = new Router();

interface Device {
    name: string;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

router.post('/local/device/sys/switch_cloud', async (ctx) => {
    try {
        // console.log(ctx.request.body);
        const wsUrl = "ws://" + ctx.request.body?.host + ":" + ctx.request.body?.port;
        // console.log(wsUrl);
        let ws = new FreeIOEWS(wsUrl, ctx.request.body?.user, ctx.request.body?.password);
        ws.on("console", console.log);
        ws.connect();
        await sleep(1000);
        if (ws.isConnected) {
            await Promise.all([
                ws.switch(ctx.request.body?.cloud, 6883, Options.instance.port).then((msg: any)=>{
                    if (msg?.data && msg.data?.result) {
                        ctx.body = {
                            code: 0,
                            msg: 'Device switched successfully, will be online after a while!'
                        };
                    } else {
                        ctx.body = {
                            code: 400,
                            msg: msg?.data?.message || 'Switch cloud failed!'
                        };
                    }
                }),
            ]);
            await sleep(1000);
        }
        ws.close();
    } catch (err) {
        console.log(err);
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to switch device\' cloud'
        };
    }
});
router.post('/local/device/sys/fetch_device_info', async (ctx) => {
    try {
        // console.log(ctx.request.body);
        const wsUrl = "ws://" + ctx.request.body?.host + ":" + ctx.request.body?.port;
        // console.log(wsUrl);
        let ws = new FreeIOEWS(wsUrl, ctx.request.body?.user, ctx.request.body?.password);
        ws.on("console", console.log);
        ws.connect();
        await sleep(1000);
        if (ws.isConnected) {
            await Promise.all([
                ws.deviceInfo().then((msg: any)=>{
                    if (msg?.data && msg.data?.result) {
                        ctx.body = {
                            code: 0,
                            data: {
                                device: msg.data.data
                            },
                            msg: 'Device info fetch successfully!'
                        };
                    } else {
                        ctx.body = {
                            code: 400,
                            msg: msg?.data?.message || 'Switch cloud failed!'
                        };
                    }
                }),
            ]);
            await sleep(1000);
        }
        ws.close();
    } catch (err) {
        console.log(err);
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to switch device\' cloud'
        };
    }
});
router.get('/local/device/sys/cloud_config', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/sys/cloud_config', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/sys/check_update', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/sys/upgrade', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/sys/option', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/sys/batch_script', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/sys/restart', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/sys/reboot', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});


export default router;
