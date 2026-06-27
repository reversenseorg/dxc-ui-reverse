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

/**
 *
 *
 * Boot :
 *  - Read /home/ * /.dexcalibur/config.json
 *  - If this file is not existing, then Dexcalibur starts into "install mode"
 * and import the configuration file specified by "/home/ * /.dexcalibur/config.json"
 *  - Else, Dexcalibur starts into "production mode"
 *
 *  - Init DexcaliburWorkspace
 *  - Start Dexcalibur
 *  - When the user selects or creates a project from SplashScreen, corresponding
 *  Project are loaded / created
 *
 *  @class
 */
import DexcaliburProject from "./DexcaliburProject";
import {IStringIndex} from "../base/IStringIndex";
import {Nullable} from "../base/Nullable";


export default class DexcaliburEngine
{
    /**git diff
     * Global configuration of Dexcalibur
     * @field
     */
    config:any = null;

    /**
     * Workspace of Dexcalibur.
     * By default, this workspace contains all project workspaces.
     *
     * @field
     */
    workspace:any = null;

    /**
     * Web Server
     * @field
     */
    webserver:any = null



    /**
     * Registry
     * @field
     */
    registry:any = null;

    /**
     * To hold active projects
     * @field
     */
    active:any = {};



    /**
     * To instanciate DexcaliburEngine.
     *
     * @private
     * @constructor
     */
    constructor(pConfig:any={}){
      for(let i in pConfig)

          (this as IStringIndex<any>)[i] = pConfig[i];
    }


    /**
     * To get active registry
     *
     * @returns {DexcaliburRegistry} Current active registry
     * @method
     */
    getRegistry():any{
        return this.registry;
    }



    /**
     * To load data from workspace and to init registry
     *
     * @method
     */
    loadWorkspaceFromConfig(pDexcaliburHome:Nullable<string>=null, pOverride:any=null){

/*        this.workspace = DexcaliburWorkspace.getInstance( d.workspace);
        this.registry = new DexcaliburRegistry( d.registry, d.registryAPI); */
    }


}


