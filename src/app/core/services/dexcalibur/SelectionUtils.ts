import {NodeInternalType} from "../../../models/NodeInternalType";

export class SelectionUtils {

  static retrieveShortForm(pEl:any):string {

    if(pEl==null) return "";

    switch( pEl.__) {
      case NodeInternalType.PACKAGE:
        return pEl.name;
        break;
      case NodeInternalType.CLASS:
        return pEl.name;
        break;
      case NodeInternalType.METHOD:
        return pEl.__signature__;
        break;
      case NodeInternalType.FIELD:
        return pEl.__signature__;
        break;
      case NodeInternalType.FILE:
        return pEl.name;
        break;
      case NodeInternalType.FUNC:
        return pEl.name;
        break;
      default:
        return pEl.name;
        break;
    }
  }
}
