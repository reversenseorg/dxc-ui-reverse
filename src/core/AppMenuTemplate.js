"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMenuTpl = void 0;
exports.AppMenuTpl = [
    {
        label: 'File',
        submenu: [{
                label: 'New project'
            }, {
                label: 'Open ...',
            }, {
                label: 'Save',
            },
            {
                label: 'Quit',
            }]
    }, {
        label: 'Code',
        submenu: [{
                label: 'Search ...',
            }, {
                type: 'separator'
            }, {
                label: 'Show control-flow graph',
            }, {
                label: 'Show cross-reference',
            }, {
                label: 'Show xref graph from ...',
            }, {
                label: 'Show xref graph to ...',
            }, {
                type: 'separator'
            }, {
                label: 'Search system calls',
            }, {
                label: 'Search instruction',
            }, {
                label: 'Search data by tag',
            }, {
                label: 'Search calls',
            }, {
                label: 'Search with constraints',
            }]
    }, {
        label: 'Instrumentation',
        submenu: [{
                label: 'Single-Application level',
            }, {
                label: 'Device level',
            }, {
                label: 'Multi-device',
            }, {
                type: 'separator'
            }, {
                label: 'Java',
            }, {
                label: 'Native',
            }]
    }, {
        label: 'Memory',
        submenu: [{
                label: 'Explore',
            }, {
                type: 'separator'
            }, {
                label: 'History',
            }]
    }, {
        label: 'Device',
        submenu: [{
                label: 'Device Manager',
            }, {
                label: 'Show screen mirror',
            }, {
                label: 'Record ...',
            }]
    }, {
        label: 'Emulator',
        submenu: [{
                label: 'Dexcalibur DVM',
            }, {
                label: 'QEMU',
            }]
    }, {
        label: 'Communication',
        submenu: [{
                label: 'Monitor',
            }, {
                type: 'separator'
            }, {
                label: 'HTTP(S)',
            }, {
                label: 'NFC',
            }, {
                label: 'Bluetoothe',
            }, {
                label: 'IPC / Binder',
            }, {
                label: 'TEE',
            }, {
                label: 'Android Intents',
            }]
    }, {
        label: 'Plugins',
        submenu: [{
                label: 'YARA',
            }, {
                label: 'Crypto',
            }, {
                label: 'TEE client',
            }, {
                label: 'Fuzzer',
            }]
    }, {
        label: 'Settings',
        submenu: [{
                label: 'General',
            }, {
                label: 'Project',
            }, {
                type: 'separator'
            }, {
                label: 'External tools',
            }]
    }, {
        label: 'Help',
        submenu: [{
                label: 'About Dexcalibur',
            }, {
                label: 'Online documentation',
            }]
    }
];
//# sourceMappingURL=AppMenuTemplate.js.map