import {Nullable} from "../../../base/Nullable";
import {Injectable} from "@angular/core";
import {ControllerService} from "../../../controller.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ProjectService} from "./project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {DxcApiToken} from "../../../base/DxcApiToken";


@Injectable()
export class ProjectResolver {

    constructor( private _ctrlSvc:ControllerService,
                 private _prjSvc:ProjectService) {

    }

    resolve(pRoute: ActivatedRouteSnapshot, pState: RouterStateSnapshot): any {

        // intercept oute resolve
        this._prjSvc.getProject(pRoute.params.uid).subscribe((vProjState)=>{

            console.log("ProjectResolver > ",vProjState);



            if(vProjState.loaded && (vProjState.project!=null)){

                this._prjSvc._beforeProjectReady(vProjState.project,true);

                this._prjSvc.switchTo(vProjState.project).subscribe(()=>{
                    console.log('[PROJECT SVC] switched to project: ', vProjState.project);
                    //(this._prjSvc as any)._location.replaceState('/home/'+pRoute.params.uid,'');
                    this._prjSvc._refreshDefaultDeviceFor(vProjState.project as DexcaliburProject);
                });
            }else{
                console.log("ProjectResolver > ERROR : project not loaded");
            }

                // show device in vp
                //this._ctrlSvc.getStage('main').showProject(vProj);
                // display device panel in explorer and expand device
                //this._ctrlSvc.getStage('main').showDeviceExpl(vDev);

        });

        return ;
    }
}