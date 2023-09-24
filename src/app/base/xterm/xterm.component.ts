import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Subject} from "rxjs";
import {IconModel} from "../icon/IconModel";
import {TerminalSession} from "../../components/workspace/ctrl/TerminalSession";
import {Nullable} from "../Nullable";

@Component({
  selector: 'dxc-xterm',
  templateUrl: './xterm.component.html',
  styleUrls: ['./xterm.component.scss']
})
export class XtermComponent implements OnInit, OnChanges {

  @Input() session:Nullable<TerminalSession> = null;
  @Input() type:Nullable<string> = null;
  @Input() writeSubject:Subject<any> = new Subject<any>();

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(pChanges: SimpleChanges) {
    if(pChanges.hasOwnProperty('session')){
      this.session.removeXterm();
      pChanges.session.currentValue.registerXterm(this);
    }
  }

}
