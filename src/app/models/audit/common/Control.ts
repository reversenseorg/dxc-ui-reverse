import ControlAssessment from "./ControlAssessment";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";

export interface ControlOptions extends IStringIndex<any>{
    id?:string;
    name?:string;
    description?:string;
    links?:string[];
    children?:Control[];
    assessments?:ControlAssessment[];
}

/**
 * @class
 */
export default class Control {


    id:string;

    name:string;

    description:string;

    links:string;

    children:Control[] = [];

    assessments:ControlAssessment[] = []

    constructor( pConfig:Nullable<ControlOptions> = null) {
        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }

    hasChildren():boolean {
        return (this.children.length > 0);
    }

    hasAssessments():boolean {
        return (this.assessments.length > 0);
    }

    toJsonObject():any {
        let o:any = {
            id: this.id,
            name: this.name,
            description: this.description,
            links: this.links,
            children: [],
            assessments: []
        };

        if(this.hasChildren()){
            this.children.map(x => {
                o.children.push(x.toJsonObject())
            });
        }

        if(this.hasAssessments()){
            this.assessments.map(x => {
                o.assessments.push(x.toJsonObject())
            });
        }

        return o;
    }

    static fromJsonObject(pOpts:any):Control {
      const a = new Control(pOpts);

      let ctrls:any[] = [];
      pOpts.children.map( (x:any) => {
        ctrls.push(Control.fromJsonObject(x));
      });
      a.children = ctrls;

      ctrls = []
      pOpts.assessments.map( (x:any) => {
        ctrls.push(ControlAssessment.fromJsonObject(x));
      });
      a.assessments = ctrls;

      return a;
    }
}
