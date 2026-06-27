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

ace.define("ace/snippets/drools",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "\n\
snippet rule\n\
	rule \"${1?:rule_name}\"\n\
	when\n\
		${2:// when...} \n\
	then\n\
		${3:// then...}\n\
	end\n\
\n\
snippet query\n\
	query ${1?:query_name}\n\
		${2:// find} \n\
	end\n\
	\n\
snippet declare\n\
	declare ${1?:type_name}\n\
		${2:// attributes} \n\
	end\n\
\n\
";
exports.scope = "drools";

});
                (function() {
                    ace.require(["ace/snippets/drools"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            