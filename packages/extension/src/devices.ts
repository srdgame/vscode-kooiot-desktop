'use strict';
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { Global, Device } from "./freeioe/global";

export class Devices {
    private configFilePath: string;
    private propertiesFile: vscode.Uri|undefined|null = undefined;
    private configFileWatcher: vscode.FileSystemWatcher|undefined = undefined;
    private disposables: vscode.Disposable[] = [];
    private updateInner = false;
    public constructor(workDir: string) {
        this.configFilePath = path.join(workDir, 'freeioe.devices.json');
    }
    public launch(context: vscode.ExtensionContext): void {

        this.configFileWatcher = vscode.workspace.createFileSystemWatcher(this.configFilePath);
        this.disposables.push(this.configFileWatcher);
        this.configFileWatcher.onDidCreate((uri) => {
            this.propertiesFile = uri;
            this.handleConfigurationChange();
        });

        this.configFileWatcher.onDidDelete(() => {
            this.propertiesFile = undefined;
            this.resetToDefaultSettings();
        });

        this.configFileWatcher.onDidChange(() => {
            this.handleConfigurationChange();
        });

        this.resetToDefaultSettings();
        Global.instance.onDevicesChanged((devices) => {
            if (!this.updateInner) {
                try {
                    fs.accessSync(this.configFilePath);
                    fs.writeFileSync(this.configFilePath, JSON.stringify(devices, null, 4), 'utf8');
                } catch (err) {
                    vscode.window.showErrorMessage('Cannot write devices file');
                }
            }
        });
    }

    resetToDefaultSettings() {
        const devices = Global.instance.devices;
        try {
            fs.accessSync(this.configFilePath);
            fs.writeFileSync(this.configFilePath, JSON.stringify(devices, null, 4), 'utf8');
            // this.propertiesFile = vscode.Uri.file(this.configFilePath); will be set in onDidCreate
        } catch (err) {
            vscode.window.showErrorMessage('Cannot write devices file');
        }
    }
    handleConfigurationChange() {
        if (this.propertiesFile === undefined) {
            return;
        }
        this.parsePropertiesFile();
    }
    private parsePropertiesFile(): boolean {
        if (!this.propertiesFile) {
            return false;
        }
        let success = true;
        try {
            const readResults: string = fs.readFileSync(this.propertiesFile.fsPath, 'utf8');
            if (readResults === "") {
                return false; // Repros randomly when the file is initially created. The parse will get called again after the file is written.
            }

            // Try to use the same configuration as before the change.
            const devices: Device[] = JSON.parse(readResults);
            if (devices) {
                this.updateInner = true;
                Global.instance.udpate(devices);
                this.updateInner = false;
            }
        } catch (err) {
            success = false;
        }

        return success;
    }
}
