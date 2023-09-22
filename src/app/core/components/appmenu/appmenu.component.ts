import {Component, OnInit} from "@angular/core";
import {ElectronService} from "../../services";
import {AppMenuService} from "./appmenu.service";


@Component({
  selector: 'app-menu',
  template: ''
})
export class AppMenuComponent implements OnInit {

  menu: any = null;

  constructor( private electronSvc:ElectronService,
               private appmenuSvc:AppMenuService) {


  }

  ngOnInit() {
  }

  update( pTpl:any):void{
  }
}
