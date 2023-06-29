'use strict';
import * as vscode from "vscode";


export class Secret {
    private _updateInner = false;
    private _secretKey = '';
    private _secretChanged = new vscode.EventEmitter<string|undefined>();
    private _secretValue: string | undefined = undefined;
    private context: vscode.ExtensionContext;

    public constructor(secretKey: string, context: vscode.ExtensionContext) {
        this._secretKey;
        this.context = context;
        context.secrets.onDidChange((event: vscode.SecretStorageChangeEvent) => {
                if (event.key === this._secretKey) {
                    if (this._updateInner) {
                        return;
                    }
                    context.secrets.get(event.key).then((value) => {
                        this._secretChanged.fire(value);
                    });
                }
            },
            undefined,
            context.subscriptions
        );
        context.secrets.get(this._secretKey).then((value) => {
            this._secretValue = value;
            this._secretChanged.fire(value);
        });
    }

    public get value() { return this._secretValue; }
    public get onSecretChanged() { return this._secretChanged.event; }
    public async setValue(value: string | undefined) {
        this._updateInner = true;
        this._secretValue = value;
        if (this._secretValue !== undefined) {
            await this.context.secrets.store(this._secretKey, this._secretValue);
        } else {
            await this.context.secrets.delete(this._secretKey);
        }
        this._updateInner = false;
    }
}

export interface ArrayItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ID: number
}

export class SecretArray {
    private _secret: Secret;
    private _value: ArrayItem[] = [];
    public constructor(key: string, context: vscode.ExtensionContext) {
        this._secret = new Secret(key, context);
        this.onValue(this._secret.value);
        this._secret.onSecretChanged((value) => this.onValue(value));
    }
    private onValue(value: string | undefined) {
        this._value = JSON.parse(value || '[]') || [];
    }

    public get value() { return this._value; }
    public list() { return this._value; }

    public get(id: number) {
        return this._value.find(item => item.ID === id);
    }
    public add(item: ArrayItem) {
        this._value.push(item);
        this._secret.setValue(JSON.stringify(this._value));
    }
    public remove(id: number | ArrayItem) {
        let index = -1;
        if ( typeof(id) === 'number') {
            index = this._value.findIndex(item => item.ID === id);
        } else {
            index = this._value.findIndex(item => item.ID === id.ID);
        }
        if (index !== -1) {
            this._value.splice(index, 1);
            this._secret.setValue(JSON.stringify(this._value));
        }
    }
    public update(updated: ArrayItem) {
        const index = this._value.findIndex(item => item.ID === updated.ID);
        if (index !== -1) {
            this._value[index] = updated;
            this._secret.setValue(JSON.stringify(this._value));
        }
    }
}
