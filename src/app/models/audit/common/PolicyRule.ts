
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

export enum PolicyRuleCondition {
    NEWOCC= 'newocc', // new occurence
    NEWOCC_SINCE = "newocc_since",
    NEWOCC_RELEASE_CTR = "newocc_relctr",
    DEFECT_SINCE = "defect_since",
    DEFECT_RELEASE_CTR = "defect_relctr",
    REMOVED= 'removed',
    REMOVED_RELEASE_CTR= 'removed_relctr',
    REMOVED_SINCE= 'removed_since',
    CRITICITY= 'criticity',
    RISK= 'risk',
}

export interface Threshold {

}

export enum ActionType {
    SEND_EMAIL='send:email',
    REPORT_WARNING='report:warning'
}


export interface PolicyAction {
    type: string;
    name?:string;
    description?:string;
    opts: Record<string, any>;
    modified?:boolean;
}

export interface PolicyRuleOptions {
    id?:string;
    name?:string;
    description?:string;
    version?:string;
    enabled?:boolean;
    control?: string/*ControlNodeCanonicalUID*/[];
    condition?: PolicyRuleCondition;
    thresholds?: Threshold[];
    actions?:PolicyAction[];
}

/**
 *
 * @class
 */
export class PolicyRule {


    id:string;
    // COMMON

    name:string;

    description:string;

    version:string;

    enabled = false;

    // RULE

    control: string/*ControlNodeCanonicalUID*/[] = [];

    condition: PolicyRuleCondition;

    thresholds: any[] = [];

    actions: PolicyAction[] = [
        { type:ActionType.SEND_EMAIL, opts:{} }
    ];



    constructor(pOptions:PolicyRuleOptions = {}) {
        if(pOptions.id!=null) this.id = pOptions.id;
        if(pOptions.name!=null) this.name = pOptions.name;
        if(pOptions.description!=null) this.description = pOptions.description;
        if(pOptions.version!=null) this.version = pOptions.version;
        if(pOptions.enabled!=null) this.enabled = pOptions.enabled;
        if(pOptions.control!=null) this.control = pOptions.control;
        if(pOptions.condition!=null) this.condition = pOptions.condition;
        if(pOptions.thresholds!=null) this.thresholds = pOptions.thresholds;
        if(pOptions.actions!=null) this.actions = pOptions.actions;
    }


    /**
     * To prepare to json serialized
     *
     * @method
     */
    toJsonObject():any{
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            version: this.version,
            enabled: this.enabled,
            control: this.control,
            condition: this.condition,
            thresholds: this.thresholds,
            actions: this.actions,
        };
    }

    static fromUnsafeObject(pOptions:PolicyRuleOptions) {
        return new PolicyRule(pOptions);
    }
}