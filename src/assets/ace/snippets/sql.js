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

ace.define("ace/snippets/sql",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "snippet tbl\n\
	create table ${1:table} (\n\
		${2:columns}\n\
	);\n\
snippet col\n\
	${1:name}	${2:type}	${3:default ''}	${4:not null}\n\
snippet ccol\n\
	${1:name}	varchar2(${2:size})	${3:default ''}	${4:not null}\n\
snippet ncol\n\
	${1:name}	number	${3:default 0}	${4:not null}\n\
snippet dcol\n\
	${1:name}	date	${3:default sysdate}	${4:not null}\n\
snippet ind\n\
	create index ${3:$1_$2} on ${1:table}(${2:column});\n\
snippet uind\n\
	create unique index ${1:name} on ${2:table}(${3:column});\n\
snippet tblcom\n\
	comment on table ${1:table} is '${2:comment}';\n\
snippet colcom\n\
	comment on column ${1:table}.${2:column} is '${3:comment}';\n\
snippet addcol\n\
	alter table ${1:table} add (${2:column} ${3:type});\n\
snippet seq\n\
	create sequence ${1:name} start with ${2:1} increment by ${3:1} minvalue ${4:1};\n\
snippet s*\n\
	select * from ${1:table}\n\
";
exports.scope = "sql";

});
                (function() {
                    ace.require(["ace/snippets/sql"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            