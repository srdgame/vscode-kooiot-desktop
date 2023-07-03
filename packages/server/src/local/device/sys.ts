
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FreeIOEWS } from './freeioe_ws';
import { Options } from '../../options';
import { Database } from '../../database';
import { MQTTBroker } from '../../mqttBroker';

const router = new Router();

interface Device {
    name: string;
}

const publishToMQTT = (gateway: string, topic: string, data: any) => {
    const topicReal = gateway + topic;
    const id = uuidv4();
    const payload = JSON.stringify({
        id: id,
        data: data
    });
    MQTTBroker.instance.publish(topicReal, payload, false, 0);
    return id;
};

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
router.post('/local/device/sys/cloud_config', async (ctx) => {
    try {
        const id = publishToMQTT(ctx.request.body?.device, '/sys/cloud_conf', ctx.request.body?.conf || {});
        ctx.body = {
            code: 0,
            data: { id: id },
            msg: 'Done'
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: err
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'App List request failed'
        };
    }
});

router.post('/local/device/sys/check_update', async (ctx) => {
    try {
        const platform = ctx.request.body?.platform || 'any/any/any';
        // FreeIOE app id is 1
        const apps : any = await Database.instance.dbCachedExts.findAsync({ ID: 1 });
        let freeioeVersion = 0;
        if (apps?.length > 0) {
            freeioeVersion = apps[0].cache_version;
        }
        const coreApps : any = await Database.instance.dbCachedExts.findAsync({ platform_path: platform });
        let coreAppVersion = 0;
        if (coreApps?.length > 0) {
            coreAppVersion = coreApps[0].cache_version;
        }

        ctx.body = {
            code: 0,
            data: {
                version: freeioeVersion,
                skynet_version: coreAppVersion,
            },
            msg: 'Fetched latest FreeIOE/Skynet version'
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: err
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Check update request failed'
        };
    }
});
router.post('/local/device/sys/upgrade', async (ctx) => {
    try {
        const id = publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/sys/upgrade', {
            no_ack: true,
            version: ctx.request.body?.version,
            skynet: ctx.request.body?.skynet,
        });
        ctx.body = {
            code: 0,
            data: { id: id },
            msg: 'Done'
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: err
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Upgrade request failed'
        };
    }
});
router.post('/local/device/sys/option', async (ctx) => {
    try {
        let topic = '';
        const option = ctx.request.body?.option;
        if (option === 'EnableData') {
            topic = '/sys/enable/data';
        } else if (option === 'EnableDataOneShort') {
            topic = '/sys/enable/data_one_short';
        } else if (option === 'EnableCache') {
            topic = '/sys/enable/data_cache';
        } else if (option === 'EnableLog') {
            topic = '/sys/enable/log';
        } else if (option === 'EnableComm') {
            topic = '/sys/enable/comm';
        } else if (option === 'EnableStat') {
            topic = '/sys/enable/stat';
        } else if (option === 'EnableEvent') {
            topic = '/sys/enable/event';
        } else if (option === 'EnableBeta') {
            topic = '/sys/enable/beta';
        } else {
            ctx.body = {
                code: 500,
                msg: 'Not supportted option'
            };
        }

        const id = publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, topic, ctx.request.body?.value);
        ctx.body = {
            code: 0,
            data: { id: id },
            msg: 'Done'
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: err
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Upgrade request failed'
        };
    }
});
router.post('/local/device/sys/batch_script', async (ctx) => {
    try {
        const id = publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/sys/upgrade', ctx.request.body?.script);
        ctx.body = {
            code: 0,
            data: { id: id },
            msg: 'Done'
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: err
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Upgrade request failed'
        };
    }
});
router.post('/local/device/sys/restart', async (ctx) => {
    try {
        const id = publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/sys/restart', {});
        ctx.body = {
            code: 0,
            data: { id: id },
            msg: 'Done'
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: err
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Upgrade request failed'
        };
    }
});
router.post('/local/device/sys/reboot', async (ctx) => {
    try {
        const id = publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/sys/reboot', {});
        ctx.body = {
            code: 0,
            data: { id: id },
            msg: 'Done'
        };
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: err
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Upgrade request failed'
        };
    }
});


export default router;
