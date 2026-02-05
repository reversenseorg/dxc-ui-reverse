import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {from, Observable, Subject, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {DxcApiService} from "../../../base/DxcApiService";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {AppMenuService} from "../../../base/appmenu/app-menu.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {OutputService} from "../../output/ctrl/output.service";
import TagCategory from "../../../models/tags/TagCategory";
import {Tag} from "../../../models/tags/Tag";
import {Ace} from "ace-builds";
import {Nullable} from "../../../base/Nullable";

export interface TagCache {
  categories: TagCategory[],
  tags: Tag[],
  byCat: Record<string, Tag[]>
}

export interface TagMapping {
  [namePattern:string] :Tag[]
}

export interface SearchOptions {
  regexp:boolean;
}

export interface FilterOptions {
  request:any;
  options:SearchOptions;
}

export interface TagMenuEvent {
  tag:Tag;
  evt:any;
  editable:boolean;
}
// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class TagService extends DxcApiService {

  onCacheReady: Subject<TagCache> = new Subject<TagCache>();

  cache:TagCache ={
    categories: [],
    tags: [],
    byCat: {}
  }

  searchCache:any = {};

  _uuidMap:any = {};
  _nameMap:any = {};

  refreshing:Nullable<Observable<Tag[]>> = null;

  onTagMenu$:Subject<TagMenuEvent> = new Subject<TagMenuEvent>();

  constructor( private appmenuSvc:AppMenuService,  private outputSvc:OutputService,  protected override _http:HttpClient) {
    super(
      {
        category: {
          list: { method:'GET', url:'/tag/categories', format: 'json', auth:false /* removed */, puid:true }
        },
        tag: {
          list: { method:'GET', url:'/tag/tags', format: 'json', auth:false /* removed */, puid:true },
          save: { method:'POST', url:'/tag/tags', format: 'json', auth:false /* removed */, puid:true }
        }
      },_http,outputSvc
    );
  }

  listCategories(pRefresh = false):Observable<TagCategory[]> {
    if(!pRefresh && this.cache.categories.length>0){
      return from([this.cache.categories])
    }

    return this._process( this.endpoints['category']['list'], {})
      .pipe(map( pRes => {
        if(!pRes.success){
          this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Tags"}));
          return [];
        }else{
          this.cache.categories = [];
          pRes.data.map((x:any) => {
            const c = new TagCategory(x);
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


  /**
   * To list all tags or filter existing tags remotly
   *
   * @param {boolean} pRefresh
   * @param {Nullable<FilterOptions>} pFilter
   * @return {Observable<Tag[]>} An observable list of Tag
   */
  listTags(pRefresh = false, pFilter:Nullable<FilterOptions> = null):Observable<Tag[]> {

    if(pRefresh && this.refreshing){
        // waiting
        return this.refreshing;
    }

    if(!pRefresh && this.cache.tags.length>0 && pFilter==null){
      return from([ this.cache.tags ]);
    }else{
      const opts:any = {};
      if(pFilter!=null){
        opts.filter = btoa(JSON.stringify(pFilter));
      }

      this.refreshing = this._process( this.endpoints['tag']['list'], opts).pipe(map( (pRes:any) => {
          if(!pRes.success){
            this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Tags"}));
            return [];
          }else{
            if(pFilter==null){
              this.cache.tags = [];
              pRes.data.map((x:any) => {             const c = new Tag(x);
                this._uuidMap[c.getUUID()] = c;
                this._nameMap[c.getUID()] = c;
                this.cache.tags.push(c);
              })
              this.onCacheReady.next(this.cache);
              this.refreshing = null;

              return this.cache.tags;
            }else{
              return pRes.data.map((x:any) => new Tag(x));
            }

          }
        }));

      return this.refreshing;
    }
  }

  /**
   * To recreate a list of tree of tags.
   * Starting with a root per top category
   *
   *
   */
  listTagsByCategory(pCat:TagCategory, pRefresh = false):Observable<Tag[]> {
    if(!pRefresh && this.cache.byCat[pCat.name] != null){
      return from([ this.cache.byCat[pCat.name] ]);
    }else{
      return this._process( this.endpoints['tag']['list'],  {
              filter: btoa(JSON.stringify({
                request:{ category:pCat.name },
                options: {regexp:false}
              }))
      }).pipe(map( (pRes:any) => {
            if(!pRes.success){
              this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Tags"}));
              return [];
            }else{
              let buffer:Tag[] = [];
              pRes.data.map((x:any) => {
                const c = new Tag(x);
                c.category = pCat;
                this._uuidMap[c.getUUID()] = c;
                this._nameMap[c.getUID()] = c;
                buffer.push(c);
              })

              return pCat._tags = this.cache.byCat[pCat.getUID()] = buffer;
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

  /**
   * To create or update a tag
   *
   * @param {Tag} tag
   */
  saveTag(pTag: Tag):Observable<boolean> {

    return this._process( this.endpoints['tag']['save'], { data:pTag.toJsonObject() })
        .pipe(map( (pRes:any) => {
          if(!pRes.success){
            this.outputSvc.print(OutputMessage.newError({msg:pRes.msg, src:"Tags"}));
            return false;
          }else{
            return true;
          }
        }));
  }
}

