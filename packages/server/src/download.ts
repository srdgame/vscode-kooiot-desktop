'use strict';
import * as fs from 'fs';
import axios from 'axios';
import { Worker }  from 'worker_threads';
import { Options } from './options';

export function downloadFileEx(url: string, params: any, filePath: string, listener: (value: any) => void) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(Options.instance.path + '/worker/downlod.js', { workerData: {url: url, params: params, filePath: filePath} });
        worker.on('message', (value) => {
            if (value.type === 'progress') {
                listener(value);
            }
            if (value.type === 'done') {
                resolve(filePath);
            }
        });
        worker.on('error',reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopeed with exit code ${code}`));
            }
        });
    });
}

export function downloadFile(url: string, params: any, filePath: string, listener: (value: any) => void) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            responseType: "stream",
            params: params,
            onDownloadProgress: function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    listener((progressEvent.loaded / progressEvent.total) * 100);
                }
            },
        }).then(response => {
            response.data.pipe(fs.createWriteStream(filePath));
            resolve(filePath);
            // TODO: MD5 check....
        }).catch(error => {
            reject(error);
        });
    });
}
