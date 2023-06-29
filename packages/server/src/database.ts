'use strict';
import Datastore from '@seald-io/nedb';

export class Database {
    private static _instance: Database;
    private _dbCachedApps: Datastore;
    private _dbCachedAppTpls: Datastore;
    private _dbCachedExts: Datastore;
    private _dbDevices: Datastore;

    static init(dbFolder: string) {
        Database._instance = new Database(dbFolder);
    }

    static get instance(): Database {
        return Database._instance;
    }

    constructor(dbFolder: string) {
        this._dbCachedApps = new Datastore({ filename: dbFolder + '/cached_apps.db', autoload: true });
        this._dbCachedAppTpls = new Datastore({ filename: dbFolder + '/cached_app_tpls.db', autoload: true });
        this._dbCachedExts = new Datastore({ filename: dbFolder + '/cached_exts.db', autoload: true });
        this._dbDevices = new Datastore({ filename: dbFolder + '/devices.db', autoload: true });
    }

    public get dbCachedApps() { return this._dbCachedApps; }
    public get dbCachedAppTpls() { return this._dbCachedAppTpls; }
    public get dbCachedExts() { return this._dbCachedExts; }
    public get dbDevices() { return this._dbDevices; }
}
