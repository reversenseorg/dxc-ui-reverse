

export enum MarkType {
  UNKNOW,
  CODE,
  DATA,
  HOOK,
  COMM
}


export class ReportTopic {
  title: string = null;
  description: string = null;

  reportTitle: string = '';
  reportDescription: string = '';
}


export class ReportTest {
  title: string = null;
  description: string = null;

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
