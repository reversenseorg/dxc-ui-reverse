import * as _fs_ from "fs";
import * as _os_ from "os";


export function __log( pMessage:string):void{
  console.log(pMessage);
  //if(LOG_FILE)
  //  _fs_.appendFileSync(LOG_FILE, pMessage+_os_.EOL);
}
