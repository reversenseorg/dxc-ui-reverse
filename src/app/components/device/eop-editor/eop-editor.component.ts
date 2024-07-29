import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, EventEmitter,
    Input,
    OnInit, Output
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";;
import {PrivilegedExecutionStrategy} from "../../../models/devices/PrivilegedExecutionStrategy";
import {DeviceManagerService} from "../ctrl/device-manager.service";
import {PrivilegedExecutionPhase} from "../../../models/devices/PrivilegedExecutionPhase";
import {IBridge} from "../../../models/IBridge";
import {Nullable} from "../../../base/Nullable";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-device-eop-editor',
    templateUrl: './eop-editor.component.html',
    styleUrls:['../../../forms.scss'],
    styles:[`
      div.strategy-header {
        color: var(--warning-bg);
        border-bottom: 1px solid var(--warning-bg);
      }

      div.strategy-phase {
        margin-top: 1em;
        background-color: var(--list-bg);
        color: var(--card-text);
        border: none;
      }
    `]
})
export class EopEditorComponent implements AfterViewInit {


    name:string;

    @Input() strategy:any; //PrivilegedExecutionStrategy;
    @Input() devID:Nullable<string> = null;
    @Input() defaultStrat:boolean = false;
    @Input() height: number = 200;
    @Input() frequency: number = 200;
    @Input() bridge: IBridge;

    @Output() update: EventEmitter<any> = new EventEmitter<any>();

    readonly gIcons = GLOBAL_ICONS;

    editingName: boolean =  false;
    savedSuccess: boolean = false;

    constructor(
        private devSvc:DeviceManagerService,
        private changeRef:ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        if(this.strategy!=null){
            this.name = this.strategy.name;
        }

        console.log("EopEditorComp : ",this);
    }

    onPaste(ext: string, ext2: any) {

    }

    quitEditMode($event: any) {

    }

    saveName($event: any) {

    }

    newPhase() {

    }

    valueChanged(pId: string) {
        this.update.emit(this.strategy);
    }

    updatePhase(pOffset: number, pPhase: PrivilegedExecutionPhase) {
        (this.strategy as PrivilegedExecutionStrategy).phases[pOffset] = pPhase;
        this.update.emit(this.strategy);
    }

    save() {
        if(this.devID==null || this.bridge.shortname==null){
            //this.outputSvc.l
            return;
        }
        this.devSvc.saveStrategy(this.devID, this.bridge.shortname, this.strategy).subscribe(()=>{
            this.savedSuccess = true;
        });
    }
}
