import {IconModel} from "../../../base/icon/IconModel";
import {SearchService} from "./search.service";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {CODE_ICONS} from "../../code/icons";
import {SEARCH_ICONS} from "../icons";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {TagCache, TagService} from "../../tag/ctrl/tag.service";
import {Tag} from "../../../models/tags/Tag";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {Nullable} from "../../../base/Nullable";
import {IStringIndex} from "../../../base/IStringIndex";
import {UIException} from "../../../base/error/UIException";


export interface RequestNode {
  selected: number;
  opts: SearchNode[]; // search node
}


const RequestHelperHIDDEN = [
  "opcode",
  "instruction",
  "modifiers"
];

export const RequestHelperTYPES = {
  T_NODE: 1,
  T_LITTERAL: 2,
  T_OPMODE: 3,
  T_MODIFIER: 4,
  T_TAGS: 5,
  T_TAG: 6
};

const RequestHelperOPMODE =  {
  equal: {
    text: "equals"
  },
  match: {
    text: "match RegExp"
  },
  hasModifier: {
    text: "is private/..."
  },
};

export interface SearchNode {
  label: string;
  icon?: Nullable<IconModel>;
  model?: any;
  _t: any;
  node?: SearchNode[];
  _f: Nullable<string>;
  _d?: number;
  _n?:NodeInternalType;
  _tags?: string[];
}

export interface SearchScope {
  label: string;
  icon: IconModel;
  _f: Nullable<string|string[]>;
}

export interface SearchNodeList {
  [name:string] :SearchNode;
}


export interface SearchScopeList {
  [name:string] :SearchScope;
}


