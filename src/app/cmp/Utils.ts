
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
