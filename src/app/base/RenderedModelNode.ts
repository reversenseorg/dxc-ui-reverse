

export type ViewerType = "txt" | "hex" | "dis" | "def";

export interface RenderingOptions {
    view: ViewerType
}

const defaultUI:RenderingOptions = {
    view: "txt"
};

export class RenderedModelNode {
    _ui: RenderingOptions | null;

    constructor(pUI?:RenderingOptions) {
        this._ui = pUI==null ? defaultUI : pUI ;
    }

    setUiType(pType:ViewerType):void {
        if(this._ui==null) this._ui = defaultUI;
        this._ui.view = pType;
    }

    getUiType():ViewerType {
        if(this._ui==null) return "def";
        return this._ui.view;
    }
}