export const BASIC_NODE:SearchNodeList = {
  NAME: {
    label: 'name',
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_LITTERAL,
    _f: "name",
  },
  RAW: {
    label: 'Advanced request',
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_LITTERAL,
    _f: "__RAW__",
  },

  BYTEARRAY: {
    label: 'Byte Array',
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_LITTERAL,
    _f: "bytearray",
  },
  SNAME: {
    label: 'Simple name',
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_LITTERAL,
    _f: "sname",
  },
  ALIAS: {
    label: 'Alias',
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_LITTERAL,
    _f: "alias",
  },
  FQCN: {
    label: 'FQCN',
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_LITTERAL,
    _f: "name",
  },
  ARGS: {
    label: 'Arg type',
    icon: CODE_ICONS['CLASS'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "args",
  },
  RET: {
    label: "Return type",
    icon: CODE_ICONS['CLASS'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "ret",
  },
  XREF_TO: {
    label: 'XRef TO',
    icon: CODE_ICONS['XREF_TO'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "caller",
    node: []
  },
  XREF_FROM: {
    label: "XRef FROM",
    icon: CODE_ICONS['XREF_FROM'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "calleed",
    node: []
  },
  READ: {
    label: 'Read',
    icon: CODE_ICONS['XREF_TO'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "caller",
    node: []
  },
  WRITE: {
    label: "Write",
    icon: CODE_ICONS['XREF_FROM'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "calleed",
    node: []
  },
  NEW: {
    label: "New instance",
    icon: CODE_ICONS['NEW'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "new",
    node: []
  },
  STRING_TAGS: {
    label: "Tags",
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_TAGS,
    _f: "has",
    _tags: [
      "^data\.format",
      "^data\.hash",
      "^data\.charset",
      "^data\.len",
      "^string\."
    ],
    node: []
  },
  TAG: {
    label: "Tag",
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_LITTERAL,
    _f: "tags",
  },
  ACCESSFLAGS: {
    label: "Access flags",
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_NODE,
    _f: null,
    node: [
      {
          label: "public",
        icon: null,
        _t: RequestHelperTYPES.T_MODIFIER,
          _f: "is.public",
      },{
      label: "protected",
        icon: null,
        _t: RequestHelperTYPES.T_MODIFIER,
        _f: "is.protected",
      },{
        label: "private",
        icon: null,
        _t: RequestHelperTYPES.T_MODIFIER,
        _f: "is.private",
      },{
        label: "native",
        icon: null,
        _t: RequestHelperTYPES.T_MODIFIER,
        _f: "is.native",
      },{
          label: "volatile",
        icon: null,
        _t: RequestHelperTYPES.T_MODIFIER,
        _f: "is.volatile",
      },{
          label: "static",
        icon: null,
        _t: RequestHelperTYPES.T_MODIFIER,
        _f: "is.static",
      }
    ]
  },
  STRING: {
    label: 'Strings',
    icon: SEARCH_ICONS['RAW'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "strings",
    _n: NodeInternalType.STRING,
    _tags: [
      "^data\.format",
      "^data\.hash",
      "^data\.charset",
      "^data\.len",
      "^string\."
    ],
    node: [
      {
        label: "value",
        icon: null,
        _t: RequestHelperTYPES.T_LITTERAL,
        _f: "value",
      }]
  },
  FIELD: {
    label: 'Field',
    icon: CODE_ICONS['FIELD'],
    _f: 'field',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.FIELD
  },
  CLASS: {
    label: 'Class',
    icon: CODE_ICONS['CLASS'],
    _f: 'class',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.CLASS
  },
  METH: {
    label: 'Method',
    icon: CODE_ICONS['METH'],
    _f: 'method',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.METHOD,
  },
  CLZ_METH: {
    label: 'method',
    icon: CODE_ICONS['METH'],
    _f: 'methods',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.METHOD
  },
  PKG: {
    label: 'Package',
    icon: CODE_ICONS['PKG'],
    _f: 'package',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.PACKAGE
  },
  FUNC: {
    label: 'Function',
    icon: CODE_ICONS['PKG'],
    _f: 'func',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.FUNC
  },
  SYSCALL: {
    label: 'Syscall',
    icon: CODE_ICONS['PKG'],
    _f: 'syscall',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.SYSCALL
  },
  INSTR: {
    label: 'Instruction',
    icon: CODE_ICONS['PKG'],
    _f: 'instr',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.INSTRUCTION
  },
  ACTIVITY: {
    label: 'Activity',
    icon: GLOBAL_ICONS['ANDROID'],
    _f: 'activity',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.ANDROID_ACTIVITY
  },
  PERMISSION: {
    label: 'Android Permission',
    icon: GLOBAL_ICONS['ANDROID'],
    _f: 'permission',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.ANDROID_PERM,
    _tags: [
      "^protectionLevel\..*"
    ]
  },
  PROVIDER: {
    label: 'Provider',
    icon: GLOBAL_ICONS['ANDROID'],
    _f: 'provider',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.ANDROID_PROVIDER
  },
  RECEIVER: {
    label: 'Receiver',
    icon: GLOBAL_ICONS['ANDROID'],
    _f: 'receiver',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.ANDROID_RECEIVER
  },
  SERVICE: {
    label: 'Service',
    icon: GLOBAL_ICONS['ANDROID'],
    _f: 'service',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.ANDROID_SERVICE
  },
  FILE: {
    label: 'File',
    icon: SEARCH_ICONS['FILE'],
    _f: 'file',
    _t: RequestHelperTYPES.T_NODE,
    _n: NodeInternalType.FILE
  }
};


BASIC_NODE['CLASS'].node = [
    BASIC_NODE['NAME'],
    BASIC_NODE['ALIAS'],
    BASIC_NODE['FQCN'],
    BASIC_NODE['ACCESSFLAGS'],
    BASIC_NODE['NEW']
  ];




BASIC_NODE['FILE'].node  = [
  BASIC_NODE['NAME']];

BASIC_NODE['CLZ_METH'].node  = BASIC_NODE['METH'].node = [
  BASIC_NODE['NAME'],
  BASIC_NODE['ALIAS'],
  {
    label: 'Param type',
    icon: CODE_ICONS['CLASS'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "args",
    node: BASIC_NODE['CLASS'].node
  },{
    label: "Return type",
    icon: CODE_ICONS['CLASS'],
    _t: RequestHelperTYPES.T_NODE,
    _f: "ret",
    node: BASIC_NODE['CLASS'].node
  },
  BASIC_NODE['TAG'],
  BASIC_NODE['ACCESSFLAGS'],
  BASIC_NODE['XREF_TO'],
  BASIC_NODE['XREF_FROM'],
];


BASIC_NODE['CLASS'].node.push({
  label: 'Methods',
  icon: CODE_ICONS['METH'],
  _f: 'methods[]',
  _t: RequestHelperTYPES.T_NODE,
  node: BASIC_NODE['METH'].node
});

BASIC_NODE['CLASS'].node.push({
  label: 'Implements',
  icon: CODE_ICONS['CLASS'],
  _f: 'implements',
  _t: RequestHelperTYPES.T_NODE,
  node: BASIC_NODE['CLASS'].node
});

BASIC_NODE['CLASS'].node.push({
  label: 'Extends',
  icon: CODE_ICONS['CLASS'],
  _f: 'extends',
  _t: RequestHelperTYPES.T_NODE,
  node: BASIC_NODE['CLASS'].node
});

BASIC_NODE['TAGS'] = {
  label: "Tags",
  icon: null,
  _t: RequestHelperTYPES.T_TAGS,
  _f: null,
  node: []
};

BASIC_NODE['FIELD'].node = [
    BASIC_NODE['NAME'],
    BASIC_NODE['ALIAS'],
    BASIC_NODE['FQCN'],
    BASIC_NODE['ACCESSFLAGS'],
    BASIC_NODE['READ'],
    BASIC_NODE['WRITE'],
    BASIC_NODE['TAGS'],
    {
      label: "enclosing class",
      icon: null,
      _t: RequestHelperTYPES.T_MODIFIER,
      _f: "is.static",
      node: BASIC_NODE['CLASS'].node
    }
  ];


BASIC_NODE['CLASS'].node.push({
  label: 'Fields',
  icon: CODE_ICONS['FIELD'],
  _f: 'fields[]',
  _t: RequestHelperTYPES.T_NODE,
  node: BASIC_NODE['FIELD'].node
});

BASIC_NODE['PKG'].node = [
    BASIC_NODE['NAME'],
    BASIC_NODE['ALIAS'],
  ];

BASIC_NODE['ARGS'].node = BASIC_NODE['CLASS'].node;
BASIC_NODE['RET'].node = BASIC_NODE['CLASS'].node;




// @ts-ignore
BASIC_NODE['STRING'].node.push({
  label: "location",
  icon: null,
  _t: RequestHelperTYPES.T_NODE,
  _f: "src",
  node: BASIC_NODE['METH'].node
});
//BASIC_NODE['STRING'].node.push(BASIC_NODE['STRING_TAGS']);

export const BUILTIN_SEARCH:SearchNode[] = [
  BASIC_NODE['METH'],
  BASIC_NODE['CLASS'],
  BASIC_NODE['FIELD'],
  BASIC_NODE['FUNC'],
  BASIC_NODE['SYSCALL'],
  BASIC_NODE['INSTR'],
  BASIC_NODE['TAG'],
  BASIC_NODE['PKG'],
  BASIC_NODE['STRING'],
  BASIC_NODE['BYTEARRAY'],
  BASIC_NODE['FILE'],
  BASIC_NODE['ACTIVITY'],
  BASIC_NODE['SERVICE'],
  BASIC_NODE['PROVIDER'],
  BASIC_NODE['RECEIVER'],
  BASIC_NODE['PERMISSION'],
  BASIC_NODE['RAW']
];


export const BUILTIN_SCOPES:SearchScopeList = {
  ALL: {
    label: 'All',
    icon: GLOBAL_ICONS['GLOBE'],
    _f: null
  },
  APP: {
    label: 'App',
    icon: GLOBAL_ICONS['WINDOW'],
    _f: ['ds','ds']
  },
  PLATFORM: {
    label: 'Android',
    icon: GLOBAL_ICONS['ANDROID'],
    _f: 'di'
  },
  DYN: {
    label: 'Dynamic',
    icon: GLOBAL_ICONS['DYN'],
    _f: 'dd'
  }
}



const RequestHelperMAP =  {
  modifiers: {
    "public": {
      type: RequestHelperTYPES.T_MODIFIER,
      token: "is.public",
      css: 'badge-warning'
    },
    "protected": {
      type: RequestHelperTYPES.T_MODIFIER,
      token: "is.protected",
      css: 'badge-warning'
    },
    "private": {
      type: RequestHelperTYPES.T_MODIFIER,
      token: "is.private",
      css: 'badge-warning'
    },
    "native": {
      type: RequestHelperTYPES.T_MODIFIER,
      token: "is.native",
      css: 'badge-warning'
    },
    "volatile": {
      type: RequestHelperTYPES.T_MODIFIER,
      token: "is.volatile",
      css: 'badge-warning'
    },
    "static": {
      type: RequestHelperTYPES.T_MODIFIER,
      token: "is.static",
      css: 'badge-warning'
    }
  },
  method: {
    "by name": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "name",
    },
    "by args type": {
      type: RequestHelperTYPES.T_NODE,
      ref: "class",
      token: "args"
    },
    "by return type": {
      type: RequestHelperTYPES.T_NODE,
      ref: "class",
      token: "ret"
    },
    "by enclosing class": {
      type: RequestHelperTYPES.T_NODE,
      ref: "class",
      token: "enclosingClass"
    },
    "by class used": {
      type: RequestHelperTYPES.T_NODE,
      ref: "class",
      token: "_useClass"
    },
    "by method called": {
      type: RequestHelperTYPES.T_NODE,
      ref: "method",
      token: "_useMethod"
    },
    "by field used": {
      type: RequestHelperTYPES.T_NODE,
      ref: "field",
      token: "_useField"
    },
    "called by": {
      type: RequestHelperTYPES.T_NODE,
      ref: "method",
      token:"_callers"
    },
    "by tag": {
      type: RequestHelperTYPES.T_LITTERAL,
      token:"tags"
    },
    "by modifiers (private/native/...)": {
      type: RequestHelperTYPES.T_NODE,
      ref: "modifiers"
    }
  },
  class: {
    "by interface": {
      type: RequestHelperTYPES.T_NODE,
      token: "implements",
      ref: "class"
    },
    "by super": {
      type: RequestHelperTYPES.T_NODE,
      token: "extends",
      ref: "class"
    },
    "FQCN is ...": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "name"
    },
    "simpleName is ...": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "simpleName"
    },
    package: {
      type: RequestHelperTYPES.T_NODE,
      ref: "package",
      token: "package"
    },
    "declaring Method": {
      type: RequestHelperTYPES.T_NODE,
      ref: "method",
      token: "method"
    },
    "declaring Field": {
      type: RequestHelperTYPES.T_NODE,
      ref: "field",
      token: "field"
    },
    "called by": {
      type: RequestHelperTYPES.T_NODE,
      ref: "method",
      token: "_callers"
    },
    "tagged ...": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "tags"
    }
  },
  field: {
    "where sgtters ... ": {
      type: RequestHelperTYPES.T_NODE,
      ref: "method",
      token: "_getters"
    },
    "where setters ... ": {
      type: RequestHelperTYPES.T_NODE,
      ref: "method",
      token: "_setters"
    },
    "name is ...": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "name"
    },
    "aliased ...": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "alias"
    },
    "signature": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "signature"
    },
    "where type ...": {
      type: RequestHelperTYPES.T_NODE,
      ref: "class",
      token: "type"
    },
    "tagged ...": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "tags"
    },
    "by modifiers":{
      type: RequestHelperTYPES.T_NODE,
      ref: "modifiers",
      css: 'badge-warning'
    }
  },
  string: {
    "by value": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "value",
      css: 'badge-warning'
    },
    "by tag": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "tags",
      css: 'badge-warning'
    },
    "by instruction": {
      type: RequestHelperTYPES.T_NODE,
      token: "instr",
      ref: "instruction"
    },
    "by method": {
      type: RequestHelperTYPES.T_NODE,
      token: "src",
      ref: "method"
    },
  },
  array: {
    "by tag": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "tags"
    },
  },
  call: {
    "by caller": {
      type: RequestHelperTYPES.T_NODE,
      ref: "method",
      token: "caller"
    },
    "by called": {
      type: RequestHelperTYPES.T_NODE,
      ref: "method",
      token: "calleed"
    },
    "by instruction": {
      type: RequestHelperTYPES.T_NODE,
      ref: "instruction",
      token: "instr"
    }
  },
  instruction: {
    "by value": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "raw"
    },
    "by basic-block offset": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "bb"
    },
    "tagged ...": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "tags"
    },
    "by smali pattern": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "_raw",
    },
    "by opcode": {
      type: RequestHelperTYPES.T_NODE,
      token: "opcode",
      ref: "opcode"
    }
  },
  opcode: {
    "where basic-block relative offset == ": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "offset"
    },
    "where smali == ": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "raw"
    },
    "where basic-block offset == ": {
      type: RequestHelperTYPES.T_LITTERAL,
      token: "bb"
    }
  }
};

