
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MQTTBroker } from '../../mqttBroker';

const router = new Router();

interface Device {
    name: string;
}

const publishToMQTT = (gateway: string, topic: string, data: any) => {
    if (gateway.length === 0) {
        console.log('publishToMQTT', "Gateway cannot be empty!");
        return;
    }
    if (topic.length === 0) {
        console.log('publishToMQTT', "Topic cannot be empty!");
        return;
    }
    const topicReal = gateway + topic;
    const payload = JSON.stringify({
        id: uuidv4(),
        data: data
    });
    console.log('Publish:', topicReal, payload);
    MQTTBroker.instance.publish(topicReal, payload, false, 0);
};

router.post('/local/device/data/action_result', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Not implemented'
        };
    }
});
router.post('/local/device/data/send_output', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/output', {
            device: ctx.request.body?.device,
            output: ctx.request.body?.output,
            prop: ctx.request.body?.prop,
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
            msg: 'App stop request failed'
        };
    }
});
router.post('/local/device/data/send_command', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/command', {
            device: ctx.request.body?.device,
            command: ctx.request.body?.output,
            param: ctx.request.body?.param,
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
router.post('/local/device/data/send_command', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/command', {
            device: ctx.request.body?.device,
            command: ctx.request.body?.output,
            param: ctx.request.body?.param,
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

router.post('/local/device/data/fire_snapshot', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/sys/data/snapshot', {});
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
router.post('/local/device/data/fire_query', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/sys/data/query', ctx.request.body?.device);
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
router.post('/local/device/data/fire_flush', async (ctx) => {
    try {
        publishToMQTT(ctx.request.body?.gateway || ctx.request.body?.device, '/sys/data/flush', {});
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


export default router;
