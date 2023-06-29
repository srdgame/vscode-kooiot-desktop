// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import { TextEncoder } from "util";

export function prepareWebView(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        "kooiotDesktop",
        "KooIoT Desktop",
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(
                    path.join(context.extensionPath, "vue-dist", "assets")
                ),
                context.globalStorageUri
            ],
        }
    );

    const dependencyNameList: string[] = [
        "index.css",
        "index.js",
        "vendor.js",
        "logo.png",
    ];
    const dependencyList: vscode.Uri[] = dependencyNameList.map((item) =>
        panel.webview.asWebviewUri(
            vscode.Uri.file(
                path.join(context.extensionPath, "vue-dist", "assets", item)
            )
        )
    );
    const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script>
        const vscode = acquireVsCodeApi();

        const oldState = vscode.getState();

        window.localStorage.clear()
        for (var key in oldState) {
            window.localStorage.setItem(key, oldState[key])
        }

        setInterval(() => {
            var newState = {}
            for (var i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                newState[key] = localStorage.getItem(key)
            }
            // Update state
            vscode.setState(newState)
        }, 1000);

        // Handle messages sent from the extension to the webview
        window.addEventListener('message', event => {
            const message = event.data; // The json data that the extension sent
            switch (message.command) {
                case 'localStorage.setItem':
                    {
                        window.localStorage.setItem(message.key, message.value)
                        break;
                    }
                case 'localStorage.getItem':
                    {
                        var value = window.localStorage.getItem(key)
                        vscode.postMessage({command:'localStorage.getItem', key: key, value: value})
                        break;
                    }
            }
        });
    </script>
    <script type="module" crossorigin src="${dependencyList[1]}"></script>
    <link rel="modulepreload" href="${dependencyList[2]}">
    <link rel="stylesheet" href="${dependencyList[0]}">
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
  `;
    panel.webview.html = html;
    return panel;
}