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

ace.define("ace/snippets/velocity",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# macro\n\
snippet #macro\n\
	#macro ( ${1:macroName} ${2:\\$var1, [\\$var2, ...]} )\n\
		${3:## macro code}\n\
	#end\n\
# foreach\n\
snippet #foreach\n\
	#foreach ( ${1:\\$item} in ${2:\\$collection} )\n\
		${3:## foreach code}\n\
	#end\n\
# if\n\
snippet #if\n\
	#if ( ${1:true} )\n\
		${0}\n\
	#end\n\
# if ... else\n\
snippet #ife\n\
	#if ( ${1:true} )\n\
		${2}\n\
	#else\n\
		${0}\n\
	#end\n\
#import\n\
snippet #import\n\
	#import ( \"${1:path/to/velocity/format}\" )\n\
# set\n\
snippet #set\n\
	#set ( $${1:var} = ${0} )\n\
";
exports.scope = "velocity";
exports.includeScopes = ["html", "javascript", "css"];

});
                (function() {
                    ace.require(["ace/snippets/velocity"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            