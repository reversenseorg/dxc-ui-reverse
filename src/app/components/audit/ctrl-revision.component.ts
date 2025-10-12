import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {Nullable} from "../../base/Nullable";
import {Metadata, MetadataTopic} from "src/app/models/audit/common/Metadata";
import {DatePipe, NgIf} from "@angular/common";

@Component({
    selector: 'dxp-ctrl-revision',
    template: `
        <ng-container *ngIf="rev">
            <b>{{ rev.date | date: 'dd/MM/yyyy'}}&nbsp;-&nbsp;{{ rev.version }}</b>
            <p>{{ rev.author }}</p>
        </ng-container> 
    `,
    standalone: true,
    imports: [
        NgIf,
        DatePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlRevisionComponent implements OnInit {

    @Input() metas: Metadata[] = [];
    @Input() last = true;

    rev:Nullable<any> = null;

    constructor(
        private _chref: ChangeDetectorRef) {
    }

    ngOnInit() {
        const sorted = this.metas
            .filter(x => (x.key===MetadataTopic.REVISION))

        const s = sorted.sort((a, b) => (a.value.date < b.value.date ? -1 : 1));

        if(sorted.length > 0){
            this.rev = s[0].value;
            this._chref.detectChanges();
        }
    }

}