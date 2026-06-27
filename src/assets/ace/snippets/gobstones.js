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

ace.define("ace/snippets/gobstones",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# Procedure\n\
snippet proc\n\
	procedure ${1?:name}(${2:argument}) {\n\
		${3:// body...}\n\
	}\n\
\n\
# Function\n\
snippet fun\n\
	function ${1?:name}(${2:argument}) {\n\
		return ${3:// body...}\n\
	}\n\
\n\
# Repeat\n\
snippet rep\n\
	repeat ${1?:times} {\n\
		${2:// body...}\n\
	}\n\
\n\
# For\n\
snippet for\n\
	foreach ${1?:e} in ${2?:list} {\n\
		${3:// body...}	\n\
	}\n\
\n\
# If\n\
snippet if\n\
	if (${1?:condition}) {\n\
		${3:// body...}	\n\
	}\n\
\n\
# While\n\
  while (${1?:condition}) {\n\
    ${2:// body...}	\n\
  }\n\
";
exports.scope = "gobstones";

});
                (function() {
                    ace.require(["ace/snippets/gobstones"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            