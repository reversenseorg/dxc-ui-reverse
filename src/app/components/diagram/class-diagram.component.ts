
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
    styleUrls: ['./mermaid.scss']
})
export class ClassDiagramComponent implements  AfterViewInit, OnDestroy {

    @ViewChild('diagramContainer', { static: true }) diagramContainer!: ElementRef;

    @Input() classes:ModelClass[] =  [];
    // Icons pour la toolbar
    icons = DIAGR_ICONS;

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

        this._renderDiagram();
    }

    ngOnDestroy() {

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

    private _generateClassDef(pClass:ModelClass, pStereotype = ClassStereotype.NONE){

        console.log("generate class def",pClass);
        let code = "";

        if(pClass.methods!=null){
            for(let i=0; i<pClass.methods.length; i++){
                code += `${pClass.simpleName} : ${pClass.methods[i].__callSignature__}\n`;
            }
        }

        if(pClass.fields){
            for(let i=0; i<pClass.fields.length; i++){
                code += `${pClass.simpleName} : ${pClass.fields[i].type.name} ${pClass.fields[i].name}\n`;
            }
        }

        return `class ${(pClass.simpleName!=null ? pClass.simpleName : pClass.name )}${this._generateStereotype(pStereotype)}${code.length>0?"{\n"+code+"}":";"}\n`;
    }

    private _generateMarkup():string {
        let code = "";
        let cls=0;
        let def:Record<string,string> = {};
        let inherit:string[] = [];

        this.classes.forEach( (c)=>{

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

                code += `${intf} <.. ${c.simpleName}\n`;
            }

            for(let i=0; i<c.supers.length; i++){
                let intf:ModelClass = c.supers[i] as ModelClass;
                if(intf == null || intf.name==null) continue;

                if(def[intf.name]==null){
                    def[intf.name] = this._generateClassDef(
                        intf,
                        /*intf.isAbstract()? ClassStereotype.ABSTRACT : */ClassStereotype.NONE);
                }

                if(i==0){
                    code += `${intf.name} <|-- ${c.name}\n`;
                }else{
                    code += `${c.supers[i-1].name} <|-- ${intf.name}\n`;
                }
            }

            code += this._generateClassDef(c);
            cls++;
        })

        if(cls==0){
            console.log(this.classes);
            throw new Error("Class Diagram Cmp : classes cannot be generated");
        }else{

            for(let k in def){
                code = def[k]+"\n"+code;
            }

            console.log(`\nclassDiagram\n${code}\n`);
            return `\nclassDiagram\n${code}\n`;
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