import { Injectable } from '@angular/core';
import {from, Observable, Subject, throwError} from 'rxjs';
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {AlertMessage, AlertOptions} from "../modal-alert/modal-alert.component";
import {Nullable} from "../../../base/Nullable";


// @ts-ignore
/**
 * Use this service to interact with workspace and
 * remote sockets
 *
 * @class
 * @since 1.0.0
 * @author Georges-Bastien MICHEL
 */
@Injectable({
  providedIn: 'root'
})
export class OutputService {

  public msg$:Subject<OutputMessage> = new Subject<OutputMessage>();
  public alert$:Subject<AlertMessage> = new Subject<AlertMessage>();
  public onNewError$:Subject<any> = new Subject<any>();

  public errorCache:OutputMessage[] = [];


  constructor( private appmenuSvc:AppMenuService) {

    // this.appmenuSvc.addMenu( {},8);
  }

  print( pMsg:OutputMessage):void {
      if(pMsg.isNotInfo()){
        this.errorCache.push(pMsg);
        //this.onNewError$.next();
      }
      this.msg$.next(pMsg);
  }


  /**
   * To broadcast a message as an alert message
   *
   * Currently, there is only one subscriber popping an alert box
   *
   * @param {OutputMessage} pMsg
   * @param {AlertOptions} pOptions Optional.
   * @method
   * @since 1.0.0
   */
  alert( pMsg:OutputMessage, pOptions:AlertOptions = {}):void {
    const opts:AlertOptions = {};

    if(pMsg.isError()){
      opts.title = "Error";
    }

    for(const i in pOptions) opts[i] = pOptions[i];

    this.alert$.next({
      msg: pMsg,
      opts: opts
    });
  }

  confirm( pMsg:OutputMessage, pOptions:AlertOptions = {}):void {
    const opts:AlertOptions = {};

    for(const i in pOptions) opts[i] = pOptions[i];

    this.alert$.next({
      msg: pMsg,
      opts: opts
    });
  }
}
