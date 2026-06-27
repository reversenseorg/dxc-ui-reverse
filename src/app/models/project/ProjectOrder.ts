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

import {ProjectInput, ProjectInputPurpose} from "./ProjectInput";
import {ProjectState} from "./ProjectState";
import {ProjectOrderOptions} from "./ProjectInterfaces";
import {DeviceUUID} from "../../models/Device";
import {OperatingSystem} from "../../models/OperatingSystem";
import {NodeInternalType} from "../../models/NodeInternalType";
import {Nullable} from "@antfu/utils";
import {ApplicationUnitUUID} from "../../models/ApplicationUnit";
import {OrganizationUnitUUID} from "../../models/orgs/OrganizationUnit";
import {UserAccountUUID} from "../../models/user/UserAccount";
import {Workflow} from "../core/Workflow";


export enum ACTION_DATE {
    START="start",
    STOP="stop",
    PAUSE="pause",
    ORDER="order",
    WAITING="waiting",
}


export interface ActionDates {
    start:number;
    stop:number;
    pause?:number;
    order?:number;
    waiting?:number;
}

export enum NewProjectFlowType {
    SELECT='select',
    UPLOAD='upload',
    DOWNLOAD='download',
    FROMFS='fromfs'
}

export interface NewProjectCommonWfOpts {
    uid?:string,
    inputs?: ProjectInput[],
    projectName?: string,
    deviceUID?: DeviceUUID,
    platformUID?: string,
    analyzerOpts?: any,
    targetOS?:OperatingSystem
}

export interface NewProjectSelectWfOptions extends NewProjectCommonWfOpts{
    flowType: NewProjectFlowType.SELECT,
    remotePath: string
}

export interface InputTemplate {
    uploadID: string,
    purpose: ProjectInputPurpose
}

export interface NewProjectUploadWfOptions extends NewProjectCommonWfOpts{
    flowType: NewProjectFlowType.UPLOAD,
    uploadUID: string[],
    inputTpls: InputTemplate[]
}

export interface NewProjectDownloadWfOptions extends NewProjectCommonWfOpts{
    flowType: NewProjectFlowType.DOWNLOAD,
    url: string
}

export interface NewProjectFromfsWfOptions extends NewProjectCommonWfOpts{
    flowType: NewProjectFlowType.FROMFS,
    localPath: string
}


export type NewProjectWorkflowOptions = NewProjectFromfsWfOptions
    | NewProjectDownloadWfOptions
    | NewProjectUploadWfOptions
    | NewProjectSelectWfOptions;


export interface ProjectOrderSettings {
    projectUID?: string;
    options?:NewProjectWorkflowOptions
}

export type ProjectOrderUUID = string;


/**
 * Represent an order to load/analyse a package (create a new project) with a specified
 * configuration.
 *
 * 1/ The cost of ProjectOrder is validated by extracting the Package Identifier and
 * checking if :
 * - current organization has a subscription plan and
 *      - An application unit already exists with this package identifier
 *      - The subscription allow the organization to create new application
 * - current organization has a scan plan and
 *      - enough credit to scan a new package
 *
 * The LicenseManager validates such request, sign it and emit AuthorizationToken
 *
 * 2/ ProjectOrder are pushed into global scan queue of the master server (queue is backed up)

 * 3/ If there is not slave node engine already up for the target project,
 * the project scheduler generate an unique webhook and spawn the slave node
 * with project order and webhook URL as parameters.
 *
 * 4/ The master receive WorkflowUUID to follow ProjectState
 *
 *
 * @class
 */
export class ProjectOrder {

    __:NodeInternalType = NodeInternalType.PROJECT_ORDER;

    uuid:Nullable<ProjectOrderUUID> = null;


    settings:ProjectOrderSettings;

    signatures:Nullable<string> = null;


    options:any = {};

    state:ProjectState = ProjectState.NONE;


    appUnit?:Nullable<ApplicationUnitUUID>;

    orgUnit?:Nullable<OrganizationUnitUUID>;

    owner:Nullable<UserAccountUUID> = null;

    /**
     * To store dates state switch
     * @field
     */
    stateDates:Record<string,number> = {};

    wf:Workflow;

    tags:number[] = [];

    dates: ActionDates;

    inputs:ProjectInput[] = [];

    constructor(pOptions:ProjectOrderOptions) {
        if(pOptions!=null){
            for(let i in pOptions) (this as any)[i] = pOptions[i];
        }
    }
}