export type RequestStep = SearchNode|SearchScope;


/*
 * Some node should be rendered differently depending of the constraint :
 * xref filtered by caller, should display called methods/class/fields/string
 * xref filtered by called, should display caller methods/class/fields/strings
 *
 * caller / calleed
 */

export interface SearchApiRequest {
  req:string;
  type:NodeInternalType;
  fmt?:SearchResultFacet;
}

export enum SearchResultFacet {
  NONE,
  CALLER,
  CALLED
}


const TOKEN_TYPES_MAPPING = {
  'strings':NodeInternalType.STRING,
  'fields':NodeInternalType.FIELD,
  'methods':NodeInternalType.METHOD,
  'classes':NodeInternalType.CLASS,
  'files':NodeInternalType.FILE,
  'activity':NodeInternalType.ANDROID_ACTIVITY,
  'service':NodeInternalType.ANDROID_SERVICE,
  'receiver':NodeInternalType.ANDROID_RECEIVER,
  'provider':NodeInternalType.ANDROID_PROVIDER,
  'call':'x',
}


export class RequestHelper
{
  state:RequestStep[] = []

  _stack: RequestNode[] = [];
  _currSet:Nullable<RequestNode> = null;
  _curr:Nullable<RequestNode> = null;

  _searchSvc:SearchService;
  _tagSvc:TagService;


