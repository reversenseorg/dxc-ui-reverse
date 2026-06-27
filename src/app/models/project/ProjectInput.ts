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

import {ValidationRule} from "../core/ValidationRule";
import {Nullable} from "../common";


export enum ProjectInputType {
    REGULAR_FILE='regular_file',
    BUFFER='buffer',
    FOLDER='folder'
}

export enum ProjectInputLocation {
    DEVICE="device",
    REMOTE="remote",
    LOCAL="local"
}

export enum ProjectInputPurpose{
    MAIN="main",
    EXTRA="extra"
}

export type ProjectInputData = any;

export interface InputExtractOptions {
    type:string;
}

export interface IProjectInput {
    data: ProjectInputData,
    location: ProjectInputLocation,
    type: ProjectInputType,
    extractOpts?: InputExtractOptions,
    purpose: ProjectInputPurpose
}

export interface ProjectInputOptions extends Record<string, any>{
    data?: ProjectInputData,
    location?: ProjectInputLocation,
    type?: ProjectInputType,
    extractOpts?: InputExtractOptions,
    purpose?: ProjectInputPurpose,
    originalName?: string
}

export class ProjectInputViewer {
    static print(pProjectInput:IProjectInput){
        return `| ${pProjectInput.purpose} | ${pProjectInput.location} | ${pProjectInput.type} | ${JSON.stringify(pProjectInput.extractOpts)} | ${pProjectInput.data} `;
    }

    static printList(pProjectInput:IProjectInput[]){
        let s = "";
        pProjectInput.map(x => s+"\n"+ProjectInputViewer.print(x));
        return s;
    }
}

export class ProjectInput implements IProjectInput{

    static VALIDATE = {
        purpose: ValidationRule.newPinklistAssert([
            ProjectInputPurpose.MAIN,
            ProjectInputPurpose.EXTRA
        ])
    };

    data: ProjectInputData;
    location: ProjectInputLocation;
    type: ProjectInputType;
    extractOpts?: InputExtractOptions = undefined;
    purpose: ProjectInputPurpose;
    originalName: Nullable<string> = null;

    constructor(pOptions:ProjectInputOptions = {}) {
        if(pOptions!=null){
            for(let i in pOptions) (this as any)[i] = (pOptions as any)[i];
        }
    }

    static from(pOptions:ProjectInputOptions):ProjectInput {
        return new ProjectInput(pOptions);
    }

    getOriginalName():Nullable<string> {
        return this.originalName;
    }

    toJsonObject():any {
        return this;
    }
}