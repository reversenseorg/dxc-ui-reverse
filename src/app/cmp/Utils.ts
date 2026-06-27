
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

export const Utils = {


  dxc_deepCopy: function(pSource:any):any {
    let dst:any = {};
    for(let i in pSource){
      if(typeof pSource[i] != 'object')
        dst[i] = pSource[i];
      else
        dst[i] = Utils.dxc_deepCopy(pSource[i]);
    }
    return dst;
  },
  dxc_encodeURIparam: function(pVal:string):string {
    return encodeURIComponent(btoa(encodeURIComponent(pVal)));
  },
  dxc_prepareURL: function( pUrl:string, pMap:any):string {
    let url = pUrl, o=null;
    for(let token in pMap){
      if(token=='id'){
        pMap[token] = encodeURIComponent(btoa(encodeURIComponent(pMap[token])));
      }
      do {
        url = url.replace(':'+token, pMap[token]);
      }while(url.indexOf(':'+token)>-1);
    }
    return url;
  }
  /*
  randString: function(size:number, charset:string):string{
    let s:string ="";

    while(s.length <= size){
      s += charset[Math.round(Math.random() * (charset.length-1))];
    }
    return s;
  }*/
};

/*
function dxc_deepCopy(pSource:any):any {
  let dst:any = {};
  for(let i in pSource){
    if(typeof pSource[i] != 'object')
      dst[i] = pSource[i];
    else
      dst[i] = dxc_deepCopy(pSource[i]);
  }
  return dst;
}

export function dxc_prepareURL( pUrl:string, pMap:any):string {
  let url = pUrl, o=null;
  for(let token in pMap){
    if(token==':id'){
      pMap[token] = encodeURIComponent(btoa(encodeURIComponent(pMap[token])));
    }
    do {
      url = url.replace(token, pMap[token]);
    }while(url.indexOf(token)>-1);
  }
  return url;
}*/
