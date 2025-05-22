import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';

// (contextmenu)="openVmMenu($event)"

@Component({
    selector: 'dxc-code-emu-log',
    template: `
        <table class="w-full h-full dxc-text-std dxc-table">
            <thead>
                <th style="width: 10%">
                    <div class="w-full border-1 pl-2">Type</div>
                </th>
                <th style="width: 90%">
                    <div class="w-full border-1 pl-2">Message</div></th>
            </thead>
            <tbody>
            <ng-container *ngIf="vmLog!=null && vmLog.length>0; else noLog">
                <tr *ngFor="let l of vmLog">
                    <td>{{ l.t }}</td>
                    <td class="dxc-text-clear75"><pre>{{ l.v }}</pre></td>
                </tr>
            </ng-container>
            <ng-template #noLog>
                <tr>
                    <td colspan="2" class="text-center p-2">No logs here.</td>
                </tr>
            </ng-template>
            </tbody>
        </table>
    `,
    styleUrls:['../viewport-code/viewport-code.component.scss','../../../forms.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEmuLoggerComponent {

    @Input() vmLog: any[] = [];

    constructor(
        private changeRef:ChangeDetectorRef) {

    }

    push(pLog:any):void {
        this.vmLog.push(pLog);
        this.changeRef.detectChanges();
    }

    update(pLogs:any[]):void {
        this.vmLog = pLogs;
        this.changeRef.detectChanges();
    }
}
