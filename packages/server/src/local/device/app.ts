
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import { MQTTBroker } from '../../mqttBroker';

const router = new Router();

interface Device {
    name: string;
}

router.post('/local/device/app/list', async (ctx) => {
    try {
        const topic = '/' + ctx.request.body?.device + '/app/list';
        const payload = JSON.stringify({
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/install';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst,
            conf: ctx.request.body?.conf || {},
            version: ctx.request.body?.version || 'latest',
            name: ctx.request.body?.name,
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/uninstall';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/upgrade';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst,
            version: ctx.request.body?.version || 'latest',
            name: ctx.request.body?.name,
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/conf';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst,
            conf: ctx.request.body?.conf || {},
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/option';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst,
            option: ctx.request.body?.option,
            value: ctx.request.body?.value,
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/start';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst,
            reason: ctx.request.body?.reason,
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/stop';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst,
            reason: ctx.request.body?.reason,
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/restart';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst,
            reason: ctx.request.body?.reason,
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
        const topic = '/' + ctx.request.body?.device + '/app/rename';
        const payload = JSON.stringify({
            inst: ctx.request.body?.inst,
            new_name: ctx.request.body?.new_name,
        });
        MQTTBroker.instance.publish(topic, payload, false, 0);
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
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/query_comm', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/upload_comm', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});

export default router;
