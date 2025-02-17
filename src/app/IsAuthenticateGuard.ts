import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class IsAuthenticatedGuard  {

    constructor( private _router:Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        /*
        if(!DxcApiToken.exists("local")){
            location.href = "http://"+location.host+"/login";
            //return this._router.parseUrl('/auth/login') as UrlTree;
        }else{
            return true;
        }
        */

        return true;

    }
}
