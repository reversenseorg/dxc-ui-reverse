import {PrivilegedExecutionStrategy} from "./devices/PrivilegedExecutionStrategy";

export interface IBridge
{
  shortname:string;

  up:boolean;

  ip:string;

  port:number;


  /**
   * Map of strategies
   * @field
   */
  strategies:Record<string, PrivilegedExecutionStrategy>;

  /**
   *
   */
  defaultStrat:string;

  deviceID?:any;
}
