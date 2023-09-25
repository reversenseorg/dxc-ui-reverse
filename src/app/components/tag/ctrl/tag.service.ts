import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {from, Observable, Subject, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {DxcApiService} from "../../../base/DxcApiService";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {AppMenuService} from "../../../core/components/appmenu/appmenu.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
import TagCategory from "../../../models/tags/TagCategory";
import {Tag} from "../../../models/tags/Tag";

export interface TagCache {
  categories: TagCategory[],
  tags: Tag[]
}

export interface TagMapping {
  [namePattern:string] :Tag[]
}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class TagService extends DxcApiService {

  onCacheReady: Subject<TagCache> = new Subject<TagCache>();

  cache:TagCache ={
    categories: [],
    tags: []
  }

  searchCache:any = {};

  _uuidMap:any = {};
  _nameMap:any = {};

  constructor( private appmenuSvc:AppMenuService,  private outputSvc:OutputService,  protected override _http:HttpClient) {
    super(
      {
        category: {
          list: { method:'GET', url:'/tag/categories', format: 'json', auth:true, puid:true }
        },
        tag: {
          list: { method:'GET', url:'/tag/tags', format: 'json', auth:true, puid:true }
        }
      },_http,outputSvc
    );
  }

  listCategories():Observable<TagCategory[]> {
    return this._process( this.endpoints['category']['list'], {})
      .pipe(map( pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Tags"}));
          return [];
        }else{
          this.cache.categories = [];
          pRes.data.map((x:any) => {           const c = new TagCategory(x);
            /*c._tags.map( (v,i)=>{
              const t = new Tag(v);
              c._tags[i] = t;
              c._tags[i].category = c;
              this._uuidMap[t.getUUID()] = t;
              this._nameMap[t.getUID()] = t;
            });*/
            this.cache.categories.push(c);
          })
          this.onCacheReady.next(this.cache);
          return this.cache.categories;
        }
      }));
  }

  listTags(pRefresh = false):Observable<Tag[]> {
    if(!pRefresh && this.cache.tags.length>0){
      return from([ this.cache.tags ]);
    }else{
      return this._process( this.endpoints['tag']['list'], {})
        .pipe(map( (pRes:any) => {
          if(!pRes.success){
            this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Tags"}));
            return [];
          }else{
            this.cache.tags = [];
            pRes.data.map((x:any) => {             const c = new Tag(x);
              this._uuidMap[c.getUUID()] = c;
              this._nameMap[c.getUID()] = c;
              this.cache.tags.push(c);
            })
            this.onCacheReady.next(this.cache);
            return this.cache.tags;
          }
        }));
    }
  }

  listCategoriesFromCache():TagCategory[]{
    return this.cache.categories;
  }

  getTagByName(pTagName:string):Tag {
    return this._nameMap[pTagName];
  }

  getTagByUUID(pUUID:number):Tag {
    return this._uuidMap[pUUID];
  }

  findTag(vPattern: string):Tag[] {
    if(this.searchCache[vPattern] != null){
      return this.searchCache[vPattern];
    }

    const tags:Tag[] = [];
    const pattern = new RegExp(vPattern);

    this.cache.tags.map((vTag:any) => {     if(pattern.test(vTag.getUID())){
        tags.push(vTag);
      }
    });

    return this.searchCache[vPattern] = tags;
  }
}

