
import {Injectable} from "@angular/core";
import {ControllerService} from "../controller.service";


@Injectable()
export class ViewportResolver {

    constructor( private _ctrlSvc:ControllerService) {
        console.log("NEW ViewportResolver > ",this._ctrlSvc);
    }

    resolve(): any {

        return this._ctrlSvc.getViewport();
    }
}