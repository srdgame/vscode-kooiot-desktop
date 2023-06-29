'use strict';
import * as path from 'path';
import MakeDir from 'make-dir';

export class Options {
    private static _instance: Options;
    private _srcDir: string;
    private _port: number;
    private _workPath: string;
    private _cloudHost: string;
    private _localFolder: string;
    private _cachedFolder: string;
    private _dbFolder: string;

    static async init(srcDir: string, port: number, workDir: string, cloudHost: string) {
        await MakeDir(workDir);
        Options._instance = new Options(srcDir, port, workDir, cloudHost);

        await MakeDir(Options.instance.localFolder);
        await MakeDir(Options.instance.cachedFolder);
        await MakeDir(Options.instance.dbFolder);

        return Options._instance;
    }

    static get instance(): Options {
        return Options._instance;
    }

    constructor(srcDir: string, port: number, workPath: string, cloudHost: string) {
        this._srcDir = srcDir;
        this._port = port;
        this._workPath = workPath;
        this._cloudHost = cloudHost;
        this._localFolder = path.join(workPath, "local");
        this._cachedFolder = path.join(workPath, "cached");
        this._dbFolder = path.join(workPath, "db");
    }

    public get path() { return this._srcDir; }
    public get workPath() { return this._workPath; }
    public get port() { return this._port; }
    public get cloudHost() { return this._cloudHost; }
    public get cachedFolder() { return this._cachedFolder; }
    public get localFolder() { return this._localFolder; }
    public get dbFolder() { return this._dbFolder; }
}