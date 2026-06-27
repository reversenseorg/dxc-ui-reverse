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

ace.define("ace/snippets/csound_orchestra",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# else\n\
snippet else\n\
	else\n\
		${1:/* statements */}\n\
# elseif\n\
snippet elseif\n\
	elseif ${1:/* condition */} then\n\
		${2:/* statements */}\n\
# if\n\
snippet if\n\
	if ${1:/* condition */} then\n\
		${2:/* statements */}\n\
	endif\n\
# instrument block\n\
snippet instr\n\
	instr ${1:name}\n\
		${2:/* statements */}\n\
	endin\n\
# i-time while loop\n\
snippet iwhile\n\
	i${1:Index} = ${2:0}\n\
	while i${1:Index} < ${3:/* count */} do\n\
		${4:/* statements */}\n\
		i${1:Index} += 1\n\
	od\n\
# k-rate while loop\n\
snippet kwhile\n\
	k${1:Index} = ${2:0}\n\
	while k${1:Index} < ${3:/* count */} do\n\
		${4:/* statements */}\n\
		k${1:Index} += 1\n\
	od\n\
# opcode\n\
snippet opcode\n\
	opcode ${1:name}, ${2:/* output types */ 0}, ${3:/* input types */ 0}\n\
		${4:/* statements */}\n\
	endop\n\
# until loop\n\
snippet until\n\
	until ${1:/* condition */} do\n\
		${2:/* statements */}\n\
	od\n\
# while loop\n\
snippet while\n\
	while ${1:/* condition */} do\n\
		${2:/* statements */}\n\
	od\n\
";
exports.scope = "csound_orchestra";

});
                (function() {
                    ace.require(["ace/snippets/csound_orchestra"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            