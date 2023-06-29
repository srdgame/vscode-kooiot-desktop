
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';

const router = new Router();

interface Device {
    name: string;
}

router.post('/local/device/data/fire_snapshot', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/data/fire_query', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/data/fire_flush', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/data/send_output', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/data/send_command', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/data/action_result', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});

export default router;
