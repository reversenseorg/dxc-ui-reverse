import {ICON_TYPE, IconModel} from "../../base/icon/IconModel";

export const FUZZ_ICONS = {
        SUCCESS: new IconModel({
            iconType: ICON_TYPE.ICON,
            type: 'fas',
            name: 'arrow-right-from-bracket',
            color1: 'dxc-success-icon'
        }),
        FAILURE: new IconModel({
            iconType: ICON_TYPE.ICON,
            type: 'fas',
            name: 'arrow-right-from-bracket',
            color1: 'dxc-error-icon'
        }),
    ENTRY: new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fas',
        name: 'arrow-right-to-bracket',
        color1: 'dxc-text-75'
    }),
    POLICY: new IconModel({
        iconType: ICON_TYPE.ICON,
        type: 'fas',
        name: 'brain-circuit',
        color1: 'dxc-text-yellow'
    })
};
