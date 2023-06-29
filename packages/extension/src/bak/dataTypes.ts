/* eslint-disable @typescript-eslint/naming-convention */
'use strict';

export interface UserApp {
    ID: number;
    app_id: string;
    name: string;
    description: string;
    user_id: number;
    download: number;
    watch: number;
}

export interface ExtApp {
    ID: number;
    app_id: string;
    name: string;
    description: string;
    user_id: number;
    download: number;
    watch: number;
}
