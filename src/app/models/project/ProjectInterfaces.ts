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

import {Nullable} from "../common";
import {ApplicationUnitUUID} from "../orgs/ApplicationUnit";
import {OrganizationUnitUUID} from "../orgs/OrganizationUnit";
import {UserAccountUUID} from "../user/UserAccount";
import {ProjectInput} from "./ProjectInput";
import {ActionDates, ProjectOrderSettings, ProjectOrderUUID} from "./ProjectOrder";
import {ProjectState} from "./ProjectState";
import {Workflow} from "../core/Workflow";


export interface ProjectOrderOptions extends Record<string,any> {
    _id?:string;
    uuid?:ProjectOrderUUID;
    slaveUID?:Nullable<string>;
    webhook?:Nullable<string>;
    settings?:ProjectOrderSettings;

    appUnit?:Nullable<ApplicationUnitUUID>;
    orgUnit?:Nullable<OrganizationUnitUUID>;
    owner?:Nullable<UserAccountUUID>;

    signatures?:Nullable<string>;

    options?:any;
    state?:Nullable<ProjectState>;
    tags?:number[];
    dates?: ActionDates;
    stateDates?: Record<string,number>;
    wf?:Workflow;

    inputs?:ProjectInput[];
}
