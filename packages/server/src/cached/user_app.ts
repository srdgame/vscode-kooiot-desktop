'use strict';
import * as path from 'path';
import * as fs from 'fs';
import Router from 'koa-router';
import { Database } from '../database';
import { downloadFile } from '../download';
import { Options } from '../options';

const router = new Router();

interface UserApp {
    name?: any;
    description?: any;
}

async function downloadApp(app: any) {
    const params = {
        device: 'KOOIOT_DESKTOP_LOCAL_CACHE',
        token: 'KOOIOT_DESKTOP_LOCAL_CACHE',
        app: app.app_id,
        version: app.cache_version,
    };
    const url = Options.instance.cloudHost + "/pkg/download";
    const loadPath = path.join(Options.instance.cachedFolder, app.ID + ".zip");
    downloadFile(url, params, loadPath, (progress) => {
        Database.instance.dbCachedApps.updateAsync({ ID: app.ID }, { $set: {progress: progress} }, {});
    }).then((filePath) => {
        console.log(`File download completed to ${filePath}`);
        Database.instance.dbCachedApps.updateAsync({ ID: app.ID },  { $set: { progress: 100 } }, {});
    }).catch((reason) => {
        console.log(`File download failed ${reason}`);
        Database.instance.dbCachedApps.updateAsync({ ID: app.ID },  { $set: { progress: -1 } }, {});
    });
}

async function removeApp(app: any) {
    const loadPath = path.join(Options.instance.cachedFolder, app?.ID + ".zip");
    fs.rm(loadPath, ()=>{});
}

router.post('/cached/user_app/create', async (ctx) => {
    ctx.type = 'application/json';

    const app = await Database.instance.dbCachedApps.findAsync({ ID: ctx.request.body?.ID });
    if (app?.length > 0) {
        ctx.body = {
            code: 400,
            msg: 'Already cached',
        };
        return;
    }

    await Database.instance.dbCachedApps.insertAsync(ctx.request.body).then((value) => {
        ctx.body = {
            code: 0,
            msg: 'Inserted',
        };
        // Do NOT use await, thus it blocks the post request
        downloadApp(value);
    }).catch((reason) => {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    });
});
router.post('/cached/user_app/delete', async (ctx) => {
    const item = {
        ID: ctx.request.body?.ID
    };
    ctx.type = 'application/json';
    await Database.instance.dbCachedApps.removeAsync(item, { multi: true }).then( (removed) => {
        if (removed > 0) {
            ctx.body = {
                code: 0,
                msg: 'Deleted',
            };
            removeApp(item);
        } else {
            ctx.body = {
                code: 400,
                msg: 'Deleted Failed',
            };
        }
    });
});
router.put('/cached/user_app/update', async (ctx) => {
    const item = {
        ID: ctx.request.body?.ID
    };
    ctx.type = 'application/json';
    await Database.instance.dbCachedApps.updateAsync(item, ctx.request.body, {}).then( ({ numAffected }) => {
        if (numAffected >= 0) {
            ctx.body = {
                code: 0,
                msg: 'Updated',
            };
        } else {
            ctx.body = {
                code: 400,
                msg: 'Updated Failed',
            };
        }
    });
});
router.get('/cached/user_app/get', async (ctx) => {
    const item = {
        ID: ctx.request.query?.ID
    };
    ctx.type = 'application/json';
    await Database.instance.dbCachedApps.findAsync(item).then( (apps) => {
        if (apps.length === 1) {
            ctx.body = {
                code: 0,
                data: {
                    app: apps[0],
                },
                msg: 'Got App',
            };
        } else {
            ctx.body = {
                code: 400,
                msg: 'Find app Failed',
            };
        }
    });
});
router.post('/cached/user_app/find_by_id', async (ctx) => {
    const item = {
        app_id: ctx.request.body?.app_id
    };
    ctx.type = 'application/json';
    await Database.instance.dbCachedApps.findAsync(item).then( (apps) => {
        if (apps.length === 1) {
            ctx.body = {
                code: 0,
                data: {
                    app: apps[0],
                },
                msg: 'Got App',
            };
        } else {
            ctx.body = {
                code: 400,
                msg: 'Find App Failed',
            };
        }
    });
});
router.post('/cached/user_app/list', async (ctx) => {
    let item: UserApp = {};
    if (ctx.request.body?.name) {
        item.name = { '$regex': '/' + ctx.request.body.name + '/' };
    }
    if (ctx.request.body?.description) {
        item.description = { '$regex': '/' + ctx.request.body.description + '/' };
    }
    ctx.type = 'application/json';
    await Database.instance.dbCachedApps.findAsync(item).then( (list) => {
        ctx.body = {
            code: 0,
            data: {
                list: list,
            },
            msg: 'Got List',
        };
    });
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 0,
            data: {
                list: [],
            },
            msg: 'List apps OK!'
        };
    }
});

export default router;