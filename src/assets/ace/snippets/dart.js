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

ace.define("ace/snippets/dart",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "snippet lib\n\
	library ${1};\n\
	${2}\n\
snippet im\n\
	import '${1}';\n\
	${2}\n\
snippet pa\n\
	part '${1}';\n\
	${2}\n\
snippet pao\n\
	part of ${1};\n\
	${2}\n\
snippet main\n\
	void main() {\n\
	  ${1:/* code */}\n\
	}\n\
snippet st\n\
	static ${1}\n\
snippet fi\n\
	final ${1}\n\
snippet re\n\
	return ${1}\n\
snippet br\n\
	break;\n\
snippet th\n\
	throw ${1}\n\
snippet cl\n\
	class ${1:`Filename(\"\", \"untitled\")`} ${2}\n\
snippet imp\n\
	implements ${1}\n\
snippet ext\n\
	extends ${1}\n\
snippet if\n\
	if (${1:true}) {\n\
	  ${2}\n\
	}\n\
snippet ife\n\
	if (${1:true}) {\n\
	  ${2}\n\
	} else {\n\
	  ${3}\n\
	}\n\
snippet el\n\
	else\n\
snippet sw\n\
	switch (${1}) {\n\
	  ${2}\n\
	}\n\
snippet cs\n\
	case ${1}:\n\
	  ${2}\n\
snippet de\n\
	default:\n\
	  ${1}\n\
snippet for\n\
	for (var ${2:i} = 0, len = ${1:things}.length; $2 < len; ${3:++}$2) {\n\
	  ${4:$1[$2]}\n\
	}\n\
snippet fore\n\
	for (final ${2:item} in ${1:itemList}) {\n\
	  ${3:/* code */}\n\
	}\n\
snippet wh\n\
	while (${1:/* condition */}) {\n\
	  ${2:/* code */}\n\
	}\n\
snippet dowh\n\
	do {\n\
	  ${2:/* code */}\n\
	} while (${1:/* condition */});\n\
snippet as\n\
	assert(${1:/* condition */});\n\
snippet try\n\
	try {\n\
	  ${2}\n\
	} catch (${1:Exception e}) {\n\
	}\n\
snippet tryf\n\
	try {\n\
	  ${2}\n\
	} catch (${1:Exception e}) {\n\
	} finally {\n\
	}\n\
";
exports.scope = "dart";

});
                (function() {
                    ace.require(["ace/snippets/dart"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            