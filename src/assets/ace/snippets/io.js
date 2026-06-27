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

ace.define("ace/snippets/io",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippets = [
    {
        "content": "assertEquals(${1:expected}, ${2:expr})",
        "name": "assertEquals",
        "scope": "io",
        "tabTrigger": "ae"
    },
    {
        "content": "${1:${2:newValue} := ${3:Object} }clone do(\n\t$0\n)",
        "name": "clone do",
        "scope": "io",
        "tabTrigger": "cdo"
    },
    {
        "content": "docSlot(\"${1:slotName}\", \"${2:documentation}\")",
        "name": "docSlot",
        "scope": "io",
        "tabTrigger": "ds"
    },
    {
        "content": "(${1:header,}\n\t${2:body}\n)$0",
        "keyEquivalent": "@(",
        "name": "Indented Bracketed Line",
        "scope": "io",
        "tabTrigger": "("
    },
    {
        "content": "\n\t$0\n",
        "keyEquivalent": "\r",
        "name": "Special: Return Inside Empty Parenthesis",
        "scope": "io meta.empty-parenthesis.io, io meta.comma-parenthesis.io"
    },
    {
        "content": "${1:methodName} := method(${2:args,}\n\t$0\n)",
        "name": "method",
        "scope": "io",
        "tabTrigger": "m"
    },
    {
        "content": "newSlot(\"${1:slotName}\", ${2:defaultValue}, \"${3:docString}\")$0",
        "name": "newSlot",
        "scope": "io",
        "tabTrigger": "ns"
    },
    {
        "content": "${1:name} := Object clone do(\n\t$0\n)",
        "name": "Object clone do",
        "scope": "io",
        "tabTrigger": "ocdo"
    },
    {
        "content": "test${1:SomeFeature} := method(\n\t$0\n)",
        "name": "testMethod",
        "scope": "io",
        "tabTrigger": "ts"
    },
    {
        "content": "${1:Something}Test := ${2:UnitTest} clone do(\n\t$0\n)",
        "name": "UnitTest",
        "scope": "io",
        "tabTrigger": "ut"
    }
];
exports.scope = "io";

});
                (function() {
                    ace.require(["ace/snippets/io"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            