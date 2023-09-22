import {TrackerInfo} from "./TrackerInfo";


const gCategories:{[name:string] :TrackerCategory} = {};

export class TrackerCategory {

    name = "";

    trackers:TrackerInfo[] = [];

    constructor(pName:string) {
        this.name = pName;
    }

    addTracker(pTracker:TrackerInfo):void {
        this.trackers.push(pTracker);
    }

    static getInstance(pName:string){
        if(gCategories[pName]==null){
            gCategories[pName] = new TrackerCategory(pName)
        }

        return gCategories[pName];
    }
}
