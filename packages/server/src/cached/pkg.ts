'use strict';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import MakeDir from 'make-dir';
import Router from 'koa-router';
import { Database } from '../database';
import { downloadFile } from '../download';
import { Options } from '../options';

const router = new Router();

interface UserApp {
    name?: any;
    description?: any;
}
router.post('/pkg/version', async (ctx) => {
    ctx.body = {
        code: 0,
        data: {
            version: 2
        },
        msg: "Pkg Version Two",
    };
});
router.get('/pkg/download', async (ctx) => {
    if (ctx.request.query?.is_core === '0' || !ctx.request.query?.is_core) {
        const apps = await Database.instance.dbCachedApps.findAsync({ app_id: ctx.request.query?.app });
        if (apps?.length > 0) {
            const app = apps[0];
            if (app.progress = 100) {
                const version = ctx.request.query?.version || app.cache_version;
                const downurl = '/cached/user_app/' + app.ID + '_' + version + ".zip";
                console.log('recirect to', downurl);
                ctx.redirect(downurl);
                ctx.status = 302;
                return;
            }
        }
    } else {
        let apps = await Database.instance.dbCachedExts.findAsync({ name: ctx.request.query?.app, platform: ctx.request.query?.platform });
        if (apps?.length > 0) {
            const app = apps[0];
            if (app.progress = 100) {
                const version = ctx.request.query?.version || app.cache_version;
                ctx.redirect('/cached/core_app/' + app.ID + '_' + version + ".zip");
                ctx.status = 302;
                return;
            }
        }
        apps = await Database.instance.dbCachedExts.findAsync({ name: ctx.request.query?.app, platform: 'any/any/any' });
        if (apps?.length > 0) {const app = apps[0];
            if (app.progress = 100) {
                const version = ctx.request.query?.version || app.cache_version;
                ctx.redirect('/cached/core_app/' + app.ID + '_' + version + ".zip");
                ctx.status = 302;
                return;
            }
        }
    }
    ctx.status = 404;
});

function fileHash(filename: string, algorithm = 'md5') {
    return new Promise((resolve, reject) => {
        // Algorithm depends on availability of OpenSSL on platform
        // Another algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
        let shasum = crypto.createHash(algorithm);
        try {
            fs.access(filename, (err) => {
                if (err) {
                    return reject('file access failed');
                }
                let s = fs.createReadStream(filename);
                s.on('data', function (data) {
                    shasum.update(data);
                });
                // making digest
                s.on('end', function () {
                    const hash = shasum.digest('hex');
                    return resolve(hash);
                });
            });
        } catch (error) {
            return reject('calc fail');
        }
    });
}

