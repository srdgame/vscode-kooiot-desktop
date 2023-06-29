
'use strict';
import Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';

const router = new Router();

interface Device {
    name: string;
}

router.post('/local/device/app/list', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: { list: [] },
            msg: 'Device List'
        };
    }
});
router.post('/local/device/app/refresh', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Failed to delete device'
        };
    }
});
router.post('/local/device/app/install', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/uninstall', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/upgrade', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/config', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/option', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/start', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/stop', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/restart', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
        };
    }
});
router.post('/local/device/app/rename', async (ctx) => {
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.type = 'application/json';
        ctx.body = {
            code: 400,
            msg: 'Failed to create device'
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
