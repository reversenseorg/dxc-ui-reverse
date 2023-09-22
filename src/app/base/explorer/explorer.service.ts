import {Injectable} from "@angular/core";
import {ExplorerItem} from "../../cmp/ExplorerItem";
import {ExplorerCodeComponent} from "../../components/code/explorer-code/explorer-code.component";
import {ExplorerFileComponent} from "../../components/file/explorer-file/explorer-file.component";
import {ExplorerHooksComponent} from "../../components/hooks/explorer-hooks/explorer-hooks.component";

@Injectable()
export class ExplorerService {

  getExplorers(): ExplorerItem[] {
    return [
      /*new ExplorerItem(ExplorerCodeComponent),
      new ExplorerItem(ExplorerFileComponent),
      new ExplorerItem(ExplorerHooksComponent)*/
    ];
  }
}