router.post('/pkg/download_hash', async (ctx) => {
    if (ctx.request.body?.is_core === '0' || !ctx.request.body?.is_core) {
        const apps = await Database.instance.dbCachedApps.findAsync({ app_id: ctx.request.body?.app });
        if (apps?.length > 0) {
            const app = apps[0];
            if (app.progress = 100) {
                const version = ctx.request.body?.version || app.cache_version;
                const filePath = path.join(Options.instance.cachedFolder, 'user_app', app.ID + "_" + version + ".zip");
                const hashAlg : any = ctx.request.body?.hash;
                await Promise.all([
                    fileHash(filePath, hashAlg).then((hash: any)=>{
                        ctx.body = {
                            code: 0,
                            data: {
                                hash: hash
                            },
                            msg: 'File hashed'
                        };
                    }).catch((reason: any) => {
                        ctx.body = {
                            code: 500,
                            msg: reason,
                        };
                    })
                ]);
                return;
            }
        }
    } else {
        let apps = await Database.instance.dbCachedExts.findAsync({ name: ctx.request.body?.app, platform: ctx.request.body?.platform });
        if (apps?.length > 0) {
            const app = apps[0];
            if (app.progress = 100) {
                const version = ctx.request.body?.version || app.cache_version;
                const filePath = path.join(Options.instance.cachedFolder, 'core_app', app.ID + "_" + version + ".tar.gz");
                const hashAlg : any = ctx.request.body?.hash;
                await Promise.all([
                    fileHash(filePath, hashAlg).then((hash: any)=>{
                        ctx.body = {
                            code: 0,
                            data: {
                                hash: hash
                            },
                            msg: 'File hashed'
                        };
                    }).catch((reason: any) => {
                        ctx.body = {
                            code: 500,
                            msg: reason,
                        };
                    })
                ]);
            }
        }
        apps = await Database.instance.dbCachedExts.findAsync({ name: ctx.request.body?.app, platform: 'any/any/any' });
        if (apps?.length > 0) {const app = apps[0];
            if (app.progress = 100) {
                const version = ctx.request.body?.version || app.cache_version;
                const filePath = path.join(Options.instance.cachedFolder, 'core_app', app.ID + "_" + version + ".tar.gz");
                const hashAlg : any = ctx.request.body?.hash;
                await Promise.all([
                    fileHash(filePath, hashAlg).then((hash: any)=>{
                        ctx.body = {
                            code: 0,
                            data: {
                                hash: hash
                            },
                            msg: 'File hashed'
                        };
                    }).catch((reason: any) => {
                        ctx.body = {
                            code: 500,
                            msg: reason,
                        };
                    })
                ]);
            }
        }
    }
    ctx.status = 404;
});
router.post('/pkg/latest_version', async (ctx) => {
    if (ctx.request.body?.is_core === '0' || !ctx.request.body?.is_core) {
        const apps = await Database.instance.dbCachedApps.findAsync({ app_id: ctx.request.body?.app });
        if (apps?.length > 0) {
            const app = apps[0];
            if (app.progress = 100) {
                ctx.body = {
                    code: 0,
                    data: {
                        version: app.cache_version
                    },
                    msg: 'Version got',
                };
                return;
            }
        }
    } else {
        let apps = await Database.instance.dbCachedExts.findAsync({ name: ctx.request.body?.app, platform: ctx.request.body?.platform });
        if (apps?.length > 0) {
            const app = apps[0];
            if (app.progress = 100) {
                ctx.body = {
                    code: 0,
                    data: {
                        version: app.cache_version
                    },
                    msg: 'Version got',
                };
                return;
            }
        }
        apps = await Database.instance.dbCachedExts.findAsync({ name: ctx.request.body?.app, platform: 'any/any/any' });
        if (apps?.length > 0) {const app = apps[0];
            if (app.progress = 100) {
                ctx.body = {
                    code: 0,
                    data: {
                        version: app.cache_version
                    },
                    msg: 'Version got',
                };
                return;
            }
        }
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'App delete Failed',
        };
    }
});
router.post('/pkg/check_version', async (ctx) => {
    if (ctx.request.body?.is_core === '0' || !ctx.request.body?.is_core) {
        const apps = await Database.instance.dbCachedApps.findAsync({ app_id: ctx.request.body?.app });
        if (apps?.length > 0) {
            const app = apps[0];
            if (app.progress = 100) {
                ctx.body = {
                    code: 0,
                    data: {
                        version: app.cache_version,
                        beta: 0
                    },
                    msg: 'Version check',
                };
                return;
            }
        }
    } else {
        let apps = await Database.instance.dbCachedExts.findAsync({ name: ctx.request.body?.app, platform: ctx.request.body?.platform });
        if (apps?.length > 0) {
            const app = apps[0];
            if (app.progress = 100) {
                ctx.body = {
                    code: 0,
                    data: {
                        version: app.cache_version,
                        beta: 0
                    },
                    msg: 'Version check',
                };
                return;
            }
        }
        apps = await Database.instance.dbCachedExts.findAsync({ name: ctx.request.body?.app, platform: 'any/any/any' });
        if (apps?.length > 0) {const app = apps[0];
            if (app.progress = 100) {
                ctx.body = {
                    code: 0,
                    data: {
                        version: app.cache_version,
                        beta: 0
                    },
                    msg: 'Version check',
                };
                return;
            }
        }
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'App delete Failed',
        };
    }
});
router.post('/pkg/conf/download', async (ctx) => {
    const tpls = await Database.instance.dbCachedAppTpls.findAsync({ ID: ctx.request.body?.conf });
    if (tpls?.length > 0) {
        const tpl = tpls[0];
        if (tpl.cache_version !== ctx.request.body?.version || ctx.request.body?.version === 'latest') {
            ctx.body = {
                code: 0,
                data: {
                    data: tpl.tpl_content,
                    version: tpl.cache_version,
                },
                msg: 'Conf download',
            };
            return;
        }
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Conf query failed',
        };
    }
});
router.post('/pkg/conf/latest_version', async (ctx) => {
    const tpls = await Database.instance.dbCachedAppTpls.findAsync({ ID: ctx.request.body?.conf });
    if (tpls?.length > 0) {
        const tpl = tpls[0];
        ctx.body = {
            code: 0,
            data: {
                version: tpl.cache_version,
            },
            msg: 'Conf download',
        };
        return;
    }
    if (ctx.body === undefined || ctx.body.code === undefined) {
        ctx.body = {
            code: 400,
            msg: 'Conf template fetch version failed',
        };
    }
});

export default router;