  activeScope: Nullable<SearchScope> = null;

  constructor( pSearchService:SearchService, pTagService:TagService){
    this._searchSvc = pSearchService;

    this._tagSvc = pTagService;

    this._tagSvc.onCacheReady.subscribe((vCache:TagCache)=>{
      console.log(vCache);
      if(vCache.tags.length > 0){
        this._updateTagNodes(vCache.tags);
      }
    });

    this.reset();
  }

  /**
   *
   * @param pTags
   * @private
   */
  private _updateTagNodes( pTags:Tag[]){

    let tpl:SearchNode;
    const allTags:any[] = [];
    const tagMap: any = {};

    pTags.map( (vTag:Tag)=> {
      allTags.push(
        tagMap[vTag.getUID()] = {
          label: vTag.label,
          icon: null,
          _t: RequestHelperTYPES.T_TAG,
          _f: vTag.getUID(),
          _n: NodeInternalType.TAG
        }
      );
    });

    BASIC_NODE['TAGS'].node = allTags;

    for(const name in BASIC_NODE){
      tpl = BASIC_NODE[name];

      if(tpl._tags!=null){
        const t:any[] = [];
        tpl._tags.map((pattern,k) => {
          const re = new RegExp(pattern);
          for(let i=0;i<allTags.length;i++){
            if(re.test(allTags[i]._f)){
              t.push(allTags[i]);
            }
          }
        });

        if(tpl.node==null) tpl.node = [];
        tpl.node.push({
          label: "Tags",
          icon: SEARCH_ICONS['RAW'],
          _t: RequestHelperTYPES.T_TAGS,
          _f: null,
          node: t
        });
      }
      else if (tpl._t===RequestHelperTYPES.T_NODE) {
        if(tpl.node==null) tpl.node = [];
        tpl.node.push(BASIC_NODE['TAGS']);
      }
    }

    console.log(BASIC_NODE);
  }


