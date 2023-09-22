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
        if(this.hasOwnProperty(i))
          this[i] = pConfig[i];
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
    loadWorkspaceFromConfig(pDexcaliburHome:string=null, pOverride:any=null){

/*        this.workspace = DexcaliburWorkspace.getInstance( d.workspace);
        this.registry = new DexcaliburRegistry( d.registry, d.registryAPI); */
    }


    /**
     *
     * @param {Boolean} pRestore If TRUE backed up configuration is loaded,
     * @method
     */
    loadConfig( pRestore:boolean) {
        //
    }



    /**
     * To get configuration object
     * @method
     */
    getConfiguration():any{
        return this.config;
    }


    /**
     * To get Dexcalibur workspace from the current instance
     * @method
     * @return {DexcaliburWorkspace}
     */
    getWorkspace():any {
        return this.workspace;
    }

    /**
     * To get WebServer instance
     * @returns {WebServer} Web server instance
     * @method
     */
    getWebserver():any{
        return this.webserver;
    }


    /**
     * @method
     */
    getProjects():string[]{
        return this.workspace.listProjects();
    }

    /**
     * @method
     */
    getProject(pProjectUID:string):DexcaliburProject{
        if(this.active[pProjectUID] instanceof DexcaliburProject){
            return this.active[pProjectUID];
        }

        return null;
    }

    deleteProject( pUID:string):boolean{
        let success:boolean = false;

        // bind

        return success;
    }

    async openProject( pUID:string):Promise<DexcaliburProject>{
      /*
        let project:DexcaliburProject = null, success:any = false;

        try{
            await DeviceManager.getInstance().scan();

            project = DexcaliburProject.load(this, pUID);

            // init

//            project = new DexcaliburProject( this, pUID);

            DexcaliburEngine.printBanner();

            success = await project.open();
            this.active[pUID] = project;
            this.webserver.setProject(project);
        }catch(err){
            console.log(err);
            Logger.error("ENGINE"," openProject() failed");
        }
*/

        return null;
    }

    // TODO : remove platform ?
    async newProject( pUID:string, pApkPath:string, pDevice:any):Promise<DexcaliburProject>{
/*
        let project:DexcaliburProject = null;
        let success:boolean = null;

        await DeviceManager.getInstance().scan();

        //validate or suggest project UID
        if(DexcaliburProject.exists(pUID)){
            pUID = DexcaliburProject.suggests(pUID);
        }

        project = new DexcaliburProject( this, pUID);

        Logger.info('[ENGINE] Creating new project : ',pUID);
        project.init();


        DexcaliburEngine.printBanner();

        if(pDevice != null){
            project.setDevice(pDevice);
        }

        // open APK, analyze manifest
        success = await project.useAPK(pApkPath);

        // create project.json file
        if(success){
            project.save();

            this.active[pUID] = project;
            this.webserver.setProject(project);

            return project;
        }else{
            Logger.error('[ENGINE] Error : APK extraction failed.')
            return null;
        }*/
      return  null;
    }

    /**
     * To detect if Frida is installed and get version
     */
    getLocalFridaVersion():string{
      // add binbding
        return null; // return FridaHelper.getLocalFridaVersion(FRIDA_BIN);
    }

}


