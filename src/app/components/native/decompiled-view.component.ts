import {
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    Input, OnChanges,
    OnInit,
    QueryList, SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {Subject} from "rxjs";
import {IViewportContainer} from "../../base/viewport/IViewportContainer";
import {NativeController} from "./ctrl/NativeController";
import {NativeService} from "./ctrl/native.service";
import ModelFile from "../../models/ModelFile";
import ModelBasicBlock from "../../models/ModelBasicBlock";
import {Nullable} from "../../base/Nullable";
import {ContextMenuComponent, ContextMenuList, ContextMenuState} from "../../base/context-menu/context-menu.component";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {ModelFunction} from "../../models/ModelFunction";
import ModelCpuInstruction from "../../models/ModelCpuInstruction";

@Component({
  selector: 'dxs-decompiled-view',
  template: `
    <pre>{{ decText }}</pre>
  `,
  styles: [`
  
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecompiledViewComponent implements OnInit, OnChanges {

    //@Input() func:Nullable<ModelFunction> = null;
    @Input() funcUID:Nullable<string> = null;

    ctxMenu: Record<string,ContextMenuComponent> = {};
    ctxMenuState:ContextMenuState = { subject: null };

    decText:string = "";

    readonly gIcons = GLOBAL_ICONS;
    private activeItem: any = -1;

    constructor(private nativeSvc: NativeService,
                private _chref: ChangeDetectorRef) {

    }


    ngOnChanges(pChanges: SimpleChanges): void {
        if(pChanges['funcUID'].currentValue!=null
            || pChanges['func'].currentValue!=null) {
            console.log("disass view : ngOnChanges : ", pChanges);
            this.refresh();
            return;
        }
    }

    ngOnInit() {
    }


    refresh() {
        if(this.funcUID==null) return;
        console.log("decomp view : refresh : ", this.funcUID);
        this.nativeSvc.decompile(this.funcUID).subscribe(res=>{
            this.decText = res;
            this._chref.detectChanges();
        });
    }
}
