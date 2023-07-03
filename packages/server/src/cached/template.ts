'use strict';
import Router from 'koa-router';
import { Database } from '../database';

const router = new Router();

interface Template {
    name?: any;
    description?: any;
}

router.post('/cached/template/create', async (ctx) => {
    ctx.type = 'application/json';
    const app = await Database.instance.dbCachedAppTpls.findAsync({ ID: ctx.request.body?.ID });
    if (app?.length > 0) {
        ctx.body = {
            code: 400,
            msg: 'Already cached',
        };
        return;
    }
    try {
        await Database.instance.dbCachedAppTpls.insertAsync(ctx.request.body).then((value) => {
            ctx.body = {
                code: 0,
                msg: 'Inserted',
            };
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
            msg: 'template insert Failed',
        };
    }
});
router.post('/cached/template/delete', async (ctx) => {
    ctx.type = 'application/json';
    const item = {
        ID: ctx.request.body?.ID
    };
    try {
        await Database.instance.dbCachedAppTpls.removeAsync(item, {}).then( (removed) => {
            if (removed >= 0) {
                ctx.body = {
                    code: 0,
                    msg: 'Deleted',
                };
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
            msg: 'template delete Failed',
        };
    }
});
router.put('/cached/template/update', async (ctx) => {
    const item = {
        ID: ctx.request.body?.ID
    };
    ctx.type = 'application/json';
    try {
        await Database.instance.dbCachedAppTpls.updateAsync(item, ctx.request.body, {}).then( ({ numAffected }) => {
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
            msg: 'template update Failed',
        };
    }
});
router.get('/cached/template/get', async (ctx) => {
    const id : any = ctx.request.query.ID;
    const item = {
        ID: parseInt(id)
    };
    ctx.type = 'application/json';
    try {
        await Database.instance.dbCachedAppTpls.findAsync(item).then( (tpls) => {
            if (tpls.length === 1) {
                ctx.body = {
                    code: 0,
                    data: {
                        template: tpls[0],
                    },
                    msg: 'Get template',
                };
            } else {
                ctx.body = {
                    code: 400,
                    msg: 'Get Failed',
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
            msg: 'template get Failed',
        };
    }
});
router.get('/cached/template/latest', async (ctx) => {
    const id : any = ctx.request.query.ID;
    const item = {
        ID: parseInt(id)
    };
    ctx.type = 'application/json';
    try {
        await Database.instance.dbCachedAppTpls.findAsync(item).then( (tpls) => {
            if (tpls.length === 1) {
                ctx.body = {
                    code: 0,
                    data: {
                        version: {
                            template_id: item.ID,
                            version: tpls[0].cache_version,
                            content: tpls[0].tpl_content,
                        }
                    },
                    msg: 'Get latest template',
                };
            } else {
                ctx.body = {
                    code: 400,
                    msg: 'Get latest  Failed',
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
            msg: 'template latest get Failed',
        };
    }
});
router.post('/cached/template/list', async (ctx) => {
    let item: Template = {};
    if (ctx.request.body?.name) {
        item.name = { '$regex': '/' + ctx.request.body.name + '/' };
    }
    if (ctx.request.body?.description) {
        item.description = { '$regex': '/' + ctx.request.body.description + '/' };
    }
    ctx.type = 'application/json';
    try {
        await Database.instance.dbCachedAppTpls.findAsync(item).then( (list) => {
            ctx.body = {
                code: 0,
                data: {
                    list: list,
                },
                msg: 'List templates OK!',
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
            msg: 'List templates OK!'
        };
    }
});

export default router;