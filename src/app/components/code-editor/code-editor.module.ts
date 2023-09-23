import {NgModule} from "@angular/core";
import {CodeEditorComponent} from "./code-editor.component";
import {CodeEditorDirective} from "./code-editor.directive";

const list = [
    CodeEditorComponent,
    CodeEditorDirective
]

@NgModule({
    declarations: [
        ...list
    ],
    imports: [],
    providers: [],
    exports: list
})
export class CodeEditorModule {

}