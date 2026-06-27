
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

import mermaid from 'mermaid';

import {
    Component,
    OnDestroy,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import {DIAGR_ICONS} from "./icons";
import ModelClass from "../../models/ModelClass";
import {GraphDataService} from "../graph/graph.service";
import {DiagramService} from "./diagram.service";
import ModelMethod from "../../models/ModelMethod";
import ModelField from "../../models/ModelField";
import {Nullable} from "../../base/Nullable";
import {CodeControllerService} from "../code/ctrl/code-controller.service";
import {forkJoin} from "rxjs";


export enum ClassStereotype {
    NONE=0,
    INTERFACE=1,
    ABSTRACT=2,
    GENERIC=3,
}

@Component({
    selector: 'dxs-diagram-class',
    template: `
        <div #diagramContainer class="mermaid-container"></div>
    `,
    styles: [`

      /*.mermaid-container {
        background-color: #ddd;
      }
      #diagram-id .dependency,
      #diagram-id .relation {
        stroke: #fff !important;
      }
      
      .marker .relation {
        stroke: #fff !important;
      }

      .marker .extension,
      .marker .lollipop,
      .marker .aggregation {
        stroke: #fff !important;
      }
      .marker .composition,
      .marker .dependency {
        stroke: #fff !important;
        fill: #fff !important;
      }*/
    `]
})
export class ClassDiagramComponent implements  AfterViewInit, OnDestroy {

    @ViewChild('diagramContainer', { static: true }) diagramContainer!: ElementRef;

    @Input() classes:ModelClass[] =  [];
    // Icons pour la toolbar
    icons = DIAGR_ICONS;
    styles:Record<string, string> = {};


    constructor(private diagSvc: DiagramService) {

    }


    ngAfterViewInit() {
        this.initializeMermaid();


    }

    private initializeMermaid() {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            }
        });


        this._setClassStyle(
            `default`,
            "fill:#777,stroke:#fff,color:#fff,stroke-width:2px"
        );

        let cls:any = {};
        let needs

        /*
        this.classes.map(c => {
            if(c.name==null) return;

            if(cls[c.name]==null){
                cls[c.name] = this.diagSvc.getClass(c.name);
            }

            if(c.implements!=undefined){
                for(let i=0; i<c.implements.length; i++) {

                }
            }


            if(c.supers!=undefined){
                for(let i=0; i<c.supers.length; i++) {

                }
            }

        });*/

        /*forkJoin(needs).subscribe({
            next: (vForkRes:any)=>{
                console.log("Report > fork join > SUCCESS ",vForkRes);
                this._changeRef.detectChanges();
            },
            error: (vErr)=>{
                console.log("Report > fork join > ERROR : ",vErr);
            }
        })*/

        this._renderDiagram();
    }

    ngOnDestroy() {

    }

    private _setClassStyle(pClass:string, pStyle:string):void {
        this.styles[pClass] = pStyle;
    }

    private _generateStereotype( pStereotype:ClassStereotype):string {
        switch( pStereotype) {
            case ClassStereotype.INTERFACE: return "<<interface>>";
            case ClassStereotype.ABSTRACT: return "<<abstract>>";
            case ClassStereotype.GENERIC: return "<<generic>>";
            case ClassStereotype.NONE:
            default:
                return "";
        }
    }

    private _encodeSymbol( pSymbol:string ):string {
        let encoded = pSymbol;

        /*
        while(encoded.indexOf('<')>-1)
            encoded = encoded.replace('<', '&lt');
        while(encoded.indexOf('>')>-1)
            encoded = encoded.replace('>', '&gt');
        */
        while(encoded.indexOf('<')>-1)
            encoded = encoded.replace('<', '');
        while(encoded.indexOf('>')>-1)
            encoded = encoded.replace('>', '');
        while(encoded.indexOf('$')>-1)
            encoded = encoded.replace('$', '.');

        return encoded;

    }


    private _generateClassDef(pClass:ModelClass, pStereotype = ClassStereotype.NONE, pStyle = ""){

        console.log("generate class def",pClass);
        let code = "";
        let cdef = `class ${this._encodeSymbol(pClass.name as string)}${pStyle.length>0?":::"+pStyle:""}`;
        let all = `${cdef}\n`;


        if(pClass.methods!=null){
            for(let i=0; i<pClass.methods.length; i++){
                if(pClass.methods[i].__callSignature__!=null){
                    code += `+${this._encodeSymbol(pClass.methods[i].__callSignature__ as string)}\n`;
                }

            }
        }

        if(pClass.fields){
            for(let i=0; i<pClass.fields.length; i++){
                code += `+${this._encodeSymbol(pClass.fields[i].type.name)} ${this._encodeSymbol(pClass.fields[i].name as string)}\n`;
            }
        }

        const s = this._generateStereotype(pStereotype);
        if(s.length>0){
            all += `${s} ${pClass.simpleName!=null?pClass.simpleName:pClass.name}\n`;
        }

        if(code.length>0){
            return all+`${cdef}{\n${code}\n}\n`;
        }else{
            return all+`\n`;
        }
    }

    private _escapeString(pStr:string):string {
        let str = pStr;
        let match:any;

        do{
            str = str.replace(/([^\\])?"/,'$1\\"');
            match = /^"|([^\\])"/.test(str);
        }while(match);

        return str;
    }

    private _addNote(pNote:string, pClass:Nullable<string> = null):string {
        return `note ${pClass!=null?"for "+pClass:""}"${this._escapeString(pNote)}"`
    }

    private _generateMarkup():string {
        let code = "";
        let cls=0;
        let def:Record<string,string> = {};
        let inherit:string[] = [];

        this.classes.forEach( (c,i)=>{

            this._setClassStyle(
                `focused${i}`,
                "fill:#777,stroke:#76D93E,color:#fff,stroke-width:2px"
            );

            if(c.implements!=undefined){
                for(let i=0; i<c.implements.length; i++){

                    let intf = c.implements[i];
                    if(intf == null) continue;

                    if(typeof intf!="string"){
                        intf = (intf as ModelClass).name as string;
                    }

                    if(def[intf]==null){
                        def[intf] = this._generateClassDef(new ModelClass({
                            name: intf
                        }),ClassStereotype.INTERFACE);
                    }

                    code += `${intf} <.. ${this._encodeSymbol(c.name as string)}\n`;
                }
            }



            if(c.supers!=undefined){
                for(let i=0; i<c.supers.length; i++){
                    let intf:ModelClass = c.supers[i] as ModelClass;
                    if(intf == null || intf.name==null) continue;

                    if(def[intf.name]==null){
                        def[intf.name] = this._generateClassDef(
                            intf,
                            /*intf.isAbstract()? ClassStereotype.ABSTRACT : */ClassStereotype.NONE);
                    }

                    if(i==0){
                        code += `${this._encodeSymbol(intf.name)} <|-- ${this._encodeSymbol(c.name as string)}\n`;
                    }else{
                        code += `${this._encodeSymbol(intf.name)} <|-- ${this._encodeSymbol(c.supers[i-1].name as string)}\n`;
                    }
                }
            }

            code += this._generateClassDef(c,ClassStereotype.NONE,`focused${i}`);
            cls++;
        })

        if(cls==0){
            console.log(this.classes);
            throw new Error("Class Diagram Cmp : classes cannot be generated");
        }else{

            for(let k in def){
                code = def[k]+code;
            }

            let styles = "";
            for(let k in this.styles){
                styles += `classDef ${k} ${this.styles[k]};\n`;
            }

            /*
            config:
  theme: 'default'
  themeVariables:
    primaryColor: '#BB2528'
    primaryTextColor: '#fff'
    primaryBorderColor: '#7C0000'
    lineColor: '#F8B229'
    secondaryColor: '#006100'
    tertiaryColor: '#fff'
---
             */
            console.log(`\nclassDiagram\n${code}\n${styles}\n`);
            /*return `---
config:
  theme: 'default'
  themeVariables:
    primaryColor: '#999'
    primaryTextColor: '#fff'
    primaryBorderColor: '#fff'
    lineColor: '#F8B229'
    secondaryColor: '#999'
    tertiaryColor: '#999'
---
classDiagram\n${code}\n${styles}\n`;*/

            return `---
config:
  theme: 'default'
  themeVariables:
    primaryColor: '#999'
    primaryTextColor: '#fff'
    primaryBorderColor: '#fff'
    lineColor: '#F8B229'
    secondaryColor: '#999'
    tertiaryColor: '#999'
---
classDiagram\n${code}\n${styles}\n`;
        }
    }
    private async _renderDiagram() {


        const diagramCode = `
classDiagram
Class01 <|-- AveryLongClass : Cool
<<Interface>> Class01
Class09 --> C2 : Where am I?
Class09 --* C3
Class09 --|> Class07
Class07 : equals()
Class07 : Object[] elementData
Class01 : size()
Class01 : int chimp
Class01 : int gorilla
class Class10 {
  <<service>>
  int id
  size()
}
    `;

        try {
            const { svg } = await mermaid.render(
                'diagram-id',
                    this._generateMarkup()
                );
            this.diagramContainer.nativeElement.innerHTML = svg;
        } catch (error) {
            console.error('Mermaid : class diagram error > ', error);
        }
    }

}