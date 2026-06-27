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

ace.define("ace/theme/terminal",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-terminal-theme";
exports.cssText = ".ace-terminal-theme .ace_gutter {\
background: #1a0005;\
color: steelblue\
}\
.ace-terminal-theme .ace_print-margin {\
width: 1px;\
background: #1a1a1a\
}\
.ace-terminal-theme {\
background-color: black;\
color: #DEDEDE\
}\
.ace-terminal-theme .ace_cursor {\
color: #9F9F9F\
}\
.ace-terminal-theme .ace_marker-layer .ace_selection {\
background: #424242\
}\
.ace-terminal-theme.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px black;\
}\
.ace-terminal-theme .ace_marker-layer .ace_step {\
background: rgb(0, 0, 0)\
}\
.ace-terminal-theme .ace_marker-layer .ace_bracket {\
background: #090;\
}\
.ace-terminal-theme .ace_marker-layer .ace_bracket-start {\
background: #090;\
}\
.ace-terminal-theme .ace_marker-layer .ace_bracket-unmatched {\
margin: -1px 0 0 -1px;\
border: 1px solid #900\
}\
.ace-terminal-theme .ace_marker-layer .ace_active-line {\
background: #2A2A2A\
}\
.ace-terminal-theme .ace_gutter-active-line {\
background-color: #2A112A\
}\
.ace-terminal-theme .ace_marker-layer .ace_selected-word {\
border: 1px solid #424242\
}\
.ace-terminal-theme .ace_invisible {\
color: #343434\
}\
.ace-terminal-theme .ace_keyword,\
.ace-terminal-theme .ace_meta,\
.ace-terminal-theme .ace_storage,\
.ace-terminal-theme .ace_storage.ace_type,\
.ace-terminal-theme .ace_support.ace_type {\
color: tomato\
}\
.ace-terminal-theme .ace_keyword.ace_operator {\
color: deeppink\
}\
.ace-terminal-theme .ace_constant.ace_character,\
.ace-terminal-theme .ace_constant.ace_language,\
.ace-terminal-theme .ace_constant.ace_numeric,\
.ace-terminal-theme .ace_keyword.ace_other.ace_unit,\
.ace-terminal-theme .ace_support.ace_constant,\
.ace-terminal-theme .ace_variable.ace_parameter {\
color: #E78C45\
}\
.ace-terminal-theme .ace_constant.ace_other {\
color: gold\
}\
.ace-terminal-theme .ace_invalid {\
color: yellow;\
background-color: red\
}\
.ace-terminal-theme .ace_invalid.ace_deprecated {\
color: #CED2CF;\
background-color: #B798BF\
}\
.ace-terminal-theme .ace_fold {\
background-color: #7AA6DA;\
border-color: #DEDEDE\
}\
.ace-terminal-theme .ace_entity.ace_name.ace_function,\
.ace-terminal-theme .ace_support.ace_function,\
.ace-terminal-theme .ace_variable {\
color: #7AA6DA\
}\
.ace-terminal-theme .ace_support.ace_class,\
.ace-terminal-theme .ace_support.ace_type {\
color: #E7C547\
}\
.ace-terminal-theme .ace_heading,\
.ace-terminal-theme .ace_string {\
color: #B9CA4A\
}\
.ace-terminal-theme .ace_entity.ace_name.ace_tag,\
.ace-terminal-theme .ace_entity.ace_other.ace_attribute-name,\
.ace-terminal-theme .ace_meta.ace_tag,\
.ace-terminal-theme .ace_string.ace_regexp,\
.ace-terminal-theme .ace_variable {\
color: #D54E53\
}\
.ace-terminal-theme .ace_comment {\
color: orangered\
}\
.ace-terminal-theme .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYLBWV/8PAAK4AYnhiq+xAAAAAElFTkSuQmCC) right repeat-y;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/terminal"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            