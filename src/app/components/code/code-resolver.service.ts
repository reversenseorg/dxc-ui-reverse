import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {CodeControllerService} from "./ctrl/code-controller.service";
import {ControllerService} from "../../controller.service";
import {ProjectService} from "../project/ctrl/project.service";
import DexcaliburProject from "../../models/DexcaliburProject";
import {Nullable} from "../../base/Nullable";
import {CodeController} from "./ctrl/CodeController";
import {OutputService} from "../output/ctrl/output.service";
import {OutputMessage} from "../../cmp/OutputMessage";
import {DxcApiToken} from "../../base/DxcApiToken";


@Injectable()
export class CodeResolver {

    constructor( private _ctrlSvc:ControllerService,
                 private _prjSvc:ProjectService,
                 private _outputSvc:OutputService,
                 private _svc:CodeControllerService) {

    }

    resolve(pRoute: ActivatedRouteSnapshot, pState: RouterStateSnapshot): any {


        // get code, ..
        const nodeType = pRoute.params.type
        const nodeUid = pRoute.params.nuid




        this._svc.retrieveNode<any>(pRoute.params.uid, { __:nodeType, _uid:decodeURIComponent(atob(nodeUid)) }).subscribe((vNode   )=>{

            if(!vNode.success){
                this._outputSvc.print(OutputMessage.newError({ msg:"Cannot open node. Cause : "+vNode.msg, src:"Code Analyzer" }));
                return;
            }

            sessionStorage.setItem("puid",pRoute.params.uid);
            sessionStorage.setItem("mode","direct");

            const tok = DxcApiToken.getInstance("puid");
            if(tok!=null){
                tok.updateToken(pRoute.params.uid);
            }else{
                DxcApiToken.create('puid', pRoute.params.uid);
            }

            console.log("CodeResolver > ",vNode);

            const c = this._svc.getController<Nullable<CodeController>>();
            console.log("CodeResolver > ctrl > ",c,vNode);

            (vNode.data as any).__puid__ = pRoute.params.uid;

            if(vNode.data!=null && c!=null){
                c.showItem(vNode.data, true);
            }
        })

        /*
        // intercept oute resolve
        this._prjSvc.getProject(pRoute.params.uid).subscribe((vProjState)=>{





            /*
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

        //return ;
    }
}