import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {CodeControllerService} from "./ctrl/code-controller.service";
import {ControllerService} from "../../controller.service";
import {ProjectService} from "../project/ctrl/project.service";
import DexcaliburProject from "../../models/DexcaliburProject";


@Injectable()
export class CodeResolver {

    constructor( private _ctrlSvc:ControllerService,
                 private _prjSvc:ProjectService,
                 private _svc:CodeControllerService) {

    }

    resolve(pRoute: ActivatedRouteSnapshot, pState: RouterStateSnapshot): any {


        // intercept oute resolve
        this._prjSvc.getProject(pRoute.params.uid).subscribe((vProjState)=>{

            console.log("CodeResolver > ",vProjState);


            // get code, ..
            const nodeType = pRoute.params.node
            const nodeUid = pRoute.params.nuid

            if(vProjState.loaded && (vProjState.project!=null)){

                this._prjSvc._beforeProjectReady(vProjState.project,true);

                this._prjSvc.switchTo(vProjState.project).subscribe(()=>{
                    console.log('[CODE SVC] switched to project: ', vProjState.project);
                    //(this._prjSvc as any)._location.replaceState('/home/'+pRoute.params.uid,'');
                    this._prjSvc._refreshDefaultDeviceFor(vProjState.project as DexcaliburProject);
                });
            }

            // show device in vp
            //this._ctrlSvc.getStage('main').showProject(vProj);
            // display device panel in explorer and expand device
            //this._ctrlSvc.getStage('main').showDeviceExpl(vDev);

        });

        return ;

        // intercept oute resolve
        /*this._svc.getProject(pRoute.params.uid).subscribe((vProjState)=>{

            console.log("ProjectResolver > ",vProjState);



            if(vProjState.loaded && (vProjState.project!=null)){

                this._svc._beforeProjectReady(vProjState.project,true);

                this._svc.switchTo(vProjState.project).subscribe(()=>{
                    console.log('[PROJECT SVC] switched to project: ', vProjState.project);
                    //(this._prjSvc as any)._location.replaceState('/home/'+pRoute.params.uid,'');
                    this._svc._refreshDefaultDeviceFor(vProjState.project as DexcaliburProject);
                });
            }

                // show device in vp
                //this._ctrlSvc.getStage('main').showProject(vProj);
                // display device panel in explorer and expand device
                //this._ctrlSvc.getStage('main').showDeviceExpl(vDev);

        });*/

        return ;
    }
}