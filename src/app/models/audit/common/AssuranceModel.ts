import Asset from "./Asset";
import Threat from "./Threat";
import Control from "./Control";
import ControlAssessment from "./ControlAssessment";
import {IStringIndex} from "../../../base/IStringIndex";

export enum AssuranceModelType {
    SECURITY="sec",
    PRIVACY="pri",
    ECOLOGY="eco",
    QUALITY="qua",
}


export default class AssuranceModel {


    /**
     * Unique identifier for the model
     */
    id:string;

    /**
     * ID of the scanner able to verify this model
     *
     */
    scannerID:string;

    name:string;

    description = "";

    links: string[] = [];

    /**
     * The assurance model source helps to differenciate
     * who create the models
     *
     * @type {AssuranceModelSource}
     */
    generic = true;

    primaryAssets:Asset[] = [];

    secondaryAssets:Asset[] = [];

    globalThreats:Threat[] = [];


    controls:Control[] = [];

    protected _ready = false;


    constructor( pConfig:any = null) {
        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }

    static fromJsonObject(pOpts:any):AssuranceModel {
      const a = new AssuranceModel(pOpts);

      pOpts.globalThreats.map( (x:Threat,i:number) => {
        a.globalThreats[i] = new Threat(x);
      });

      pOpts.primaryAssets.map( (x:Asset,i:number) => {
        a.primaryAssets[i] = new Asset(x);
      });

      pOpts.secondaryAssets.map( (x:Asset,i:number) => {
        a.secondaryAssets[i] = new Asset(x);
      });

      const ctrls:Control[] = [];
      pOpts.controls.map( (x:Control) => {
        ctrls.push(Control.fromJsonObject(x));
      });
      a.controls = ctrls;

      return a;
    }

    /**
     * @method
     */
    getID():string {
        return this.id;
    }

    getScannerID():string {
        return  this.scannerID;
    }

    getThreats():Threat[] {
        return this.globalThreats;
    }

    getPrimaryAssets():Asset[] {
        return this.primaryAssets;
    }
    getSecondaryAssets():Asset[] {
        return this.secondaryAssets;
    }

    load():void {
        return ;
    }

    /**
     * To check if the model is ready to be consumed by the scanner
     *
     * @return {boolean}
     * @method
     */
    isReady():boolean {
        return this._ready;
    }


    toJsonObject():any {
        const o:any = {};

        o.id = this.id;
        o.name = this.name;
        o.description = this.description;
        o.scannerID = this.scannerID;
        o.generic = this.generic;
        o.links = this.links;

        o.controls = [];
        this.controls.map( x => {
            o.controls.push(x.toJsonObject());
        })
        o.globalThreats = [];
        this.globalThreats.map( x => {
            o.globalThreats.push(x.toJsonObject());
        });
        o.primaryAssets = [];
        this.primaryAssets.map( x => {
            o.primaryAssets.push(x);//.toJsonObject());
        });
        o.secondaryAssets = [];
        this.secondaryAssets.map( x => {
            o.secondaryAssets.push(x);//.toJsonObject());
        });

        return o;
    }

    isGeneric():boolean {
        return this.generic;
    }
}
