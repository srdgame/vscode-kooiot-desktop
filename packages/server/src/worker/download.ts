'use strict';
import * as fs from 'fs';
import { isMainThread, workerData, parentPort }  from 'worker_threads';
import axios from 'axios';

if (!isMainThread) {
    axios.get(workerData.url, {
        responseType: "stream",
        params: workerData.params,
        onDownloadProgress: function (progressEvent) {
            if (progressEvent.lengthComputable) {
                parentPort?.postMessage({ type: 'progress', value: (progressEvent.loaded / progressEvent.total) * 100 });
            }
        },
    }).then(response => {
        response.data.pipe(fs.createWriteStream(workerData.filePath));
    }).catch(error => {
        console.log(error);
    });
    parentPort?.postMessage({ type: 'done' });
} else {
    console.log('This cannot be an main thread');
}
