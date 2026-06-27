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

ace.define("ace/snippets/wollok",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "##\n\
## Basic Java packages and import\n\
snippet im\n\
	import\n\
snippet w.l\n\
	wollok.lang\n\
snippet w.i\n\
	wollok.lib\n\
\n\
## Class and object\n\
snippet cl\n\
	class ${1:`Filename(\"\", \"untitled\")`} ${2}\n\
snippet obj\n\
	object ${1:`Filename(\"\", \"untitled\")`} ${2:inherits Parent}${3}\n\
snippet te\n\
	test ${1:`Filename(\"\", \"untitled\")`}\n\
\n\
##\n\
## Enhancements\n\
snippet inh\n\
	inherits\n\
\n\
##\n\
## Comments\n\
snippet /*\n\
	/*\n\
	 * ${1}\n\
	 */\n\
\n\
##\n\
## Control Statements\n\
snippet el\n\
	else\n\
snippet if\n\
	if (${1}) ${2}\n\
\n\
##\n\
## Create a Method\n\
snippet m\n\
	method ${1:method}(${2}) ${5}\n\
\n\
##  \n\
## Tests\n\
snippet as\n\
	assert.equals(${1:expected}, ${2:actual})\n\
\n\
##\n\
## Exceptions\n\
snippet ca\n\
	catch ${1:e} : (${2:Exception} ) ${3}\n\
snippet thr\n\
	throw\n\
snippet try\n\
	try {\n\
		${3}\n\
	} catch ${1:e} : ${2:Exception} {\n\
	}\n\
\n\
##\n\
## Javadocs\n\
snippet /**\n\
	/**\n\
	 * ${1}\n\
	 */\n\
\n\
##\n\
## Print Methods\n\
snippet print\n\
	console.println(\"${1:Message}\")\n\
\n\
##\n\
## Setter and Getter Methods\n\
snippet set\n\
	method set${1:}(${2:}) {\n\
		$1 = $2\n\
	}\n\
snippet get\n\
	method get${1:}() {\n\
		return ${1:};\n\
	}\n\
\n\
##\n\
## Terminate Methods or Loops\n\
snippet re\n\
	return";
exports.scope = "wollok";

});
                (function() {
                    ace.require(["ace/snippets/wollok"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            