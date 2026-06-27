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

ace.define("ace/theme/gruvbox",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-gruvbox";
exports.cssText = ".ace-gruvbox .ace_gutter-active-line {\
background-color: #3C3836;\
}\
.ace-gruvbox {\
color: #EBDAB4;\
background-color: #1D2021;\
}\
.ace-gruvbox .ace_invisible {\
color: #504945;\
}\
.ace-gruvbox .ace_marker-layer .ace_selection {\
background: rgba(179, 101, 57, 0.75)\
}\
.ace-gruvbox.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #002240;\
}\
.ace-gruvbox .ace_keyword {\
color: #8ec07c;\
}\
.ace-gruvbox .ace_comment {\
font-style: italic;\
color: #928375;\
}\
.ace-gruvbox .ace-statement {\
color: red;\
}\
.ace-gruvbox .ace_variable {\
color: #84A598;\
}\
.ace-gruvbox .ace_variable.ace_language {\
color: #D2879B;\
}\
.ace-gruvbox .ace_constant {\
color: #C2859A;\
}\
.ace-gruvbox .ace_constant.ace_language {\
color: #C2859A;\
}\
.ace-gruvbox .ace_constant.ace_numeric {\
color: #C2859A;\
}\
.ace-gruvbox .ace_string {\
color: #B8BA37;\
}\
.ace-gruvbox .ace_support {\
color: #F9BC41;\
}\
.ace-gruvbox .ace_support.ace_function {\
color: #F84B3C;\
}\
.ace-gruvbox .ace_storage {\
color: #8FBF7F;\
}\
.ace-gruvbox .ace_keyword.ace_operator {\
color: #EBDAB4;\
}\
.ace-gruvbox .ace_punctuation.ace_operator {\
color: yellow;\
}\
.ace-gruvbox .ace_marker-layer .ace_active-line {\
background: #3C3836;\
}\
.ace-gruvbox .ace_marker-layer .ace_selected-word {\
border-radius: 4px;\
border: 8px solid #3f475d;\
}\
.ace-gruvbox .ace_print-margin {\
width: 5px;\
background: #3C3836;\
}\
.ace-gruvbox .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNQUFD4z6Crq/sfAAuYAuYl+7lfAAAAAElFTkSuQmCC\") right repeat-y;\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);

});
                (function() {
                    ace.require(["ace/theme/gruvbox"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            