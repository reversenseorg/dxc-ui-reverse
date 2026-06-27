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

import {Device} from "../../models/Device";


export type DeviceBindedData<T extends any> = T & {
    dev: Device,
    _t?:string,
    _e?:any
    [ppt:string]:any
}


export interface ProfilingOpts {
    rooted?:boolean;
}

export interface FridaInstallOpts {
    devicePath?:string;
    offline?:boolean;
    randomName?:boolean;
}

export interface EnrollmentOpts {
    frida?:FridaInstallOpts;
    profiling?:ProfilingOpts;
}