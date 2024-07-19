import {
    ChangeDetectorRef,
    Component, EventEmitter,
    Input,
    OnInit, Output
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {PrivilegedExecutionPhase} from "../../../models/devices/PrivilegedExecutionPhase";




export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-device-eop-phase-e',
    template: `
        <div class="row">
            <div class="col-lg-1">
                <label for="name">Name</label>
            </div>
            <div class="col-lg-1">
                <label for="side">Side</label>
            </div>
            <div class="col-lg-1">
                <label for="type">Type</label>
            </div>
            <div class="col-lg-8">
                <label for="cmd">Command</label>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-1">
                <ng-container *ngIf="editable; else fixedName">
                    <input  type="text" class="pl-1" name="name" id="name" placeholder="exploit..." [(ngModel)]="name" />
                </ng-container>
                <ng-template #fixedName>
                    {{ name }}
                </ng-template>
            </div>
            <div class="col-lg-1">
                <ng-container *ngIf="editable; else fixedSide">
                    <select name="side" [(ngModel)]="side" class="dxc-input">
                        <option value="host">Host</option>
                        <option value="device">Device</option>
                    </select>
                </ng-container>
                <ng-template #fixedSide>
                    {{ side }}
                </ng-template>
            </div>
            <div class="col-lg-1">
                <ng-container *ngIf="editable; else fixedType">
                    <select name="type" [(ngModel)]="type" class="dxc-input">
                        <option value="shell_cmd">Shell Command</option>
                        <option value="bridge_cmd">Bridge Command</option>
                        <option value="bin">Binary</option>
                    </select>
                </ng-container>
                <ng-template #fixedType>
                    {{ type }}
                </ng-template>
            </div>
            <div class="col-lg-8">
                <ng-container *ngIf="editable; else fixedText">
                    <input type="text" class="pl-1" name="cmd" id="cmd" placeholder="command ...." [(ngModel)]="text" style="width:200px"/>
                </ng-container>
                <ng-template #fixedText>
                    {{ text }}
                </ng-template>
            </div>
            <div class="col-lg-1">
                <ng-container *ngIf="editable; else fixedRun">
                    <dxc-btn [borderless]="false" [icon]="gIcons['SAVE']" [label]="'Add'" (click)="save()"></dxc-btn>
                </ng-container>
                <ng-template #fixedRun>
                    <dxc-btn [borderless]="false" [icon]="gIcons['PLAY']" [label]="'Run'" (click)="run()"></dxc-btn>
                </ng-template>
            </div>
        </div>
    `,
    styles:[`
      div.project-card {
        
        background-color: var(--card-bg);
        color: var(--card-text);
        border: 1px solid var(--input-border);
        border-radius: var(--card-border-radius);
        
        .project-app {
          color: var(--card-text-high);
        }
        .project-name {
          font-size: 0.8rem;
          color: var(--text-100);
          text-decoration: underline;
        }
      }
      
    `]
})
export class EopPhaseEditorComponent implements OnInit {

    @Input() side:string;
    @Input() text:string;
    @Input() type:string;
    @Input() editable = false;

    name:string;

    @Output() phaseChange:EventEmitter<PrivilegedExecutionPhase> = new EventEmitter();

    readonly gIcons = GLOBAL_ICONS;

    constructor(private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {

    }

    save() {
        this.phaseChange.emit(new PrivilegedExecutionPhase({

        }))
    }

    run() {

    }
}
