import {Nullable} from "../base/Nullable";


export enum MarkType {
  UNKNOW,
  CODE,
  DATA,
  HOOK,
  COMM
}


export class ReportTopic {
  title: Nullable<string> = null;
  description: Nullable<string> = null;

  reportTitle: string = '';
  reportDescription: string = '';
}


export class ReportTest {
  title: Nullable<string> = null;
  description: Nullable<string> = null;

  reportTitle: string = '';
  reportDescription: string = '';

  goalText: string = '';
  testText: string = '';
  verdictText: string = '';
}

export class ReportMark {
  name: string = "";
  topics:any = [];
  type:MarkType = MarkType.UNKNOW;
}
