'use strict';
import * as fs from 'fs';
import axios from 'axios';
import { Options } from './options';
import { Database } from './database';
import Aedes from 'aedes';
import AedesServerFactory from 'aedes-server-factory';

const topicRegex = new RegExp('^([^/]+)/([^/]+)(.*)$');

export class MQTTBroker {
    private static _instance: MQTTBroker;
    private _broker: Aedes | undefined;

    static init(port: number, wsPort: number) {
        MQTTBroker._instance = new MQTTBroker();
        MQTTBroker._instance.startBroker(port, wsPort);
    }

    static get instance(): MQTTBroker {
        return MQTTBroker._instance;
    }

    public startBroker(port: number, wsPort: number) {
        const aedes = new Aedes();
        const server = AedesServerFactory.createServer(aedes);
        const wsServer = AedesServerFactory.createServer(aedes, {ws: true});

        server.listen(port, function () {
            console.log('MQTT started and listening on port ', port);
        });

        wsServer.listen(wsPort, function () {
            console.log('MQTT-WS started and listening on port ', wsPort);
        });


        aedes.on('client', (client) => {
            console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id);
        });
        aedes.on('clientDisconnect', (client) => {
            console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id);
        });
        aedes.on('publish', function(packet, client) {
            const groups = topicRegex.exec(packet.topic);
            if (!groups) {
                console.log('Topic match error', packet.topic);
                return;
            }
            const gateway = groups[1];
            const msgTopic = groups[2];
            if (msgTopic === 'status') {
                console.log('Device status', gateway, packet.payload.toString());
                const online = packet.payload.toString() === 'ONLINE';
                Database.instance.dbDevices.updateAsync({sn: gateway}, { $set: {online: online, online_time: new Date().getTime()} }, {upsert: true}).then( ({ numAffected }) => {
                    if (numAffected <= 0) {
                        console.log('Device updated Failed!!!');
                    }
                });
            } else if(msgTopic === 'result') {
                console.log('Device result', groups[3], packet.payload.toString());
                // TODO: Save the result for action
            }
        });
        this._broker = aedes;
    }
    public publish(topic: string, payload: string, retain: boolean, qos: 0 | 1 | 2) {
        if (this._broker === undefined) {
            return false;
        }
        this._broker.publish({
            topic: topic,
            payload: payload,
            retain: retain,
            cmd: 'publish',
            qos: qos,
            dup: true
        }, (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("publish done", topic, payload);
            }
        });
    }
}
