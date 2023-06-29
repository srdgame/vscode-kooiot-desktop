'use strict';
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { Secret, SecretArray } from "../freeioe/secret";
import { UserApp, ExtApp } from './dataTypes';

export class CachedUserApps extends SecretArray {
    public findByName(name: string) : UserApp | undefined {
        let list = this.value as UserApp[];
        const index = list.findIndex(item => item.name === name);
        if (index !== -1) {
            return list[index];
        }
    }
}

export class AppCached {
    private apps: CachedUserApps;
    public constructor(context: vscode.ExtensionContext) {
        this.apps = new CachedUserApps('kooiot-desktop.app_local', context);
    }
    public get userApps() { return this.apps; }

    public createNew(app: UserApp) {
        // TODO: Save app
        this.apps.add(app);
    }
}
