'use strict';
import * as vscode from "vscode";
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as path from "path";
import * as fs from "fs";
import { Devices } from "./devices";

interface ServerOption {
    port: number;
    workDir: string;
}

export class Server {
    private process: ChildProcessWithoutNullStreams | undefined;
    private runningStatus: vscode.Disposable | undefined;
    private outputChannel: vscode.OutputChannel | undefined;
    private devices: Devices | undefined;

    public launch(context: vscode.ExtensionContext): void {
        if (this.outputChannel) {
            return;
        }

        let outputChannel  = vscode.window.createOutputChannel('KooIoT-Desktop-Server');
        this.outputChannel = outputChannel;

        const config = vscode.workspace.getConfiguration('kooiot-desktop.server');
        // test for running process
        if (this.runningStatus) {
            vscode.window.showErrorMessage('Process is already running!');
            return;
        }

        const serverFile = vscode.Uri.file(
            path.join(context.extensionPath, "server-dist", "assets")
        ).fsPath;

        // get config params object
        const options: ServerOption = {
            port: 6108,
            workDir: path.join(context.globalStorageUri.fsPath, 'kooiot-desktop')
        };
        if (config.port) {
            options.port = config.port;
        }
        if (config.workDir) {
            options.workDir = config.workDir;
        }
        this.devices = new Devices(options.workDir);
        this.devices.launch(context);

        const startTime = new Date();

        this.runningStatus = vscode.window.setStatusBarMessage('Running...');

        outputChannel.show(true);

        outputChannel.clear();
        outputChannel.appendLine('Info: Start process (' + startTime.toLocaleTimeString() + ')');

        // spawn new node.js process
        let process = spawn('node', [serverFile, options.port.toString(), options.workDir], {});
        this.process = process;

        let self = this;
        // process event handlers
        process.stdout.on('data', function (data) {
            if (!config.showStdout)
                {return;}
            outputChannel.append(data.toString());
        });
        process.stderr.on('data', function (data) {
            outputChannel.appendLine('Error: ');
            outputChannel.appendLine(data.toString());
        });
        process.on('close', function () {
            if (self.runningStatus) {
                if (config.showInfo) {
                    outputChannel.appendLine('Info: Execution time ' + (new Date().getTime() - startTime.getTime()) + ' seconds');
                }
                self.runningStatus.dispose();
                self.runningStatus = undefined;
            }
        });
        process.on('error', (processError) => {
            outputChannel.appendLine('Process error: ')
            outputChannel.appendLine(processError.toString())
            if (config.showInfo) {
                outputChannel.appendLine('Info: End process with errors! Execution time ' + (new Date().getTime() - startTime.getTime()) + ' seconds');
            }
            if (self.runningStatus) {
                self.runningStatus.dispose();
                self.runningStatus = undefined;
            }
        });
    }
}
