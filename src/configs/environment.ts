'use strict';

import {normalize, resolve} from 'path';
import {state} from './state';

export class Environment {
    public isPortable: boolean = false;
    public USER_FOLDER: string = '';
    public PATH: string = '';

    constructor() {
        state.context?.globalState.update('_', undefined);

        this.isPortable = !!process.env.VSCODE_PORTABLE;

        if (!this.isPortable) {
            const fsPath = state.context?.globalStorageUri.fsPath ?? '';
            const path = resolve(fsPath, '../../..');

            this.PATH = path.concat(normalize('/'));
            this.USER_FOLDER = resolve(this.PATH, 'User').concat(normalize('/'));
        } else {
            this.PATH = process.env.VSCODE_PORTABLE ?? '';
            this.USER_FOLDER = resolve(this.PATH, 'user-data/User').concat(normalize('/'));
        }
    }
}
