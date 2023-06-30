'use strict';

import * as events from 'events';
import WebSocket  from 'ws';


export interface WSMessage {
    id: number;
    code: string;
    data: any;
}

type WSCallback = (msg: WSMessage) => void;

export class FreeIOEWS extends events.EventEmitter {
    private address: string;
    private user: string;
    private password: string;
    private websocket: WebSocket | null;
    private msgId = 0;
    private callbackMap = new Map<number, WSCallback>();
    private reconnectTimer: NodeJS.Timer | null;
    private connected = false;
    private closed = false;

    // Events
    // on(event: 'message', listener: (this: WsConn, msg : WSMessage) => void): this;
    // on(event: 'console' | 'comm' | 'log', listener: (this: WsConn, data: string) => void): this;

    constructor( address: string, user: string, password: string) {
        super();
        this.address = address;
        this.user = user;
        this.password = password;
        this.reconnectTimer = null;
        this.websocket = null;
    }
    private appendOutput(content : string) {
        this.emit('console', content);
    }
    public connect() {
        if (this.websocket || this.reconnectTimer) {
            return;
        }
        const ws = new WebSocket(this.address);
        ws.on('open',  () => this.onWsOpen());
        ws.on('close', (code: number, reason: string) => this.onWsClose(code, reason));
        ws.on('error', (error: Error) => this.onWsError(error));
        ws.on('message', (data: string) => this.onWsMessage(data));
        this.websocket = ws;
    }
    public get isConnected() { return this.connected; }

    private onWsOpen() {
        this.appendOutput("WebSocket connection is ready to " + this.address);
        this.connected = true;
        if (this.websocket) {
            this.websocket.ping("hello world");
        }
    }
    private onWsClose(code: number, reason: string ) {
        this.appendOutput("WebSocket connection is closed from " + this.address);
        if (this.connected) {
            this.emit('close', code, reason);
        }
        this.connected = false;
        this.websocket = null;

        if (this.closed) {
            this.appendOutput("WebSocket connection exited!!!");
            return;
        }

        if (this.reconnectTimer) {
            this.appendOutput("WebSocket connection is reconnecting, please wait!");
            return;
        }

        this.reconnectTimer = setTimeout(async ()=>{
            this.reconnectTimer = null;
            this.appendOutput("WebSocket connection reconnect to " + this.address + " closed: " + this.closed);
            // console.log(this);
            if (!this.closed) {
                this.connect();
            }
        }, 3000);
    }
    private onWsError(error: Error) {
        this.appendOutput(`unexpected response: ${error}`);
    }
    private onWsMessage(data: string) {
        console.log('WS Recv: ' + data);
        const msg: WSMessage = Object.assign({}, JSON.parse(data));
        const func: WSCallback | undefined = this.callbackMap.get(msg.id);
        if (func !== undefined) {
            this.callbackMap.delete(msg.id);
            func(msg);
            return;
        }
        if (msg.code === 'info') {
            this.emit('info', msg.data.sn, msg.data.beta);
            this.appendOutput("Send login request...");
            this.login().then(msg => {
                this.emit('login', msg.data.result, msg.data.message);
            }, (reason) => {
                this.emit('login', false, reason);
            });
        }
        else {
            this.emit('message', msg);
        }
    }
    private sendWsMessage(code: string, data:any, callback?: WSCallback, cb?: (err: Error) => void) {
        const msgId = this.msgId++;
        if (callback !== undefined) {
            this.callbackMap.set(msgId, callback);
        }
        const msg: WSMessage = {
            id: msgId,
            code: code,
            data: data
        };
        if (!this.websocket) {
            if (cb) {
                cb(Error("Not connected!!"));
            }
            return;
        }
        console.log('WS Send: ' + JSON.stringify(msg));
        this.websocket.send(JSON.stringify(msg), {mask: true}, (err) => {
            if (err && cb) {
                cb(err);
            }
        });
    }
    private login() : Thenable<WSMessage> {
		return new Promise((c, e) => {
            const data = {
                user: this.user,
                passwd: this.password
            };
            this.sendWsMessage("login", data, (msg) => { c(msg); }, (err) => { e(err); });
        });
    }
    public switch(localAddr: string, mqttPort: number, httpPort: number) {
		return new Promise((c, e) => {
            const data = {
                cloud: localAddr,
                port: mqttPort,
                pkg: localAddr + ':' + httpPort,
                cnf: localAddr + ':' + httpPort,
            };
            this.sendWsMessage("switch_cloud", data, (msg) => { c(msg); }, (err) => { e(err); });
        });
    }

    public deviceInfo() : Thenable<WSMessage> {
        return new Promise((c, e) => {
            this.sendWsMessage("device_info", {}, (msg) => { c(msg); }, (err) => { e(err); });
        });
    }
    public close() {
        console.log('[FreeIOE WS Client] closing', this.address);
        this.closed = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        console.log('[FreeIOE WS Client] closed', this.address + " closed: " + this.closed);
        // console.log(this);
    }

    public dispose() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
}
