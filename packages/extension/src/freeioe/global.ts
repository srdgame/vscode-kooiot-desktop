'use strict';
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export interface Device {
    name: string;
    desc: string;
    host: string;
    port: number;
    cloudAuth: boolean;
    sn?: string;
    user?: string;
    password?: string;
}

export class Global {
    private static _instance: Global;

    private _deviceListUpdateInner = false;
    private _deviceListKey = 'freeioe.device_list';
    private _deviceList: Device[] = [];
    private _devicesChanged = new vscode.EventEmitter<Device[]>();
    private _authCodeUpdateInner = false;
    private _authCodeKey = 'freeioe.auth_code';
    private _authCode: string = '';
    private _authCodeChanged = new vscode.EventEmitter<string>();

    static init(context: vscode.ExtensionContext): void {
        Global._instance = new Global(context);
    }

    static get instance(): Global {
        return Global._instance;
    }

    constructor(context: vscode.ExtensionContext) {
        context.secrets.onDidChange((event: vscode.SecretStorageChangeEvent) => {
                if (event.key === this._authCodeKey) {
                    if (this._authCodeUpdateInner) {
                        return;
                    }
                    context.secrets.get(event.key).then((value) => {
                        this._authCode = value || '';
                        this._authCodeChanged.fire(this.authCode);
                    });
                }
                else if (event.key === this._deviceListKey) {
                    if (this._deviceListUpdateInner) {
                        return;
                    }
                    context.secrets.get(event.key).then((value) => {
                        this._deviceList = JSON.parse(value || '[]');
                        this._devicesChanged.fire(this.devices);
                    });
                }
            },
            undefined,
            context.subscriptions
        );
        context.secrets.get(this._authCodeKey).then((value) => {
            this._authCode = value || '';
            this._authCodeChanged.fire(this.authCode);
        });
        context.secrets.get(this._deviceListKey).then((value) => {
            this._deviceList = JSON.parse(value || '[]');
            this._devicesChanged.fire(this.devices);
        });
        this.onDevicesChanged(async (devices: Device[]) => {
            this._deviceListUpdateInner = true;
            await context.secrets.store(this._deviceListKey, JSON.stringify(devices)).then(()=>{
                this._deviceListUpdateInner = false;
            });
        });
        this.onAuthCodeChanged(async (key: string) => {
            this._authCodeUpdateInner = true;
            await context.secrets.store(this._authCodeKey, key).then(()=>{
                this._deviceListUpdateInner = false;
            });
        });
    }

    public get devices() { return this._deviceList; }
    public get authCode() { return this._authCode; }
    public get onDevicesChanged() { return this._devicesChanged.event; }
    public get onAuthCodeChanged(){ return this._authCodeChanged.event; }

    public getDevice(name: string) {
        return this._deviceList.find(item => item.name === name);
    }
    public addDevice(device: Device) {
        this._deviceList.push(device);
        this._devicesChanged.fire(this.devices);
    }
    public removeDevice(name: string) {
        const index = this._deviceList.findIndex(item => item.name === name);
        if (index !== -1) {
            this._deviceList.splice(index, 1);
            this._devicesChanged.fire(this.devices);
        }
    }
    public udpateDevice(device: Device) {
        const index = this._deviceList.findIndex(item => item.name === device.name);
        if (index !== -1) {
            this._deviceList[index] = device;
            this._devicesChanged.fire(this.devices);
        }
    }
    public udpate(devices: Device[]) {
        this._deviceList = devices;
        this._devicesChanged.fire(this.devices);
    }
}