  reset(){
    this.state = [];
    this._curr = {
      selected: 0,
      opts: BUILTIN_SEARCH
    };
    this._currSet = null;
    this._stack = [];
  }

  findReturnType(pPattern:string, pOptions:any):NodeInternalType {

    let req:string = pPattern;
    while(req.indexOf(')') < req.indexOf('.')){
      req = req.substr(req.indexOf('.'));
    }

    req = req.substr(0,req.indexOf('('));

    return (TOKEN_TYPES_MAPPING as IStringIndex<any>)[req];
  }


  static appendNode( pCmd:string, pNode:RequestNode, pPattern:Nullable<string>=null):string {
    const n:SearchNode = pNode.opts[pNode.selected];
    switch(n._t)
    {
      case RequestHelperTYPES.T_NODE:
        pCmd += n._f;
        break;
      case RequestHelperTYPES.T_LITTERAL:
        // escape double quote
        pCmd += `${n._f}:${pPattern}`;
        break;
      case RequestHelperTYPES.T_MODIFIER:
        /*if(nodes.length > 2)
          cmd += `").filter("${n._t}`;
        else*/
        pCmd += `"${n._t}"`;
        break;
      case RequestHelperTYPES.T_TAG:
        pCmd += n._f;
        break;
    }

    return pCmd;
  }

