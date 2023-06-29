// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import { TextEncoder } from "util";
import { prepareWebView } from "./webview";
import { Server } from './server';

let server: Server;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        'Congratulations, your extension "vue-3-vscode-webview" is now active!'
    );

    server = new Server();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let open = vscode.commands.registerCommand(
        `kooiot-desktop.open`,
        () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage(
                "Opening KooIoT Desktop view!"
            );

            // Launch server
            server.launch(context);

            const panel = prepareWebView(context);

            panel.webview.onDidReceiveMessage(
                async ({ message }) => {
                    vscode.window.showInformationMessage(message);
                },
                undefined,
                context.subscriptions
            );
        }
    );
    let start = vscode.commands.registerCommand(
        `kooiot-desktop.start`,
        () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage(
                "Start KooIoT Desktop backgroup!"
            );

            // Launch server
            server.launch(context);
        }
    );
    context.subscriptions.push(open);
    context.subscriptions.push(start);
}

// this method is called when your extension is deactivated
export function deactivate() {

}
