import ApplicationStub from "./ApplicationStub";


export default class ElectronStub {
  app:ApplicationStub;

  constructor(pBasePath:string) {
    this.app = new ApplicationStub(pBasePath);
  }
}
