import {TerminalComponent} from "./terminal.component";
import {TerminalView} from "../../cmp/TerminalView";
import {TerminalTab} from "../../cmp/TerminalTab";


export interface ITerminalContainer {
  id:number;
  parent: TerminalComponent;
  view: TerminalView;
  tab:TerminalTab;

  resize( pSize:any):void;
}