  /**
   *
   * @param pPattern
   * @param pOptions
   */
  compile(pPattern:string, pOptions:any):SearchApiRequest {

      if(this._curr==null){
        throw new UIException("request-generator : current request is null");
      }
      let cmd="";
      const nodes:RequestNode[] = this._stack;

      /*if(this._curr==null){
        throw UIException.
      }*/


      if(nodes.length==0){
        cmd = pPattern;
        if(this._curr.opts[this._curr.selected]._f=='__RAW__'){
          const ret = this.findReturnType(pPattern, pOptions);

            return {
              req: cmd,
              type: ret //this.findReturnType(pPattern, pOptions) //SearchResultFacet depend of the first token get.method, class, ...
            };

        }
      }

      // nodes.push(this._curr);

      for(let i=1; i<nodes.length; i++){
        if(i>1) cmd+=".";

        cmd = RequestHelper.appendNode(cmd, nodes[i], pPattern);
        /*
        n = nodes[i].opts[nodes[i].selected];
        switch(n._t)
        {
          case RequestHelperTYPES.T_NODE:
            cmd += n._f;
            break;
          case RequestHelperTYPES.T_LITTERAL:
            // escape double quote
            cmd += `${n._f}:${pPattern}`;
            break;
          case RequestHelperTYPES.T_MODIFIER:
            //if(nodes.length > 2)
            //  cmd += `").filter("${n._t}`;
            //else
              cmd += `"${n._t}"`;
            break;
          case RequestHelperTYPES.T_TAG:
            cmd += n._f;
            break;
        }*/
      }

      // append current node
      // nodes.push(this._curr);
      if(nodes.length>1) cmd += ".";
      cmd = RequestHelper.appendNode(cmd, this._curr, pPattern);

      const req:SearchApiRequest = {
        req: `${pOptions.nocase ? "nocase()." : ""}${nodes[0].opts[nodes[0].selected]._f}("${cmd}")${pOptions.apponly ? '.filter("tags:ds")' : ""}`,
        type: nodes[0].opts[nodes[0].selected]._n==null ? nodes[0].opts[nodes[0].selected]._n as NodeInternalType : NodeInternalType.CLASS
      };

      //nodes.pop();

      return req;
      /*
      if(nodes.length>0){
        return {
          request: `${pOptions.nocase ? "nocase()." : ""}${nodes[0].opts[nodes[0].selected]._f}("${cmd}")${pOptions.apponly ? '.filter("tags:ds")' : ""}`,
          type: nodes[0].opts[nodes[0].selected]._n
        }
      }else{

        // escape double quote
        return {
          req: `${pOptions.nocase?"nocase().":""}${this._curr.opts[this._curr.selected]._f}("${pPattern}")${pOptions.apponly?'.filter("tags:ds")':""}`,
          type: this._curr.opts[this._curr.selected]._f
        };
      }*/
      /*
      nodes
      nocase().meth("null.").filter("4")
      method > access flags > native
       */

  }

