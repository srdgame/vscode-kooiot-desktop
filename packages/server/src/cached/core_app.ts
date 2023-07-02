'use strict';
import * as fs from 'fs';
import * as path from 'path';
import MakeDir from 'make-dir';
import Router from 'koa-router';
import { Database } from '../database';
import { downloadFile } from '../download';
import { Options } from '../options';

const router = new Router();
interface CoreApp {
    name?: any;
    description?: any;
}

async function _downloadApp(app: any) {
    const cachedFolder = path.join(Options.instance.cachedFolder, 'user_app');
    await MakeDir(cachedFolder);
    const params = {
        device: 'KOOIOT_DESKTOP_LOCAL_CACHE',
        token: 'KOOIOT_DESKTOP_LOCAL_CACHE',
        app: app.app_id,
        version: app.cache_version,
        is_core: true,
        platform: app.system?.name + "/" + app.system?.version + "/" + app.hardware?.name,
    };
    const url = Options.instance.cloudHost + "/pkg/download";
    const loadPath = path.join(cachedFolder, app.ID + "_" + params.version + ".tar.gz");
    downloadFile(url, params, loadPath, (progress) => {
        Database.instance.dbCachedExts.updateAsync({ ID: app.ID }, { $set: { progress: progress } }, {});
    }).then((filePath) => {
        console.log(`File download completed to ${filePath}`);
        Database.instance.dbCachedExts.updateAsync({ ID: app.ID }, { $set: { progress: 100, cache_path: loadPath } }, {});
    }).catch((reason) => {
        console.log(`File download failed ${reason}`);
        Database.instance.dbCachedExts.updateAsync({ ID: app.ID }, { $set: { progress: -1 } }, {});
    });
}

async function downloadApp(app: any) {
    try {
        await _downloadApp(app);
    } catch (err) {
        console.log(err);
    }
}

async function removeApp(app: any) {
    const loadPath = path.join(Options.instance.cachedFolder, app?.ID + ".zip");
    fs.rm(loadPath, ()=>{});
}

router.post('/cached/core_app/create', async (ctx) => {
    ctx.type = 'application/json';
    // TODO: Download file

    const app = await Database.instance.dbCachedExts.findAsync({ ID: ctx.request.body?.ID });
    if (app?.length > 0) {
        ctx.body = {
            code: 400,
            msg: 'Already cached',
        };
        return;
    }

    try {
        await Database.instance.dbCachedExts.insertAsync(ctx.request.body).then((value) => {
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
    } catch (reason) {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'App create Failed',
        };
    }
});

router.post('/cached/core_app/delete', async (ctx) => {
    const item = {
        ID: ctx.request.body?.ID
    };
    ctx.type = 'application/json';
    try{
        await Database.instance.dbCachedExts.removeAsync(item, {}).then( (removed) => {
            if (removed >= 0) {
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
    } catch (reason) {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'App Delete Failed',
        };
    }
});
router.put('/cached/core_app/update', async (ctx) => {
    const item = {
        ID: ctx.request.body?.ID
    };
    ctx.type = 'application/json';
    try{
        await Database.instance.dbCachedExts.updateAsync(item, ctx.request.body, {}).then( ({ numAffected }) => {
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
    } catch (reason) {
        ctx.body = {
            code: 400,
            msg: reason,
        };
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'App update Failed',
        };
    }
});
router.get('/cached/core_app/get', async (ctx) => {
    const item = {
        ID: ctx.request.query?.ID
    };
    ctx.type = 'application/json';
    try{
        await Database.instance.dbCachedExts.findAsync(item).then( (apps) => {
            if (apps.length === 1) {
                ctx.body = {
                    code: 0,
                    data: {
                        app: apps[0],
                    },
                    msg: 'Got app',
                };
            } else {
                ctx.body = {
                    code: 400,
                    msg: 'Read app Failed',
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
            msg: 'App read Failed',
        };
    }
});
router.post('/cached/core_app/find_by_id', async (ctx) => {
    const item = {
        app_id: ctx.request.body?.app_id
    };
    ctx.type = 'application/json';
    try{
        await Database.instance.dbCachedExts.findAsync(item).then( (apps) => {
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
                    msg: 'Find Failed',
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
            msg: 'App find Failed',
        };
    }
});
router.post('/cached/core_app/list', async (ctx) => {
    let item: CoreApp = {};
    if (ctx.request.body?.name) {
        item.name = { '$regex': '/' + ctx.request.body.name + '/' };
    }
    if (ctx.request.body?.description) {
        item.description = { '$regex': '/' + ctx.request.body.description + '/' };
    }
    ctx.type = 'application/json';
    try{
        // console.log(Database.instance.dbCachedExts.getAllData());
        await Database.instance.dbCachedExts.findAsync(item).then( (list) => {
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
            code: 0,
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
            msg: 'App list Failed',
        };
    }
});

export default router;