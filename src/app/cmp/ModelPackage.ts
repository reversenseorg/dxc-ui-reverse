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

import {Nullable} from "../base/Nullable";
import DataScope from "../models/DataScope";
import ModelResource from "../models/ModelResource";
import ModelClass from "../models/ModelClass";
import ModelMetadata from "../models/ModelMetadata";
import {NodeInternalType} from "../models/NodeInternalType";

export class ModelPackage {


    __:NodeInternalType = NodeInternalType.PACKAGE;

    _t:Nullable<string> = null;

    /**
     * Package name
     *
     * @type {String}
     * @field
     */
    name:string;

    /**
     * Package simple name
     */
    sname:string;

    /**
     * Package metadata
     * @type {String}
     * @field
     */
    meta:Nullable<ModelMetadata> = null;

    /**
     * Package children
     * @type {Class[]|ModelPackage[]}
     * @field
     */
    children:(ModelPackage|ModelClass|ModelResource<any>)[] = [];

    /**
     * Tags
     * @type {string|number|Tag}
     * @field
     */
    tags:number[] = [];

    /**
     * Alias
     * @type {string}
     * @field
     */
    alias:Nullable<string> = null;

    scope:Nullable<DataScope> = null;

    size:number = 0;
    absolute_size:number;
}
