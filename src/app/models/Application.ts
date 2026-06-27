
/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {Device} from "./Device";
import DexcaliburProject from "./DexcaliburProject";

export class ApplicationBinary
{
    ctx:DexcaliburProject;

    constructor(pContext:DexcaliburProject) {
        this.ctx = pContext;
    }


    start(pDevice:Device):number{
        throw new Error('[IOS APPLICATION] "start" operation is not implemented.');
        return -1;
    }

    kill(pDevice:Device, pPID=-1):boolean{
        throw new Error('[IOS APPLICATION] "kill" operation is not implemented.');
        return false;
    }

    isRunning(pDevice:Device):boolean{
        throw new Error('[IOS APPLICATION] "isRunning" operation is not implemented.');
        return false;
    }

    getPID(pDevice:Device):number{
        throw new Error('[IOS APPLICATION] "getPID" operation is not implemented.');

        return -1;
    }
}

export default class Application
{
    app:ApplicationBinary;

    constructor(pApp:ApplicationBinary) {
        this.app = pApp;
    }

    start(pDevice:Device){
        return this.app.start(pDevice);
    }

    kill(pDevice:Device){
        return this.app.kill(pDevice);
    }

    isRunning(pDevice:Device){
        return this.app.isRunning(pDevice);
    }

    getPID(pDevice:Device){
        return this.app.getPID(pDevice);
    }
}