  /**
   *
   * @param pPattern
   */
  execute(pPattern:string):Observable<any> {
    const request = this.compile(pPattern, { nocase:true, apponly:false });
    return this._searchSvc.executeRaw(request.req).pipe(map( (pObs:any) => {

      if(pObs.data!=null){
        pObs.data.map( (vRes:any) => {
          //vRes._t = request.type;
          //vRes.__ = request.type;
        });
      }

      console.log(pObs);
      return pObs;
    }));
  }



  applyScope(pScopeName:string){
    this.activeScope = BUILTIN_SCOPES[pScopeName];
  }


  selectNode(pOffset = -1):Nullable<RequestNode> {

    if(this._curr==null){
      throw UIException.SOMETHING_IS_WRONG_WITH_REQUEST("request-generator : current request is null");
    }

    if(this._curr.opts[pOffset] != null){
      this._curr.selected = pOffset;

      if(this._curr.opts[pOffset].hasOwnProperty("node") && this._curr.opts[pOffset].node!=null){
        this._stack.push( this._curr);
        this._curr = {
          selected: 0,
          opts: this._curr.opts[pOffset].node!=null ? this._curr.opts[pOffset].node as SearchNode[] : []
        };
        return this._curr;
      }else{
        return null;
      }
    }else{
      return null;
    }
  }

  /**
   *
   * @param {number} pStackOffset Node offset into current stack
   * @param {number} pOffset Choice offset into option list of the current node
   */
  changePickedFilter(pNode:any, pStackOffset:number, pOffset:number):Nullable<RequestNode> {
    // not null or undefined
    let oldStack:RequestNode[] = [];

    if(this._stack[pStackOffset]!=null){

      oldStack = this._stack;
      if(pStackOffset>0){
        this._stack = this._stack.slice(0, pStackOffset);
        this._stack.push({
          selected: pOffset,
          opts: oldStack[pStackOffset].opts
        });
        this._curr = {
          selected: 0,
          opts: this._stack[pStackOffset].opts[pOffset].node!=null ? this._stack[pStackOffset].opts[pOffset].node as SearchNode[] : []
        };
      }else{

        console.log("Helper.changePickedFilter : ", pOffset, BUILTIN_SEARCH);


        if(BUILTIN_SEARCH[pOffset]._t==RequestHelperTYPES.T_LITTERAL){
          this._stack = [];
          this._curr = {
            selected: pOffset,
            opts: BUILTIN_SEARCH
          };
        }else{
          this._stack = [{
            selected: pOffset,
            opts: BUILTIN_SEARCH// oldStack[pStackOffset].opts
          }];
          this._curr = {
            selected: 1,
            opts: (this._stack[0].opts[pOffset].node!=null? this._stack[0].opts[pOffset].node as SearchNode[] : [])
          };
        }
      }

      oldStack = [];

      return this._curr;
    }else{
      return null;
    }
  }

  getCurrentNode():Nullable<RequestNode>{
    return this._curr;
  }

  getActiveFilters():RequestNode[]{
    return this._stack;
  }

  getBuiltinScopes():SearchScopeList {
    return BUILTIN_SCOPES;
  }
  getDefaultScope():SearchScope {
    return BUILTIN_SCOPES['ALL'];
  }
}
