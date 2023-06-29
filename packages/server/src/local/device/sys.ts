
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';

const router = new Router();

interface Device {
    name: string;
}

router.post('/local/device/sys/switch_cloud', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
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
