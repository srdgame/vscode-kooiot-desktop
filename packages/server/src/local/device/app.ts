
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MQTTBroker } from '../../mqttBroker';
import { Database } from '../../database';

const router = new Router();

interface Device {
    name: string;
}

const publishToMQTT = (gateway: string, topic: string, data: any) => {
    const topicReal = gateway + topic;
    const payload = JSON.stringify({
        id: uuidv4(),
        data: data
    });
    MQTTBroker.instance.publish(topicReal, payload, false, 0);
};

router.post('/local/device/app/list', async (ctx) => {
    try {
        const apps :any[] = [];
        await Database.instance.dbDevices.findAsync({
            sn: ctx.request.body?.device
        }).then( (devices) => {
            if (devices.length >= 1) {
                const installedApps = devices[0].installedApps;
                for (const k in installedApps) {
                    let app = installedApps[k];
                    app.inst = k;
                    apps.push(app);
                }
            }
        });

        for(let i:number = 0; i< apps.length; i++) {
            let app = apps[i];
            if (app.version !== 0 && app.version !== '0') {
                await Database.instance.dbCachedApps.findAsync({
                    app_id: app.name
                }).then( (result) => {
                    if (result.length >= 1) {
                        app.app = result[0];
                        app.app_latest = {
                            app_id: app.name,
                            version: result[0].cache_version
                        };
                    }
                });
            }
        }
        ctx.body = {
            code: 0,
            data: {
                apps: apps,
            },
            msg: 'Got application list',
        };
    } catch (reason) {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'App List request failed'
        };
    }
});
router.post('/local/device/app/refresh', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/list', {});
        ctx.body = {
            code: 0,
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
router.post('/local/device/app/install', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/install', {
            inst: ctx.request.body?.inst,
            conf: ctx.request.body?.conf || {},
            version: ctx.request.body?.version || 'latest',
            name: ctx.request.body?.name,
        });
        ctx.body = {
            code: 0,
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
            msg: 'App install request failed'
        };
    }
});
router.post('/local/device/app/uninstall', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/uninstall', {
            inst: ctx.request.body?.inst
        });
        ctx.body = {
            code: 0,
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
            msg: 'App uninstall request failed'
        };
    }
});
router.post('/local/device/app/upgrade', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/upgrade', {
            inst: ctx.request.body?.inst,
            version: ctx.request.body?.version || 'latest',
            name: ctx.request.body?.name,
        });
        ctx.body = {
            code: 0,
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
            msg: 'App upgrade request failed'
        };
    }
});
router.post('/local/device/app/config', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/conf', {
            inst: ctx.request.body?.inst,
            conf: ctx.request.body?.conf || {},
        });
        ctx.body = {
            code: 0,
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
            msg: 'App config request failed'
        };
    }
});
router.post('/local/device/app/option', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/option', {
            inst: ctx.request.body?.inst,
            option: ctx.request.body?.option,
            value: ctx.request.body?.value,
        });
        ctx.body = {
            code: 0,
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
            msg: 'App option request failed'
        };
    }
});
router.post('/local/device/app/start', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/start', {
            inst: ctx.request.body?.inst,
            reason: ctx.request.body?.reason,
        });
        ctx.body = {
            code: 0,
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
            msg: 'App start request failed'
        };
    }
});
router.post('/local/device/app/stop', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/stop', {
            inst: ctx.request.body?.inst,
            reason: ctx.request.body?.reason,
        });
        ctx.body = {
            code: 0,
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
            msg: 'App stop request failed'
        };
    }
});
router.post('/local/device/app/restart', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/restart', {
            inst: ctx.request.body?.inst,
            reason: ctx.request.body?.reason,
        });
        ctx.body = {
            code: 0,
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
            msg: 'App restart request failed'
        };
    }
});
router.post('/local/device/app/rename', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.device, '/app/rename', {
            inst: ctx.request.body?.inst,
            new_name: ctx.request.body?.new_name,
        });
        ctx.body = {
            code: 0,
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
            msg: 'App stop request failed'
        };
    }
});
router.post('/local/device/app/query_log', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Not implemented'
        };
    }
});
router.post('/local/device/app/query_comm', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Not implemented'
        };
    }
});
router.post('/local/device/app/upload_comm', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Not implemented'
        };
    }
});

export default router;
