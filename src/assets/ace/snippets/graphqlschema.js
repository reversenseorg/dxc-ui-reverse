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

ace.define("ace/snippets/graphqlschema",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# Type Snippet\n\
trigger type\n\
snippet type\n\
	type ${1:type_name} {\n\
		${2:type_siblings}\n\
	}\n\
\n\
# Input Snippet\n\
trigger input\n\
snippet input\n\
	input ${1:input_name} {\n\
		${2:input_siblings}\n\
	}\n\
\n\
# Interface Snippet\n\
trigger interface\n\
snippet interface\n\
	interface ${1:interface_name} {\n\
		${2:interface_siblings}\n\
	}\n\
\n\
# Interface Snippet\n\
trigger union\n\
snippet union\n\
	union ${1:union_name} = ${2:type} | ${3: type}\n\
\n\
# Enum Snippet\n\
trigger enum\n\
snippet enum\n\
	enum ${1:enum_name} {\n\
		${2:enum_siblings}\n\
	}\n\
";
exports.scope = "graphqlschema";

});
                (function() {
                    ace.require(["ace/snippets/graphqlschema"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            