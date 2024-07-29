import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {PrivilegedExecutionPhase, PrivilegedExecutionType} from "../../../models/devices/PrivilegedExecutionPhase";


export interface TargetApp {
    method: "upload"|"store"|"download";

}


export enum EopPhaseSide {
    DEV='dev',
    HOST='host',
    BRIDGE='bridge'
}




@Component({
    selector: 'dxs-device-eop-phase-e',
    template: `
        <div class="row p-1">
            <div class="col-lg-1 text-center">
                <label for="name">Step</label>
            </div>
            <div class="col-lg-2">
                <label for="side">Type</label>
            </div>
            <div *ngIf="bridgeCmd!=null" class="col-lg-3">
                <label for="type">Bridge Command</label>
            </div>
            <div [class]="'col-lg-'+(bridgeCmd?'3':'5')">
                <label for="cmd">Binary</label>
            </div>
            <div [class]="'col-lg-'+(bridgeCmd?'2':'4')">
                <label for="cmd">Binary arguments</label>
            </div>
        </div>
        <div class="row p-1 pb-3">
            <div class="col-lg-1 text-center">
                <span class="dxc-text-yellow">{{ offset }}</span>&nbsp;
                <!--<ng-container *ngIf="editable; else fixedName">
                    <input  type="text" class="pl-1" name="name" id="name" placeholder="exploit..." [(ngModel)]="name" />
                </ng-container>
                <ng-template #fixedName>
                    {{ name }}
                </ng-template>-->
            </div>
            <div class="col-lg-2">
                <ng-container *ngIf="editable; else fixedSide">
                    <select name="side" (change)="valueChanged('type')" [(ngModel)]="type" class="dxc-input">
                        <option value="h">Host Command</option>
                        <option value="bc">Bridge Command</option>
                        <option value="w">Wrap Command</option>
                        <option value="c">Dev Command</option>
                        <option value="b">Binary</option>
                        <option value="i">Intent</option>
                    </select>
                </ng-container>
                <ng-template #fixedSide>
                    {{ type }}
                </ng-template>
            </div>
            <div *ngIf="bridgeCmd!=null" class="col-lg-3">
                <input  type="text" class="pl-1" name="bridgeCmd" id="bridgeCmd" [(ngModel)]="bridgeCmd" />
            </div>
            <div [class]="'col-lg-'+(bridgeCmd?'3':'5')">
                    <input  type="text" class="pl-1" name="bin" id="bin" [(ngModel)]="bin" />
            </div>
            <div [class]="'col-lg-'+(bridgeCmd?'2':'4')">
                    <input  type="text" class="pl-1" name="binArgs" id="binArgs" [(ngModel)]="binArgs"/>
            </div>
            <div class="col-lg-1">
                <ng-container *ngIf="changed && editable">
                    <dxc-btn [borderless]="true" [icon]="gIcons['SAVE']" [label]="'Add'" (click)="save()"></dxc-btn>
                </ng-container>
            </div>
        </div>
    `,
    styleUrls:['../../../forms.scss']
})
export class EopPhaseEditorComponent implements AfterViewInit {


    @Input() text:string;
    @Input() type:PrivilegedExecutionType;

    @Input() bin:string;
    @Input() binArgs:string[];

    @Input() offset:number;
    @Input() bridgeCmd: string;

    @Input() phase:PrivilegedExecutionPhase;
    @Input() editable = false;

    name:string;

    @Output() phaseChange:EventEmitter<PrivilegedExecutionPhase> = new EventEmitter();

    readonly gIcons = GLOBAL_ICONS;
    changed: boolean = false;


    constructor(private changeRef:ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        if(this.phase != null){

            if(this.phase.bridgeCmd!=null){
                this.bridgeCmd = this.phase.bridgeCmd;
            }

            this.type = this.phase.type;

            switch (this.phase.type){
                case PrivilegedExecutionType.HOST_COMMAND:
                    if(this.phase.hostBin!=null){
                        this.bin = this.phase.hostBin;
                        this.binArgs = this.phase.hostBinArgs;
                        this.text = this.phase.hostBinArgs.join(" ");
                    }
                    break;
                case PrivilegedExecutionType.WRAPPER_MODE:
                case PrivilegedExecutionType.BRIDGE_COMMAND:
                case PrivilegedExecutionType.INTENT:
                    this.bin = this.phase.devBin;
                    this.binArgs = this.phase.devBinArgs;
                    this.text = this.phase.devBinArgs.join(" ");
                    break;
                case PrivilegedExecutionType.COMMAND:
                case PrivilegedExecutionType.BINARY:
                    this.bin = this.phase.devBin;
                    this.binArgs = this.phase.devBinArgs;
                    this.text = this.phase.devBinArgs.join(" ");
                    // this.text = this.phase.hostBin;
                    // this.text = this.phase.hostBinArgs;
                    break;
            }
        }
    }

    /**
     * YTo save changes
     */
    save() {
        this.changed = false;

        const phase = new PrivilegedExecutionPhase({
            type: this.type,
            bridgeCmd: this.bridgeCmd
        });

        switch (this.type){
            case PrivilegedExecutionType.HOST_COMMAND:
                phase.hostBin = this.bin;
                phase.hostBinArgs = this.binArgs;
                break;
            case PrivilegedExecutionType.BINARY:
            case PrivilegedExecutionType.COMMAND:
            case PrivilegedExecutionType.BRIDGE_COMMAND:
            case PrivilegedExecutionType.INTENT:
            case PrivilegedExecutionType.WRAPPER_MODE:
                phase.devBin = this.bin;
                phase.devBinArgs = this.binArgs;
                break;
        }


        this.phaseChange.emit(phase);
    }

    run() {

    }

    valueChanged(pName: string) {
        this.changed = true;
    }
}
