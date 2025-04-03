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


