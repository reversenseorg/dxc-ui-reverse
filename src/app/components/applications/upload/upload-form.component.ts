/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Optional,
} from "@angular/core";
import {Message, MessageService, PrimeNGConfig} from "primeng/api";
import {ApplicationUnit} from "../../../api/orgs/ApplicationUnit";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {LayoutService} from "../../../../layout/service/app.layout.service";
import {NewProjectFlowType, ProjectInputPurpose, ProjectService, UploadedFile} from "../../project/project.service";
import {ApplicationService} from "../application.service";
import {Nullable} from "../../../api/common";
import {ScanOrderState} from "../../audit/scan-modal.component";
import {OrganizationUnit} from "../../../api/orgs/OrganizationUnit";
import {OrganizationService} from "../../organization/organization.service";
import {Connection, ConnectionUUID} from "../../../api/orgs/auth/Connection";
import {OperatingSystem} from "../../../api/OperatingSystem";
import DexcaliburProject from "../../../api/DexcaliburProject";
import {AuditService} from "../../audit/audit.service";


export type UploadUID = string;

interface UploadedProjectInput {
   file?: File;
   uploadID?: UploadUID;
   purpose?: ProjectInputPurpose;
}

interface FileUploadEvent {
   files: File[]
}



@Component({
   selector: 'dxp-au-rel-upload',
   templateUrl: './upload-form.component.html',
   styles:[`
      .app-preview {
         border-radius: 1em;
      }

      .dl-running {
         border: none;
         background: #efefef;
      }

      .dl-process {
         border: 1px solid #859cd1;
         background: #f1f2ff;
      }

      .dl-failed {
         border: 1px solid #ac6060;
         background: #ffcaca;
      }

      .dl-done {
         border: 1px solid #539f53;
         background: #e1ffdc;
      }
   `],
   providers: [MessageService],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseUploadFormComponent implements OnInit {

   @Input() uploadedFiles:any[] = [];
   @Input() orgUnit:OrganizationUnit;
   @Input() appUnit:Nullable<ApplicationUnit> = null;
   @Input() relname:string;

   totalSizePercent: number = 0;
   totalSize:number = 0;

   projInputs:Record<string, UploadedProjectInput> = {};


   queue:ScanOrderState[] = []

   _uploadUID:Nullable<UploadUID> = null;
   _uploadUIDs:Nullable<{ uid:UploadUID, purpose:ProjectInputPurpose}[]> = [];

    private opeSuccess: boolean = false;
   private tags: string[] = [];

   mode = "determinate";
   ready = false;
   dlMode: boolean = false;
   dlInfo: any = {
      uid: null,
      name: "Unknown",
      version: "?.?.?",
      icons: ""
   };
   os: OperatingSystem = OperatingSystem.NONE;
   previewing = false;
   selFile: Nullable<UploadUID> = null;

   pvwUplStep: string = 'none';
   pvwStrStep: string = 'none';
   pkgid: string = "";
   prj: Nullable<DexcaliburProject> = null;
   @Input() step: any = 0;

   conns: Connection[] = [];
   sConn: Nullable<ConnectionUUID> = null;
   conn: Nullable<Connection> = null;
   appChecked:any = null;
   chkMsg: Message[] = [];
   licEvt: EventEmitter<any> = new EventEmitter();

   private _inputs: { uid:UploadUID, purpose:ProjectInputPurpose }[] = [];

   constructor( @Optional() private _config: DynamicDialogConfig,
                @Optional() private _ref: DynamicDialogRef,
                private _prime:PrimeNGConfig,
                private _projSvc: ProjectService,
                private _appSvc: ApplicationService,
                private _auditSvc: AuditService,
                private _orgSvc:OrganizationService,
                private _msgSvc:MessageService,
                public layoutService: LayoutService,
                private _changeRef:ChangeDetectorRef) {

      if(this._config.data.appUnit!=null){
         this.appUnit = this._config.data.appUnit;
      }
      if(this._config.data.orgUnit!=null){
         this.orgUnit = this._config.data.orgUnit;
      }
   }

   ngOnInit() {
      this._appSvc.onFileUpload.subscribe((vUpload:UploadedFile)=>{
         console.log("Uploaded file : ", vUpload);

         this.mode = "determinate";
         if(vUpload.localUID!=null && this.projInputs[vUpload.localUID]!=null){
            this.projInputs[vUpload.localUID].uploadID = vUpload.uid as string ;

             if(this.projInputs[vUpload.localUID].purpose==null){
                 this.projInputs[vUpload.localUID].purpose =
                     (Object.keys(this.projInputs).length<2?ProjectInputPurpose.MAIN:ProjectInputPurpose.EXTRA);
             }

            this.pvwUplStep = 'process';
            this.selFile = vUpload.uid as string;
            this.ready = true;
            this._changeRef.detectChanges();
         }
      });
      // reset state and trigger change
      this.reset();
   }


   refreshConns():void {
      if(this.orgUnit==null) return;

      this.sConn = null;

      this._orgSvc.listConnection(this.orgUnit.getUID()).subscribe(list => {
         this.conns = list;
         this._changeRef.detectChanges();
      });
   }

   choose(pEvent:any, pCallback:any) {
      pCallback();
   }

   onRemoveTemplatingFile(pEvent:any, pFile:any, removeFileCallback:any, index:number) {
      removeFileCallback(pEvent, index);
      // update size
      this.totalSize -= parseInt(this.formatSize(pFile.size));
      this.totalSizePercent = this.totalSize / 10;
      // remove from input list
      const uid = `${pFile.name}:${pFile.size}:${pFile.lastModified}`;
      delete this.projInputs[uid];

      console.log("FILE REMOVED ",this);
   }

   onClearTemplatingUpload(pClear:any) {
      pClear();
      this.totalSize = 0;
      this.totalSizePercent = 0;
      this.uploadedFiles = [];
      this.projInputs = {};
      this._inputs = [];
      console.log("CLEARED ",this);
   }

   onTemplatedUpload(pEvent:any) {
      this._msgSvc.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
   }

   formatSize(pBytes:number) {
      const k = 1024;
      const dm = 3;
      let sizes:any = this._prime.translation.fileSizeTypes;

      if (pBytes === 0) {
         return `0 ${sizes[0]}`;
      }

      const i = Math.floor(Math.log(pBytes) / Math.log(k));
      const formattedSize = parseFloat((pBytes / Math.pow(k, i)).toFixed(dm));


      return `${formattedSize} ${sizes[i]}`;
   }


   onUpload(pEvent: FileUploadEvent, pIntant:string) {
      this.mode = "indeterminate";
      this.ready = false;
      pEvent.files.map((vFile:File)=>{
         const uid = `${vFile.name}:${vFile.size}:${vFile.lastModified}`;

         if(this.projInputs[uid]==null){
             this.projInputs[uid] = {
                 file:vFile
             };
             console.log(vFile);
             this._appSvc.uploadFile(vFile,uid);
         }
      })
   }

   uploadProgress($event: any) {
      console.log("uploadProgress : ",$event);
   }

   createRelease(pCallback:any, pScan = false) {

      if(this.appUnit==null){
         // create application from uploaded resources
         return ;
      }

      console.log("createRelease : ",this.dlMode,this);

      if(this._inputs.length==0){
         this._msgSvc.add({ severity: 'error', summary: 'Cannot create application', detail: 'Something is wrong with inputs. Please contact support.', life: 3000 });
         return;
      }

      this.opeSuccess = false;
      const settings:any = {
         name: this.relname,
         type: NewProjectFlowType.UPLOAD,
         targetOS: (this.appUnit.os as any),
         aid: this.appUnit.getUID(),
         inputs: this._inputs
      };


      // close, push notification, jump to future dashboard
      this._projSvc.newProject(NewProjectFlowType.UPLOAD, settings).subscribe( (pRes)=>{
         console.log("newProject > ",pRes);
         if(pRes.success){
            this._msgSvc.add({ severity: 'success', summary: 'New Project', detail: 'A new project has been queued. See more', life: 3000 });
            this.opeSuccess = true;

            this.prj = new DexcaliburProject(null, pRes.data.__puid );
            this.prj.pkg = this.pkgid;

            if(pCallback!=null){
               pCallback.emit();
            }else{
               this.close();
            }
         }else{
            this._msgSvc.add({ severity: 'error', summary: 'Cannot create application', detail: (pRes.msg!=null?pRes.msg : 'An unexpected error occured. Please contact support.')  });
            return;
         }


         // focus project order
         /*
         this.queue.push({
            settings: JSON.parse(JSON.stringify(settings)),
            startDate: (new Date()),
            status: ScanOrderStatus.RUNNING,
            orderID: "0",
            queued: true
         });*/
      })

      // hide modal

   }

   close(){
      this._ref.close();
   }

   setPurpose(pFile: any, pEvent: ProjectInputPurpose) {

      const uid = `${pFile.name}:${pFile.size}:${pFile.lastModified}`;

       console.log("set purpose before : ",uid,this.projInputs[uid]);

       const n = {
           file:this.projInputs[uid].file,
           purpose: pEvent,
           uploadID: this.projInputs[uid].uploadID
       };

      delete this.projInputs[uid];
       this.projInputs[uid] = n;

      console.log("set purpose qfter : ",this,pFile,uid,pEvent,this.projInputs[uid]);
   }

   getDefaultPurpose(pFile:any):ProjectInputPurpose {

      const uid = `${pFile.name}:${pFile.size}:${pFile.lastModified}`;

       console.log("get purpose  of ",uid,this.projInputs[uid].purpose);
      return this.projInputs[uid].purpose as any;
   }

   start(pMode: string, pNextCallback: any) {
      this.dlMode = (pMode==='dl');

      if(this.dlMode){
         this.refreshConns();
      }
      pNextCallback.emit();
   }

   private _dlPkg(){
      if(this.conn==null) return;

      // https://play.google.com/store/apps/details?id=<PACKAGE_ID>&hl=fr
      if(this.pkgid.startsWith("http")){
         try{
            const storeUri = new URL(this.pkgid);
            if(storeUri.host==="play.google.com"){
               const p = storeUri.searchParams.get('id');
               if(p!=null){
                  this.pkgid = p;
               }
            }
         }catch (e){}
      }

      this._appSvc.downloadPackageOver(this.orgUnit.getUID(), this.pkgid, this.conn).subscribe((vSuccess)=>{
         if(vSuccess){
            // this.dlstep = 'process';

            if(this.conn!=null){
               this.relname = this.conn.name;
            }

            this.pvwStrStep = 'process';
            this.ready = true;

            //this._uploadUID = vSuccess.data[0].uid;

            this._uploadUIDs = vSuccess.data;

            // trigger binary preview
            this._changeRef.detectChanges();
         }else{
            this.pvwStrStep = 'failed';
            this._uploadUID = null;
            this._uploadUIDs = [];
            this._changeRef.detectChanges();
         }
      })
   }

   private _dlApp(){
      if(this.conn==null) return;

      if(this.appUnit==null) return;

      this._appSvc.downloadReleaseOver(this.appUnit.getUID(), this.conn).subscribe((vSuccess)=>{
         if(vSuccess){

            this.pvwStrStep = 'process';
            this.ready = true;

            if(this.conn!=null){
               this.relname = this.conn.name;
            }
            console.log("DL : ",vSuccess);
            this._uploadUID = vSuccess.data.download;

            // trigger binary preview
            this._changeRef.detectChanges();
         }else{
            this.pvwStrStep = 'failed';
         }
      })
   }

   startDl(pNextCallback: any) {
      if(this.conn==null) return;

      this.pvwStrStep = 'running';
      this.dlMode = true;
      //this.dlstep = 'running';

      this._changeRef.detectChanges();

      if(this.appUnit!=null){
         this._dlApp();
      }else{
         this._dlPkg();
      }

   }

   pickOs(pOS: string, pNextCallback: any) {
      this.os = pOS as OperatingSystem;
      pNextCallback.emit();
   }

   pickConn(pEvt:any){
      this.conn = this.conns.find(x => x.uuid==this.sConn);
      console.log("pickConn > ",pEvt,this.conn);
      this._changeRef.detectChanges();
   }

   getOs(pOS: string):OperatingSystem {
      return pOS as OperatingSystem;
   }

   previewUpl($event: MouseEvent, file: any, index: any) {
      console.log(file,index,$event);
   }

   /**
    * To check if an app unit exits or not, and load licenses
    * @param pNextCallback
    */
   checkApp(pNextCallback: any) {

      this.opeSuccess = false;

      const settings:any = {
         os: (this.appUnit!=null ? this.appUnit.os : this.os),
         aid: (this.appUnit!=null ? this.appUnit.getUID() : null),
         inputs: []
      };

      this._inputs = [];

      console.log("checkApp : dlMode : ",this.dlMode);
      if(this.dlMode){
         if(this._uploadUIDs==null || this._uploadUIDs.length==0){
            this._msgSvc.add({ severity: 'error', summary: 'Failure', detail: 'Some project inputs are invalid. Please contact support.'/*, life: 3000*/ });
            return;
         }

         this._uploadUIDs.map((vUpl)=>{
             this._inputs.push({
                 uid: vUpl.uid,
                 purpose: vUpl.purpose
             });
         })

      }else{
         for(let k in this.projInputs){
            if(this.projInputs[k].uploadID==null){
               this._msgSvc.add({ severity: 'error', summary: 'Failure', detail: 'Some project inputs are invalid. Please contact support.'/*, life: 3000*/ });
               return
            }

            this._inputs.push({
               uid: this.projInputs[k].uploadID as UploadUID,
               purpose: this.projInputs[k].purpose as ProjectInputPurpose
            });
         }
      }


       console.log("check app : ",this);

      settings.inputs = this._inputs;

      if(this.appUnit==null){
         if(pNextCallback!=null){
            pNextCallback.emit();
         }

         this._appSvc.checkApp(this.orgUnit.getUID(), settings)
             .subscribe((vSuccess)=>{
                if(vSuccess.success===false || vSuccess.data==null){
                   this._msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Application unit cannot be created or retrieved from project inputs.', life: 3000 });
                   return;
                }

                this._orgSvc.getApplication(vSuccess.data.aid).subscribe((appunit)=>{
                   this.appUnit = appunit;
                   this.appChecked = vSuccess.data;
                   this.appChecked.app = this.appUnit;
                   this._changeRef.detectChanges();
                });
             });
      }else{

      }

   }

   orderScans(pOpts: any) {
      console.log("SCAN ORDERS: ",pOpts,this);

      if(this.prj==null) return;

      pOpts.projectUID = this.prj.getUID();

      this._auditSvc.newScanOrder(pOpts).subscribe((vData:any)=>{

         if(vData.success==true){
            console.log("newScanOrder from existing project > ",vData);
            /*
            this.queue.push({
                settings: JSON.parse(JSON.stringify(opts)),
                startDate: (new Date()),
                status: ScanOrderStatus.RUNNING,
                orderID: "0",
                queued: true
            });*/

            if(this._ref!=null){
               this._ref.close();
            }
         }else{
            //this.messages =[{ severity: 'error', detail: vData.msg }];
         }
      })

   }

   clearUpl(pEvent: MouseEvent, pClearCallback: any ) {
      this.pvwUplStep = 'none';
      this._changeRef.detectChanges();
      pClearCallback.call(null, [pEvent]);
   }

   reset() {

      this.step = 1;
      this._inputs = [];
      this._changeRef.detectChanges();
   }

    getMainUpld():Nullable<UploadUID> {

        if(this._uploadUIDs==null || this._uploadUIDs.length==0){
            return null;
        }

        const u = this._uploadUIDs.find(x => (x.purpose==ProjectInputPurpose.MAIN));
        return u!=null?u.uid:null;
    }
}