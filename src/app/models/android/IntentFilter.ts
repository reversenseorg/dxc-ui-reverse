import {IntentActionCriteria, IntentCategoryCriteria, IntentDataCriteria} from "./Intent";
import AndroidActivity from "./AndroidActivity";


const UID_SEPARATOR = "-";

export class IntentFilter
{
    __id:string = null;
    action:any = [];
    category:any = [];
    data:any = [];

    constructor(config:any=null){

        this.action = [];
        this.category = [];
        this.data = [];

        // auto config
        if(config != null) {
          for (let i in config)
            this[i] = config[i];

          this.configure(config);
        }

    }


    configure(pData:any):void {

      if(pData.action != null && pData.action instanceof Array){
        this.action = [];
        for(let i=0; i<pData.action.length; i++){
          this.action.push(IntentActionCriteria.from(pData.action[i]));
        }
      }


      if(pData.category != null && pData.category instanceof Array){
        this.category = [];
        for(let i=0; i<pData.category.length; i++){
          this.category.push(IntentCategoryCriteria.from(pData.category[i]));
        }
      }


      if(pData.data != null && pData.data instanceof Array){
        this.data = [];
        for(let i=0; i<pData.data.length; i++){
          this.data.push(IntentDataCriteria.from(pData.data[i]));
        }
      }
    }

    generateUID(parent):void{
       // this.__id = parent.getUID()+UID_SEPARATOR+parent.countIntentFilter();
    }

    getUid():string{
        return this.__id;
    }

    getActions():IntentActionCriteria[]{
        return this.action;
    }

    getCategories(){
        return this.category;
    }

    getData(){
        return this.data;
    }

    hasData(){
        return this.data.length > 0;
    }

    hasMultipleActions():boolean {
      return (this.action!=null) && (this.action.length > 1);
    }

    hasMultipleCategories():boolean {
      return (this.category!=null) && (this.category.length > 1);
    }

    toXmlObject(){
        let o:any = {action:[], category:[], data:[]};


        this.action.map( v => { o.action.push(v.toXmlObject()) });
        this.category.map( v => { o.category.push(v.toXmlObject()) });
        this.data.map( v => { o.data.push(v.toXmlObject()) });
        /*
        for(let i in this){
            for(let j=0; j<this[i].length; j++){
                o[i].push(this[i][j].toXmlObject());
            }
        }*/

        return o;
    }

    static from(xmlobj:any):IntentFilter{

        let intf:any = new IntentFilter();

        if(xmlobj.action != null && xmlobj.action instanceof Array){
            for(let i=0; i<xmlobj.action.length; i++){
                intf.action.push(IntentActionCriteria.from(xmlobj.action[i]));
            }
        }


        if(xmlobj.category != null && xmlobj.category instanceof Array){
            for(let i=0; i<xmlobj.category.length; i++){
                intf.category.push(IntentCategoryCriteria.from(xmlobj.category[i]));
            }
        }


        if(xmlobj.data != null && xmlobj.data instanceof Array){
            for(let i=0; i<xmlobj.data.length; i++){
                intf.data.push(IntentDataCriteria.from(xmlobj.data[i]));
            }
        }

        return intf as IntentFilter;
    }

    toXml():any{
        throw  Error('[ANDROID INTENT] toXml() is not implemented');
    }

    /**
     *
     * @param {Activity} activity
     * @returns {String} The next valid value for Intent Filter UID
     * @function
     */
    static generateIntentFilterUID(activity:AndroidActivity):string{
        return activity.getUID()+UID_SEPARATOR+activity.intentFilters.length;
    }

    toJsonObject():any{
        let o:any = new Object();

        o.__id = this.__id;

        o.data = [];
        this.data.map(x => o.data.push(x.toJsonObject()));
        o.action = [];
        this.action.map(x => o.action.push(x.toJsonObject()));
        o.category = [];
        this.category.map(x => o.category.push(x.toJsonObject()));

        return o;
    }
}
