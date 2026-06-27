/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {ErrorCode, MonitoredError} from "../../../dxc/error/MonitoredError";


export class WebsocketClientException extends MonitoredError {

    static CODE = {
        SESSID_IS_NOT_DEFINED: ErrorCode.UI + 401,
    }

    static SESSID_IS_NOT_DEFINED = ()=>{
        return new WebsocketClientException("Session ID is null",
            WebsocketClientException.CODE.SESSID_IS_NOT_DEFINED) };



    constructor( pMsg:string, pCode:number = -1, pExtra:any = null) {
        super('WEBSOCKET CLIENT', pMsg, pCode, pExtra);
    }
}