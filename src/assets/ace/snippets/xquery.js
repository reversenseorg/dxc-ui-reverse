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

ace.define("ace/snippets/xquery",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "snippet for\n\
	for $${1:item} in ${2:expr}\n\
snippet return\n\
	return ${1:expr}\n\
snippet import\n\
	import module namespace ${1:ns} = \"${2:http://www.example.com/}\";\n\
snippet some\n\
	some $${1:varname} in ${2:expr} satisfies ${3:expr}\n\
snippet every\n\
	every $${1:varname} in ${2:expr} satisfies ${3:expr}\n\
snippet if\n\
	if(${1:true}) then ${2:expr} else ${3:true}\n\
snippet switch\n\
	switch(${1:\"foo\"})\n\
	case ${2:\"foo\"}\n\
	return ${3:true}\n\
	default return ${4:false}\n\
snippet try\n\
	try { ${1:expr} } catch ${2:*} { ${3:expr} }\n\
snippet tumbling\n\
	for tumbling window $${1:varname} in ${2:expr}\n\
	start at $${3:start} when ${4:expr}\n\
	end at $${5:end} when ${6:expr}\n\
	return ${7:expr}\n\
snippet sliding\n\
	for sliding window $${1:varname} in ${2:expr}\n\
	start at $${3:start} when ${4:expr}\n\
	end at $${5:end} when ${6:expr}\n\
	return ${7:expr}\n\
snippet let\n\
	let $${1:varname} := ${2:expr}\n\
snippet group\n\
	group by $${1:varname} := ${2:expr}\n\
snippet order\n\
	order by ${1:expr} ${2:descending}\n\
snippet stable\n\
	stable order by ${1:expr}\n\
snippet count\n\
	count $${1:varname}\n\
snippet ordered\n\
	ordered { ${1:expr} }\n\
snippet unordered\n\
	unordered { ${1:expr} }\n\
snippet treat \n\
	treat as ${1:expr}\n\
snippet castable\n\
	castable as ${1:atomicType}\n\
snippet cast\n\
	cast as ${1:atomicType}\n\
snippet typeswitch\n\
	typeswitch(${1:expr})\n\
	case ${2:type}  return ${3:expr}\n\
	default return ${4:expr}\n\
snippet var\n\
	declare variable $${1:varname} := ${2:expr};\n\
snippet fn\n\
	declare function ${1:ns}:${2:name}(){\n\
	${3:expr}\n\
	};\n\
snippet module\n\
	module namespace ${1:ns} = \"${2:http://www.example.com}\";\n\
";
exports.scope = "xquery";

});
                (function() {
                    ace.require(["ace/snippets/xquery"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            